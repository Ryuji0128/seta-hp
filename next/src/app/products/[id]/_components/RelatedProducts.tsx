import { Box } from "@mui/material";
import SectionContainer from "@/components/SectionContainer";
import { FONT_DISPLAY, FONT_ITALIC } from "@/theme/themeConstants";
import Image from "next/image";
import Link from "next/link";
import { normalizeImageUrl } from "@/lib/images";
import { type ProductSummary } from "@/lib/types/product";
import { formatRefNumber } from "@/lib/format";

interface Props {
  products: ProductSummary[];
}

const RelatedProducts: React.FC<Props> = ({ products }) => {
  const fontDisplay = FONT_DISPLAY;
  const fontItalic = FONT_ITALIC;

  return (
    <Box component="section" sx={{ bgcolor: "background.alt", py: { xs: 8, md: 12 } }}>
      <SectionContainer>
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            gap: 3,
            borderTop: "1px solid",
            borderColor: "text.primary",
            pt: 3.5,
            mb: 6,
            fontFamily: fontItalic,
            fontStyle: "italic",
            fontSize: "16px",
            letterSpacing: "0.05em",
          }}
        >
          <Box sx={{ color: "primary.main" }}>—</Box>
          <Box sx={{ color: "text.primary" }}>Related</Box>
          <Box sx={{ color: "text.secondary", fontSize: "14px" }}>／　関連商品</Box>
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
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: "6px",
                    overflow: "hidden",
                    bgcolor: "#FFFFFF",
                    cursor: "pointer",
                    transition: "transform 0.4s, border-color 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: "text.primary",
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
                          color: "text.disabled",
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
                        color: "primary.main",
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
                        color: "text.primary",
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
                        color: "text.primary",
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
      </SectionContainer>
    </Box>
  );
};

export default RelatedProducts;
