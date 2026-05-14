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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

const NAV_LINKS = [
  { title: "カタログ", href: "/products" },
  { title: "ギャラリー", href: "/gallery" },
  { title: "工房について", href: "/about" },
  { title: "お問い合わせ", href: "/contact" },
];

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
          color: "#0A0A0A",
        }}
      >
        <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
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
              passHref
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "10px",
                  fontFamily: theme.custom.fonts.display,
                  fontSize: { xs: "16px", md: "19px" },
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "#0A0A0A",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    bgcolor: "#B45309",
                    transform: "rotate(45deg)",
                  }}
                />
                SETA CRAFT
              </Box>
            </Link>

            {/* Nav */}
            {isTablet ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <SessionProvider>
                  <UserAuthButton />
                </SessionProvider>
                <IconButton
                  edge="end"
                  aria-label="menu"
                  onClick={handleMenuOpen}
                >
                  <MenuIcon sx={{ color: "#0A0A0A" }} />
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
                        passHref
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
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    passHref
                    style={{ textDecoration: "none" }}
                  >
                    <Box
                      sx={{
                        color: "#0A0A0A",
                        fontSize: "14px",
                        fontWeight: 500,
                        transition: "color 0.2s",
                        cursor: "pointer",
                        "&:hover": { color: "#B45309" },
                      }}
                    >
                      {item.title}
                    </Box>
                  </Link>
                ))}
                <Link href="/products" passHref style={{ textDecoration: "none" }}>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#0A0A0A",
                      color: "#FFFFFF",
                      px: 2.5,
                      py: 1.1,
                      fontSize: "13px",
                      fontWeight: 600,
                      "&:hover": { bgcolor: "#B45309" },
                    }}
                  >
                    購入する →
                  </Button>
                </Link>
                <SessionProvider>
                  <UserAuthButton />
                </SessionProvider>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Box sx={{ height: { xs: 60, md: 72 } }} />
    </>
  );
}
