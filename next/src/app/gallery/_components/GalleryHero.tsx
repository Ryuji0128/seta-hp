import { Box, Container } from "@mui/material";
import { FONT_DISPLAY, FONT_ITALIC } from "@/theme/themeConstants";

interface Props {
  count: number;
}

const GalleryHero: React.FC<Props> = ({ count }) => {
  const fontDisplay = FONT_DISPLAY;
  const fontItalic = FONT_ITALIC;

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 7, md: 11 },
        background:
          "radial-gradient(ellipse at 80% 30%, rgba(180,83,9,0.05), transparent 50%), #FFFFFF",
      }}
    >
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
        <Box sx={{ maxWidth: 800 }}>
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
            Gallery · 制作事例
          </Box>

          <Box
            component="h1"
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: "clamp(40px, 5.5vw, 84px)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "#0A0A0A",
              mt: 0,
              mb: 3,
              "& em": { fontStyle: "normal", color: "#B45309" },
            }}
          >
            これまでの<br />
            <em>仕事。</em>
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
            — Selected works from the workshop.
          </Box>

          <Box sx={{ display: "flex", gap: 5, pt: 3, borderTop: "1px solid #EFEFEA" }}>
            <Box>
              <Box
                sx={{
                  fontFamily: fontDisplay,
                  fontSize: "26px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#0A0A0A",
                  mb: 0.5,
                }}
              >
                {count}
              </Box>
              <Box
                sx={{
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#6B6B6B",
                }}
              >
                Works on display
              </Box>
            </Box>
            <Box>
              <Box
                sx={{
                  fontFamily: fontDisplay,
                  fontSize: "26px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#0A0A0A",
                  mb: 0.5,
                }}
              >
                Solo
              </Box>
              <Box
                sx={{
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#6B6B6B",
                }}
              >
                One maker
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default GalleryHero;
