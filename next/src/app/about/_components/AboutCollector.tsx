"use client";

import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const COLLECTION = [
  { label: "コレクション歴", value: "約3年" },
  { label: "メインジャンル", value: "MLB / Topps NOW / Topps Chrome" },
  { label: "推しチーム", value: "ロサンゼルス・ドジャース" },
  { label: "推し選手", value: "大谷翔平 / ムーキー・ベッツ / フレディ・フリーマン" },
];

const AboutCollector = () => {
  const theme = useTheme();
  const fontDisplay = theme.custom.fonts.display;
  const fontItalic = theme.custom.fonts.italic;

  return (
    <Box component="section" sx={{ bgcolor: "#F6F6F4", py: { xs: 10, md: 15 } }}>
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            gap: 3,
            borderTop: "1px solid #0A0A0A",
            pt: 3.5,
            mb: 8,
            fontFamily: fontItalic,
            fontStyle: "italic",
            fontSize: "16px",
            letterSpacing: "0.05em",
          }}
        >
          <Box sx={{ color: "#B45309" }}>— 02</Box>
          <Box sx={{ color: "#0A0A0A" }}>Collector</Box>
          <Box sx={{ color: "#6B6B6B", fontSize: "14px" }}>／　コレクターとして</Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1.4fr" },
            gap: { xs: 4, md: 10 },
          }}
        >
          <Box
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 500,
              fontSize: "clamp(32px, 3.8vw, 56px)",
              lineHeight: 1.2,
              letterSpacing: "-0.025em",
              color: "#0A0A0A",
            }}
          >
            同じ熱量の
            <br />
            <Box component="span" sx={{ color: "#B45309" }}>仲間として。</Box>
          </Box>

          <Box sx={{ pt: 2 }}>
            <Box sx={{ fontSize: "15.5px", color: "#2A2A2A", lineHeight: 2, mb: 3 }}>
              私自身、MLBカードのコレクターです。きっかけは大谷翔平選手のドジャース移籍。
              ニュースで見た Topps NOW のカードに惹かれて1枚買ったら、
              気づけばコレクションが壁一面に広がっていました。
            </Box>
            <Box sx={{ fontSize: "15.5px", color: "#2A2A2A", lineHeight: 2, mb: 4 }}>
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
                    borderTop: "1px solid #E5E5E0",
                    ...(i === COLLECTION.length - 1 && { borderBottom: "1px solid #E5E5E0" }),
                  }}
                >
                  <Box sx={{ fontSize: "13px", color: "#6B6B6B", fontWeight: 500 }}>
                    {item.label}
                  </Box>
                  <Box sx={{ fontSize: "14.5px", color: "#0A0A0A", lineHeight: 1.7 }}>
                    {item.value}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutCollector;
