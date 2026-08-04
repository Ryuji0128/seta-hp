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
}: UseCrudResourceOptions) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const data = await apiJson<Record<string, unknown>>(listUrl ?? endpoint);
      setItems((data[listKey] as T[]) ?? []);
    } catch (error) {
      console.error(`${label}一覧の取得に失敗:`, error);
    } finally {
      setLoading(false);
    }
  }, [endpoint, listUrl, listKey, label]);

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
        await refetch();
        return true;
      } catch (error) {
        console.error(`${label}の保存に失敗:`, error);
        alert(error instanceof Error ? error.message : `${label}の保存に失敗しました`);
        return false;
      }
    },
    [endpoint, label, refetch]
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

  return { items, loading, refetch, save, remove };
}
