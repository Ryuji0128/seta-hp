import { Box } from "@mui/material";
import SectionContainer from "@/components/SectionContainer";
import {
  ProductCardFrame,
  ProductCardMedia,
  ProductPriceRow,
} from "@/components/product/ProductCardPrimitives";
import { FONT_DISPLAY, FONT_ITALIC } from "@/theme/themeConstants";
import Link from "next/link";
import { normalizeImageUrl } from "@/lib/images";
import { type ProductSummary } from "@/lib/types/product";
import { formatRefNumber } from "@/lib/format";

interface Props {
  products: ProductSummary[];
}

const RelatedProducts: React.FC<Props> = ({ products }) => {
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
            fontFamily: FONT_ITALIC,
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
                <ProductCardFrame hoverShadow={false}>
                  <ProductCardMedia
                    src={imageUrl}
                    alt={p.name}
                    sizes="(max-width: 600px) 50vw, 25vw"
                    aspectRatio="1 / 1"
                    placeholder={`No. ${ref}`}
                    placeholderFontSize="13px"
                    placeholderLetterSpacing="normal"
                  />
                  <Box sx={{ p: 2 }}>
                    <Box
                      sx={{
                        fontFamily: FONT_ITALIC,
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
                        fontFamily: FONT_DISPLAY,
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
                    <ProductPriceRow price={p.price} variant="compact" />
                  </Box>
                </ProductCardFrame>
              </Link>
            );
          })}
        </Box>
      </SectionContainer>
    </Box>
  );
};

export default RelatedProducts;
