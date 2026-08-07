/**
 * レビューコメントへの返信 API
 *
 * POST   /api/review-comments/:id/replies            … 返信追加
 * DELETE /api/review-comments/:id/replies?replyId=N  … 返信削除
 *
 * 注意: DELETE は commentId と replyId の組で絞ること。replyId 単独で消すと
 *       任意のコメントの返信を別 URL から消せてしまう(権限問題)。
 */

import { getPrismaClient } from "@/lib/db";
import { isErrorResponse, parseJsonBody } from "@/lib/api-utils";
import {
  cleanReviewInput as clean,
  parseReviewId as parseId,
  REVIEW_MAX_CONTENT as MAX_CONTENT,
  REVIEW_MAX_NAME as MAX_NAME,
  reviewWriteGuard,
} from "@/lib/reviewCommentsGuard";
import { NextRequest, NextResponse } from "next/server";

const prisma = getPrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const blocked = await reviewWriteGuard(req);
  if (blocked) return blocked;

  const { id: rawId } = await params;
  const commentId = parseId(rawId);
  if (!commentId)
    return NextResponse.json({ error: "invalid id" }, { status: 400 });

  try {
    const body = await parseJsonBody(req);
    if (isErrorResponse(body)) return body;
    const authorName = clean(body.authorName, MAX_NAME);
    const content = clean(body.content, MAX_CONTENT);

    if (!authorName || !content) {
      return NextResponse.json(
        { error: "authorName / content は必須です" },
        { status: 400 }
      );
    }

    const reply = await prisma.reviewCommentReply.create({
      data: { commentId, authorName, content },
    });
    return NextResponse.json({ reply }, { status: 201 });
  } catch (error) {
    console.error("レビュー返信作成エラー:", error);
    return NextResponse.json({ error: "作成に失敗しました" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const blocked = await reviewWriteGuard(req);
  if (blocked) return blocked;

  const { id: rawId } = await params;
  const commentId = parseId(rawId);
  if (!commentId)
    return NextResponse.json({ error: "invalid id" }, { status: 400 });

  const replyId = parseId(req.nextUrl.searchParams.get("replyId"));
  if (!replyId)
    return NextResponse.json({ error: "replyId is required" }, { status: 400 });

  try {
    const result = await prisma.reviewCommentReply.deleteMany({
      where: { id: replyId, commentId },
    });
    if (result.count === 0) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("レビュー返信削除エラー:", error);
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
}
