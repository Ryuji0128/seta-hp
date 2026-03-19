import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StyleIcon from "@mui/icons-material/Style";
import Image from "next/image";
import Link from "next/link";
import { getPrismaClient } from "@/lib/db";

async function getFeaturedProducts() {
  const prisma = getPrismaClient();

  // 公開中の商品を最新4件取得
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return products;
}

export default async function FeaturedProductsSection() {
  const products = await getFeaturedProducts();

  // 商品がない場合はセクションを表示しない
  if (products.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: "white",
      }}
    >
      <Container maxWidth="lg">
        {/* セクションタイトル */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "#333",
              fontSize: { xs: "1.25rem", md: "1.5rem" },
              mb: 1,
            }}
          >
            人気の商品
          </Typography>
          <Link href="/products" passHref>
            <Button
              endIcon={<ArrowForwardIcon />}
              sx={{
                color: "#FF5722",
                fontWeight: 500,
                fontSize: "13px",
                "&:hover": {
                  bgcolor: "rgba(255, 87, 34, 0.08)",
                },
              }}
            >
              すべて見る
            </Button>
          </Link>
        </Box>

        {/* 商品グリッド */}
        <Grid container spacing={3}>
          {products.map((product) => {
            const hasBadgeNew = product.tags?.includes("NEW");
            const hasBadgePopular = product.tags?.includes("人気");

            return (
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
                    {hasBadgeNew && (
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
                    {hasBadgePopular && !hasBadgeNew && (
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

                    <CardContent sx={{ p: 2, textAlign: "center" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333",
                          fontSize: "13px",
                          fontWeight: 500,
                          lineHeight: 1.5,
                          mb: 1.5,
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
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
