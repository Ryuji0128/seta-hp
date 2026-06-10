"use client";

import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const VALUES = [
  {
    no: "i.",
    title: "カード愛",
    titleEn: "Collector First",
    body: "私自身がコレクター。だからこそ「こんなディスプレイが欲しい」というコレクター心理がわかります。スリーブのまま展示、UV対応素材、傷つけない設計。すべて自分が欲しかったものです。",
  },
  {
    no: "ii.",
    title: "丁寧なものづくり",
    titleEn: "Craftsmanship",
    body: "レーザーで0.1mmの精度で切削。エッジは一つずつ手で面取り。検品も自分が納得するまで、出荷しません。",
  },
  {
    no: "iii.",
    title: "対話して作る",
    titleEn: "Made Together",
    body: "「こんなディスプレイが欲しい」という具体的なご相談を受けて、特注品もお作りします。個人工房なので、量はこなせませんが、対話の時間は惜しみません。",
  },
];

const AboutValues = () => {
  const theme = useTheme();
  const fontDisplay = theme.custom.fonts.display;
  const fontItalic = theme.custom.fonts.italic;

  return (
    <Box component="section" sx={{ bgcolor: "#F6F6F4", py: { xs: 10, md: 15 } }}>
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            gap: 3,
            borderTop: "1px solid #0A0A0A",
            pt: 3.5,
            mb: 8,
            fontFamily: fontItalic,
            fontStyle: "italic",
            fontSize: "16px",
            letterSpacing: "0.05em",
          }}
        >
          <Box sx={{ color: "#B45309" }}>— 03</Box>
          <Box sx={{ color: "#0A0A0A" }}>Values</Box>
          <Box sx={{ color: "#6B6B6B", fontSize: "14px" }}>／　大切にしていること</Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: { xs: 4, md: 5 },
          }}
        >
          {VALUES.map((v) => (
            <Box key={v.no}>
              <Box
                sx={{
                  fontFamily: fontItalic,
                  fontStyle: "italic",
                  fontSize: "14px",
                  color: "#B45309",
                  letterSpacing: "0.1em",
                  mb: 3,
                }}
              >
                {v.no}
              </Box>
              <Box
                sx={{
                  fontFamily: fontDisplay,
                  fontSize: "26px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#0A0A0A",
                  mb: 0.75,
                }}
              >
                {v.title}
              </Box>
              <Box
                sx={{
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#6B6B6B",
                  fontWeight: 500,
                  mb: 2,
                }}
              >
                {v.titleEn}
              </Box>
              <Box sx={{ fontSize: "14px", color: "#2A2A2A", lineHeight: 1.85 }}>
                {v.body}
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default AboutValues;
