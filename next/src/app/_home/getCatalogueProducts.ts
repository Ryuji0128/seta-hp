import { getPrismaClient } from "@/lib/db";
import { normalizeImageUrl } from "@/lib/images";

// トップの「ラインナップ」カードに表示する商品データ。
export type CatalogueProduct = {
  id: number;
  name: string;
  price: number;
  image: string | null;
};

/**
 * 商品管理で登録した公開商品を新しい順に取得し、トップのラインナップ用に整形して返す。
 * メイン画像(image)が無ければ images[0] を使用。DBエラー時は空配列を返してトップが落ちないようにする。
 */
export async function getCatalogueProducts(): Promise<CatalogueProduct[]> {
  try {
    const prisma = getPrismaClient();
    const products = await prisma.product.findMany({
      where: { isPublished: true },
      select: { id: true, name: true, price: true, image: true, images: true },
      orderBy: { createdAt: "desc" },
    });

    return products.map((p) => {
      const fallbackImage = Array.isArray(p.images)
        ? (p.images
            .map((img) => typeof img === "string" ? normalizeImageUrl(img) : null)
            .find((img): img is string => Boolean(img)) ?? null)
        : null;
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        image: normalizeImageUrl(p.image) || fallbackImage,
      };
    });
  } catch (error) {
    console.error("カタログ商品の取得に失敗:", error);
    return [];
  }
}
