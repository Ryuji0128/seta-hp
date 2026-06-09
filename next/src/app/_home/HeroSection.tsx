"use client";

import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  const theme = useTheme();
  const fontDisplay = theme.custom.fonts.display;
  const fontItalic = theme.custom.fonts.italic;

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        py: { xs: 7, md: 12.5 },
        background:
          "radial-gradient(ellipse at 80% 20%, rgba(180, 83, 9, 0.04), transparent 50%), #FFFFFF",
      }}
    >
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.05fr 1fr" },
            gap: { xs: 6, md: 10 },
            alignItems: "center",
          }}
        >
          {/* Text side */}
          <Box>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.5,
                mb: 4,
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#B45309",
              }}
            >
              <Box sx={{ width: 28, height: "1px", bgcolor: "#B45309" }} />
              Catalogue 2026 · Edition I
            </Box>

            <Box
              component="h1"
              sx={{
                fontFamily: fontDisplay,
                fontWeight: 800,
                fontSize: "clamp(56px, 7.2vw, 108px)",
                lineHeight: 0.96,
                letterSpacing: "-0.04em",
                color: "#0A0A0A",
                mb: 4,
                "& em": { fontStyle: "normal", color: "#B45309" },
              }}
            >
              カードは、
              <br />
              <em>飾る</em>ために
              <br />
              ある。
            </Box>

            <Box
              sx={{
                fontFamily: fontItalic,
                fontStyle: "italic",
                fontSize: "20px",
                color: "#B45309",
                mb: 2.5,
                letterSpacing: "0.02em",
              }}
            >
              飾らない愛、はない。
            </Box>

            <Box
              sx={{
                fontSize: "18px",
                lineHeight: 1.6,
                color: "#2A2A2A",
                mb: 1.5,
                maxWidth: 480,
              }}
            >
              本当に好きな一枚のためのアクリルディスプレイ。
            </Box>

            <Box
              sx={{
                fontSize: "13.5px",
                color: "#6B6B6B",
                letterSpacing: "0.04em",
                lineHeight: 1.85,
                maxWidth: 460,
                mb: 5,
              }}
            >
              小さな個人工房から、一つずつ手作りでお届けします。
              <br />
              コレクターが、コレクターのために設計しました。
            </Box>

            {/* CTA */}
            <Box sx={{ display: "flex", gap: 1.75, flexWrap: "wrap" }}>
              <Link href="#products" passHref style={{ textDecoration: "none" }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1.25,
                    bgcolor: "#0A0A0A",
                    color: "#FFFFFF",
                    px: 3.5,
                    py: 2,
                    borderRadius: "999px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background-color 0.2s, transform 0.2s",
                    "&:hover": { bgcolor: "#B45309", transform: "translateY(-1px)" },
                  }}
                >
                  カタログを見る <span>→</span>
                </Box>
              </Link>
              <Link href="#craft" passHref style={{ textDecoration: "none" }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1.25,
                    color: "#0A0A0A",
                    px: 2.75,
                    py: 2,
                    borderRadius: "999px",
                    fontSize: "14px",
                    fontWeight: 500,
                    border: "1px solid #E5E5E0",
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                    "&:hover": { borderColor: "#0A0A0A" },
                  }}
                >
                  作り方を見る
                </Box>
              </Link>
            </Box>

            {/* Stats */}
            <Box
              sx={{
                display: "flex",
                gap: { xs: 3, md: 4.5 },
                mt: 7,
                pt: 3.5,
                borderTop: "1px solid #EFEFEA",
                flexWrap: "wrap",
              }}
            >
              {[
                { v: "3", l: "標準モデル" },
                { v: "100%", l: "手仕上げ" },
                { v: "¥0", l: "全国送料無料" },
              ].map((s) => (
                <Box key={s.l} sx={{ flex: 1, minWidth: 100, maxWidth: 140 }}>
                  <Box
                    sx={{
                      fontFamily: fontDisplay,
                      fontSize: "26px",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      color: "#0A0A0A",
                      mb: 0.5,
                    }}
                  >
                    {s.v}
                  </Box>
                  <Box
                    sx={{
                      fontSize: "11px",
                      color: "#6B6B6B",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    {s.l}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Visual side */}
          <Box
            sx={{
              position: "relative",
              aspectRatio: "5 / 6",
              borderRadius: "4px",
              overflow: "hidden",
              boxShadow:
                "0 30px 60px -20px rgba(10,10,10,0.3), 0 18px 36px -18px rgba(180,83,9,0.15)",
            }}
          >
            <Image
              src="/images/placeholders/hero-award-history.svg"
              alt="AWARD HISTORY 壁 — 飾Love 試作品"
              fill
              sizes="(max-width: 960px) 100vw, 50vw"
              priority
              unoptimized
              style={{ objectFit: "cover" }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 24,
                left: 24,
                color: "rgba(255,255,255,0.45)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                zIndex: 1,
              }}
            >
              AWARD HISTORY  /  Featured Build
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: 24,
                right: 24,
                color: "#B45309",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.15em",
                zIndex: 1,
              }}
            >
              FEATURED · BUILD 008
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 24,
                right: 24,
                fontFamily: fontItalic,
                fontStyle: "italic",
                color: "rgba(255,255,255,0.55)",
                fontSize: "14px",
                zIndex: 1,
              }}
            >
              Award History
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
