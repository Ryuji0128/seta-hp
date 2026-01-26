import { auth } from "@/lib/auth";
import { getPrismaClient } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

const prisma = getPrismaClient();

/**
 * 見積書アップロード（POST）
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const amount = formData.get("amount") as string;

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

      // 許可するファイルタイプ
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

      // アップロードディレクトリ
      const uploadDir = path.join(process.cwd(), "public", "uploads", "estimates");
      await mkdir(uploadDir, { recursive: true });

      // ファイル名を生成
      const timestamp = Date.now();
      const ext = path.extname(file.name);
      fileName = `${timestamp}-${file.name}`;
      filePath = `/uploads/estimates/${fileName}`;

      await writeFile(path.join(uploadDir, fileName), buffer);
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
