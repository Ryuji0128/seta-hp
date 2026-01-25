import { NextResponse, NextRequest } from "next/server";
import { fetchSecret } from "@/lib/fetchSecrets";
import { rateLimit } from "@/lib/rateLimit";
import axios from "axios";

// レート制限設定: 5回/分
const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 1000; // 1分

/**
 * IPアドレスを取得
 */
function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown";
}

export async function POST(req: NextRequest) {
  // レート制限チェック
  const clientIp = getClientIp(req);
  if (!rateLimit(`recaptcha:${clientIp}`, RATE_LIMIT, RATE_WINDOW)) {
    return NextResponse.json(
      { success: false, error: "リクエスト回数が上限に達しました。しばらくお待ちください。" },
      { status: 429 }
    );
  }

  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ success: false, message: 'No token provided' }, { status: 400 });
  }

  const secretName = "RECAPTCHA_SECRET_KEY";
  const recaptchaKey = await fetchSecret(secretName);

  try {
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify`;

    const response = await axios.post(verificationUrl, null, {
      params: {
        secret: recaptchaKey,
        response: token,
      },
    });

    const { success, score } = response.data;

    if (!success) {
      // トークンが無効な場合
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
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
