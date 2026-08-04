import { NextResponse } from "next/server";

/**
 * 統一されたAPIレスポンス形式
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
}

/**
 * 400 Bad Request（`{ error }` 形式・各ルートの直書きレスポンスと同形）
 */
export function badRequestResponse(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

/**
 * 404 Not Found（`{ error }` 形式）
 */
export function notFoundResponse(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 404 });
}

/**
 * 500 Internal Server Error（`{ error }` 形式）
 */
export function internalErrorResponse(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 500 });
}

/**
 * バリデーションエラーレスポンスを作成
 */
export function validationErrorResponse(
  errors: Record<string, string>,
  status: number = 400
): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, errors },
    { status }
  );
}

/**
 * レート制限エラーレスポンスを作成
 */
export function rateLimitResponse(
  retryAfter: number,
  resetAt: number,
  message: string = "リクエスト回数が上限に達しました。しばらくお待ちください。"
): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, error: message },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(resetAt),
      },
    }
  );
}

/**
 * 認証エラーレスポンスを作成
 */
export function unauthorizedResponse(
  message: string = "認証が必要です"
): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, error: message },
    { status: 401 }
  );
}

/**
 * 権限エラーレスポンスを作成
 */
export function forbiddenResponse(
  message: string = "権限がありません"
): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, error: message },
    { status: 403 }
  );
}

