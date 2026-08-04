import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { parsePagination } from "@/lib/pagination";
import { badRequestResponse } from "@/lib/api-response";
import { handleApiError, isErrorResponse, parseJsonBody, requireRole } from "@/lib/api-utils";
import xss from "xss";

/** "Invalid Date" によるPrismaエラーを防ぐための日付検証 */
function parseValidDate(value: unknown): Date | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

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
    const session = await requireRole(["ADMIN", "EDITOR"], "編集権限が必要です");
    if (isErrorResponse(session)) return session;

    const prisma = getPrismaClient();
    const body = await parseJsonBody(req);
    if (isErrorResponse(body)) return body;
    const { title, contents, date, url } = body;

    if (!title || !contents || !date) {
      return badRequestResponse("タイトル、内容、日付は必須です");
    }

    const parsedDate = parseValidDate(date);
    if (!parsedDate) {
      return badRequestResponse("日付の形式が正しくありません");
    }

    const sanitizedContents = typeof contents === "string" ? xss(contents) : contents;

    const news = await prisma.news.create({
      data: {
        title: xss(title),
        contents: sanitizedContents,
        date: parsedDate,
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
    const session = await requireRole(["ADMIN", "EDITOR"], "編集権限が必要です");
    if (isErrorResponse(session)) return session;

    const prisma = getPrismaClient();
    const body = await parseJsonBody(req);
    if (isErrorResponse(body)) return body;
    const { id, title, contents, date, url } = body;

    if (!id) {
      return badRequestResponse("IDは必須です");
    }

    let parsedDate: Date | undefined;
    if (date) {
      const valid = parseValidDate(date);
      if (!valid) {
        return badRequestResponse("日付の形式が正しくありません");
      }
      parsedDate = valid;
    }

    const sanitizedContents = contents !== undefined
      ? (typeof contents === "string" ? xss(contents) : contents)
      : undefined;

    const news = await prisma.news.update({
      where: { id },
      data: {
        title: title ? xss(title) : undefined,
        contents: sanitizedContents,
        date: parsedDate,
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
    const session = await requireRole(["ADMIN"], "管理者権限が必要です");
    if (isErrorResponse(session)) return session;

    const prisma = getPrismaClient();
    const body = await parseJsonBody(req);
    if (isErrorResponse(body)) return body;
    const { id } = body;

    if (!id) {
      return badRequestResponse("IDは必須です");
    }

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
