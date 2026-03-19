"use client";

import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import StyleIcon from "@mui/icons-material/Style";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Link from "next/link";

const categories = [
  {
    title: "カードディスプレイ",
    description: "トレカ、ポケカ、遊戯王など、大切なカードを美しく飾るためのスタンド・ケース",
    icon: StyleIcon,
    href: "/products?category=card-display",
    color: "#8B6914",
  },
  {
    title: "アクリル製品",
    description: "レーザーカットで精密に加工したアクリル製のスタンド・キーホルダーなど",
    icon: AutoAwesomeIcon,
    href: "/products?category=acrylic",
    color: "#A67C52",
  },
  {
    title: "3Dプリント製品",
    description: "3Dプリンターで作成したオリジナルフィギュアスタンド・小物入れなど",
    icon: ViewInArIcon,
    href: "/products?category=3d-print",
    color: "#6B4423",
  },
];

const CategorySection = () => {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: "primary.pale",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "primary.dark",
              mb: 2,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
            }}
          >
            カテゴリから探す
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Grid item xs={12} md={4} key={index}>
                <Link href={category.href} style={{ textDecoration: "none" }}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: "center" }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          bgcolor: category.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mx: "auto",
                          mb: 3,
                        }}
                      >
                        <IconComponent sx={{ fontSize: 40, color: "white" }} />
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          color: "primary.dark",
                          mb: 2,
                        }}
                      >
                        {category.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "info.main",
                          lineHeight: 1.7,
                        }}
                      >
                        {category.description}
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
};

export default CategorySection;
