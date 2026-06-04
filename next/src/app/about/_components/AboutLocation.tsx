"use client";

import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";

const META = [
  { label: "Location", value: "富山県高岡市" },
  { label: "Region", value: "金工伝統 400年" },
  { label: "Est.", value: "2026年" },
  { label: "Maker", value: "個人工房・一人" },
];

const AboutLocation = () => {
  const theme = useTheme();
  const fontDisplay = theme.custom.fonts.display;
  const fontItalic = theme.custom.fonts.italic;

  return (
    <Box component="section" sx={{ bgcolor: "#0A0A0A", color: "#FFFFFF", py: { xs: 10, md: 15 } }}>
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            gap: 3,
            borderTop: "1px solid #FFFFFF",
            pt: 3.5,
            mb: 8,
            fontFamily: fontItalic,
            fontStyle: "italic",
            fontSize: "16px",
            letterSpacing: "0.05em",
          }}
        >
          <Box sx={{ color: "#E5AC60" }}>— 05</Box>
          <Box sx={{ color: "#FFFFFF" }}>Location</Box>
          <Box sx={{ color: "rgba(255,255,255,0.55)", fontSize: "14px" }}>／　工房の場所</Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" }, gap: { xs: 5, md: 10 }, alignItems: "center" }}>
          <Box>
            <Box
              component="h2"
              sx={{
                fontFamily: fontDisplay,
                fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: 700,
                letterSpacing: "-0.035em",
                lineHeight: 1.1,
                m: 0,
                mb: 3.5,
              }}
            >
              ものづくりの街、
              <br />
              <Box component="span" sx={{ color: "#E5AC60" }}>富山県高岡市。</Box>
            </Box>
            <Box sx={{ color: "rgba(255,255,255,0.75)", fontSize: "15px", lineHeight: 1.9, mb: 3 }}>
              高岡市は400年以上にわたって金工・漆器・木工を育ててきた、ものづくりの街です。
              飾Love は、その土地でレーザーと3Dプリンタという現代の道具を使って、
              「ただ飾る」ためのコレクター道具を作っています。
            </Box>
            <Link href="/contact" passHref style={{ textDecoration: "none" }}>
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
                お問い合わせ <span>→</span>
              </Box>
            </Link>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, pt: { xs: 2, md: 0 } }}>
            {META.map((m) => (
              <Box key={m.label}>
                <Box
                  sx={{
                    fontFamily: fontDisplay,
                    fontWeight: 700,
                    fontSize: "15px",
                    letterSpacing: "-0.01em",
                    color: "#E5AC60",
                    mb: 0.75,
                  }}
                >
                  {m.label}
                </Box>
                <Box sx={{ color: "rgba(255,255,255,0.85)", fontSize: "14px", lineHeight: 1.6 }}>
                  {m.value}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutLocation;
