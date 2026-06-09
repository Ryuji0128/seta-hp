"use client";

import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const AboutHero = () => {
  const theme = useTheme();
  const fontDisplay = theme.custom.fonts.display;
  const fontItalic = theme.custom.fonts.italic;

  return (
    <Box
      component="section"
      sx={{
        bgcolor: "#0A0A0A",
        color: "#FFFFFF",
        py: { xs: 10, md: 16 },
      }}
    >
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
        <Box sx={{ maxWidth: 800 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.5,
              mb: 4,
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#E5AC60",
            }}
          >
            <Box sx={{ width: 28, height: "1px", bgcolor: "#E5AC60" }} />
            The Workshop · 工房について
          </Box>

          <Box
            component="h1"
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 800,
              fontSize: "clamp(48px, 6.5vw, 96px)",
              lineHeight: 0.96,
              letterSpacing: "-0.04em",
              mt: 0,
              mb: 3,
              "& em": { fontStyle: "normal", color: "#E5AC60" },
            }}
          >
            個人工房で、
            <br />
            <em>ひとつずつ。</em>
          </Box>

          <Box
            sx={{
              fontFamily: fontItalic,
              fontStyle: "italic",
              fontSize: "20px",
              color: "rgba(255,255,255,0.5)",
              mb: 4,
              letterSpacing: "0.02em",
            }}
          >
            — A small personal workshop.
          </Box>

          <Box
            sx={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.9,
              maxWidth: 640,
            }}
          >
            小さな個人工房から、MLBカード・トレカコレクターのための
            「ただ飾る」ためのアクリルディスプレイを、一つずつ手作りでお届けしています。
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutHero;
