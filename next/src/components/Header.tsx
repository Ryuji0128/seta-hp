"use client";

import UserAuthButton from "@/components/UserAuthButton";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const contentsList = [
    { title: "商品一覧", href: "/products" },
    { title: "ギャラリー", href: "/gallery" },
    { title: "工房について", href: "/about" },
    { title: "お問い合わせ", href: "/contact" },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #EAEAEA",
          boxShadow: "none",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: { xs: 56, md: 64 },
            }}
          >
            {/* ロゴ */}
            <Link
              href="/"
              passHref
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: "16px", md: "20px" },
                  color: "#333",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                }}
              >
                SETA Craft
              </Typography>
            </Link>

            {/* ナビゲーション */}
            {isTablet ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <SessionProvider>
                  <UserAuthButton />
                </SessionProvider>

                <IconButton
                  edge="start"
                  aria-label="menu"
                  onClick={handleMenuOpen}
                >
                  <MenuIcon sx={{ color: "#333" }} />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  sx={{ mt: 1 }}
                >
                  {contentsList.map((content, index) => (
                    <MenuItem key={index} onClick={handleMenuClose}>
                      <Link
                        href={content.href}
                        passHref
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          width: "100%",
                        }}
                      >
                        <Typography variant="body1">{content.title}</Typography>
                      </Link>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {contentsList.map((content, index) => (
                  <Link key={index} href={content.href} passHref>
                    <Button
                      sx={{
                        color: "#333",
                        fontWeight: 500,
                        "&:hover": {
                          color: "#FF5722",
                          backgroundColor: "transparent",
                        },
                        fontSize: "14px",
                        px: 2,
                      }}
                    >
                      {content.title}
                    </Button>
                  </Link>
                ))}

                <SessionProvider>
                  <UserAuthButton />
                </SessionProvider>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* ヘッダー分の高さを確保 */}
      <Box sx={{ ...theme.mixins.toolbar }} />
    </>
  );
}
