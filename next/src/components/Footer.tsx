"use client";

import { Box, Container, Link, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

export default function Footer() {
  const params = usePathname();
  const isFooterDisabled = params.includes("portal-");
  if (isFooterDisabled) {
    return null;
  }

  const footerLinks = [
    { title: "商品一覧", href: "/products" },
    { title: "ギャラリー", href: "/gallery" },
    { title: "工房について", href: "/about" },
    { title: "お問い合わせ", href: "/contact" },
    { title: "配送・返品", href: "/shipping" },
    { title: "会社情報", href: "/company" },
    { title: "特定商取引法", href: "/legal" },
    { title: "プライバシーポリシー", href: "/privacy-policy" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#F5F5F5",
        borderTop: "1px solid #E0E0E0",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* リンク */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: { xs: 2, md: 3 },
            mb: 3,
          }}
        >
          {footerLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              sx={{
                color: "#666",
                textDecoration: "none",
                fontSize: "13px",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              {link.title}
            </Link>
          ))}
        </Box>

        {/* コピーライト */}
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            color: "#999",
            fontSize: "12px",
          }}
        >
          &copy; {new Date().getFullYear()} SETA Craft
        </Typography>
      </Container>
    </Box>
  );
}
