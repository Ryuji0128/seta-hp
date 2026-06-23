import { Box, Container } from "@mui/material";
import { FONT_DISPLAY, FONT_ITALIC } from "@/theme/themeConstants";
import Image from "next/image";
import Link from "next/link";
import { normalizeImageUrl } from "@/lib/images";
import { type ProductSummary } from "@/lib/types/product";

interface Props {
  products: ProductSummary[];
}

const formatRefNumber = (id: number) => String(id).padStart(3, "0");

const RelatedProducts: React.FC<Props> = ({ products }) => {
  const fontDisplay = FONT_DISPLAY;
  const fontItalic = FONT_ITALIC;

  return (
    <Box component="section" sx={{ bgcolor: "#F6F6F4", py: { xs: 8, md: 12 } }}>
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            gap: 3,
            borderTop: "1px solid #0A0A0A",
            pt: 3.5,
            mb: 6,
            fontFamily: fontItalic,
            fontStyle: "italic",
            fontSize: "16px",
            letterSpacing: "0.05em",
          }}
        >
          <Box sx={{ color: "#B45309" }}>—</Box>
          <Box sx={{ color: "#0A0A0A" }}>Related</Box>
          <Box sx={{ color: "#6B6B6B", fontSize: "14px" }}>／　関連商品</Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            gap: { xs: 2.5, md: 3 },
          }}
        >
          {products.map((p) => {
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
                    bgcolor: "#FFFFFF",
                    cursor: "pointer",
                    transition: "transform 0.4s, border-color 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: "#0A0A0A",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      aspectRatio: "1 / 1",
                      background: "linear-gradient(150deg, #F6F6F4 0%, #EDEDE8 100%)",
                      overflow: "hidden",
                    }}
                  >
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={p.name}
                        fill
                        sizes="(max-width: 600px) 50vw, 25vw"
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
                          fontSize: "13px",
                        }}
                      >
                        No. {ref}
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Box
                      sx={{
                        fontFamily: fontItalic,
                        fontStyle: "italic",
                        color: "#B45309",
                        fontSize: "12px",
                        letterSpacing: "0.05em",
                        mb: 0.5,
                      }}
                    >
                      Ref. {ref}
                    </Box>
                    <Box
                      sx={{
                        fontFamily: fontDisplay,
                        fontSize: "14px",
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                        color: "#0A0A0A",
                        mb: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: 1.4,
                      }}
                    >
                      {p.name}
                    </Box>
                    <Box
                      sx={{
                        fontFamily: fontDisplay,
                        fontSize: "15px",
                        fontWeight: 700,
                        letterSpacing: "-0.015em",
                        color: "#0A0A0A",
                      }}
                    >
                      ¥{p.price.toLocaleString()}
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

export default RelatedProducts;
