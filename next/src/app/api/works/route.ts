import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { auth } from "@/lib/auth";

// 許可されたカテゴリ
const VALID_CATEGORIES = ["modeling", "print", "laser", "mockup"];

// 制作事例一覧取得（公開用）
export async function GET(req: NextRequest) {
  try {
    const prisma = getPrismaClient();
    const { searchParams } = new URL(req.url);
    const includeUnpublished = searchParams.get("includeUnpublished") === "true";

    // 認証チェック（非公開を含める場合）
    if (includeUnpublished) {
      const session = await auth();
      if (!session) {
        return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
      }
    }

    const works = await prisma.work.findMany({
      where: includeUnpublished ? {} : { isPublished: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ works });
  } catch (error) {
    console.error("制作事例取得エラー:", error);
    return NextResponse.json({ error: "制作事例の取得に失敗しました" }, { status: 500 });
  }
}

// 制作事例作成
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

    const prisma = getPrismaClient();
    const body = await req.json();
    const { title, description, category, tags, image, isPublished } = body;

    if (!title || !description || !category) {
      return NextResponse.json({ error: "タイトル、説明、カテゴリは必須です" }, { status: 400 });
    }

    // カテゴリの検証
    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: `カテゴリは${VALID_CATEGORIES.join(", ")}のいずれかを指定してください` }, { status: 400 });
    }

    const work = await prisma.work.create({
      data: {
        title,
        description,
        category,
        tags: Array.isArray(tags) ? tags.join(",") : tags || "",
        image: image || null,
        isPublished: isPublished !== false,
      },
    });

    return NextResponse.json({ message: "制作事例を作成しました", work });
  } catch (error) {
    console.error("制作事例作成エラー:", error);
    return NextResponse.json({ error: "制作事例の作成に失敗しました" }, { status: 500 });
  }
}

// 制作事例更新
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const userRole = (session?.user as { role?: string })?.role;
    if (userRole !== "ADMIN" && userRole !== "EDITOR") {
      return NextResponse.json({ error: "編集権限が必要です" }, { status: 403 });
    }

    const prisma = getPrismaClient();
    const body = await req.json();
    const { id, title, description, category, tags, image, isPublished } = body;

    if (!id) {
      return NextResponse.json({ error: "IDは必須です" }, { status: 400 });
    }

    // 存在確認
    const existing = await prisma.work.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "指定された制作事例が見つかりません" }, { status: 404 });
    }

    // カテゴリの検証
    if (category && !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: `カテゴリは${VALID_CATEGORIES.join(", ")}のいずれかを指定してください` }, { status: 400 });
    }

    const work = await prisma.work.update({
      where: { id },
      data: {
        title,
        description,
        category,
        tags: Array.isArray(tags) ? tags.join(",") : tags,
        image: image || null,
        isPublished,
      },
    });

    return NextResponse.json({ message: "制作事例を更新しました", work });
  } catch (error) {
    console.error("制作事例更新エラー:", error);
    return NextResponse.json({ error: "制作事例の更新に失敗しました" }, { status: 500 });
  }
}

// 制作事例削除
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const userRole = (session?.user as { role?: string })?.role;
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
    }

    const prisma = getPrismaClient();
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "IDは必須です" }, { status: 400 });
    }

    // 存在確認
    const existing = await prisma.work.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "指定された制作事例が見つかりません" }, { status: 404 });
    }

    await prisma.work.delete({
      where: { id },
    });

    return NextResponse.json({ message: "制作事例を削除しました" });
  } catch (error) {
    console.error("制作事例削除エラー:", error);
    return NextResponse.json({ error: "制作事例の削除に失敗しました" }, { status: 500 });
  }
}
