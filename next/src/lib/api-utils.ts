import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import xss from "xss";
import { auth } from "@/lib/auth";
import { forbiddenResponse, unauthorizedResponse } from "@/lib/api-response";

type UserRole = "ADMIN" | "EDITOR" | "VIEWER";

/**
 * 認証と権限をまとめて検証する。
 * 未認証なら401、権限不足なら403のレスポンスを、検証通過ならセッションを返す。
 */
export async function requireRole(
  roles: UserRole[],
  forbiddenMessage: string = "権限がありません"
): Promise<Session | NextResponse> {
  const session = await auth();
  if (!session?.user) {
    return unauthorizedResponse();
  }
  if (!session.user.role || !roles.includes(session.user.role)) {
    return forbiddenResponse(forbiddenMessage);
  }
  return session;
}

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

/**
 * タグ入力（配列 or カンマ区切り文字列）をサニタイズ済みのカンマ区切り文字列へ正規化する。
 */
export function sanitizeTags(tags: unknown): string {
  if (Array.isArray(tags)) {
    return tags.map((t) => xss(String(t))).join(",");
  }
  return xss(typeof tags === "string" ? tags : "");
}
