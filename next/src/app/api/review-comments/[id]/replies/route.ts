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
import { isRateLimited } from "@/lib/rate-limit";
import { reviewCommentsDisabledResponse } from "@/lib/reviewCommentsGuard";
import { NextRequest, NextResponse } from "next/server";
import xss from "xss";

const prisma = getPrismaClient();

const MAX_CONTENT = 2000;
const MAX_NAME = 80;

function clean(value: unknown, max: number): string {
  return xss(String(value ?? "")).trim().slice(0, max);
}

function parseId(raw: string | null): number | null {
  if (!raw) return null;
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const disabled = reviewCommentsDisabledResponse();
  if (disabled) return disabled;

  if (await isRateLimited(req, { windowMs: 60_000, max: 30 })) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { id: rawId } = await params;
  const commentId = parseId(rawId);
  if (!commentId)
    return NextResponse.json({ error: "invalid id" }, { status: 400 });

  try {
    const body = await req.json();
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
  const disabled = reviewCommentsDisabledResponse();
  if (disabled) return disabled;

  if (await isRateLimited(req, { windowMs: 60_000, max: 30 })) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

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
