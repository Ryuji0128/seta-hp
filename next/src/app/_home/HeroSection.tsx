"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const HeroSection = () => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: "400px", md: "480px" },
        display: "flex",
        alignItems: "center",
        bgcolor: "#FAFAFA",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: "center",
            py: { xs: 6, md: 8 },
          }}
        >
          {/* サブタイトル */}
          <Typography
            variant="body2"
            sx={{
              color: "#FF5722",
              fontWeight: 600,
              fontSize: "14px",
              letterSpacing: "0.1em",
              mb: 2,
            }}
          >
            ハンドメイド・オリジナル
          </Typography>

          {/* メインタイトル */}
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.8rem", sm: "2.4rem", md: "3rem" },
              color: "#333",
              mb: 3,
              lineHeight: 1.4,
            }}
          >
            カード好きが作った
            <br />
            <Box component="span" sx={{ color: "#FF5722" }}>
              こだわりのディスプレイ
            </Box>
          </Typography>

          {/* 説明文 */}
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "14px", md: "16px" },
              color: "#666",
              mb: 5,
              maxWidth: 500,
              mx: "auto",
              lineHeight: 1.9,
            }}
          >
            大切なカードを美しく飾るスタンド・ケースを
            <br />
            一つ一つ丁寧に製作しています。
          </Typography>

          {/* CTAボタン */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/products" passHref>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: "#FF5722",
                  color: "white",
                  fontWeight: 600,
                  px: 5,
                  py: 1.5,
                  fontSize: "15px",
                  borderRadius: "50px",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#E64A19",
                    boxShadow: "0 4px 12px rgba(255, 87, 34, 0.3)",
                  },
                }}
              >
                商品を見る
              </Button>
            </Link>
            <Link href="/gallery" passHref>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  color: "#333",
                  borderColor: "#DDD",
                  fontWeight: 500,
                  px: 5,
                  py: 1.5,
                  fontSize: "15px",
                  borderRadius: "50px",
                  "&:hover": {
                    borderColor: "#333",
                    bgcolor: "transparent",
                  },
                }}
              >
                ギャラリー
              </Button>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
