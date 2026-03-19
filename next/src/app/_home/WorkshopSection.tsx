"use client";

import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Link from "next/link";

const features = [
  "カード好きが設計・製作",
  "レーザーカッター・3Dプリンターで丁寧に加工",
  "細部までこだわった仕上がり",
  "一つ一つ手作業で検品",
];

const WorkshopSection = () => {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: "primary.dark",
        color: "white",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: "1.75rem", md: "2.25rem" },
              }}
            >
              SETA Craftについて
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                lineHeight: 1.8,
                opacity: 0.9,
              }}
            >
              私たちは「カード好き」が集まった小さな工房です。
              <br />
              自分たちが欲しいと思うディスプレイを、一つ一つ丁寧に作っています。
              <br />
              <br />
              「こんなディスプレイがあったらいいな」という想いを形にして、
              同じカード好きの皆さんにお届けします。
            </Typography>

            <Box sx={{ mb: 4 }}>
              {features.map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <CheckCircleOutlineIcon
                    sx={{
                      color: "secondary.light",
                      mr: 1.5,
                      fontSize: 20,
                    }}
                  />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Link href="/about" passHref>
              <Button
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: "white",
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                もっと詳しく
              </Button>
            </Link>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                bgcolor: "rgba(255,255,255,0.1)",
                borderRadius: 3,
                p: 4,
                height: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body1" sx={{ opacity: 0.7 }}>
                工房の写真
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WorkshopSection;
