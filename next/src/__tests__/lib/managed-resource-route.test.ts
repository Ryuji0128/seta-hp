import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));

import { auth } from "@/lib/auth";
import {
  deleteManagedResource,
  getPublishedListParams,
} from "@/lib/managed-resource-route";
import { isErrorResponse } from "@/lib/api-utils";

const mockAuth = vi.mocked(auth);

describe("getPublishedListParams", () => {
  beforeEach(() => {
    mockAuth.mockReset();
  });

  it("公開一覧は認証せずページネーションを返す", async () => {
    const req = new NextRequest("http://localhost/api/products?page=2&limit=10");
    const result = await getPublishedListParams(req);

    expect(isErrorResponse(result)).toBe(false);
    if (!isErrorResponse(result)) {
      expect(result).toEqual({
        includeUnpublished: false,
        page: 2,
        limit: 10,
        skip: 10,
      });
    }
    expect(mockAuth).not.toHaveBeenCalled();
  });

  it("非公開を含む一覧はEDITOR以上だけを許可する", async () => {
    mockAuth.mockResolvedValue({ user: { role: "VIEWER" } } as never);
    const denied = await getPublishedListParams(
      new NextRequest("http://localhost/api/products?includeUnpublished=true")
    );
    expect(isErrorResponse(denied)).toBe(true);
    if (isErrorResponse(denied)) expect(denied.status).toBe(403);

    mockAuth.mockResolvedValue({ user: { role: "EDITOR" } } as never);
    const allowed = await getPublishedListParams(
      new NextRequest("http://localhost/api/products?includeUnpublished=true")
    );
    expect(isErrorResponse(allowed)).toBe(false);
    if (!isErrorResponse(allowed)) expect(allowed.includeUnpublished).toBe(true);
  });
});

describe("deleteManagedResource", () => {
  beforeEach(() => {
    mockAuth.mockReset();
  });

  it("ADMIN認証、ID検証、削除、後処理を順に実行する", async () => {
    mockAuth.mockResolvedValue({ user: { role: "ADMIN" } } as never);
    const existing = { id: 7, image: "/uploads/old.webp" };
    const findById = vi.fn().mockResolvedValue(existing);
    const deleteById = vi.fn().mockResolvedValue(existing);
    const afterDelete = vi.fn().mockResolvedValue(undefined);

    const response = await deleteManagedResource(
      new NextRequest("http://localhost/api/products", {
        method: "DELETE",
        body: JSON.stringify({ id: 7 }),
      }),
      {
        findById,
        deleteById,
        afterDelete,
        notFoundMessage: "見つかりません",
        errorLog: "削除エラー",
        errorMessage: "削除に失敗しました",
      }
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(findById).toHaveBeenCalledWith(7);
    expect(deleteById).toHaveBeenCalledWith(7);
    expect(afterDelete).toHaveBeenCalledWith(existing);
  });

  it("対象がなければ削除せず404を返す", async () => {
    mockAuth.mockResolvedValue({ user: { role: "ADMIN" } } as never);
    const deleteById = vi.fn();
    const response = await deleteManagedResource(
      new NextRequest("http://localhost/api/news", {
        method: "DELETE",
        body: JSON.stringify({ id: 99 }),
      }),
      {
        findById: vi.fn().mockResolvedValue(null),
        deleteById,
        notFoundMessage: "見つかりません",
        errorLog: "削除エラー",
        errorMessage: "削除に失敗しました",
      }
    );

    expect(response.status).toBe(404);
    expect(deleteById).not.toHaveBeenCalled();
  });
});
