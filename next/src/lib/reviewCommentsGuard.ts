/**
 * 社内レビューコメント API の有効化ガード
 *
 * UI 側 (layout.tsx) と同じ NEXT_PUBLIC_ENABLE_COMMENTS フラグで API も完全に閉じる。
 * 本番デプロイ時は環境変数を設定しないことで、エンドポイント自体が 404 を返す。
 */

import { NextResponse } from "next/server";
import type { RateLimitConfig } from "@/lib/rate-limit";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export function reviewCommentsDisabledResponse(): NextResponse | null {
  if (process.env.NEXT_PUBLIC_ENABLE_COMMENTS !== "true") {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  return null;
}

/** 書き込みAPI共通の有効化フラグ・レート制限ガード。 */
export async function reviewWriteGuard(
  req: Request,
  config: RateLimitConfig = RATE_LIMITS.review
): Promise<NextResponse | null> {
  const disabled = reviewCommentsDisabledResponse();
  if (disabled) return disabled;

  const pathname = new URL(req.url).pathname;
  const { limited } = await enforceRateLimit(req, `review:${pathname}`, config);
  return limited;
}

/** 正の整数IDのみ許可する */
export function parseReviewId(raw: string | null): number | null {
  if (!raw) return null;
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}
