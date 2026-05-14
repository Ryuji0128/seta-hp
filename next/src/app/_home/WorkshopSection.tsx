"use client";

import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";

const META = [
  { label: "Est.", value: "2026年・富山県" },
  { label: "Maker", value: "個人工房" },
  { label: "Specialty", value: "MLBカード・Topps NOW" },
  { label: "Output", value: "受注生産・少量" },
];

const WorkshopSection = () => {
  const theme = useTheme();
  const fontDisplay = theme.custom.fonts.display;

  return (
    <Box
      component="section"
      id="workshop"
      sx={{ bgcolor: "#0A0A0A", color: "#FFFFFF", py: { xs: 10, md: 15 } }}
    >
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 6, md: 10 },
            alignItems: "center",
          }}
        >
          {/* Image */}
          <Box
            sx={{
              position: "relative",
              aspectRatio: "4 / 5",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <Image
              src="/images/placeholders/workshop.svg"
              alt="工房 / Workshop in Takaoka, Toyama"
              fill
              sizes="(max-width: 960px) 100vw, 50vw"
              unoptimized
              style={{ objectFit: "cover" }}
            />
          </Box>

          {/* Text */}
          <Box>
            <Box
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#E5AC60",
                mb: 2,
              }}
            >
              The Workshop · 工房について
            </Box>

            <Box
              component="h2"
              sx={{
                fontFamily: fontDisplay,
                fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: 700,
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
                mt: 0,
                mb: 3.5,
                "& em": { fontStyle: "normal", color: "#E5AC60" },
              }}
            >
              一人で、
              <br />
              <em>ひとつずつ。</em>
            </Box>

            <Box sx={{ color: "rgba(255,255,255,0.7)", fontSize: "15px", lineHeight: 1.8, mb: 2.5 }}>
              昼はソフトウェアエンジニア、夜はカードディスプレイを作っています。
              10年以上のMLBカードコレクターであり、400年の金工伝統がある富山県高岡市の小さな工房で、
              飾Love を運営しています。
            </Box>
            <Box sx={{ color: "rgba(255,255,255,0.7)", fontSize: "15px", lineHeight: 1.8, mb: 2.5 }}>
              カタログにある全てのモデルは、私が設計・切削・造形・仕上げ・梱包まで一貫して行っています。
              チームも外注もありません。レーザーと私と、「カードディスプレイはどうあるべきか」という
              無数の判断だけがあります。
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: "20px 32px",
                mt: 5,
                pt: 4,
                borderTop: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {META.map((m) => (
                <Box key={m.label} sx={{ fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>
                  <Box
                    sx={{
                      display: "block",
                      color: "#FFFFFF",
                      fontWeight: 600,
                      fontSize: "15px",
                      mb: 0.5,
                      fontFamily: fontDisplay,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {m.label}
                  </Box>
                  {m.value}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default WorkshopSection;
