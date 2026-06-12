import { NextResponse, NextRequest } from "next/server";
import { fetchSecret } from "@/lib/fetchSecrets";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { rateLimitResponse } from "@/lib/api-response";
import { isErrorResponse, parseJsonBody } from "@/lib/api-utils";

export async function POST(req: NextRequest) {
  // レート制限チェック
  const clientIp = getClientIp(req);
  const rateLimitResult = await checkRateLimit(`recaptcha:${clientIp}`, RATE_LIMITS.recaptcha);
  if (!rateLimitResult.success) {
    const retryAfter = Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000);
    return rateLimitResponse(retryAfter, rateLimitResult.resetAt);
  }

  const body = await parseJsonBody(req);
  if (isErrorResponse(body)) return body;
  const { token, expectedAction } = body;

  if (!token) {
    return NextResponse.json({ success: false, message: 'No token provided' }, { status: 400 });
  }

  const secretName = "RECAPTCHA_SECRET_KEY";
  const recaptchaKey = await fetchSecret(secretName);

  try {
    const params = new URLSearchParams({ secret: recaptchaKey, response: token });
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?${params}`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`siteverify応答エラー: HTTP ${response.status}`);
    }

    const { success, score, action, hostname } = await response.json();

    if (!success) {
      // トークンが無効な場合
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 400 }
      );
    }

    // action検証（指定された場合のみ）
    if (expectedAction && action !== expectedAction) {
      return NextResponse.json(
        { success: false, message: 'Action mismatch' },
        { status: 400 }
      );
    }

    // hostname検証（本番環境のみ）
    const allowedHostnames = process.env.ALLOWED_RECAPTCHA_HOSTNAMES?.split(',') || [];
    if (allowedHostnames.length > 0 && !allowedHostnames.includes(hostname)) {
      return NextResponse.json(
        { success: false, message: 'Invalid hostname' },
        { status: 400 }
      );
    }

    if (score < 0.5) {
      // トークンは有効だがスコアが低い場合
      return NextResponse.json(
        { success: false, message: 'Low score, verification failed' },
        { status: 403 }
      );
    }

    // トークンが有効でスコアが閾値以上の場合
    return NextResponse.json(
      { success: true, message: 'Verification successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error("reCAPTCHA 検証エラー:", error);
    return NextResponse.json({ success: false, error: "reCAPTCHA 検証に失敗しました。" }, { status: 500 });
  }
}
