"use client";

import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";

const CTASection = () => {
  const theme = useTheme();
  const fontDisplay = theme.custom.fonts.display;

  return (
    <Box
      component="section"
      sx={{
        bgcolor: "#0A0A0A",
        color: "#FFFFFF",
        py: { xs: 10, md: 15 },
        textAlign: "center",
      }}
    >
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
        <Box
          component="h2"
          sx={{
            fontFamily: fontDisplay,
            fontSize: "clamp(48px, 6vw, 96px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            mt: 0,
            mb: 3,
            "& em": { fontStyle: "normal", color: "#E5AC60" },
          }}
        >
          あなたのカードに、
          <br />
          <em>居場所を。</em>
        </Box>
        <Box
          sx={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.7)",
            maxWidth: 480,
            mx: "auto",
            mb: 5,
            lineHeight: 1.7,
          }}
        >
          一つずつ手作り、全国送料無料。壁に、机に、あなたのそばに。
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1.75,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/products" passHref style={{ textDecoration: "none" }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.25,
                bgcolor: "#FFFFFF",
                color: "#0A0A0A",
                px: 4,
                py: 2,
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background-color 0.2s, transform 0.2s",
                "&:hover": { bgcolor: "#E5AC60", transform: "translateY(-1px)" },
              }}
            >
              BASEで購入する <span>→</span>
            </Box>
          </Link>
          <Link href="/contact" passHref style={{ textDecoration: "none" }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.25,
                color: "#FFFFFF",
                px: 3.5,
                py: 2,
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: 500,
                border: "1px solid rgba(255,255,255,0.25)",
                cursor: "pointer",
                transition: "border-color 0.2s",
                "&:hover": { borderColor: "#FFFFFF" },
              }}
            >
              特注品のご相談
            </Box>
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default CTASection;
