import { auth } from "@/lib/auth";
import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import crypto from "crypto";
import { getActualMimeType, getExtensionFromMimeType, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/upload-validation";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        if (session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "権限がありません" }, { status: 403 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "ファイルがありません" }, { status: 400 });
        }

        if (file.size > MAX_IMAGE_SIZE) {
            return NextResponse.json({ error: "ファイルサイズは5MB以下にしてください" }, { status: 400 });
        }

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            return NextResponse.json({ error: "許可されていないファイル形式です（JPEG, PNG, GIF, WebPのみ）" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // マジックナンバー検証
        const actualMimeType = getActualMimeType(buffer);
        if (!actualMimeType || !ALLOWED_IMAGE_TYPES.includes(actualMimeType)) {
            return NextResponse.json({ error: "不正なファイル形式です" }, { status: 400 });
        }

        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        const ext = getExtensionFromMimeType(actualMimeType);
        const fileName = `${crypto.randomUUID()}${ext}`;
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        const imageUrl = `/uploads/${fileName}`;
        return NextResponse.json({ url: imageUrl });
    } catch {
        return NextResponse.json({ error: "アップロードに失敗しました" }, { status: 500 });
    }
}
