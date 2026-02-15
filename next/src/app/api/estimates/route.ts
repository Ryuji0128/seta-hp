import { auth } from "@/lib/auth";
import { getPrismaClient } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { fetchSecret } from "@/lib/fetchSecrets";
import axios from "axios";

const prisma = getPrismaClient();

/**
 * 見積書アップロード（POST）
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const amount = formData.get("amount") as string;
    const recaptchaToken = formData.get("recaptchaToken") as string | null;

    // 本番環境でreCAPTCHA検証（RECAPTCHA_SECRET_KEYが設定されている場合のみ）
    const recaptchaKey = await fetchSecret("RECAPTCHA_SECRET_KEY").catch(() => null);
    if (recaptchaKey && recaptchaKey.trim() !== "") {
      if (!recaptchaToken) {
        return NextResponse.json(
          { error: "reCAPTCHA検証が必要です" },
          { status: 400 }
        );
      }

      const verificationUrl = "https://www.google.com/recaptcha/api/siteverify";
      const response = await axios.post(verificationUrl, null, {
        params: {
          secret: recaptchaKey,
          response: recaptchaToken,
        },
      });

      const { success, score, action, hostname } = response.data;

      // hostname検証（本番環境のみ）
      const allowedHostnames = process.env.ALLOWED_RECAPTCHA_HOSTNAMES?.split(',') || [];
      const hostnameValid = allowedHostnames.length === 0 || allowedHostnames.includes(hostname);

      if (!success || score < 0.5 || action !== "estimate_upload" || !hostnameValid) {
        return NextResponse.json(
          { error: "reCAPTCHA検証に失敗しました" },
          { status: 403 }
        );
      }
    }

    if (!amount || parseInt(amount, 10) < 100) {
      return NextResponse.json(
        { error: "100円以上を指定してください" },
        { status: 400 }
      );
    }

    let filePath: string | null = null;
    let fileName: string | null = null;

    // ファイルがある場合のみアップロード処理
    if (file && file.size > 0) {
      // ファイルサイズチェック (10MB)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "ファイルサイズは10MB以下にしてください" },
          { status: 400 }
        );
      }

      // 許可するファイルタイプ（クライアント申告値）
      const allowedTypes = [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "image/jpg",
      ];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "PDF、PNG、JPG形式のファイルのみ許可されています" },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Magic Number検証（ファイル内容の実際の形式を確認）
      const magicNumber = buffer.subarray(0, 8);
      const isPDF = magicNumber[0] === 0x25 && magicNumber[1] === 0x50 &&
                    magicNumber[2] === 0x44 && magicNumber[3] === 0x46; // %PDF
      const isPNG = magicNumber[0] === 0x89 && magicNumber[1] === 0x50 &&
                    magicNumber[2] === 0x4E && magicNumber[3] === 0x47; // PNG
      const isJPEG = magicNumber[0] === 0xFF && magicNumber[1] === 0xD8 &&
                     magicNumber[2] === 0xFF; // JPEG

      if (!isPDF && !isPNG && !isJPEG) {
        return NextResponse.json(
          { error: "ファイルの形式が不正です" },
          { status: 400 }
        );
      }

      // アップロードディレクトリ
      const uploadDir = path.join(process.cwd(), "public", "uploads", "estimates");
      await mkdir(uploadDir, { recursive: true });

      // ファイル名を生成（パストラバーサル対策: basenameで正規化 + 許可文字のみ）
      const timestamp = Date.now();
      const safeBaseName = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, "_");
      fileName = `${timestamp}-${safeBaseName}`;
      filePath = `/uploads/estimates/${fileName}`;

      // 最終パスが想定ディレクトリ内であることを検証
      const finalPath = path.join(uploadDir, fileName);
      if (!finalPath.startsWith(uploadDir)) {
        return NextResponse.json(
          { error: "無効なファイル名です" },
          { status: 400 }
        );
      }

      await writeFile(finalPath, buffer);
    }

    // DB保存
    const estimate = await prisma.estimate.create({
      data: {
        fileName: fileName || "見積書なし",
        filePath: filePath || "",
        amount: parseInt(amount, 10),
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      estimate,
    });
  } catch (error) {
    console.error("見積書アップロードエラー:", error);
    return NextResponse.json(
      { error: "アップロードに失敗しました" },
      { status: 500 }
    );
  }
}

/**
 * 見積書一覧取得（GET）- 認証必須
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const estimates = await prisma.estimate.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ estimates });
  } catch (error) {
    console.error("見積書取得エラー:", error);
    return NextResponse.json(
      { error: "見積書一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}

/**
 * 見積書削除（DELETE）- ADMIN必須
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

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

    // 削除前にレコードを取得してファイルパスを確認
    const estimate = await prisma.estimate.findUnique({
      where: { id: Number(id) },
    });

    if (!estimate) {
      return NextResponse.json(
        { error: "見積書が見つかりません" },
        { status: 404 }
      );
    }

    // DBレコードを削除
    await prisma.estimate.delete({
      where: { id: Number(id) },
    });

    // ファイルが存在する場合は削除
    if (estimate.filePath) {
      try {
        const fullPath = path.join(process.cwd(), "public", estimate.filePath);
        await unlink(fullPath);
      } catch (fileError) {
        // ファイルが既に存在しない場合などはエラーを無視
        console.warn("ファイル削除警告:", fileError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("見積書削除エラー:", error);
    return NextResponse.json(
      { error: "削除に失敗しました" },
      { status: 500 }
    );
  }
}
