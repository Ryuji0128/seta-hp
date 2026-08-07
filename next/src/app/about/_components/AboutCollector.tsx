import { Box } from "@mui/material";
import SectionContainer from "@/components/SectionContainer";
import AboutSectionHeader from "./AboutSectionHeader";
import { FONT_DISPLAY } from "@/theme/themeConstants";

const COLLECTION = [
  { label: "コレクション歴", value: "約3年" },
  { label: "メインジャンル", value: "MLB / Topps NOW / Topps Chrome" },
  { label: "推しチーム", value: "ロサンゼルス・ドジャース" },
  { label: "推し選手", value: "大谷翔平 / ムーキー・ベッツ / フレディ・フリーマン" },
];

const AboutCollector = () => {
  return (
    <Box component="section" sx={{ bgcolor: "background.alt", py: { xs: 10, md: 15 } }}>
      <SectionContainer>
        <AboutSectionHeader
          number="02"
          title="Collector"
          titleJa="コレクターとして"
          marginBottom={8}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1.4fr" },
            gap: { xs: 4, md: 10 },
          }}
        >
          <Box
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 500,
              fontSize: "clamp(32px, 3.8vw, 56px)",
              lineHeight: 1.2,
              letterSpacing: "-0.025em",
              color: "text.primary",
            }}
          >
            同じ熱量の
            <br />
            <Box component="span" sx={{ color: "primary.main" }}>仲間として。</Box>
          </Box>

          <Box sx={{ pt: 2 }}>
            <Box sx={{ fontSize: "15.5px", color: "secondary.main", lineHeight: 2, mb: 3 }}>
              私自身、MLBカードのコレクターです。きっかけは大谷翔平選手のドジャース移籍。
              ニュースで見た Topps NOW のカードに惹かれて1枚買ったら、
              気づけばコレクションが壁一面に広がっていました。
            </Box>
            <Box sx={{ fontSize: "15.5px", color: "secondary.main", lineHeight: 2, mb: 4 }}>
              集めるほどに「もっとカッコよく飾りたい」という想いが強くなり、
              それが飾Love を始めた原点です。
              同じ熱量でカードを愛する方に使ってもらえたら、これほど嬉しいことはありません。
            </Box>

            <Box>
              {COLLECTION.map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "120px 1fr", sm: "160px 1fr" },
                    gap: 2,
                    py: 2,
                    borderTop: "1px solid",
                    borderTopColor: "divider",
                    ...(i === COLLECTION.length - 1 && { borderBottom: "1px solid", borderBottomColor: "divider" }),
                  }}
                >
                  <Box sx={{ fontSize: "13px", color: "text.secondary", fontWeight: 500 }}>
                    {item.label}
                  </Box>
                  <Box sx={{ fontSize: "14.5px", color: "text.primary", lineHeight: 1.7 }}>
                    {item.value}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </SectionContainer>
    </Box>
  );
};

export default AboutCollector;
