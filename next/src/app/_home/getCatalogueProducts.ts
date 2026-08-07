import { unstable_cache } from "next/cache";
import { getPrismaClient } from "@/lib/db";
import { getPrimaryProductImage } from "@/lib/types/product";
import { CACHE_REVALIDATE_SECONDS, CACHE_TAGS } from "@/lib/cache-tags";

// トップの「ラインナップ」カードに表示する商品データ。
export type CatalogueProduct = {
  id: number;
  name: string;
  price: number;
  image: string | null;
};

type HomeProductData = {
  catalogueProducts: CatalogueProduct[];
  heroImages: string[];
};

/**
 * 商品管理で登録した公開商品を新しい順に取得し、トップのラインナップ用に整形して返す。
 * 商品一覧とヒーロー候補を同じクエリから構築する。DBエラー時は空配列を返してトップが落ちないようにする。
 * unstable_cache でキャッシュし、商品の書き込み時（products タグ）に無効化される。
 */
export const getHomeProductData = unstable_cache(
  async (): Promise<HomeProductData> => {
    try {
      const prisma = getPrismaClient();
      const products = await prisma.product.findMany({
        where: { isPublished: true },
        select: { id: true, name: true, price: true, images: true, isHeroImage: true },
        orderBy: { createdAt: "desc" },
      });

      const catalogueProducts = products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: getPrimaryProductImage(p.images),
      }));
      const heroImages = products
        .filter((product) => product.isHeroImage)
        .map((product) => getPrimaryProductImage(product.images))
        .filter((image): image is string => Boolean(image));

      return { catalogueProducts, heroImages };
    } catch (error) {
      console.error("カタログ商品の取得に失敗:", error);
      return { catalogueProducts: [], heroImages: [] };
    }
  },
  ["home-product-data"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: [CACHE_TAGS.products] }
);
