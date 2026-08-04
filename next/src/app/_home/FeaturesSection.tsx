import { Box } from "@mui/material";
import SectionContainer from "@/components/SectionContainer";
import { FONT_DISPLAY } from "@/theme/themeConstants";

const FEATURES = [
  {
    num: "01",
    title: "変色しないアクリル",
    titleEn: "UV-Resistant Acrylic",
    body: "UV安定剤入りキャストアクリルを使用。黄ばみ・くもりが出ません。",
  },
  {
    num: "02",
    title: "スリーブ対応",
    titleEn: "Sleeve-Compatible",
    body: "標準スリーブのまま展示可能。カードを保護したまま飾れます。",
  },
  {
    num: "03",
    title: "壁掛け・卓上 両対応",
    titleEn: "Wall or Desktop",
    body: "壁掛け金具と卓上スタンドの両方が付属。いつでも置き場所を変えられます。",
  },
  {
    num: "04",
    title: "全国送料無料",
    titleEn: "Free Shipping in JP",
    body: "緩衝材入りの梱包と配送保険付き。全国どこでも送料無料でお届けします。",
  },
];

const FeaturesSection = () => {
  const fontDisplay = FONT_DISPLAY;

  return (
    <Box component="section" sx={{ bgcolor: "background.alt", py: { xs: 10, md: 15 } }}>
      <SectionContainer>
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
            長く、<em>共に。</em>
          </Box>
          <Box sx={{ fontSize: "16px", color: "secondary.main", lineHeight: 1.7, maxWidth: 540 }}>
            飾るカードの方が長持ちするくらい、ディスプレイ側もしっかり作る。
            <br />
            手を抜かないことが、飾Love のスタンダードです。
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
            gap: "1px",
            bgcolor: "divider",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          {FEATURES.map((f) => (
            <Box key={f.num} sx={{ bgcolor: "#FFFFFF", p: { xs: 4, md: 5 } }}>
              <Box
                sx={{
                  fontFamily: fontDisplay,
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "primary.main",
                  mb: 3,
                  letterSpacing: "0.1em",
                }}
              >
                {f.num}
              </Box>
              <Box
                sx={{
                  fontFamily: fontDisplay,
                  fontSize: "19px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  mb: 1.25,
                  color: "text.primary",
                }}
              >
                {f.title}
              </Box>
              <Box
                sx={{
                  fontSize: "12px",
                  color: "text.secondary",
                  mb: 1.75,
                }}
              >
                {f.titleEn}
              </Box>
              <Box sx={{ fontSize: "13.5px", color: "secondary.main", lineHeight: 1.7 }}>
                {f.body}
              </Box>
            </Box>
          ))}
        </Box>
      </SectionContainer>
    </Box>
  );
};

export default FeaturesSection;
