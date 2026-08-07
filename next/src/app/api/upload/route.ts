import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { badRequestResponse, internalErrorResponse } from "@/lib/api-response";
import { isErrorResponse, requireEditor } from "@/lib/api-utils";
import {
  getActualMimeType,
  getExtensionFromMimeType,
  isAllowedImageType,
  MAX_IMAGE_SIZE,
} from "@/lib/upload-validation";

export async function POST(req: NextRequest) {
  try {
    const session = await requireEditor();
    if (isErrorResponse(session)) return session;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return badRequestResponse("ファイルが選択されていません");
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return badRequestResponse("ファイルサイズは5MB以下にしてください");
    }

    if (!isAllowedImageType(file.type)) {
      return badRequestResponse("JPG, PNG, GIF, WebPのみアップロード可能です");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const actualMimeType = getActualMimeType(buffer);
    if (!actualMimeType || !isAllowedImageType(actualMimeType)) {
      return badRequestResponse("不正なファイル形式です。JPG, PNG, GIF, WebPのみアップロード可能です");
    }

    const ext = getExtensionFromMimeType(actualMimeType);
    const fileName = `${crypto.randomUUID()}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const url = `/uploads/${fileName}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("アップロードエラー:", error);
    return internalErrorResponse("アップロードに失敗しました");
  }
}
