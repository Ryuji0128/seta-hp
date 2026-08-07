"use client";

import { useCallback, useEffect, useState } from "react";
import { apiJson } from "@/lib/api-client";

interface UseCrudResourceOptions {
  /** 書き込み先エンドポイント（POST/PUT/DELETE） */
  endpoint: string;
  /** 一覧取得URL（省略時は endpoint） */
  listUrl?: string;
  /** 一覧レスポンス内の配列キー（例: "products"） */
  listKey: string;
  /** リソース表示名（エラーメッセージ用。例: "商品"） */
  label: string;
  /** APIから1ページごとに取得する件数 */
  pageSize?: number;
}

interface PaginatedResourceResponse {
  [key: string]: unknown;
  total?: number;
}

/**
 * 管理画面CRUDの共通フック。
 * ProductManagement / GalleryManagement / NewsManagement / InquiryManagement で
 * 重複していた fetch・保存・削除・再取得の定型を一元化する。
 */
export function useCrudResource<T extends { id: number }>({
  endpoint,
  listUrl,
  listKey,
  label,
  pageSize = 50,
}: UseCrudResourceOptions) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const baseUrl = listUrl ?? endpoint;
      const separator = baseUrl.includes("?") ? "&" : "?";
      const data = await apiJson<PaginatedResourceResponse>(
        `${baseUrl}${separator}page=${page}&limit=${pageSize}`
      );
      const nextItems = (data[listKey] as T[]) ?? [];
      const nextTotal = typeof data.total === "number" ? data.total : nextItems.length;
      const lastPage = Math.max(1, Math.ceil(nextTotal / pageSize));

      setTotal(nextTotal);
      if (page > lastPage) {
        setPage(lastPage);
      } else {
        setItems(nextItems);
      }
    } catch (error) {
      console.error(`${label}一覧の取得に失敗:`, error);
    } finally {
      setLoading(false);
    }
  }, [endpoint, listUrl, listKey, label, page, pageSize]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  /** 保存（id 指定で更新・省略で作成）。成功で true、失敗は alert 表示して false。 */
  const save = useCallback(
    async (payload: Record<string, unknown>, id?: number): Promise<boolean> => {
      try {
        await apiJson(endpoint, {
          method: id ? "PUT" : "POST",
          body: id ? { id, ...payload } : payload,
        });
        if (!id && page !== 1) {
          setPage(1);
        } else {
          await refetch();
        }
        return true;
      } catch (error) {
        console.error(`${label}の保存に失敗:`, error);
        alert(error instanceof Error ? error.message : `${label}の保存に失敗しました`);
        return false;
      }
    },
    [endpoint, label, page, refetch]
  );

  /** 削除。成功で true、失敗は alert 表示して false。 */
  const remove = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        await apiJson(endpoint, { method: "DELETE", body: { id } });
        await refetch();
        return true;
      } catch (error) {
        console.error(`${label}の削除に失敗:`, error);
        alert(error instanceof Error ? error.message : `${label}の削除に失敗しました`);
        return false;
      }
    },
    [endpoint, label, refetch]
  );

  return {
    items,
    loading,
    save,
    remove,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      setPage,
    },
  };
}
