import { NextResponse } from "next/server";

/**
 * リクエストボディの JSON パースを安全に行う。
 * 不正な JSON の場合は 400 エラーレスポンスを返す。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function parseJsonBody(req: Request): Promise<any | NextResponse> {
  try {
    return await req.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストボディが不正です" },
      { status: 400 }
    );
  }
}

export function isErrorResponse(value: unknown): value is NextResponse {
  return value instanceof NextResponse;
}
