/**
 * レビューコメント個別操作 API
 *
 * PATCH  /api/review-comments/:id  … status の切替（open <-> resolved）
 * DELETE /api/review-comments/:id  … 削除（社内利用なので誰でも可）
 */

import { getPrismaClient } from "@/lib/db";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import {
  parseReviewId as parseId,
  reviewCommentsDisabledResponse,
} from "@/lib/reviewCommentsGuard";
import { NextRequest, NextResponse } from "next/server";

const prisma = getPrismaClient();

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const disabled = reviewCommentsDisabledResponse();
  if (disabled) return disabled;

  const { limited } = await enforceRateLimit(req, `review:${req.nextUrl.pathname}`, RATE_LIMITS.reviewUpdate);
  if (limited) return limited;

  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) return NextResponse.json({ error: "invalid id" }, { status: 400 });

  try {
    const body = await req.json();
    const status = body.status === "resolved" ? "resolved" : "open";

    const updated = await prisma.reviewComment.update({
      where: { id },
      data: { status },
      include: { replies: { orderBy: { createdAt: "asc" } } },
    });
    return NextResponse.json({ comment: updated });
  } catch (error) {
    console.error("レビューコメント更新エラー:", error);
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const disabled = reviewCommentsDisabledResponse();
  if (disabled) return disabled;

  const { limited } = await enforceRateLimit(req, `review:${req.nextUrl.pathname}`, RATE_LIMITS.review);
  if (limited) return limited;

  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) return NextResponse.json({ error: "invalid id" }, { status: 400 });

  try {
    await prisma.reviewComment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("レビューコメント削除エラー:", error);
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
}
