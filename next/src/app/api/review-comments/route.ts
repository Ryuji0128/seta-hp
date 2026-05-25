/**
 * 社内レビュー用ページ内コメント API
 *
 * GET  /api/review-comments?page=/vision   … 当該ページのコメント＋返信を返す
 * POST /api/review-comments                … 新規コメント作成
 *
 * NEXT_PUBLIC_ENABLE_COMMENTS=true の時のみ動作。それ以外は 404。
 */

import { getPrismaClient } from "@/lib/db";
import { isRateLimited } from "@/lib/rate-limit";
import { reviewCommentsDisabledResponse } from "@/lib/reviewCommentsGuard";
import { NextRequest, NextResponse } from "next/server";
import xss from "xss";

const prisma = getPrismaClient();

const MAX_CONTENT = 2000;
const MAX_NAME = 80;
const MAX_SELECTOR = 500;

function clean(value: unknown, max: number): string {
  return xss(String(value ?? "")).trim().slice(0, max);
}

export async function GET(req: NextRequest) {
  const disabled = reviewCommentsDisabledResponse();
  if (disabled) return disabled;

  const page = req.nextUrl.searchParams.get("page");
  if (!page) {
    return NextResponse.json({ error: "page is required" }, { status: 400 });
  }

  try {
    const comments = await prisma.reviewComment.findMany({
      where: { pageUrl: page },
      orderBy: { createdAt: "asc" },
      include: { replies: { orderBy: { createdAt: "asc" } } },
    });
    return NextResponse.json({ comments });
  } catch (error) {
    console.error("レビューコメント取得エラー:", error);
    return NextResponse.json({ error: "取得に失敗しました" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const disabled = reviewCommentsDisabledResponse();
  if (disabled) return disabled;

  if (await isRateLimited(req, { windowMs: 60_000, max: 30 })) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const pageUrl = clean(body.pageUrl, 500);
    const authorName = clean(body.authorName, MAX_NAME);
    const content = clean(body.content, MAX_CONTENT);
    const elementSelector = body.elementSelector
      ? clean(body.elementSelector, MAX_SELECTOR)
      : null;
    const xRatio = Number(body.xRatio);
    const yAbsolute = Number(body.yAbsolute);

    if (!pageUrl || !authorName || !content) {
      return NextResponse.json(
        { error: "pageUrl / authorName / content は必須です" },
        { status: 400 }
      );
    }
    if (
      !Number.isFinite(xRatio) ||
      !Number.isFinite(yAbsolute) ||
      xRatio < 0 ||
      xRatio > 1 ||
      yAbsolute < 0
    ) {
      return NextResponse.json({ error: "座標が不正です" }, { status: 400 });
    }

    const created = await prisma.reviewComment.create({
      data: {
        pageUrl,
        authorName,
        content,
        elementSelector,
        xRatio,
        yAbsolute,
      },
      include: { replies: true },
    });

    return NextResponse.json({ comment: created }, { status: 201 });
  } catch (error) {
    console.error("レビューコメント作成エラー:", error);
    return NextResponse.json({ error: "作成に失敗しました" }, { status: 500 });
  }
}
