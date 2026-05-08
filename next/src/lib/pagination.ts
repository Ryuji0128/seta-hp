const DEFAULT_LIMIT = 50;

/**
 * ページネーションパラメータのパース・バリデーション
 * page指定時はデフォルトlimitを適用、両方未指定なら全件取得
 */
export function parsePagination(searchParams: URLSearchParams): {
  page: number;
  limit: number | undefined;
  skip: number | undefined;
} {
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  // どちらも未指定なら全件返却（既存フロント互換）
  if (!pageParam && !limitParam) {
    return { page: 1, limit: undefined, skip: undefined };
  }

  const rawPage = parseInt(pageParam || "1", 10);
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;

  const rawLimit = limitParam ? parseInt(limitParam, 10) : DEFAULT_LIMIT;
  const limit = Number.isFinite(rawLimit) && rawLimit >= 1 ? Math.min(rawLimit, 100) : DEFAULT_LIMIT;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
}
