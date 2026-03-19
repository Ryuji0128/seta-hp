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
 * 成功レスポンスを作成
 */
export function successResponse<T>(
  data: T,
  status: number = 200,
  headers?: HeadersInit
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { success: true, data },
    { status, headers }
  );
}

/**
 * エラーレスポンスを作成
 */
export function errorResponse(
  error: string,
  status: number = 400,
  headers?: HeadersInit
): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, error },
    { status, headers }
  );
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
  resetAt: number
): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, error: "リクエスト回数が上限に達しました。しばらくお待ちください。" },
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

/**
 * サーバーエラーレスポンスを作成
 */
export function serverErrorResponse(
  message: string = "サーバーエラーが発生しました"
): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, error: message },
    { status: 500 }
  );
}
