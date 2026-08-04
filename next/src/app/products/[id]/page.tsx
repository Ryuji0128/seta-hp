import { cache } from "react";
import { notFound } from "next/navigation";
import { Box } from "@mui/material";
import type { Metadata } from "next";
import { getPrismaClient } from "@/lib/db";
import { buildProductJsonLd, buildBreadcrumbJsonLd } from "@/lib/structured-data";
import ProductDetail from "./_components/ProductDetail";
import RelatedProducts from "./_components/RelatedProducts";
import SectionContainer from "@/components/SectionContainer";

// ISR: ビルド時は生成せず（CIビルドはDB到達不可のため generateStaticParams は空）、
// 初回アクセス時に生成してキャッシュする。商品の作成・更新・削除時は
// API 側の revalidateProductPages() が全詳細ページを即時再生成対象にする。
export const revalidate = 3600;

export async function generateStaticParams() {
  return [];
}

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// React cache() で generateMetadata とページ本体の二重クエリを1回に集約
const getProduct = cache(async (id: number) => {
  const prisma = getPrismaClient();
  return prisma.product.findUnique({ where: { id } });
});

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
  // 非公開商品はページ本体が 404 になるため、メタデータでも同条件で弾く
  // （非公開商品の title/description/OG が head に漏れないようにする）
  if (!product || !product.isPublished) return { title: "商品が見つかりません" };

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${productId}` },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.description,
      url: `/products/${productId}`,
      images: product.image ? [product.image] : ["/og-image.png"],
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

  // 検索結果に価格・在庫を表示させる Product 構造化データと、
  // パンくずリッチリザルト用の BreadcrumbList をサーバーレンダリングで埋め込む。
  const productJsonLd = buildProductJsonLd(product);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Box sx={{ bgcolor: "#FFFFFF" }}>
        <SectionContainer sx={{ py: { xs: 4, md: 8 } }}>
          <ProductDetail product={product} />
        </SectionContainer>
        {relatedProducts.length > 0 && <RelatedProducts products={relatedProducts} />}
      </Box>
    </>
  );
}
