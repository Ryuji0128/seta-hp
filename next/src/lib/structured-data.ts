import { parseProductImages, type Product } from "@/lib/types/product";
import { getStockMeta } from "@/lib/constants/categories";
import { formatRefNumber } from "@/lib/format";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

// 相対パス（/uploads/...）を絶対URLに変換する。外部URLはそのまま。
function toAbsoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * 商品ページ用 schema.org/Product 構造化データを生成する。
 * 検索結果に価格・在庫を表示させ、リッチリザルトの対象にする。
 */
export function buildProductJsonLd(product: Product): Record<string, unknown> {
  const images = parseProductImages(product.images, product.image).map(toAbsoluteUrl);
  const url = `${SITE_URL}/products/${product.id}`;
  // 在庫表示文字列 → schema.org availability。未知の値は「在庫あり」とみなす（InStock）。
  const availability = getStockMeta(product.stock)?.schemaUrl ?? "https://schema.org/InStock";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    ...(images.length > 0 ? { image: images } : {}),
    sku: formatRefNumber(product.id),
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "JPY",
      price: product.price,
      availability,
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };
}

/**
 * 商品ページ用 schema.org/BreadcrumbList 構造化データを生成する。
 * ProductDetail の表示パンくず（Home / Catalogue / 商品）と対応。
 */
export function buildBreadcrumbJsonLd(product: Product): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "商品一覧", item: `${SITE_URL}/products` },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${SITE_URL}/products/${product.id}`,
      },
    ],
  };
}
