import { Box } from "@mui/material";
import type { Metadata } from "next";
import { getPrismaClient } from "@/lib/db";
import ProductsHero from "./_components/ProductsHero";
import ProductsGrid from "./_components/ProductsGrid";
import ProductsBespokeCta from "./_components/ProductsBespokeCta";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catalogue / 商品一覧 | SETA Craft",
  description:
    "SETA Craft の商品一覧。MLBカード・トレカコレクター向けのアクリルディスプレイ、特注品など、富山県高岡市の工房から一つずつお届け。",
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
