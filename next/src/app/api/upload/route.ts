import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { isErrorResponse, requireEditor } from "@/lib/api-utils";
import { getActualMimeType, getExtensionFromMimeType, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/upload-validation";

export async function POST(req: NextRequest) {
  try {
    const session = await requireEditor();
    if (isErrorResponse(session)) return session;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "ファイルが選択されていません" }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "ファイルサイズは5MB以下にしてください" }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "JPG, PNG, GIF, WebPのみアップロード可能です" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const actualMimeType = getActualMimeType(buffer);
    if (!actualMimeType || !ALLOWED_IMAGE_TYPES.includes(actualMimeType)) {
      return NextResponse.json({ error: "不正なファイル形式です。JPG, PNG, GIF, WebPのみアップロード可能です" }, { status: 400 });
    }

    const ext = getExtensionFromMimeType(actualMimeType);
    const fileName = `${crypto.randomUUID()}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const url = `/uploads/${fileName}`;
    return NextResponse.json({ url, fileName });
  } catch (error) {
    console.error("アップロードエラー:", error);
    return NextResponse.json({ error: "アップロードに失敗しました" }, { status: 500 });
  }
}
