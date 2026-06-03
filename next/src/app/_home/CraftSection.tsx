"use client";

import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";

const STEPS = [
  {
    num: "01",
    label: "Laser Cutting",
    title: "精密カット",
    sub: "Laser · 0.1mm 精度",
    body: "産業用CO₂レーザーでアクリルを精密に切削。スリーブを傷つけない隙間まで計算してあります。",
    image: "/images/placeholders/craft-01-laser.svg",
  },
  {
    num: "02",
    label: "3D Printing",
    title: "三次元造形",
    sub: "FDM · カスタム形状",
    body: "結合部・取付金具・名前プレートは3Dプリントで造形。市販品にはない、コレクターのための一品仕立てを実現します。",
    image: "/images/placeholders/craft-02-3d.svg",
  },
  {
    num: "03",
    label: "Hand Finishing",
    title: "手仕上げ",
    sub: "Solo · 一つずつ",
    body: "エッジの面取りから組立て・検品まで、すべて手作業。自分が納得するまで、出荷しません。",
    image: "/images/placeholders/craft-03-hand.svg",
  },
];

const CraftSection = () => {
  const theme = useTheme();
  const fontDisplay = theme.custom.fonts.display;

  return (
    <Box component="section" id="craft" sx={{ py: { xs: 10, md: 15 } }}>
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
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
            三つの工程、
            <br />
            <em>一つ</em>のこだわり。
          </Box>
          <Box sx={{ fontSize: "16px", color: "#2A2A2A", lineHeight: 1.7, maxWidth: 540 }}>
            CADから壁に届くまで、すべての工程をこの工房で行います。
            <br />
            外注なし、近道なし。
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 4,
          }}
        >
          {STEPS.map((s) => (
            <Box key={s.num}>
              {/* Image */}
              <Box
                sx={{
                  position: "relative",
                  aspectRatio: "1 / 1",
                  borderRadius: "4px",
                  mb: 2.5,
                  overflow: "hidden",
                }}
              >
                <Image
                  src={s.image}
                  alt={`${s.title} — ${s.label}`}
                  fill
                  sizes="(max-width: 960px) 100vw, 33vw"
                  unoptimized
                  style={{ objectFit: "cover" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "18px",
                    left: "20px",
                    fontFamily: fontDisplay,
                    fontSize: "60px",
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    color: "rgba(10, 10, 10, 0.1)",
                    lineHeight: 1,
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                >
                  {s.num}
                </Box>
              </Box>

              {/* Text */}
              <Box
                sx={{
                  fontFamily: fontDisplay,
                  fontSize: "22px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  mb: 0.75,
                  color: "#0A0A0A",
                }}
              >
                {s.title}
              </Box>
              <Box
                sx={{
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#6B6B6B",
                  fontWeight: 500,
                  mb: 1.5,
                }}
              >
                {s.sub}
              </Box>
              <Box sx={{ fontSize: "14px", color: "#2A2A2A", lineHeight: 1.7 }}>
                {s.body}
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default CraftSection;
