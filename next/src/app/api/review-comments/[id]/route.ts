/**
 * レビューコメント個別操作 API
 *
 * PATCH  /api/review-comments/:id  … status の切替（open <-> resolved）
 * DELETE /api/review-comments/:id  … 削除（社内利用なので誰でも可）
 */

import { getPrismaClient } from "@/lib/db";
import { badRequestResponse, internalErrorResponse } from "@/lib/api-response";
import { RATE_LIMITS } from "@/lib/rate-limit";
import { reviewCommentSelect } from "@/lib/review-comment-query";
import { isErrorResponse, parseJsonBody } from "@/lib/api-utils";
import {
  parseReviewId as parseId,
  reviewWriteGuard,
} from "@/lib/reviewCommentsGuard";
import { NextRequest, NextResponse } from "next/server";

const prisma = getPrismaClient();

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const blocked = await reviewWriteGuard(req, RATE_LIMITS.reviewUpdate);
  if (blocked) return blocked;

  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) return badRequestResponse("invalid id");

  try {
    const body = await parseJsonBody(req);
    if (isErrorResponse(body)) return body;
    const status = body.status === "resolved" ? "resolved" : "open";

    const updated = await prisma.reviewComment.update({
      where: { id },
      data: { status },
      select: reviewCommentSelect,
    });
    return NextResponse.json({ comment: updated });
  } catch (error) {
    console.error("レビューコメント更新エラー:", error);
    return internalErrorResponse("更新に失敗しました");
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const blocked = await reviewWriteGuard(req);
  if (blocked) return blocked;

  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) return badRequestResponse("invalid id");

  try {
    await prisma.reviewComment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("レビューコメント削除エラー:", error);
    return internalErrorResponse("削除に失敗しました");
  }
}
