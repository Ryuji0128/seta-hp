/**
 * 社内レビュー用ページ内コメント API
 *
 * GET  /api/review-comments?page=/vision   … 当該ページのコメント＋返信を返す
 * POST /api/review-comments                … 新規コメント作成
 *
 * NEXT_PUBLIC_ENABLE_COMMENTS=true の時のみ動作。それ以外は 404。
 */

import { getPrismaClient } from "@/lib/db";
import { badRequestResponse } from "@/lib/api-response";
import {
  handleApiError,
  isErrorResponse,
  parseJsonWithSchema,
} from "@/lib/api-utils";
import { REVIEW_MAX_PAGE_URL } from "@/lib/review-constants";
import { reviewCommentSelect } from "@/lib/review-comment-query";
import {
  cleanReviewInput,
  ReviewCommentCreateSchema,
} from "@/lib/review-validation";
import {
  reviewCommentsDisabledResponse,
  reviewWriteGuard,
} from "@/lib/reviewCommentsGuard";
import { NextRequest, NextResponse } from "next/server";

const prisma = getPrismaClient();

export async function GET(req: NextRequest) {
  const disabled = reviewCommentsDisabledResponse();
  if (disabled) return disabled;

  const pageUrl = cleanReviewInput(
    req.nextUrl.searchParams.get("page"),
    REVIEW_MAX_PAGE_URL
  );
  if (!pageUrl) {
    return badRequestResponse("page is required");
  }

  try {
    const comments = await prisma.reviewComment.findMany({
      where: { pageUrl },
      orderBy: { createdAt: "asc" },
      select: reviewCommentSelect,
    });
    return NextResponse.json({ comments });
  } catch (error) {
    return handleApiError(error, {
      log: "レビューコメント取得エラー",
      message: "取得に失敗しました",
    });
  }
}

export async function POST(req: NextRequest) {
  const blocked = await reviewWriteGuard(req);
  if (blocked) return blocked;

  try {
    const data = await parseJsonWithSchema(req, ReviewCommentCreateSchema);
    if (isErrorResponse(data)) return data;

    const created = await prisma.reviewComment.create({
      data,
      select: reviewCommentSelect,
    });

    return NextResponse.json({ comment: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error, {
      log: "レビューコメント作成エラー",
      message: "作成に失敗しました",
    });
  }
}
