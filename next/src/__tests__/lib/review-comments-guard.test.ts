import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/rate-limit", () => ({
  RATE_LIMITS: {
    review: { limit: 30, windowMs: 60_000 },
    reviewUpdate: { limit: 60, windowMs: 60_000 },
  },
  enforceRateLimit: vi.fn(),
}));

import { enforceRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { parseGuardedReviewId } from "@/lib/reviewCommentsGuard";

const mockEnforceRateLimit = vi.mocked(enforceRateLimit);

describe("parseGuardedReviewId", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_ENABLE_COMMENTS = "true";
    mockEnforceRateLimit.mockReset();
    mockEnforceRateLimit.mockResolvedValue({
      limited: null,
      result: { success: true, remaining: 29, resetAt: Date.now() + 60_000 },
    });
  });

  it("書き込みガード通過後に正の整数IDを返す", async () => {
    const req = new Request("http://localhost/api/review-comments/12");
    const result = await parseGuardedReviewId(
      req,
      Promise.resolve({ id: "12" }),
      RATE_LIMITS.reviewUpdate
    );

    expect(result).toBe(12);
    expect(mockEnforceRateLimit).toHaveBeenCalledWith(
      req,
      "review:/api/review-comments/12",
      RATE_LIMITS.reviewUpdate
    );
  });

  it("不正なIDを400として返す", async () => {
    const result = await parseGuardedReviewId(
      new Request("http://localhost/api/review-comments/invalid"),
      Promise.resolve({ id: "invalid" })
    );

    expect(typeof result).not.toBe("number");
    if (typeof result !== "number") {
      expect(result.status).toBe(400);
      expect(await result.json()).toEqual({ error: "invalid id" });
    }
  });

  it("機能が無効ならIDを評価せず404を返す", async () => {
    delete process.env.NEXT_PUBLIC_ENABLE_COMMENTS;

    const result = await parseGuardedReviewId(
      new Request("http://localhost/api/review-comments/12"),
      Promise.resolve({ id: "12" })
    );

    expect(typeof result).not.toBe("number");
    if (typeof result !== "number") {
      expect(result.status).toBe(404);
    }
    expect(mockEnforceRateLimit).not.toHaveBeenCalled();
  });
});
