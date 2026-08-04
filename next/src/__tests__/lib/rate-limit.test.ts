import { beforeEach, describe, expect, it, vi } from "vitest";

vi.stubEnv("NODE_ENV", "test");
vi.useFakeTimers();

const { checkRateLimit, getClientIp, enforceRateLimit } = await import("@/lib/rate-limit");

describe("checkRateLimit", () => {
  const config = { limit: 3, windowMs: 60_000 };

  beforeEach(() => {
    vi.advanceTimersByTime(120_000);
  });

  it("初回リクエストは成功", async () => {
    const result = await checkRateLimit("test-new-key", config);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("制限内の連続リクエストは成功", async () => {
    const key = "test-within-limit";
    await checkRateLimit(key, config);
    await checkRateLimit(key, config);
    const result = await checkRateLimit(key, config);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it("制限超過で失敗", async () => {
    const key = "test-exceeded";
    await checkRateLimit(key, config);
    await checkRateLimit(key, config);
    await checkRateLimit(key, config);
    const result = await checkRateLimit(key, config);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("ウィンドウ経過後にリセット", async () => {
    const key = "test-reset";
    await checkRateLimit(key, config);
    await checkRateLimit(key, config);
    await checkRateLimit(key, config);
    expect((await checkRateLimit(key, config)).success).toBe(false);

    vi.advanceTimersByTime(61_000);
    expect((await checkRateLimit(key, config)).success).toBe(true);
  });

  it("異なるキーは独立してカウント", async () => {
    await checkRateLimit("key-a", config);
    await checkRateLimit("key-a", config);
    await checkRateLimit("key-a", config);
    expect((await checkRateLimit("key-a", config)).success).toBe(false);
    expect((await checkRateLimit("key-b", config)).success).toBe(true);
  });
});

describe("enforceRateLimit", () => {
  const config = { limit: 2, windowMs: 60_000 };

  it("制限内はlimitedがnullで結果を返す", async () => {
    const request = new Request("http://localhost/api/test", {
      headers: { "x-forwarded-for": "203.0.113.5" },
    });

    const { limited, result } = await enforceRateLimit(request, "test-enforce", config);
    expect(limited).toBeNull();
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(1);
  });

  it("制限超過で429レスポンスを返す", async () => {
    const request = new Request("http://localhost/api/test", {
      headers: { "x-forwarded-for": "203.0.113.6" },
    });

    await enforceRateLimit(request, "test-enforce-over", config);
    await enforceRateLimit(request, "test-enforce-over", config);
    const { limited } = await enforceRateLimit(request, "test-enforce-over", config);

    expect(limited).not.toBeNull();
    expect(limited?.status).toBe(429);
    expect(limited?.headers.get("Retry-After")).toBeTruthy();
  });

  it("IPごとに独立してカウントされる", async () => {
    const requestA = new Request("http://localhost/api/test", {
      headers: { "x-forwarded-for": "203.0.113.7" },
    });
    const requestB = new Request("http://localhost/api/test", {
      headers: { "x-forwarded-for": "203.0.113.8" },
    });

    await enforceRateLimit(requestA, "test-enforce-ip", config);
    await enforceRateLimit(requestA, "test-enforce-ip", config);
    expect((await enforceRateLimit(requestA, "test-enforce-ip", config)).limited).not.toBeNull();
    expect((await enforceRateLimit(requestB, "test-enforce-ip", config)).limited).toBeNull();
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
