import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// ファイルのマジックナンバー（先頭バイト列）によるMIMEタイプ検証
function getActualMimeType(buffer: Buffer): string | null {
  const signatures: { mime: string; bytes: number[] }[] = [
    { mime: "image/jpeg", bytes: [0xFF, 0xD8, 0xFF] },
    { mime: "image/png", bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] },
    { mime: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38] }, // GIF87a or GIF89a
    { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF header (WebP starts with RIFF)
  ];

  for (const sig of signatures) {
    if (buffer.length >= sig.bytes.length) {
      const match = sig.bytes.every((byte, index) => buffer[index] === byte);
      if (match) {
        // WebPの場合、追加チェック（RIFF....WEBP）
        if (sig.mime === "image/webp") {
          if (buffer.length >= 12 && buffer.toString("ascii", 8, 12) === "WEBP") {
            return sig.mime;
          }
          continue;
        }
        return sig.mime;
      }
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const userRole = (session?.user as { role?: string })?.role;
    if (userRole !== "ADMIN" && userRole !== "EDITOR") {
      return NextResponse.json({ error: "編集権限が必要です" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "ファイルが選択されていません" }, { status: 400 });
    }

    // ファイルサイズチェック (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "ファイルサイズは5MB以下にしてください" }, { status: 400 });
    }

    // 許可する拡張子（クライアント側のチェック）
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "JPG, PNG, GIF, WebPのみアップロード可能です" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // サーバーサイドでマジックナンバーを検証（file.typeはクライアント側で偽装可能なため）
    const actualMimeType = getActualMimeType(buffer);
    if (!actualMimeType || !allowedTypes.includes(actualMimeType)) {
      return NextResponse.json({ error: "不正なファイル形式です。JPG, PNG, GIF, WebPのみアップロード可能です" }, { status: 400 });
    }

    // ファイル名を生成 (タイムスタンプ + ランダム文字列)
    const ext = path.extname(file.name) || `.${file.type.split("/")[1]}`;
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const fileName = `${timestamp}-${random}${ext}`;

    // アップロード先ディレクトリ
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // ディレクトリが存在しない場合は作成
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // 公開URLを返す
    const url = `/uploads/${fileName}`;

    return NextResponse.json({ url, fileName });
  } catch (error) {
    console.error("アップロードエラー:", error);
    return NextResponse.json({ error: "アップロードに失敗しました" }, { status: 500 });
  }
}
