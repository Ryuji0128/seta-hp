"use client";

import { Box, Link, Toolbar, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

export default function Footer() {

  //　現在のURLを取得し、管理者ページでFooterを非表示にする
  const params = usePathname();
  const isFooterDisabled = params.includes("portal-")
  if (isFooterDisabled) {
    return null;
  }
  
  return (
    <Box
      component="footer"
      sx={{
        position: "static",
        bottom: 0,
        backgroundColor: "primary.main",
        color: "primary.contrastText",
        padding: "1rem 0",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Typography variant="body1" color="inherit">
          &copy; {new Date().getFullYear()} 瀬田製作所
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <Link
            href="/privacy-policy"
            color="inherit"
            sx={{
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            プライバシーポリシー
          </Link>
          {/* <Link
            href="/terms-of-service"
            color="inherit"
            sx={{
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            利用規約
          </Link> */}
        </Box>
        {/* FooterにreCaptchaのプライバシーポリシー及び利用規約を表示 */}
        {/* This site is protected by reCAPTCHA and the Google
        <Link
          href="https://policies.google.com/privacy"
          color="inherit"
          sx={{
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Privacy Policy
        </Link>
        <Link
          href="https://policies.google.com/terms"
          color="inherit"
          sx={{
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Terms of Service
        </Link> */}
      </Toolbar>
    </Box>
  );
}