import { notFound } from "next/navigation";
import { Box, Container, Typography, Chip, Button, Divider, Grid } from "@mui/material";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StyleIcon from "@mui/icons-material/Style";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { getPrismaClient } from "@/lib/db";
import { getProductCategoryLabel } from "@/lib/constants/categories";
import ProductImageGallery from "./ProductImageGallery";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: number) {
  const prisma = getPrismaClient();

  const product = await prisma.product.findUnique({
    where: { id },
  });

  return product;
}

async function getRelatedProducts(category: string, excludeId: number) {
  const prisma = getPrismaClient();

  const products = await prisma.product.findMany({
    where: {
      category,
      isPublished: true,
      id: { not: excludeId },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return products;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const productId = parseInt(id, 10);

  if (isNaN(productId)) {
    return { title: "商品が見つかりません" };
  }

  const product = await getProduct(productId);

  if (!product) {
    return { title: "商品が見つかりません" };
  }

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

  if (isNaN(productId)) {
    notFound();
  }

  const product = await getProduct(productId);

  if (!product || !product.isPublished) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id);
  const tags = product.tags ? product.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  // 画像配列を取得（後方互換性対応）
  const productImages: string[] = Array.isArray(product.images)
    ? (product.images as string[])
    : product.image
      ? [product.image]
      : [];

  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {/* 戻るリンク */}
        <Link href="/products" style={{ textDecoration: "none" }}>
          <Button
            startIcon={<ArrowBackIcon />}
            sx={{
              color: "#666",
              mb: 3,
              "&:hover": { bgcolor: "transparent", color: "#333" },
            }}
          >
            商品一覧に戻る
          </Button>
        </Link>

        <Grid container spacing={4}>
          {/* 商品画像 */}
          <Grid item xs={12} md={6}>
            <ProductImageGallery images={productImages} productName={product.name} />
          </Grid>

          {/* 商品情報 */}
          <Grid item xs={12} md={6}>
            <Box>
              {/* カテゴリ */}
              <Typography
                variant="caption"
                sx={{
                  color: "#999",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {getProductCategoryLabel(product.category)}
              </Typography>

              {/* 商品名 */}
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  color: "#333",
                  mt: 1,
                  mb: 2,
                }}
              >
                {product.name}
              </Typography>

              {/* 価格 */}
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.8rem", md: "2.2rem" },
                  color: "#FF5722",
                  mb: 3,
                }}
              >
                ¥{product.price.toLocaleString()}
                <Typography
                  component="span"
                  sx={{ fontSize: "14px", fontWeight: 400, color: "#666", ml: 1 }}
                >
                  (税込)
                </Typography>
              </Typography>

              {/* 在庫状況 */}
              <Box sx={{ mb: 3 }}>
                <Chip
                  label={product.stock}
                  color={
                    product.stock === "在庫あり"
                      ? "success"
                      : product.stock === "残りわずか"
                        ? "warning"
                        : product.stock === "売り切れ"
                          ? "error"
                          : "info"
                  }
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* 説明 */}
              <Typography
                variant="body1"
                sx={{
                  color: "#555",
                  lineHeight: 1.8,
                  whiteSpace: "pre-wrap",
                }}
              >
                {product.description}
              </Typography>

              {/* タグ */}
              {tags.length > 0 && (
                <Box sx={{ mt: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: "#DDD", color: "#666" }}
                    />
                  ))}
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              {/* 配送情報 */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#666" }}>
                <LocalShippingOutlinedIcon fontSize="small" />
                <Typography variant="body2">
                  全国一律送料・詳細は配送についてをご確認ください
                </Typography>
              </Box>

              {/* お問い合わせボタン */}
              <Box sx={{ mt: 4 }}>
                <Link href="/contact" style={{ textDecoration: "none" }}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      py: 1.5,
                      bgcolor: "#FF5722",
                      borderRadius: "50px",
                      fontWeight: 600,
                      fontSize: "16px",
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: "#E64A19",
                        boxShadow: "none",
                      },
                    }}
                  >
                    この商品について問い合わせる
                  </Button>
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* 関連商品 */}
        {relatedProducts.length > 0 && (
          <Box sx={{ mt: { xs: 6, md: 10 } }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.2rem", md: "1.5rem" },
                color: "#333",
                mb: 3,
              }}
            >
              関連商品
            </Typography>

            <Grid container spacing={3}>
              {relatedProducts.map((relatedProduct) => (
                <Grid item xs={6} sm={6} md={3} key={relatedProduct.id}>
                  <Link href={`/products/${relatedProduct.id}`} style={{ textDecoration: "none" }}>
                    <Box
                      sx={{
                        border: "1px solid #EAEAEA",
                        borderRadius: 2,
                        overflow: "hidden",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "#DDD",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          paddingTop: "100%",
                          bgcolor: "#F8F8F8",
                        }}
                      >
                        {relatedProduct.image ? (
                          <Image
                            src={relatedProduct.image}
                            alt={relatedProduct.name}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <StyleIcon sx={{ fontSize: 40, color: "#DDD" }} />
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ p: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#333",
                            fontSize: "13px",
                            fontWeight: 500,
                            mb: 1,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: 40,
                          }}
                        >
                          {relatedProduct.name}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 700, color: "#333", fontSize: "14px" }}
                        >
                          ¥{relatedProduct.price.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}
