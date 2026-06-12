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
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Box
                component="img"
                src="/kaza-love_logo.png"
                alt=""
                sx={{
                  height: 48,
                  width: "auto",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              かざらぶ
            </Box>
            <Typography
              sx={{
                fontSize: "13px",
                lineHeight: 1.8,
                maxWidth: 320,
                color: "rgba(255,255,255,0.55)",
              }}
            >
              飾Love(かざらぶ)は、小さな個人工房から、
              MLBカード・トレカコレクターのためのハンドメイドアクリルディスプレイをお届けします。
              レーザー加工で、ひとつずつ丁寧に。
            </Typography>
            <Box
              component="a"
              href="https://x.com/kaza_love_"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 2.5,
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.6)",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.4)",
                  color: "#FFFFFF",
                },
              }}
              aria-label="X (Twitter)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Box>
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
          {/* 年越し時のSSR/クライアント不一致による警告を抑止 */}
          <span suppressHydrationWarning>© {new Date().getFullYear()} 飾Love</span>
          <span>Made in Japan</span>
        </Box>
      </Container>
    </Box>
  );
}
