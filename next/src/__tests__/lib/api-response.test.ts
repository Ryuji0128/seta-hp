import { describe, it, expect } from "vitest";
import {
  successResponse,
  badRequestResponse,
  notFoundResponse,
  internalErrorResponse,
  validationErrorResponse,
  rateLimitResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/api-response";

describe("successResponse", () => {
  it("最小成功payloadと指定したレスポンス設定を返す", async () => {
    const res = successResponse({ status: 201, headers: { "X-Test": "ok" } });
    expect(res.status).toBe(201);
    expect(res.headers.get("X-Test")).toBe("ok");
    expect(await res.json()).toEqual({ success: true });
  });
});

describe("badRequestResponse", () => {
  it("400ステータスで{ error }形式を返す", async () => {
    const res = badRequestResponse("入力が不正です");
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("入力が不正です");
  });
});

describe("notFoundResponse", () => {
  it("404ステータスで{ error }形式を返す", async () => {
    const res = notFoundResponse("対象が見つかりません");
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe("対象が見つかりません");
  });
});

describe("internalErrorResponse", () => {
  it("500ステータスで{ error }形式を返す", async () => {
    const res = internalErrorResponse("サーバーエラーが発生しました");
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("サーバーエラーが発生しました");
  });
});

describe("validationErrorResponse", () => {
  it("400ステータスでフィールド別エラーを返す", async () => {
    const errors = { name: "必須です", email: "不正な形式です" };
    const res = validationErrorResponse(errors);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.errors).toEqual(errors);
  });
});

describe("rateLimitResponse", () => {
  it("429ステータスでレート制限ヘッダーを含む", async () => {
    const res = rateLimitResponse(30, 1700000000);
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("30");
    expect(res.headers.get("X-RateLimit-Remaining")).toBe("0");
    const json = await res.json();
    expect(json.success).toBe(false);
  });
});

describe("unauthorizedResponse", () => {
  it("401ステータスを返す", async () => {
    const res = unauthorizedResponse();
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("認証が必要です");
  });

  it("カスタムメッセージを指定可能", async () => {
    const res = unauthorizedResponse("トークンが無効です");
    const json = await res.json();
    expect(json.error).toBe("トークンが無効です");
  });
});

describe("forbiddenResponse", () => {
  it("403ステータスを返す", async () => {
    const res = forbiddenResponse();
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe("権限がありません");
  });
});
