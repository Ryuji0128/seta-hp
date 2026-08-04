import { Box } from "@mui/material";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { getPrismaClient } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import ProductsHero from "./_components/ProductsHero";
import ProductsGrid from "./_components/ProductsGrid";
import ProductsBespokeCta from "./_components/ProductsBespokeCta";

// searchParams（カテゴリ・ソート）に依存するため動的レンダリング。
// 公開商品の取得は unstable_cache（products タグ）でキャッシュし、絞り込みはメモリ上で行う。
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catalogue / 商品一覧",
  description:
    "MLBカード・野球カードコレクター向けアクリルディスプレイの商品一覧。8枚・16枚・25枚の壁面展示モデルやオーダーメイドに対応。全国送料無料。",
  alternates: { canonical: "/products" },
};

// 公開商品の全件取得（新着順）。商品の書き込み時に products タグで無効化される。
const getPublishedProducts = unstable_cache(
  async () => {
    const prisma = getPrismaClient();
    return prisma.product.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
  },
  ["published-products"],
  { revalidate: 3600, tags: [CACHE_TAGS.products] }
);

async function getProducts(category?: string, sort?: string) {
  const products = await getPublishedProducts();
  const filtered = category ? products.filter((p) => p.category === category) : products;

  if (sort === "price-asc") return [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") return [...filtered].sort((a, b) => b.price - a.price);
  return filtered; // 取得時点で新着順
}

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; sort?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, sort } = await searchParams;
  const products = await getProducts(category, sort);

  return (
    <Box sx={{ bgcolor: "#FFFFFF" }}>
      <ProductsHero count={products.length} />
      <ProductsGrid products={products} />
      <ProductsBespokeCta />
    </Box>
  );
}
