// シンプルなインメモリレートリミット
// 本番環境ではRedisを使用することを推奨

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// 古いエントリをクリーンアップ（メモリリーク防止）
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // 1分ごとにクリーンアップ

export interface RateLimitConfig {
  // ウィンドウ内で許可するリクエスト数
  limit: number;
  // ウィンドウの長さ（ミリ秒）
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * レートリミットをチェック
 * @param key 識別子（IPアドレスやユーザーIDなど）
 * @param config レートリミット設定
 * @returns レートリミット結果
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // 新規または期限切れの場合
  if (!entry || entry.resetAt < now) {
    const resetAt = now + config.windowMs;
    rateLimitStore.set(key, { count: 1, resetAt });
    return {
      success: true,
      remaining: config.limit - 1,
      resetAt,
    };
  }

  // 制限内の場合
  if (entry.count < config.limit) {
    entry.count++;
    return {
      success: true,
      remaining: config.limit - entry.count,
      resetAt: entry.resetAt,
    };
  }

  // 制限超過
  return {
    success: false,
    remaining: 0,
    resetAt: entry.resetAt,
  };
}

/**
 * IPアドレスを取得
 */
export function getClientIp(request: Request): string {
  // プロキシ経由の場合
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  // 直接接続の場合
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

// プリセット設定
export const RATE_LIMITS = {
  // 登録: 1時間に5回まで
  register: {
    limit: 5,
    windowMs: 60 * 60 * 1000, // 1時間
  },
  // ログイン: 15分に10回まで
  login: {
    limit: 10,
    windowMs: 15 * 60 * 1000, // 15分
  },
  // お問い合わせ: 1分に3回まで
  contact: {
    limit: 3,
    windowMs: 60 * 1000, // 1分
  },
  // reCAPTCHA検証: 1分に5回まで
  recaptcha: {
    limit: 5,
    windowMs: 60 * 1000, // 1分
  },
  // API一般: 1分に60回まで
  api: {
    limit: 60,
    windowMs: 60 * 1000, // 1分
  },
} as const;
