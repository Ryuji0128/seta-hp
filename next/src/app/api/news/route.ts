import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { auth } from "@/lib/auth";
import { parsePagination } from "@/lib/pagination";
import { isErrorResponse, parseJsonBody } from "@/lib/api-utils";
import xss from "xss";

// お知らせ一覧取得
export async function GET(req: NextRequest) {
  try {
    const prisma = getPrismaClient();
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = parsePagination(searchParams);

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        orderBy: { date: "desc" },
        take: limit,
        skip,
      }),
      prisma.news.count(),
    ]);
    return NextResponse.json({ news, total, page, limit });
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

    const userRole = session.user?.role;
    if (userRole !== "ADMIN" && userRole !== "EDITOR") {
      return NextResponse.json({ error: "編集権限が必要です" }, { status: 403 });
    }

    const prisma = getPrismaClient();
    const body = await parseJsonBody(req);
    if (isErrorResponse(body)) return body;
    const { title, contents, date, url } = body;

    if (!title || !contents || !date) {
      return NextResponse.json({ error: "タイトル、内容、日付は必須です" }, { status: 400 });
    }

    const sanitizedContents = typeof contents === "string" ? xss(contents) : contents;

    const news = await prisma.news.create({
      data: {
        title: xss(title),
        contents: sanitizedContents,
        date: new Date(date),
        url: url ? xss(url) : null,
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

    const userRole = session.user?.role;
    if (userRole !== "ADMIN" && userRole !== "EDITOR") {
      return NextResponse.json({ error: "編集権限が必要です" }, { status: 403 });
    }

    const prisma = getPrismaClient();
    const body = await parseJsonBody(req);
    if (isErrorResponse(body)) return body;
    const { id, title, contents, date, url } = body;

    if (!id) {
      return NextResponse.json({ error: "IDは必須です" }, { status: 400 });
    }

    const sanitizedContents = contents !== undefined
      ? (typeof contents === "string" ? xss(contents) : contents)
      : undefined;

    const news = await prisma.news.update({
      where: { id },
      data: {
        title: title ? xss(title) : undefined,
        contents: sanitizedContents,
        date: date ? new Date(date) : undefined,
        url: url !== undefined ? (url ? xss(url) : null) : undefined,
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

    const userRole = session.user?.role;
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
    }

    const prisma = getPrismaClient();
    const body = await parseJsonBody(req);
    if (isErrorResponse(body)) return body;
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
