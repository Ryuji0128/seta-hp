"use client";

import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { getProductCategoryLabel } from "@/lib/constants/categories";
import { normalizeImageUrl } from "@/lib/images";
import { type ProductGridItem } from "@/lib/types/product";

interface Props {
  products: ProductGridItem[];
}

const formatRefNumber = (id: number) => String(id).padStart(3, "0");

const ProductsGrid: React.FC<Props> = ({ products }) => {
  const theme = useTheme();
  const fontDisplay = theme.custom.fonts.display;
  const fontItalic = theme.custom.fonts.italic;

  if (products.length === 0) {
    return (
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#F6F6F4" }}>
        <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
          <Box
            sx={{
              border: "1px solid #E5E5E0",
              borderRadius: "6px",
              p: { xs: 5, md: 10 },
              textAlign: "center",
              bgcolor: "#FFFFFF",
            }}
          >
            <Box
              sx={{
                fontFamily: fontItalic,
                fontStyle: "italic",
                color: "#B45309",
                fontSize: "14px",
                letterSpacing: "0.1em",
                mb: 1,
              }}
            >
              Coming Soon
            </Box>
            <Box
              sx={{
                fontFamily: fontDisplay,
                fontSize: "28px",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "#0A0A0A",
                mb: 1.5,
              }}
            >
              商品を準備中
            </Box>
            <Box sx={{ fontSize: "14px", color: "#6B6B6B" }}>
              標準ラインナップを準備しています。
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            gap: { xs: 3, md: 3.5 },
          }}
        >
          {products.map((p) => {
            const tags = p.tags ? p.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
            const isPopular = tags.includes("人気");
            const isNew = tags.includes("NEW");
            const ref = formatRefNumber(p.id);
            const imageUrl = normalizeImageUrl(p.image);

            return (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Box
                  sx={{
                    border: "1px solid #E5E5E0",
                    borderRadius: "6px",
                    overflow: "hidden",
                    cursor: "pointer",
                    bgcolor: "#FFFFFF",
                    transition: "transform 0.4s, border-color 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: "#0A0A0A",
                      boxShadow: "0 22px 40px -22px rgba(10,10,10,0.2)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      aspectRatio: "4 / 5",
                      background: "linear-gradient(150deg, #F6F6F4 0%, #EDEDE8 100%)",
                      overflow: "hidden",
                    }}
                  >
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={p.name}
                        fill
                        sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                        unoptimized
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#9A9A9A",
                          fontFamily: fontItalic,
                          fontStyle: "italic",
                          fontSize: "15px",
                          letterSpacing: "0.04em",
                        }}
                      >
                        No. {ref}
                      </Box>
                    )}
                    {(isPopular || isNew) && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 16,
                          left: 16,
                          bgcolor: isPopular ? "#B45309" : "#0A0A0A",
                          color: "#FFFFFF",
                          px: 1.25,
                          py: 0.625,
                          borderRadius: "999px",
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                        }}
                      >
                        {isPopular ? "Popular" : "New"}
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ p: "24px 24px 28px" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        mb: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          fontFamily: fontItalic,
                          fontStyle: "italic",
                          color: "#B45309",
                          fontSize: "13px",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Ref. {ref}
                      </Box>
                      <Box
                        sx={{
                          fontSize: "11px",
                          color: "#6B6B6B",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          fontWeight: 500,
                        }}
                      >
                        {getProductCategoryLabel(p.category)}
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        fontFamily: fontDisplay,
                        fontSize: "18px",
                        fontWeight: 700,
                        letterSpacing: "-0.015em",
                        color: "#0A0A0A",
                        lineHeight: 1.4,
                        mb: 2.25,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "calc(2 * 1.4 * 18px)",
                      }}
                    >
                      {p.name}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        pt: 2,
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
                        ¥{p.price.toLocaleString()}
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
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default ProductsGrid;
