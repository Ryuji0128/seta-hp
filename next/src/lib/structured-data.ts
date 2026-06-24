import { parseProductImages, type Product } from "@/lib/types/product";

const SITE_URL = "https://kaza-love.com";
const SITE_NAME = "飾Love";

// 在庫表示文字列 → schema.org の availability URL へマッピング。
// 未知の値は「在庫あり」とみなす（InStock）。
const STOCK_TO_AVAILABILITY: Record<string, string> = {
  在庫あり: "https://schema.org/InStock",
  残りわずか: "https://schema.org/LimitedAvailability",
  売り切れ: "https://schema.org/OutOfStock",
};

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
  const availability =
    STOCK_TO_AVAILABILITY[product.stock] ?? "https://schema.org/InStock";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    ...(images.length > 0 ? { image: images } : {}),
    sku: String(product.id).padStart(3, "0"),
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
