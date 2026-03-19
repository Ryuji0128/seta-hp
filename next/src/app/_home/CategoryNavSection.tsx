"use client";

import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";
import StyleIcon from "@mui/icons-material/Style";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import { PRODUCT_CATEGORIES } from "@/lib/constants/categories";

// カテゴリのアイコンマッピング
const categoryIcons: Record<string, React.ElementType> = {
  "card-display": StyleIcon,
  acrylic: AutoAwesomeIcon,
  "3d-print": ViewInArIcon,
  "laser-cut": ContentCutIcon,
};

// ナビゲーション用カテゴリ
const navCategories = [
  {
    title: "新着商品",
    href: "/products?sort=new",
    icon: FiberNewIcon,
  },
  {
    title: "人気商品",
    href: "/products?sort=popular",
    icon: WhatshotIcon,
  },
  // 定義されたカテゴリを追加
  ...PRODUCT_CATEGORIES.map((cat) => ({
    title: cat.label,
    href: `/products?category=${cat.value}`,
    icon: categoryIcons[cat.value] || StyleIcon,
  })),
];

const CategoryNavSection = () => {
  return (
    <Box
      sx={{
        bgcolor: "white",
        py: { xs: 2, md: 3 },
        borderTop: "1px solid #EAEAEA",
        borderBottom: "1px solid #EAEAEA",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: { xs: 1, md: 4 },
            flexWrap: "wrap",
          }}
        >
          {navCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={index}
                href={category.href}
                style={{ textDecoration: "none" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    px: { xs: 1.5, md: 2 },
                    py: 1,
                    borderRadius: "50px",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "#F5F5F5",
                    },
                    "&:hover .category-icon": {
                      color: "#FF5722",
                    },
                    "&:hover .category-text": {
                      color: "#FF5722",
                    },
                  }}
                >
                  <IconComponent
                    className="category-icon"
                    sx={{
                      fontSize: { xs: 18, md: 20 },
                      color: "#666",
                      transition: "color 0.2s",
                    }}
                  />
                  <Typography
                    className="category-text"
                    variant="body2"
                    sx={{
                      color: "#333",
                      fontSize: { xs: "12px", md: "13px" },
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      transition: "color 0.2s",
                    }}
                  >
                    {category.title}
                  </Typography>
                </Box>
              </Link>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default CategoryNavSection;
