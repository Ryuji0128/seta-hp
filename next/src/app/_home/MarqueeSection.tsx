import { Box } from "@mui/material";

const ITEMS = [
  "Made in Japan",
  "Handcrafted",
  "レーザー加工",
  "UV対応アクリル",
  "全国送料無料",
  "Personal Studio",
  "コレクターの、コレクターによる",
];

// Repeat twice for seamless looping
const RUN = [...ITEMS, ...ITEMS];

const MarqueeSection = () => {
  return (
    <Box
      component="section"
      sx={{
        bgcolor: "#0A0A0A",
        color: "#FFFFFF",
        py: 2.25,
        overflow: "hidden",
        borderTop: "1px solid #EFEFEA",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "80px",
          whiteSpace: "nowrap",
          animation: "seta-marquee 30s linear infinite",
          fontSize: "13px",
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          "& > span": {
            display: "flex",
            alignItems: "center",
            gap: "80px",
          },
          "& > span::after": {
            content: '"\\2726"',
            color: "#B45309",
            marginLeft: "80px",
          },
        }}
      >
        {RUN.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </Box>
    </Box>
  );
};

export default MarqueeSection;
