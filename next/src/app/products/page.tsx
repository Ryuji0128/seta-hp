import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Chip } from "@mui/material";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import StyleIcon from "@mui/icons-material/Style";
import { getPrismaClient } from "@/lib/db";
import { getProductCategoryLabel } from "@/lib/constants/categories";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "商品一覧 | SETA Craft",
  description:
    "SETA Craftの商品一覧。カードディスプレイ、アクリル製品、3Dプリント製品など、カード好きが作ったこだわりのディスプレイをご覧いただけます。",
  alternates: {
    canonical: "/products",
  },
};

async function getProducts(category?: string, sort?: string) {
  const prisma = getPrismaClient();

  const where: { isPublished: boolean; category?: string } = {
    isPublished: true,
  };

  if (category) {
    where.category = category;
  }

  let orderBy: { createdAt?: "desc" | "asc"; price?: "desc" | "asc" } = { createdAt: "desc" };

  if (sort === "price-asc") {
    orderBy = { price: "asc" };
  } else if (sort === "price-desc") {
    orderBy = { price: "desc" };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
  });

  return products;
}

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; sort?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, sort } = await searchParams;
  const products = await getProducts(category, sort);

  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh" }}>
      {/* ヘッダー */}
      <Box
        sx={{
          borderBottom: "1px solid #EAEAEA",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.5rem", md: "1.8rem" },
              color: "#333",
            }}
          >
            商品一覧
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              mt: 1,
            }}
          >
            カード好きが作った、こだわりのディスプレイ
          </Typography>
        </Container>
      </Box>

      {/* 商品グリッド */}
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          {products.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <StyleIcon sx={{ fontSize: 64, color: "#DDD", mb: 2 }} />
              <Typography variant="body1" sx={{ color: "#666" }}>
                商品を準備中です
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={6} sm={6} md={3} key={product.id}>
                  <Link href={`/products/${product.id}`} style={{ textDecoration: "none" }}>
                    <Card
                      sx={{
                        height: "100%",
                        boxShadow: "none",
                        border: "1px solid #EAEAEA",
                        borderRadius: 2,
                        cursor: "pointer",
                        overflow: "hidden",
                        position: "relative",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "#DDD",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        },
                      }}
                    >
                      {/* バッジ */}
                      {product.tags && product.tags.includes("人気") && (
                        <Chip
                          label="人気"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 10,
                            left: 10,
                            zIndex: 1,
                            bgcolor: "#FF5722",
                            color: "white",
                            fontWeight: 600,
                            fontSize: "10px",
                            height: 22,
                            borderRadius: 1,
                          }}
                        />
                      )}
                      {product.tags && product.tags.includes("NEW") && (
                        <Chip
                          label="NEW"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 10,
                            left: 10,
                            zIndex: 1,
                            bgcolor: "#333",
                            color: "white",
                            fontWeight: 600,
                            fontSize: "10px",
                            height: 22,
                            borderRadius: 1,
                          }}
                        />
                      )}

                      <CardMedia
                        component="div"
                        sx={{
                          height: { xs: 140, md: 180 },
                          bgcolor: "#F8F8F8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <StyleIcon sx={{ fontSize: 48, color: "#DDD" }} />
                        )}
                      </CardMedia>

                      <CardContent sx={{ p: 2 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#999",
                            fontSize: "11px",
                          }}
                        >
                          {getProductCategoryLabel(product.category)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#333",
                            fontSize: "13px",
                            fontWeight: 500,
                            lineHeight: 1.5,
                            my: 1,
                            minHeight: 40,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {product.name}
                        </Typography>

                        {/* 価格 */}
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 700,
                            color: "#333",
                            fontSize: "16px",
                          }}
                        >
                          ¥{product.price.toLocaleString()}
                          <Typography
                            component="span"
                            sx={{ fontSize: "12px", fontWeight: 400, color: "#999", ml: 0.5 }}
                          >
                            〜
                          </Typography>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  );
}
