import { auth } from "@/lib/auth";
import { getPrismaClient } from "@/lib/db";
import { badRequestResponse, validationErrorResponse } from "@/lib/api-response";
import { handleApiError, isErrorResponse, parseJsonBody, requireRole } from "@/lib/api-utils";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { validateInquiry } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import xss from "xss";
import { parsePagination } from "@/lib/pagination";

const prisma = getPrismaClient();

// SMTP接続を使い回すため、トランスポーターはリクエスト毎ではなく一度だけ生成する
let transporter: Transporter | null = null;
function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

/**
 * ✅ 問い合わせ登録（メール送信 + DB保存）
 */
export async function POST(req: NextRequest) {
  try {
    // レート制限チェック
    const { limited } = await enforceRateLimit(req, "contact", RATE_LIMITS.contact);
    if (limited) return limited;

    const inquiryData = await parseJsonBody(req);
    if (isErrorResponse(inquiryData)) return inquiryData;

    // 🔹 XSS対策
    const sanitizedData = {
      name: xss(inquiryData.name || ""),
      email: xss(inquiryData.email || ""),
      phone: xss(inquiryData.phone || ""),
      inquiry: xss(inquiryData.inquiry || ""),
    };

    // 🔹 バリデーション
    const validateResult = validateInquiry(sanitizedData);
    if (Object.keys(validateResult).length > 0) {
      return validationErrorResponse(validateResult);
    }

    // ログイン中ユーザーのIDを取得（監査証跡用、未ログインならnull）
    const session = await auth();
    const userId = session?.user?.id || null;

    // 🔹 DB登録
    const inquiryRecord = await prisma.inquiry.create({
      data: {
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        inquiry: sanitizedData.inquiry,
        userId,
      },
    });

    // 🔹 メール送信（失敗してもDB登録は成功として扱う）
    let emailSent = true;
    try {
      const transporter = getTransporter();
      const adminAddress = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER;

      // 🔸 管理者宛メール
      await transporter.sendMail({
        from: `"飾Love お問い合わせフォーム" <${process.env.SMTP_USER}>`,
        to: adminAddress,
        subject: `【飾Love お問い合わせ】${sanitizedData.name} 様より`,
        html: `
          <h3>新しいお問い合わせがありました。</h3>
          <p><strong>お名前:</strong> ${sanitizedData.name}</p>
          <p><strong>メール:</strong> ${sanitizedData.email}</p>
          <p><strong>電話番号:</strong> ${sanitizedData.phone}</p>
          <p><strong>お問い合わせ内容:</strong><br>${sanitizedData.inquiry}</p>
          <hr />
          <p><small>ID: ${inquiryRecord.id} / ${inquiryRecord.createdAt}</small></p>
        `,
      });

      // 🔸 自動返信メール
      await transporter.sendMail({
        from: `"飾Love" <${process.env.SMTP_USER}>`,
        to: sanitizedData.email,
        subject: "【飾Love・自動返信】お問い合わせありがとうございます",
        html: `
          <p>${sanitizedData.name} 様</p>
          <p>このたびは 飾Love(かざらぶ)へのお問い合わせ、誠にありがとうございます。</p>
          <p>以下の内容で受け付けました。</p>
          <hr />
          <p>${sanitizedData.inquiry}</p>
          <hr />
          <p>２営業日以内に、担当者よりご連絡いたします。</p>
          <p>飾Love(かざらぶ)<br>
          Email: info@kaza-love.com<br>
          </p>
        `,
      });
    } catch (emailError) {
      console.error("メール送信エラー（DB登録は完了）:", emailError);
      emailSent = false;
    }

    return NextResponse.json({
      success: true,
      message: emailSent
        ? "問い合わせを登録し、メールを送信しました。"
        : "問い合わせを登録しました。確認メールの送信に失敗しましたが、お問い合わせは受け付けております。",
    });
  } catch (error) {
    console.error("問い合わせ処理エラー:", error);
    return NextResponse.json(
      { success: false, error: "送信・登録処理に失敗しました。" },
      { status: 500 }
    );
  }
}

/**
 * ✅ 問い合わせ一覧取得（認証必須）
 */
export async function GET(req: NextRequest) {
  try {
    // 認証・権限チェック（ADMINのみ）
    const session = await requireRole(["ADMIN"]);
    if (isErrorResponse(session)) return session;

    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = parsePagination(searchParams);

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.inquiry.count(),
    ]);
    return NextResponse.json({ inquiries, total, page, limit });
  } catch (error) {
    return handleApiError(error, { log: "問い合わせ取得エラー", message: "問い合わせ一覧の取得に失敗しました" });
  }
}

/**
 * ✅ 問い合わせ削除（ADMIN必須）
 */
export async function DELETE(req: NextRequest) {
  try {
    // 認証・権限チェック（ADMINのみ）
    const session = await requireRole(["ADMIN"]);
    if (isErrorResponse(session)) return session;

    const body = await parseJsonBody(req);
    if (isErrorResponse(body)) return body;
    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return badRequestResponse("IDが正しく指定されていません");
    }

    await prisma.inquiry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // 存在しないIDの削除は handleApiError が P2025 → 404 に変換する
    return handleApiError(error, {
      log: "問い合わせ削除エラー",
      message: "削除に失敗しました",
      notFoundMessage: "指定された問い合わせが見つかりません",
    });
  }
}
