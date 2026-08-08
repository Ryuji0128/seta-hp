interface ApiJsonOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

/** AbortControllerによる意図的なキャンセルかを環境非依存で判定する。 */
export function isAbortError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AbortError"
  );
}

/**
 * クライアント側 fetch の共通ヘルパ。
 * 「JSON で送って、失敗なら data.error を Error として投げる」定型を一元化する。
 */
export async function apiJson<T = unknown>(
  url: string,
  options?: ApiJsonOptions
): Promise<T> {
  const { body, ...requestOptions } = options ?? {};
  const headers = new Headers(requestOptions.headers);
  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...requestOptions,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
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
