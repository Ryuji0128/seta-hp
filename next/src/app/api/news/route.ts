import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { parsePagination } from "@/lib/pagination";
import {
  handleApiError,
  isErrorResponse,
  parseJsonWithSchema,
  requireAdmin,
  requireEditor,
} from "@/lib/api-utils";
import {
  NewsCreateSchema,
  NewsUpdateSchema,
  RequiredIdSchema,
} from "@/lib/validation";
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
    return handleApiError(error, { log: "お知らせ取得エラー", message: "お知らせの取得に失敗しました" });
  }
}

// お知らせ作成
export async function POST(req: NextRequest) {
  try {
    const session = await requireEditor();
    if (isErrorResponse(session)) return session;

    const prisma = getPrismaClient();
    const parsed = await parseJsonWithSchema(req, NewsCreateSchema);
    if (isErrorResponse(parsed)) return parsed;
    const { title, contents, date, url } = parsed;

    const sanitizedContents = typeof contents === "string" ? xss(contents) : contents;

    const news = await prisma.news.create({
      data: {
        title: xss(title),
        contents: sanitizedContents,
        date,
        url: url ? xss(url) : null,
      },
    });

    return NextResponse.json({ message: "お知らせを作成しました", news });
  } catch (error) {
    return handleApiError(error, { log: "お知らせ作成エラー", message: "お知らせの作成に失敗しました" });
  }
}

// お知らせ更新
export async function PUT(req: NextRequest) {
  try {
    const session = await requireEditor();
    if (isErrorResponse(session)) return session;

    const prisma = getPrismaClient();
    const parsed = await parseJsonWithSchema(req, NewsUpdateSchema);
    if (isErrorResponse(parsed)) return parsed;
    const { id, title, contents, date, url } = parsed;

    const sanitizedContents = contents !== undefined
      ? (typeof contents === "string" ? xss(contents) : contents)
      : undefined;

    const news = await prisma.news.update({
      where: { id },
      data: {
        title: title ? xss(title) : undefined,
        contents: sanitizedContents,
        date,
        url: url !== undefined ? (url ? xss(url) : null) : undefined,
      },
    });

    return NextResponse.json({ message: "お知らせを更新しました", news });
  } catch (error) {
    return handleApiError(error, {
      log: "お知らせ更新エラー",
      message: "お知らせの更新に失敗しました",
      notFoundMessage: "指定されたお知らせが見つかりません",
    });
  }
}

// お知らせ削除
export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (isErrorResponse(session)) return session;

    const prisma = getPrismaClient();
    const parsed = await parseJsonWithSchema(req, RequiredIdSchema);
    if (isErrorResponse(parsed)) return parsed;
    const { id } = parsed;

    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json({ message: "お知らせを削除しました" });
  } catch (error) {
    return handleApiError(error, {
      log: "お知らせ削除エラー",
      message: "お知らせの削除に失敗しました",
      notFoundMessage: "指定されたお知らせが見つかりません",
    });
  }
}
