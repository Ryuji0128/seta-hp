import { Box, Container } from "@mui/material";
import type { ReactNode } from "react";
import { FONT_DISPLAY, FONT_ITALIC } from "@/theme/themeConstants";

interface HeroStat {
  value: ReactNode;
  label: ReactNode;
}

interface PageHeroProps {
  /** アイブロウ（小見出し）。先頭に銅色の横線が付く */
  eyebrow: ReactNode;
  /** 見出し（h1）。<em> は銅色アクセントになる */
  heading: ReactNode;
  /** 斜体サブタイトル（"— ..." を含めて渡す） */
  subtitle: ReactNode;
  /** 下部の統計行（任意） */
  stats?: HeroStat[];
  /** 統計行を折り返す（項目が多いページ用） */
  statsWrap?: boolean;
}

/**
 * ライトテーマのページヒーロー（アイブロウ＋大見出し＋斜体サブ＋任意の統計行）。
 * GalleryHero / ProductsHero が同一の外殻だったため共通化（#195）。
 * インタラクションなしのサーバーコンポーネント。
 */
export default function PageHero({ eyebrow, heading, subtitle, stats, statsWrap }: PageHeroProps) {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 7, md: 11 },
        background:
          "radial-gradient(ellipse at 80% 30%, rgba(180,83,9,0.05), transparent 50%), #FFFFFF",
      }}
    >
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
        <Box sx={{ maxWidth: 800 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.5,
              mb: 3,
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#B45309",
            }}
          >
            <Box sx={{ width: 28, height: "1px", bgcolor: "#B45309" }} />
            {eyebrow}
          </Box>

          <Box
            component="h1"
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: "clamp(40px, 5.5vw, 84px)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "#0A0A0A",
              mt: 0,
              mb: 3,
              "& em": { fontStyle: "normal", color: "#B45309" },
            }}
          >
            {heading}
          </Box>

          <Box
            sx={{
              fontFamily: FONT_ITALIC,
              fontStyle: "italic",
              fontSize: "20px",
              color: "#6B6B6B",
              mb: 4,
              letterSpacing: "0.02em",
            }}
          >
            {subtitle}
          </Box>

          {stats && stats.length > 0 && (
            <Box
              sx={{
                display: "flex",
                gap: 5,
                pt: 3,
                borderTop: "1px solid #EFEFEA",
                ...(statsWrap ? { flexWrap: "wrap" } : {}),
              }}
            >
              {stats.map((stat, i) => (
                <Box key={i}>
                  <Box
                    sx={{
                      fontFamily: FONT_DISPLAY,
                      fontSize: "26px",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      color: "#0A0A0A",
                      mb: 0.5,
                    }}
                  >
                    {stat.value}
                  </Box>
                  <Box
                    sx={{
                      fontSize: "11px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#6B6B6B",
                    }}
                  >
                    {stat.label}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
