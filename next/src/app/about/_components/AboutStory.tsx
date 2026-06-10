"use client";

import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const AboutStory = () => {
  const theme = useTheme();
  const fontDisplay = theme.custom.fonts.display;
  const fontItalic = theme.custom.fonts.italic;

  return (
    <Box component="section" sx={{ py: { xs: 10, md: 15 } }}>
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1.4fr" },
            gap: { xs: 4, md: 10 },
            mb: 8,
            alignItems: "baseline",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              gap: 3,
              borderTop: "1px solid #0A0A0A",
              pt: 3.5,
              fontFamily: fontItalic,
              fontStyle: "italic",
              fontSize: "16px",
              letterSpacing: "0.05em",
            }}
          >
            <Box sx={{ color: "#B45309" }}>— 01</Box>
            <Box sx={{ color: "#0A0A0A" }}>Story</Box>
            <Box sx={{ color: "#6B6B6B", fontSize: "14px" }}>／　はじまり</Box>
          </Box>
          <Box />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1.4fr" },
            gap: { xs: 4, md: 10 },
          }}
        >
          <Box
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 500,
              fontSize: "clamp(32px, 3.8vw, 56px)",
              lineHeight: 1.2,
              letterSpacing: "-0.025em",
              color: "#0A0A0A",
            }}
          >
            欲しいものが
            <br />
            なかったから、
            <br />
            <Box component="span" sx={{ color: "#B45309" }}>作った。</Box>
          </Box>

          <Box sx={{ pt: 2 }}>
            <Box sx={{ fontSize: "15.5px", color: "#2A2A2A", lineHeight: 2, mb: 3 }}>
              飾Love は、カード好きが営む小さな個人工房です。
            </Box>
            <Box sx={{ fontSize: "15.5px", color: "#2A2A2A", lineHeight: 2, mb: 3 }}>
              MLBカードを集めていると、「お気に入りのカードをもっとちゃんと飾りたい」
              「コレクションを見やすく整理したい」という気持ちが少しずつ強くなっていきました。
              けれど、いざ探してみると、自分が本当に納得できるディスプレイにはなかなか出会えません。
            </Box>
            <Box sx={{ fontSize: "15.5px", color: "#2A2A2A", lineHeight: 2, mb: 3 }}>
              ないなら、作ってみよう。
              <br />
              そう思って始めたのが、この工房です。
            </Box>
            <Box sx={{ fontSize: "15.5px", color: "#2A2A2A", lineHeight: 2 }}>
              レーザー加工で、自分が「これだ」と思える一品仕立てを、
              一つずつ手作業で組み立てています。同じカード好きの方に届くと嬉しいです。
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutStory;
