// カテゴリ定義の一元管理

export const PRODUCT_CATEGORIES = [
  { value: "card-display", label: "カードディスプレイ" },
  { value: "acrylic", label: "アクリル製品" },
  { value: "3d-print", label: "3Dプリント製品" },
] as const;

export const GALLERY_CATEGORIES = [
  { value: "modeling", label: "3Dモデリング" },
  { value: "print", label: "3Dプリント製品" },
  { value: "laser", label: "レーザーカット" },
  { value: "mockup", label: "試作品" },
] as const;

export const STOCK_OPTIONS = [
  { value: "在庫あり", label: "在庫あり" },
  { value: "残りわずか", label: "残りわずか" },
  { value: "受注生産", label: "受注生産" },
  { value: "売り切れ", label: "売り切れ" },
] as const;

// 型定義
export type ProductCategoryValue = (typeof PRODUCT_CATEGORIES)[number]["value"];
export type GalleryCategoryValue = (typeof GALLERY_CATEGORIES)[number]["value"];
export type StockOptionValue = (typeof STOCK_OPTIONS)[number]["value"];

// ヘルパー関数
export function getProductCategoryLabel(value: string): string {
  return PRODUCT_CATEGORIES.find((c) => c.value === value)?.label || value;
}

export function getGalleryCategoryLabel(value: string): string {
  return GALLERY_CATEGORIES.find((c) => c.value === value)?.label || value;
}

export function getStockLabel(value: string): string {
  return STOCK_OPTIONS.find((s) => s.value === value)?.label || value;
}

// カテゴリ値の配列（バリデーション用）
export const VALID_PRODUCT_CATEGORIES = PRODUCT_CATEGORIES.map((c) => c.value);
export const VALID_GALLERY_CATEGORIES = GALLERY_CATEGORIES.map((c) => c.value);
export const VALID_STOCK_OPTIONS = STOCK_OPTIONS.map((s) => s.value);
