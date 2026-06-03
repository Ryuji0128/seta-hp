"use client";

import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";

const PRODUCTS = [
  {
    ref: "008",
    cardCount: "8 Cards",
    cap: "8枚展示",
    name: "Starter",
    nameJp: "8枚展示モデル",
    price: "¥8,800",
    image: "/images/placeholders/product-008.svg",
  },
  {
    ref: "016",
    cardCount: "16 Cards",
    cap: "16枚展示",
    name: "Collector",
    nameJp: "16枚展示モデル",
    price: "¥12,800",
    image: "/images/placeholders/product-016.svg",
  },
  {
    ref: "025",
    cardCount: "25 Cards",
    cap: "25枚展示",
    name: "Master",
    nameJp: "25枚展示モデル",
    price: "¥19,800",
    image: "/images/placeholders/product-025.svg",
  },
];

const CatalogueSection = () => {
  const theme = useTheme();
  const fontDisplay = theme.custom.fonts.display;
  const fontItalic = theme.custom.fonts.italic;

  return (
    <Box component="section" id="products" sx={{ py: { xs: 10, md: 15 } }}>
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
        {/* Heading */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1.4fr" },
            gap: { xs: 3, md: 10 },
            mb: 8,
            alignItems: "end",
          }}
        >
          <Box
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: "clamp(40px, 4.6vw, 64px)",
              lineHeight: 1,
              letterSpacing: "-0.035em",
              color: "#0A0A0A",
              "& em": { fontStyle: "normal", color: "#B45309" },
            }}
          >
            三つの
            <br />
            スタン<em>ダード。</em>
          </Box>
          <Box sx={{ fontSize: "16px", color: "#2A2A2A", lineHeight: 1.7, maxWidth: 540 }}>
            標準モデルは8枚・16枚・25枚の三型。
            <br />
            いずれもアクリルからレーザー切削、手仕上げ、全国送料無料でお届けします。
            <Box
              sx={{
                display: "block",
                mt: 1.5,
                color: "#6B6B6B",
                fontFamily: fontItalic,
                fontStyle: "italic",
              }}
            >
              — Three sizes, one philosophy.
            </Box>
          </Box>
        </Box>

        {/* Products */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 3.5,
          }}
        >
          {PRODUCTS.map((p) => (
            <Link
              key={p.ref}
              href="/products"
              passHref
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Box
                sx={{
                  border: "1px solid #E5E5E0",
                  borderRadius: "6px",
                  overflow: "hidden",
                  cursor: "pointer",
                  bgcolor: "#FFFFFF",
                  transition:
                    "transform 0.4s, border-color 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: "#0A0A0A",
                    boxShadow: "0 22px 40px -22px rgba(10,10,10,0.2)",
                  },
                }}
              >
                {/* Image */}
                <Box
                  sx={{
                    position: "relative",
                    aspectRatio: "4 / 5",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={p.image}
                    alt={`${p.name} - ${p.nameJp}`}
                    fill
                    sizes="(max-width: 960px) 100vw, 33vw"
                    unoptimized
                    style={{ objectFit: "cover" }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      bgcolor: "#FFFFFF",
                      color: "#0A0A0A",
                      px: 1.25,
                      py: 0.625,
                      borderRadius: "999px",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      zIndex: 1,
                    }}
                  >
                    {p.cardCount}
                  </Box>
                </Box>

                {/* Info */}
                <Box sx={{ p: "24px 24px 28px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      mb: 1.75,
                    }}
                  >
                    <Box
                      sx={{
                        fontFamily: fontItalic,
                        fontStyle: "italic",
                        color: "#B45309",
                        fontSize: "14px",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Ref. {p.ref}
                    </Box>
                    <Box
                      sx={{
                        fontSize: "11px",
                        color: "#6B6B6B",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        fontWeight: 500,
                      }}
                    >
                      {p.cap}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      fontFamily: fontDisplay,
                      fontSize: "22px",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      color: "#0A0A0A",
                      mb: 0.5,
                    }}
                  >
                    {p.name}
                  </Box>
                  <Box sx={{ fontSize: "12px", color: "#6B6B6B", letterSpacing: "0.08em", mb: 2.5 }}>
                    {p.nameJp}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      pt: 2.25,
                      borderTop: "1px solid #EFEFEA",
                    }}
                  >
                    <Box
                      sx={{
                        fontFamily: fontDisplay,
                        fontSize: "22px",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        color: "#0A0A0A",
                      }}
                    >
                      {p.price}
                    </Box>
                    <Box
                      sx={{
                        fontSize: "11px",
                        color: "#6B6B6B",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      送料込
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Link>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default CatalogueSection;
