import { notFound } from "next/navigation";
import { Box, Container } from "@mui/material";
import type { Metadata } from "next";
import { getPrismaClient } from "@/lib/db";
import ProductDetail from "./_components/ProductDetail";
import RelatedProducts from "./_components/RelatedProducts";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: number) {
  const prisma = getPrismaClient();
  return prisma.product.findUnique({ where: { id } });
}

async function getRelatedProducts(category: string, excludeId: number) {
  const prisma = getPrismaClient();
  return prisma.product.findMany({
    where: { category, isPublished: true, id: { not: excludeId } },
    take: 4,
    orderBy: { createdAt: "desc" },
  });
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const productId = parseInt(id, 10);
  if (isNaN(productId)) return { title: "商品が見つかりません" };

  const product = await getProduct(productId);
  if (!product) return { title: "商品が見つかりません" };

  return {
    title: `${product.name} | SETA Craft`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  if (isNaN(productId)) notFound();

  const product = await getProduct(productId);
  if (!product || !product.isPublished) notFound();

  const [relatedProducts] = await Promise.all([
    getRelatedProducts(product.category, product.id),
  ]);

  return (
    <Box sx={{ bgcolor: "#FFFFFF" }}>
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important", py: { xs: 4, md: 8 } }}>
        <ProductDetail product={product} />
      </Container>
      {relatedProducts.length > 0 && <RelatedProducts products={relatedProducts} />}
    </Box>
  );
}
