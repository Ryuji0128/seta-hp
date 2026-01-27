import { auth } from "@/lib/auth";
import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import crypto from "crypto";

// 許可されたMIMEタイプ
const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
];

// 最大ファイルサイズ (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(req: Request) {
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

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "ファイルがありません" }, { status: 400 });
        }

        // ファイルサイズチェック
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "ファイルサイズは5MB以下にしてください" }, { status: 400 });
        }

        // MIMEタイプチェック
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            return NextResponse.json({ error: "許可されていないファイル形式です（JPEG, PNG, GIF, WebPのみ）" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 保存先: public/uploads
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        // ランダムファイル名を生成（セキュリティ向上）
        const ext = path.extname(file.name).toLowerCase() || ".jpg";
        const randomName = crypto.randomUUID();
        const fileName = `${randomName}${ext}`;
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        const imageUrl = `/uploads/${fileName}`;
        return NextResponse.json({ url: imageUrl });
    } catch {
        return NextResponse.json({ error: "アップロードに失敗しました" }, { status: 500 });
    }
}
