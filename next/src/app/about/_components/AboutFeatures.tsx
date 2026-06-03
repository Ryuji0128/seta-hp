"use client";

import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const FEATURES = [
  { en: "Solo-Built", ja: "設計・製作・梱包まで一人で一貫" },
  { en: "Laser + 3D Print", ja: "0.1mm 精度のレーザー加工とカスタム造形" },
  { en: "UV-Resistant Acrylic", ja: "黄ばみ・くもりが出ない素材を使用" },
  { en: "Sleeve-Compatible", ja: "標準スリーブのまま展示できる設計" },
  { en: "Free JP Shipping", ja: "全国送料無料、緩衝材・保険込み" },
];

const AboutFeatures = () => {
  const theme = useTheme();
  const fontDisplay = theme.custom.fonts.display;
  const fontItalic = theme.custom.fonts.italic;

  return (
    <Box component="section" sx={{ py: { xs: 10, md: 15 } }}>
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            gap: 3,
            borderTop: "1px solid #0A0A0A",
            pt: 3.5,
            mb: 6,
            fontFamily: fontItalic,
            fontStyle: "italic",
            fontSize: "16px",
            letterSpacing: "0.05em",
          }}
        >
          <Box sx={{ color: "#B45309" }}>— 03</Box>
          <Box sx={{ color: "#0A0A0A" }}>Features</Box>
          <Box sx={{ color: "#6B6B6B", fontSize: "14px" }}>／　飾Love の特徴</Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1.4fr" }, gap: { xs: 0, md: 10 } }}>
          <Box
            sx={{
              fontFamily: fontDisplay,
              fontSize: "clamp(28px, 3.4vw, 48px)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "#0A0A0A",
              lineHeight: 1.15,
              mb: { xs: 5, md: 0 },
            }}
          >
            5つの<br />
            <Box component="span" sx={{ color: "#B45309" }}>こだわり。</Box>
          </Box>

          <Box>
            {FEATURES.map((f, i) => (
              <Box
                key={i}
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "160px 1fr" },
                  gap: { xs: 0.5, sm: 4 },
                  py: 3,
                  borderTop: "1px solid #E5E5E0",
                  ...(i === FEATURES.length - 1 && { borderBottom: "1px solid #E5E5E0" }),
                }}
              >
                <Box
                  sx={{
                    fontFamily: fontDisplay,
                    fontWeight: 700,
                    fontSize: "16px",
                    letterSpacing: "-0.01em",
                    color: "#0A0A0A",
                  }}
                >
                  {f.en}
                </Box>
                <Box sx={{ fontSize: "14.5px", color: "#2A2A2A", lineHeight: 1.7 }}>
                  {f.ja}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutFeatures;
