import { unstable_cache } from "next/cache";
import { getPrismaClient } from "@/lib/db";
import { parseProductImages } from "@/lib/types/product";
import { CACHE_REVALIDATE_SECONDS, CACHE_TAGS } from "@/lib/cache-tags";

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
 * unstable_cache でキャッシュし、商品の書き込み時（products タグ）に無効化される。
 */
export const getCatalogueProducts = unstable_cache(
  async (): Promise<CatalogueProduct[]> => {
  try {
    const prisma = getPrismaClient();
    const products = await prisma.product.findMany({
      where: { isPublished: true },
      select: { id: true, name: true, price: true, image: true, images: true },
      orderBy: { createdAt: "desc" },
    });

    return products.map((p) => {
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        image: parseProductImages(p.images, p.image)[0] ?? null,
      };
    });
  } catch (error) {
    console.error("カタログ商品の取得に失敗:", error);
    return [];
  }
  },
  ["catalogue-products"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: [CACHE_TAGS.products] }
);
