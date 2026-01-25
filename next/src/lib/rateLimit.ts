/**
 * IPベースのレート制限
 * メモリ内でリクエスト回数を追跡
 */

interface RateLimitRecord {
  count: number;
  lastReset: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// 古いレコードを定期的にクリーンアップ（メモリリーク防止）
const CLEANUP_INTERVAL = 60 * 1000; // 1分
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, record] of rateLimitMap.entries()) {
    if (now - record.lastReset > windowMs * 2) {
      rateLimitMap.delete(key);
    }
  }
}

/**
 * レート制限チェック
 * @param ip クライアントのIPアドレス
 * @param limit 制限回数
 * @param windowMs 制限期間（ミリ秒）
 * @returns true: 許可, false: 制限
 */
export function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  cleanup(windowMs);

  const now = Date.now();
  const key = ip;
  const record = rateLimitMap.get(key);

  // 新規 or ウィンドウ期間が過ぎた場合はリセット
  if (!record || now - record.lastReset > windowMs) {
    rateLimitMap.set(key, { count: 1, lastReset: now });
    return true;
  }

  // 制限に達している場合
  if (record.count >= limit) {
    return false;
  }

  // カウントアップ
  record.count++;
  return true;
}

/**
 * 残りリクエスト回数を取得
 */
export function getRateLimitRemaining(ip: string, limit: number, windowMs: number): number {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.lastReset > windowMs) {
    return limit;
  }

  return Math.max(0, limit - record.count);
}
