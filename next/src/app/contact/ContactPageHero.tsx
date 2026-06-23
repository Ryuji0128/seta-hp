import { Box, Container } from "@mui/material";
import { FONT_DISPLAY, FONT_ITALIC } from "@/theme/themeConstants";

interface Props {
  titleJa: string;
  titleEn: string;
  lead: string;
}

const ContactPageHero: React.FC<Props> = ({ titleJa, titleEn, lead }) => {
  const fontDisplay = FONT_DISPLAY;
  const fontItalic = FONT_ITALIC;

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        py: { xs: 7, md: 11 },
        background:
          "radial-gradient(ellipse at 20% 30%, rgba(180,83,9,0.04), transparent 50%), #FFFFFF",
      }}
    >
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
        <Box sx={{ maxWidth: 720 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.5,
              mb: 3,
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#B45309",
            }}
          >
            <Box sx={{ width: 28, height: "1px", bgcolor: "#B45309" }} />
            Contact · お問い合わせ
          </Box>

          <Box
            component="h1"
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: "clamp(40px, 5vw, 72px)",
              lineHeight: 1,
              letterSpacing: "-0.035em",
              color: "#0A0A0A",
              mt: 0,
              mb: 2,
            }}
          >
            {titleJa}
          </Box>

          <Box
            sx={{
              fontFamily: fontItalic,
              fontStyle: "italic",
              fontSize: "20px",
              color: "#6B6B6B",
              mb: 4,
              letterSpacing: "0.02em",
            }}
          >
            — {titleEn}
          </Box>

          <Box sx={{ fontSize: "16px", color: "#2A2A2A", lineHeight: 1.8, maxWidth: 560 }}>
            {lead}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactPageHero;
