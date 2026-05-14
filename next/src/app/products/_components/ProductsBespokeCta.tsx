"use client";

import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";

const ProductsBespokeCta = () => {
  const theme = useTheme();
  const fontDisplay = theme.custom.fonts.display;

  return (
    <Box component="section" sx={{ bgcolor: "#0A0A0A", color: "#FFFFFF", py: { xs: 10, md: 14 } }}>
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" }, gap: { xs: 4, md: 8 }, alignItems: "center" }}>
          <Box
            component="h2"
            sx={{
              fontFamily: fontDisplay,
              fontSize: "clamp(36px, 4.5vw, 64px)",
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
              m: 0,
              "& em": { fontStyle: "normal", color: "#E5AC60" },
            }}
          >
            既製品にない、
            <br />
            <em>あなただけの一品。</em>
          </Box>

          <Box>
            <Box
              sx={{
                color: "rgba(255,255,255,0.75)",
                fontSize: "15px",
                lineHeight: 1.9,
                mb: 3.5,
              }}
            >
              50枚以上の大型システム、AWARD HISTORY のような特注品、
              サイズ・形状のカスタマイズなど、お気軽にご相談ください。
              一品からお作りします。
            </Box>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              <Link href="/contact" passHref style={{ textDecoration: "none" }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1.25,
                    bgcolor: "#FFFFFF",
                    color: "#0A0A0A",
                    px: 3.5,
                    py: 1.75,
                    borderRadius: "999px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background-color 0.2s, transform 0.2s",
                    "&:hover": { bgcolor: "#E5AC60", transform: "translateY(-1px)" },
                  }}
                >
                  特注品のご相談 <span>→</span>
                </Box>
              </Link>
              <Link href="/gallery" passHref style={{ textDecoration: "none" }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1.25,
                    color: "#FFFFFF",
                    px: 3.5,
                    py: 1.75,
                    borderRadius: "999px",
                    fontSize: "14px",
                    fontWeight: 500,
                    border: "1px solid rgba(255,255,255,0.25)",
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                    "&:hover": { borderColor: "#FFFFFF" },
                  }}
                >
                  制作事例を見る
                </Box>
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductsBespokeCta;
