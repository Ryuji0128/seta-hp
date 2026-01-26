import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { auth } from "@/lib/auth";

// お知らせ一覧取得
export async function GET() {
  try {
    const prisma = getPrismaClient();
    const news = await prisma.news.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json({ news });
  } catch (error) {
    console.error("お知らせ取得エラー:", error);
    return NextResponse.json({ error: "お知らせの取得に失敗しました" }, { status: 500 });
  }
}

// お知らせ作成
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const prisma = getPrismaClient();
    const body = await req.json();
    const { title, contents, date, url } = body;

    if (!title || !contents || !date) {
      return NextResponse.json({ error: "タイトル、内容、日付は必須です" }, { status: 400 });
    }

    const news = await prisma.news.create({
      data: {
        title,
        contents,
        date: new Date(date),
        url: url || null,
      },
    });

    return NextResponse.json({ message: "お知らせを作成しました", news });
  } catch (error) {
    console.error("お知らせ作成エラー:", error);
    return NextResponse.json({ error: "お知らせの作成に失敗しました" }, { status: 500 });
  }
}

// お知らせ更新
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const prisma = getPrismaClient();
    const body = await req.json();
    const { id, title, contents, date, url } = body;

    if (!id) {
      return NextResponse.json({ error: "IDは必須です" }, { status: 400 });
    }

    const news = await prisma.news.update({
      where: { id },
      data: {
        title,
        contents,
        date: date ? new Date(date) : undefined,
        url: url || null,
      },
    });

    return NextResponse.json({ message: "お知らせを更新しました", news });
  } catch (error) {
    console.error("お知らせ更新エラー:", error);
    return NextResponse.json({ error: "お知らせの更新に失敗しました" }, { status: 500 });
  }
}

// お知らせ削除
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

    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json({ message: "お知らせを削除しました" });
  } catch (error) {
    console.error("お知らせ削除エラー:", error);
    return NextResponse.json({ error: "お知らせの削除に失敗しました" }, { status: 500 });
  }
}
