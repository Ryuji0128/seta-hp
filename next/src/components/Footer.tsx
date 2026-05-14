"use client";

import { Box, Container, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { usePathname } from "next/navigation";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Catalogue / 品目",
    links: [
      { label: "Starter · 8枚展示", href: "/products" },
      { label: "Collector · 16枚展示", href: "/products" },
      { label: "Master · 25枚展示", href: "/products" },
      { label: "特注品のご相談", href: "/contact" },
    ],
  },
  {
    title: "Studio / 工房",
    links: [
      { label: "工房について", href: "/about" },
      { label: "作り方", href: "/about" },
      { label: "ギャラリー", href: "/gallery" },
      { label: "お問い合わせ", href: "/contact" },
    ],
  },
  {
    title: "Policies / 規約",
    links: [
      { label: "配送について", href: "/shipping" },
      { label: "特定商取引法", href: "/legal" },
      { label: "プライバシー", href: "/privacy-policy" },
      { label: "会社情報", href: "/company" },
    ],
  },
];

export default function Footer() {
  const params = usePathname();
  const theme = useTheme();
  const isFooterDisabled = params.includes("portal-");
  if (isFooterDisabled) {
    return null;
  }

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0A0A0A",
        color: "rgba(255,255,255,0.55)",
        pt: { xs: 8, md: 10 },
        pb: 5,
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "2fr 1fr 1fr 1fr" },
            gap: { xs: 5, md: 7.5 },
            pb: 7,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Brand */}
          <Box>
            <Box
              sx={{
                fontFamily: theme.custom.fonts.display,
                fontWeight: 800,
                fontSize: "24px",
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
                mb: 1.75,
                display: "flex",
                alignItems: "baseline",
                gap: "10px",
              }}
            >
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  bgcolor: "#B45309",
                  transform: "rotate(45deg)",
                }}
              />
              瀬田製作所
            </Box>
            <Typography
              sx={{
                fontSize: "13px",
                lineHeight: 1.8,
                maxWidth: 320,
                color: "rgba(255,255,255,0.55)",
              }}
            >
              富山県高岡市の個人事業所。SaaS / Web アプリ / 組み込みシステム /
              AI データ解析を本業に、サブブランド <strong style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>飾Love(かざらぶ)</strong>{" "}
              でハンドメイドアクリルディスプレイを製作しています。
            </Typography>
          </Box>

          {/* Columns */}
          {COLUMNS.map((col) => (
            <Box key={col.title}>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#E5AC60",
                  mb: 2.5,
                }}
              >
                {col.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                {col.links.map((link) => (
                  <Box component="li" key={link.label} sx={{ mb: 1.25 }}>
                    <Link
                      href={link.href}
                      style={{
                        color: "rgba(255,255,255,0.75)",
                        textDecoration: "none",
                        fontSize: "13px",
                      }}
                    >
                      {link.label}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
            fontSize: "12px",
            letterSpacing: "0.05em",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          <span>© {new Date().getFullYear()} 瀬田製作所</span>
          <span>富山県高岡市</span>
        </Box>
      </Container>
    </Box>
  );
}
