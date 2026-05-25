import { auth } from "@/lib/auth";
import { getPrismaClient } from "@/lib/db";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { validateInquiry } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import xss from "xss";
import { parsePagination } from "@/lib/pagination";

const prisma = getPrismaClient();

/**
 * ✅ 問い合わせ登録（メール送信 + DB保存）
 */
export async function POST(req: NextRequest) {
  try {
    // レート制限チェック
    const clientIp = getClientIp(req);
    const rateLimitResult = await checkRateLimit(`contact:${clientIp}`, RATE_LIMITS.contact);
    if (!rateLimitResult.success) {
      const retryAfter = Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { success: false, error: "リクエスト回数が上限に達しました。しばらくお待ちください。" },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimitResult.resetAt),
          },
        }
      );
    }

    const inquiryData = await req.json();

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
      return NextResponse.json({ errors: validateResult }, { status: 400 });
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
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

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
          運営: 瀬田製作所(個人事業所) / 富山県高岡市<br>
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
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

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
    console.error("問い合わせ取得エラー:", error);
    return NextResponse.json(
      { error: "問い合わせ一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}

/**
 * ✅ 問い合わせ削除（ADMIN必須）
 */
export async function DELETE(req: NextRequest) {
  try {
    // 認証チェック
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // ADMINロールチェック
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "IDが指定されていません" },
        { status: 400 }
      );
    }

    await prisma.inquiry.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("問い合わせ削除エラー:", error);
    return NextResponse.json(
      { error: "削除に失敗しました" },
      { status: 500 }
    );
  }
}
