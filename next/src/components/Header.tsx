"use client";

import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from "@mui/material";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useState } from "react";
import SectionContainer from "@/components/SectionContainer";
import { FONT_DISPLAY } from "@/theme/themeConstants";

// next-auth のクライアントJSは遅延チャンクに分離（初期バンドル削減 #245）
const UserAuthMenu = dynamic(() => import("@/components/UserAuthMenu"), {
  ssr: false,
  loading: () => (
    <IconButton disabled>
      <PersonOutlineIcon sx={{ color: "#CCC" }} />
    </IconButton>
  ),
});

const NAV_LINKS = [
  { title: "カタログ", href: "/products" },
  { title: "ギャラリー", href: "/gallery" },
  { title: "工房について", href: "/about" },
  { title: "お問い合わせ", href: "/contact" },
];

const X_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid #EFEFEA",
          boxShadow: "none",
          color: "text.primary",
        }}
      >
        <SectionContainer>
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: { xs: 60, md: 72 },
            }}
          >
            {/* Brand */}
            <Link
              href="/"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontFamily: FONT_DISPLAY,
                  fontSize: { xs: "16px", md: "19px" },
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "text.primary",
                }}
              >
                <Box
                  component="img"
                  src="/kaza-love_logo.png"
                  alt=""
                  sx={{
                    height: { xs: 32, md: 38 },
                    width: "auto",
                    display: "inline-block",
                    flexShrink: 0,
                    verticalAlign: "middle",
                  }}
                />
                <Box component="span" sx={{ lineHeight: 1 }}>かざらぶ</Box>
              </Box>
            </Link>

            {/* Nav（CSSブレークポイントで出し分け。useMediaQuery による
                ハイドレーション後のちらつきを避ける #245） */}
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 4 } }}>
              {/* Desktop: ナビリンク */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{ textDecoration: "none" }}
                  >
                    <Box
                      sx={{
                        color: "text.primary",
                        fontSize: "14px",
                        fontWeight: 500,
                        transition: "color 0.2s",
                        cursor: "pointer",
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      {item.title}
                    </Box>
                  </Link>
                ))}
              </Box>

              {/* X (Twitter) */}
              <Box
                component="a"
                href="https://x.com/kaza_love_"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "text.primary",
                  p: { xs: 0.5, md: 0 },
                  transition: "color 0.2s",
                  "&:hover": { color: "primary.main" },
                }}
                aria-label="X (Twitter)"
              >
                {X_ICON}
              </Box>

              {/* Desktop: 購入CTA */}
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <Link href="/products" style={{ textDecoration: "none" }}>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "background.dark",
                      color: "#FFFFFF",
                      px: 2.5,
                      py: 1.1,
                      fontSize: "13px",
                      fontWeight: 600,
                      "&:hover": { bgcolor: "primary.main" },
                    }}
                  >
                    購入する →
                  </Button>
                </Link>
              </Box>

              {/* 認証ボタン（遅延読み込み） */}
              <UserAuthMenu />

              {/* Mobile: ハンバーガーメニュー */}
              <IconButton
                edge="end"
                aria-label="menu"
                onClick={handleMenuOpen}
                sx={{ display: { xs: "inline-flex", md: "none" } }}
              >
                <MenuIcon sx={{ color: "text.primary" }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ mt: 1 }}
              >
                {NAV_LINKS.map((item) => (
                  <MenuItem key={item.href} onClick={handleMenuClose}>
                    <Link
                      href={item.href}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        width: "100%",
                      }}
                    >
                      {item.title}
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </SectionContainer>
      </AppBar>
      <Box sx={{ height: { xs: 60, md: 72 } }} />
    </>
  );
}
