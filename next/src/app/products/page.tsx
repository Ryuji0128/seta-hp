import { Box } from "@mui/material";
import type { Metadata } from "next";
import { getPrismaClient } from "@/lib/db";
import ProductsHero from "./_components/ProductsHero";
import ProductsGrid from "./_components/ProductsGrid";
import ProductsBespokeCta from "./_components/ProductsBespokeCta";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catalogue / 商品一覧",
  description:
    "MLBカード・野球カードコレクター向けアクリルディスプレイの商品一覧。8枚・16枚・25枚の壁面展示モデルやオーダーメイドに対応。全国送料無料。",
  alternates: { canonical: "/products" },
};

async function getProducts(category?: string, sort?: string) {
  const prisma = getPrismaClient();
  const where: { isPublished: boolean; category?: string } = { isPublished: true };
  if (category) where.category = category;

  let orderBy: { createdAt?: "desc" | "asc"; price?: "desc" | "asc" } = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  else if (sort === "price-desc") orderBy = { price: "desc" };

  return prisma.product.findMany({ where, orderBy });
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
