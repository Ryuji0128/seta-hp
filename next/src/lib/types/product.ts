export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string;
  stock: string;
  image: string | null;
  images: unknown;
  isPublished: boolean;
  isHeroImage: boolean;
  purchaseUrl: string | null;
  createdAt: string | Date;
}

export type ProductSummary = Pick<Product, "id" | "name" | "category" | "price" | "image">;

export type ProductGridItem = Pick<Product, "id" | "name" | "category" | "price" | "image" | "tags">;

export function parseTags(tagString: string | null | undefined): string[] {
  return tagString ? tagString.split(",").map((t) => t.trim()).filter(Boolean) : [];
}

export function parseProductImages(images: unknown, image: string | null): string[] {
  if (Array.isArray(images) && images.every((i) => typeof i === "string")) {
    return images;
  }
  return image ? [image] : [];
}
