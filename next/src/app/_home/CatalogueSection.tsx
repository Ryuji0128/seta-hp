import { Box } from "@mui/material";
import SectionContainer from "@/components/SectionContainer";
import { FONT_DISPLAY, FONT_ITALIC } from "@/theme/themeConstants";
import Image from "next/image";
import Link from "next/link";
import type { CatalogueProduct } from "./getCatalogueProducts";

interface CatalogueSectionProps {
  products: CatalogueProduct[];
}

// 標準3型の英語ティア名。商品名から「N枚」を読み取り、Ref番号やバッジを導出する。
const TIER_NAMES: Record<number, string> = { 8: "Starter", 16: "Collector", 25: "Master" };

type CatalogueMeta = {
  en: string | null; // 英語ティア名（標準型のみ）
  ref: string | null; // Ref. 008 形式
  cap: string | null; // 8枚展示
  badge: string | null; // 8 Cards
  label: string | null; // 画像未設定時のプレースホルダー見出し
};

function catalogueMeta(name: string): CatalogueMeta {
  const match = name.match(/(\d+)\s*枚/);
  const count = match ? Number(match[1]) : null;
  if (!count) return { en: null, ref: null, cap: null, badge: null, label: null };
  const padded = String(count).padStart(3, "0");
  const en = TIER_NAMES[count] ?? null;
  return {
    en,
    ref: `Ref. ${padded}`,
    cap: `${count}枚展示`,
    badge: `${count} Cards`,
    label: `${(en ?? "No.").toUpperCase()} · No. ${padded}`,
  };
}

const CatalogueSection = ({ products }: CatalogueSectionProps) => {
  const fontDisplay = FONT_DISPLAY;
  const fontItalic = FONT_ITALIC;

  // 公開商品が無ければセクションごと非表示
  if (products.length === 0) return null;

  return (
    <Box component="section" id="products" sx={{ py: { xs: 10, md: 15 } }}>
      <SectionContainer>
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
              color: "text.primary",
              "& em": { fontStyle: "normal", color: "primary.main" },
            }}
          >
            ライン
            <br />
            <em>ナップ。</em>
          </Box>
          <Box sx={{ fontSize: "16px", color: "secondary.main", lineHeight: 1.7, maxWidth: 540 }}>
            アクリルから一つずつレーザー切削、手仕上げ。
            <br />
            MLBカード・トレカを美しく飾るためのディスプレイを、全国送料無料でお届けします。
            <Box
              sx={{
                display: "block",
                mt: 1.5,
                color: "text.secondary",
                fontFamily: fontItalic,
                fontStyle: "italic",
              }}
            >
              — Handmade, one at a time.
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
          {products.map((p) => {
            const meta = catalogueMeta(p.name);
            const title = meta.en ?? p.name;
            return (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                passHref
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
                    transition:
                      "transform 0.4s, border-color 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: "text.primary",
                      boxShadow: "0 22px 40px -22px rgba(10,10,10,0.2)",
                    },
                  }}
                >
                  {/* Media */}
                  <Box
                    sx={{
                      position: "relative",
                      aspectRatio: "4 / 5",
                      overflow: "hidden",
                      background: p.image
                        ? "#F4F4F0"
                        : "linear-gradient(150deg, #F4F4F0 0%, #E7E7E0 100%)",
                    }}
                  >
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 960px) 100vw, 33vw"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      meta.label && (
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#B9B9B0",
                            fontFamily: fontItalic,
                            fontStyle: "italic",
                            fontSize: "15px",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {meta.label}
                        </Box>
                      )
                    )}
                    {meta.badge && (
                      <Box
                        component="span"
                        sx={{
                          position: "absolute",
                          top: "16px",
                          left: "16px",
                          bgcolor: "#FFFFFF",
                          color: "text.primary",
                          px: "10px",
                          py: "5px",
                          borderRadius: "999px",
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                        }}
                      >
                        {meta.badge}
                      </Box>
                    )}
                  </Box>

                  {/* Info */}
                  <Box sx={{ p: "24px 24px 28px" }}>
                    {(meta.ref || meta.cap) && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          mb: "14px",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            fontFamily: fontItalic,
                            fontStyle: "italic",
                            color: "primary.main",
                            fontSize: "14px",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {meta.ref}
                        </Box>
                        <Box
                          component="span"
                          sx={{
                            fontSize: "11px",
                            color: "text.secondary",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            fontWeight: 500,
                          }}
                        >
                          {meta.cap}
                        </Box>
                      </Box>
                    )}
                    <Box
                      sx={{
                        fontFamily: fontDisplay,
                        fontSize: "22px",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        color: "text.primary",
                        mb: "6px",
                      }}
                    >
                      {title}
                    </Box>
                    {meta.en && (
                      <Box
                        sx={{
                          fontSize: "12px",
                          color: "text.secondary",
                          letterSpacing: "0.08em",
                          mb: "20px",
                        }}
                      >
                        {p.name}
                      </Box>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        pt: "18px",
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

export default CatalogueSection;
