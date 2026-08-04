/**
 * 商品・制作事例の参照番号（Ref. 001 形式）を生成する。
 * ProductsGrid / GalleryGrid / RelatedProducts / ProductDetail / 構造化データで共用。
 */
export function formatRefNumber(id: number): string {
  return String(id).padStart(3, "0");
}
