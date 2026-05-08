import { describe, it, expect } from "vitest";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  rateLimitResponse,
  unauthorizedResponse,
  forbiddenResponse,
  serverErrorResponse,
} from "@/lib/api-response";

describe("successResponse", () => {
  it("200ステータスでdataを含む", async () => {
    const res = successResponse({ items: [1, 2, 3] });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toEqual({ items: [1, 2, 3] });
  });

  it("カスタムステータスコードを指定可能", async () => {
    const res = successResponse("created", 201);
    expect(res.status).toBe(201);
  });
});

describe("errorResponse", () => {
  it("400ステータスでエラーメッセージを含む", async () => {
    const res = errorResponse("入力が不正です");
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe("入力が不正です");
  });

  it("カスタムステータスコードを指定可能", async () => {
    const res = errorResponse("not found", 404);
    expect(res.status).toBe(404);
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

describe("serverErrorResponse", () => {
  it("500ステータスを返す", async () => {
    const res = serverErrorResponse();
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("サーバーエラーが発生しました");
  });
});
