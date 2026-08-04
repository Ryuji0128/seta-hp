/**
 * クライアント側 fetch の共通ヘルパ。
 * 「JSON で送って、失敗なら data.error を Error として投げる」定型を一元化する。
 */
export async function apiJson<T = unknown>(
  url: string,
  options?: { method?: string; body?: unknown }
): Promise<T> {
  const { method = "GET", body } = options ?? {};

  const res = await fetch(url, {
    method,
    ...(body !== undefined
      ? {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      : {}),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = (data as { error?: string } | null)?.error;
    throw new Error(message || "リクエストに失敗しました");
  }

  return data as T;
}

/**
 * 画像アップロード（/api/upload）の共通処理。
 * ImageUpload / MultiImageUpload で重複していた FormData POST を一元化。
 * 成功時はアップロード先 URL を返し、失敗時はサーバーの error メッセージで throw する。
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = (data as { error?: string } | null)?.error;
    throw new Error(message || "アップロードに失敗しました");
  }

  return (data as { url: string }).url;
}
