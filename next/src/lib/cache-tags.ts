import { revalidatePath, revalidateTag } from "next/cache";

/**
 * unstable_cache のタグ定義。
 * 公開ページのDBアクセスはこのタグ付きでキャッシュし、
 * 管理画面からの書き込み時に revalidate* で即時無効化する。
 */
export const CACHE_TAGS = {
  products: "products",
  works: "works",
} as const;

/**
 * 商品の作成・更新・削除後に、商品を表示する全ページのキャッシュを破棄する。
 * - products タグ: トップ（カタログ/ヒーロー画像）・商品一覧のデータキャッシュ
 * - /products/[id]: ISR済みの商品詳細ページ（関連商品の表示を含むため全件）
 */
export function revalidateProductPages() {
  revalidateTag(CACHE_TAGS.products);
  revalidatePath("/products/[id]", "page");
}

/** 制作事例の作成・更新・削除後に、ギャラリーのデータキャッシュを破棄する。 */
export function revalidateWorkPages() {
  revalidateTag(CACHE_TAGS.works);
}
