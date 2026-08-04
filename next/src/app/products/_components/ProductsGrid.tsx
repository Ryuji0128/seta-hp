import { Box } from "@mui/material";
import { FONT_DISPLAY, FONT_ITALIC } from "@/theme/themeConstants";
import Image from "next/image";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import SectionContainer from "@/components/SectionContainer";
import { getProductCategoryLabel } from "@/lib/constants/categories";
import { normalizeImageUrl } from "@/lib/images";
import { parseTags, type ProductGridItem } from "@/lib/types/product";
import { formatRefNumber } from "@/lib/format";

interface Props {
  products: ProductGridItem[];
}

const ProductsGrid: React.FC<Props> = ({ products }) => {
  const fontDisplay = FONT_DISPLAY;
  const fontItalic = FONT_ITALIC;

  if (products.length === 0) {
    return <EmptyState title="商品を準備中" description="標準ラインナップを準備しています。" />;
  }

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <SectionContainer>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            gap: { xs: 3, md: 3.5 },
          }}
        >
          {products.map((p) => {
            const tags = parseTags(p.tags);
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
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: "6px",
                    overflow: "hidden",
                    cursor: "pointer",
                    bgcolor: "#FFFFFF",
                    transition: "transform 0.4s, border-color 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: "text.primary",
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
                          bgcolor: isPopular ? "primary.main" : "background.dark",
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
                          color: "primary.main",
                          fontSize: "13px",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Ref. {ref}
                      </Box>
                      <Box
                        sx={{
                          fontSize: "11px",
                          color: "text.secondary",
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
                        color: "text.primary",
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
                          color: "text.primary",
                        }}
                      >
                        ¥{p.price.toLocaleString()}
                      </Box>
                      <Box
                        sx={{
                          fontSize: "11px",
                          color: "text.secondary",
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
      </SectionContainer>
    </Box>
  );
};

export default ProductsGrid;
