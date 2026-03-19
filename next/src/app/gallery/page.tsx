import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button } from "@mui/material";
import type { Metadata } from "next";
import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StyleIcon from "@mui/icons-material/Style";
import Image from "next/image";
import { getPrismaClient } from "@/lib/db";
import { getGalleryCategoryLabel } from "@/lib/constants/categories";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ギャラリー | SETA Craft",
  description:
    "SETA Craftの制作事例をご紹介。カードディスプレイ、アクリル製品、3Dプリント製品など、これまでに作成した作品をご覧いただけます。",
  alternates: {
    canonical: "/gallery",
  },
};

async function getWorks() {
  const prisma = getPrismaClient();
  const works = await prisma.work.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });
  return works;
}

export default async function GalleryPage() {
  const works = await getWorks();

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
            ギャラリー
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              mt: 1,
            }}
          >
            これまでに作成した作品をご紹介します
          </Typography>
        </Container>
      </Box>

      {/* ギャラリーグリッド */}
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          {works.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <StyleIcon sx={{ fontSize: 64, color: "#DDD", mb: 2 }} />
              <Typography variant="body1" sx={{ color: "#666" }}>
                作品を準備中です
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {works.map((work) => (
                <Grid item xs={6} sm={6} md={4} key={work.id}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 2,
                      border: "1px solid #EAEAEA",
                      boxShadow: "none",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      },
                    }}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        height: { xs: 150, md: 200 },
                        bgcolor: "#F8F8F8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {work.image ? (
                        <Image
                          src={work.image}
                          alt={work.title}
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
                          color: "#FF5722",
                          fontWeight: 600,
                          fontSize: "11px",
                        }}
                      >
                        {getGalleryCategoryLabel(work.category)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "#333",
                          mt: 0.5,
                          fontSize: "13px",
                        }}
                      >
                        {work.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* CTA */}
          <Box
            sx={{
              mt: 6,
              p: 4,
              bgcolor: "#FAFAFA",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#333",
                mb: 1,
                fontSize: "1rem",
              }}
            >
              お気軽にお問い合わせください
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                mb: 3,
                fontSize: "13px",
              }}
            >
              商品に関するご質問など、お気軽にご連絡ください。
            </Typography>
            <Link href="/contact" passHref>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: "#FF5722",
                  color: "white",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: "50px",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#E64A19",
                  },
                }}
              >
                お問い合わせ
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
