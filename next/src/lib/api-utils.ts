import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import xss from "xss";
import { auth } from "@/lib/auth";
import {
  badRequestResponse,
  forbiddenResponse,
  internalErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "@/lib/api-response";

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

/**
 * API ルート共通の catch ハンドラ。
 * - Zod バリデーションエラー → 400（先頭メッセージ）
 * - Prisma P2025（更新・削除対象なし） → 404
 * - その他 → ログ出力して 500
 */
export function handleApiError(
  error: unknown,
  options: { log: string; message: string; notFoundMessage?: string }
): NextResponse {
  if (error instanceof z.ZodError) {
    return badRequestResponse(error.errors[0].message);
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    return notFoundResponse(options.notFoundMessage ?? "対象が見つかりません");
  }
  console.error(`${options.log}:`, error);
  return internalErrorResponse(options.message);
}
