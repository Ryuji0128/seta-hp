// カテゴリ定義の一元管理

export const PRODUCT_CATEGORIES = [
  { value: "card-display", label: "カードディスプレイ" },
  { value: "acrylic", label: "アクリル製品" },
  { value: "3d-print", label: "3Dプリント製品" },
] as const;

export const GALLERY_CATEGORIES = [
  { value: "modeling", label: "3Dモデリング", color: "#1976d2" },
  { value: "print", label: "3Dプリント製品", color: "#388e3c" },
  { value: "laser", label: "レーザーカット", color: "#f57c00" },
  { value: "mockup", label: "試作品", color: "#7b1fa2" },
] as const;

// 在庫ステータスの一元メタテーブル。
// muiColor: 管理画面 Chip の色 / schemaUrl: schema.org availability /
// detail: 商品詳細ページのバッジ配色（bg/文字色）
export const STOCK_OPTIONS = [
  {
    value: "在庫あり",
    label: "在庫あり",
    muiColor: "success",
    schemaUrl: "https://schema.org/InStock",
    detail: { bg: "rgba(180,83,9,0.08)", color: "#B45309" },
  },
  {
    value: "残りわずか",
    label: "残りわずか",
    muiColor: "warning",
    schemaUrl: "https://schema.org/LimitedAvailability",
    detail: { bg: "#FEF3E2", color: "#8C3E07" },
  },
  {
    value: "受注生産",
    label: "受注生産",
    muiColor: "info",
    schemaUrl: "https://schema.org/InStock",
    detail: { bg: "#F6F6F4", color: "#6B6B6B" },
  },
  {
    value: "売り切れ",
    label: "売り切れ",
    muiColor: "error",
    schemaUrl: "https://schema.org/OutOfStock",
    detail: { bg: "#FEE2E2", color: "#991B1B" },
  },
] as const;

export type StockMeta = (typeof STOCK_OPTIONS)[number];

/** 在庫ステータス文字列からメタ情報を引く（未知の値は undefined） */
export function getStockMeta(value: string): StockMeta | undefined {
  return STOCK_OPTIONS.find((s) => s.value === value);
}

export function getProductCategoryLabel(value: string): string {
  return PRODUCT_CATEGORIES.find((c) => c.value === value)?.label || value;
}

export function getGalleryCategoryLabel(value: string): string {
  return GALLERY_CATEGORIES.find((c) => c.value === value)?.label || value;
}

export const VALID_PRODUCT_CATEGORIES = PRODUCT_CATEGORIES.map((c) => c.value);
export const VALID_GALLERY_CATEGORIES = GALLERY_CATEGORIES.map((c) => c.value);
export const VALID_STOCK_OPTIONS = STOCK_OPTIONS.map((s) => s.value);
