import { describe, it, expect, vi, beforeEach } from "vitest";

// setIntervalのモック（モジュール読み込み時に実行されるため）
vi.useFakeTimers();

const { checkRateLimit, getClientIp } = await import("@/lib/rate-limit");

describe("checkRateLimit", () => {
  const config = { limit: 3, windowMs: 60_000 };

  beforeEach(() => {
    // タイマーを進めてストアをリセット
    vi.advanceTimersByTime(120_000);
  });

  it("初回リクエストは成功", () => {
    const result = checkRateLimit("test-new-key", config);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("制限内の連続リクエストは成功", () => {
    const key = "test-within-limit";
    checkRateLimit(key, config);
    checkRateLimit(key, config);
    const result = checkRateLimit(key, config);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it("制限超過で失敗", () => {
    const key = "test-exceeded";
    checkRateLimit(key, config);
    checkRateLimit(key, config);
    checkRateLimit(key, config);
    const result = checkRateLimit(key, config);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("ウィンドウ経過後にリセット", () => {
    const key = "test-reset";
    checkRateLimit(key, config);
    checkRateLimit(key, config);
    checkRateLimit(key, config);
    expect(checkRateLimit(key, config).success).toBe(false);

    vi.advanceTimersByTime(61_000);
    expect(checkRateLimit(key, config).success).toBe(true);
  });

  it("異なるキーは独立してカウント", () => {
    checkRateLimit("key-a", config);
    checkRateLimit("key-a", config);
    checkRateLimit("key-a", config);
    expect(checkRateLimit("key-a", config).success).toBe(false);
    expect(checkRateLimit("key-b", config).success).toBe(true);
  });
});

describe("getClientIp", () => {
  it("x-forwarded-forヘッダーの最初のIPを返す", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "203.0.113.1, 10.0.0.1" },
    });
    expect(getClientIp(request)).toBe("203.0.113.1");
  });

  it("x-real-ipヘッダーを返す", () => {
    const request = new Request("http://localhost", {
      headers: { "x-real-ip": "192.168.1.1" },
    });
    expect(getClientIp(request)).toBe("192.168.1.1");
  });

  it("ヘッダーがない場合unknownを返す", () => {
    const request = new Request("http://localhost");
    expect(getClientIp(request)).toBe("unknown");
  });

  it("x-forwarded-forがx-real-ipより優先される", () => {
    const request = new Request("http://localhost", {
      headers: {
        "x-forwarded-for": "203.0.113.1",
        "x-real-ip": "192.168.1.1",
      },
    });
    expect(getClientIp(request)).toBe("203.0.113.1");
  });
});
