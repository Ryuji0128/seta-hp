"use client";

import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { getGalleryCategoryLabel } from "@/lib/constants/categories";

interface Work {
  id: number;
  title: string;
  category: string;
  image: string | null;
  createdAt: Date | string;
}

interface Props {
  works: Work[];
}

const formatRefNumber = (id: number) => String(id).padStart(3, "0");

const GalleryGrid: React.FC<Props> = ({ works }) => {
  const theme = useTheme();
  const fontDisplay = theme.custom.fonts.display;
  const fontItalic = theme.custom.fonts.italic;

  if (works.length === 0) {
    return (
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#F6F6F4" }}>
        <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
          <Box
            sx={{
              border: "1px solid #E5E5E0",
              borderRadius: "6px",
              p: { xs: 5, md: 10 },
              textAlign: "center",
              bgcolor: "#FFFFFF",
            }}
          >
            <Box
              sx={{
                fontFamily: fontItalic,
                fontStyle: "italic",
                color: "#B45309",
                fontSize: "14px",
                letterSpacing: "0.1em",
                mb: 1,
              }}
            >
              Coming Soon
            </Box>
            <Box
              sx={{
                fontFamily: fontDisplay,
                fontSize: "28px",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "#0A0A0A",
                mb: 1.5,
              }}
            >
              作品を準備中
            </Box>
            <Box sx={{ fontSize: "14px", color: "#6B6B6B" }}>
              撮影が完了次第、順次掲載していきます。
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            gap: { xs: 3, md: 4 },
          }}
        >
          {works.map((work, idx) => (
            <Box
              key={work.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transition: "transform 0.4s",
                "&:hover": { transform: "translateY(-4px)" },
                "&:hover .gallery-img": {
                  borderColor: "#0A0A0A",
                },
              }}
            >
              <Box
                className="gallery-img"
                sx={{
                  position: "relative",
                  aspectRatio: "4 / 5",
                  bgcolor: "#FFFFFF",
                  overflow: "hidden",
                  borderRadius: "4px",
                  border: "1px solid #E5E5E0",
                  transition: "border-color 0.3s",
                }}
              >
                {work.image ? (
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                    style={{ objectFit: "contain", objectPosition: "center center" }}
                  />
                ) : (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#9A9A9A",
                      fontFamily: fontItalic,
                      fontStyle: "italic",
                      fontSize: "14px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    No. {formatRefNumber(idx + 1)}
                  </Box>
                )}
              </Box>

              <Box sx={{ pt: 2.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      fontFamily: fontItalic,
                      fontStyle: "italic",
                      color: "#B45309",
                      fontSize: "13px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    No. {formatRefNumber(idx + 1)}
                  </Box>
                  <Box
                    sx={{
                      fontSize: "11px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#6B6B6B",
                      fontWeight: 500,
                    }}
                  >
                    {getGalleryCategoryLabel(work.category)}
                  </Box>
                </Box>
                <Box
                  sx={{
                    fontFamily: fontDisplay,
                    fontSize: "18px",
                    fontWeight: 700,
                    letterSpacing: "-0.015em",
                    color: "#0A0A0A",
                    lineHeight: 1.4,
                  }}
                >
                  {work.title}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default GalleryGrid;
