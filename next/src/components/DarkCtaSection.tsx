import { Box, Container } from "@mui/material";
import Link from "next/link";
import type { ReactNode } from "react";
import { FONT_DISPLAY } from "@/theme/themeConstants";

interface DarkCtaSectionProps {
  /** 見出し（h2）。<em> は銅色アクセントになる */
  heading: ReactNode;
  /** 本文 */
  body: ReactNode;
  /** 主ボタン（白背景）のラベル。末尾に矢印が付く */
  primaryLabel: ReactNode;
  /** 主ボタンのリンク先（既定: お問い合わせ） */
  primaryHref?: string;
  /** 副ボタン（枠線）のラベル */
  secondaryLabel: ReactNode;
  /** 副ボタンのリンク先 */
  secondaryHref: string;
}

/**
 * ダークな2カラム CTA セクション。
 * GalleryCta / ProductsBespokeCta が同一レイアウトだったため共通化（#195）。
 * インタラクションは CSS hover のみのためサーバーコンポーネント。
 */
export default function DarkCtaSection({
  heading,
  body,
  primaryLabel,
  primaryHref = "/contact",
  secondaryLabel,
  secondaryHref,
}: DarkCtaSectionProps) {
  return (
    <Box component="section" sx={{ bgcolor: "#0A0A0A", color: "#FFFFFF", py: { xs: 10, md: 14 } }}>
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" }, gap: { xs: 4, md: 8 }, alignItems: "center" }}>
          <Box
            component="h2"
            sx={{
              fontFamily: FONT_DISPLAY,
              fontSize: "clamp(36px, 4.5vw, 64px)",
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
              m: 0,
              "& em": { fontStyle: "normal", color: "#E5AC60" },
            }}
          >
            {heading}
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
              {body}
            </Box>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              <Link href={primaryHref} passHref style={{ textDecoration: "none" }}>
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
                  {primaryLabel} <span>→</span>
                </Box>
              </Link>
              <Link href={secondaryHref} passHref style={{ textDecoration: "none" }}>
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
                  {secondaryLabel}
                </Box>
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
