import { Box, Container, Grid, Typography, Paper } from "@mui/material";
import type { Metadata } from "next";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BuildIcon from "@mui/icons-material/Build";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HandshakeIcon from "@mui/icons-material/Handshake";

export const metadata: Metadata = {
  title: "工房について | SETA Craft",
  description:
    "SETA Craftは、カード好きの私が一人で運営している小さな工房です。レーザーカッター・3Dプリンターを使って、カードディスプレイを一つ一つ丁寧に作っています。",
  alternates: {
    canonical: "/about",
  },
};

const values = [
  {
    icon: FavoriteIcon,
    title: "カード愛",
    description:
      "私たち自身がカードコレクター。だからこそ「こんなディスプレイが欲しい」という気持ちがわかります。",
  },
  {
    icon: BuildIcon,
    title: "丁寧なものづくり",
    description:
      "レーザーカッター・3Dプリンターで一つ一つ丁寧に製作。細部までこだわった仕上がりをお届けします。",
  },
  {
    icon: HandshakeIcon,
    title: "お客様との対話",
    description:
      "「こんなのが欲しい」というご要望をお聞かせください。一緒に理想のディスプレイを作り上げます。",
  },
];

const features = [
  "カード好きのスタッフが設計・製作",
  "レーザーカッター・3Dプリンターで精密加工",
  "一つ一つ手作業で検品",
  "オーダーメイドは準備中",
  "お客様の声を製品に反映",
];

export default function AboutPage() {
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
            工房について
          </Typography>
        </Container>
      </Box>

      {/* コンセプト */}
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="md">
          <Typography
            variant="body1"
            sx={{
              lineHeight: 2,
              color: "#333",
              mb: 3,
            }}
          >
            SETA Craftは、カード好きの私が一人で運営している小さな工房です。
          </Typography>
          <Typography
            variant="body1"
            sx={{
              lineHeight: 2,
              color: "#333",
              mb: 3,
            }}
          >
            トレーディングカードを集めていると、「お気に入りのカードをもっとカッコよく飾りたい」
            「コレクションを見やすく整理したい」という想いが生まれます。
            でも、なかなか理想のディスプレイが見つからない...。
          </Typography>
          <Typography
            variant="body1"
            sx={{
              lineHeight: 2,
              color: "#333",
              mb: 3,
            }}
          >
            そんな経験から、「じゃあ自分で作ろう！」と始めたのがこの工房です。
            レーザーカッターや3Dプリンターを使って、
            自分が本当に欲しいと思えるディスプレイを一つ一つ丁寧に作っています。
          </Typography>
          <Typography
            variant="body1"
            sx={{
              lineHeight: 2,
              color: "#333",
            }}
          >
            同じカード好きの皆さんに、私のディスプレイを使っていただけたら嬉しいです。
          </Typography>
        </Container>
      </Box>

      {/* 大切にしていること */}
      <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: "#FAFAFA" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "#333",
              mb: 4,
              fontSize: { xs: "1.2rem", md: "1.4rem" },
            }}
          >
            大切にしていること
          </Typography>
          <Grid container spacing={3}>
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Grid item xs={12} md={4} key={index}>
                  <Paper
                    sx={{
                      p: 3,
                      height: "100%",
                      borderRadius: 1,
                      border: "1px solid #EAEAEA",
                      boxShadow: "none",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <IconComponent sx={{ fontSize: 28, color: "primary.main", mr: 1.5 }} />
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: "#333",
                          fontSize: "1rem",
                        }}
                      >
                        {value.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        lineHeight: 1.8,
                        fontSize: "13px",
                      }}
                    >
                      {value.description}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* 特徴 */}
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "#333",
              mb: 3,
              fontSize: { xs: "1.2rem", md: "1.4rem" },
            }}
          >
            SETA Craftの特徴
          </Typography>
          <Box>
            {features.map((feature, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  py: 1.5,
                  borderBottom:
                    index < features.length - 1 ? "1px solid #EAEAEA" : "none",
                }}
              >
                <CheckCircleOutlineIcon
                  sx={{ color: "primary.main", mr: 2, fontSize: 20 }}
                />
                <Typography variant="body1" sx={{ color: "#333", fontSize: "14px" }}>
                  {feature}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
