/**
 * 社内レビューコメント API の有効化ガード
 *
 * UI 側 (layout.tsx) と同じ NEXT_PUBLIC_ENABLE_COMMENTS フラグで API も完全に閉じる。
 * 本番デプロイ時は環境変数を設定しないことで、エンドポイント自体が 404 を返す。
 */

import { NextResponse } from "next/server";

export function reviewCommentsDisabledResponse(): NextResponse | null {
  if (process.env.NEXT_PUBLIC_ENABLE_COMMENTS !== "true") {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  return null;
}
