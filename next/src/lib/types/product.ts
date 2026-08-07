import type { Product as PrismaProduct } from "@prisma/client";
import { normalizeImageUrl } from "@/lib/images";

// DB直取得（Date）とAPIレスポンス（ISO文字列）の両方を受けつつ、
// モデルのフィールド追加・変更はPrisma型へ追従する。
export type Product = Omit<PrismaProduct, "createdAt" | "updatedAt"> & {
  createdAt: string | Date;
};

export type ProductSummary = Pick<Product, "id" | "name" | "category" | "price" | "image">;

export type ProductGridItem = Pick<Product, "id" | "name" | "category" | "price" | "image" | "tags">;

export function parseTags(tagString: string | null | undefined): string[] {
  return tagString ? tagString.split(",").map((t) => t.trim()).filter(Boolean) : [];
}

export function parseProductImages(images: unknown, image: string | null): string[] {
  if (Array.isArray(images) && images.every((i) => typeof i === "string")) {
    return images.map((img) => normalizeImageUrl(img)).filter((img): img is string => Boolean(img));
  }

  const normalizedImage = normalizeImageUrl(image);
  return normalizedImage ? [normalizedImage] : [];
}
