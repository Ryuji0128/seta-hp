/**
 * レビューコメント個別操作 API
 *
 * PATCH  /api/review-comments/:id  … status の切替（open <-> resolved）
 * DELETE /api/review-comments/:id  … 削除（社内利用なので誰でも可）
 */

import { getPrismaClient } from "@/lib/db";
import { successResponse } from "@/lib/api-response";
import {
  handleApiError,
  isErrorResponse,
  parseJsonWithSchema,
} from "@/lib/api-utils";
import { RATE_LIMITS } from "@/lib/rate-limit";
import { reviewCommentSelect } from "@/lib/review-comment-query";
import { ReviewStatusUpdateSchema } from "@/lib/review-validation";
import { parseGuardedReviewId } from "@/lib/reviewCommentsGuard";
import { NextRequest, NextResponse } from "next/server";

const prisma = getPrismaClient();

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = await parseGuardedReviewId(req, params, RATE_LIMITS.reviewUpdate);
  if (isErrorResponse(id)) return id;

  try {
    const data = await parseJsonWithSchema(req, ReviewStatusUpdateSchema);
    if (isErrorResponse(data)) return data;

    const updated = await prisma.reviewComment.update({
      where: { id },
      data,
      select: reviewCommentSelect,
    });
    return NextResponse.json({ comment: updated });
  } catch (error) {
    return handleApiError(error, {
      log: "レビューコメント更新エラー",
      message: "更新に失敗しました",
      notFoundMessage: "コメントが見つかりません",
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = await parseGuardedReviewId(req, params);
  if (isErrorResponse(id)) return id;

  try {
    await prisma.reviewComment.delete({ where: { id }, select: { id: true } });
    return successResponse();
  } catch (error) {
    return handleApiError(error, {
      log: "レビューコメント削除エラー",
      message: "削除に失敗しました",
      notFoundMessage: "コメントが見つかりません",
    });
  }
}
