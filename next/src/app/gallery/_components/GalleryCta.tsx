"use client";

import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";

const GalleryCta = () => {
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
            こんなのが
            <br />
            <em>作れますか?</em>
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
              特注品・大型品・サイズや形状の個別調整など、お気軽にご相談ください。
              一品から制作します。
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
                  お問い合わせ <span>→</span>
                </Box>
              </Link>
              <Link href="/products" passHref style={{ textDecoration: "none" }}>
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
                  カタログを見る
                </Box>
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default GalleryCta;
