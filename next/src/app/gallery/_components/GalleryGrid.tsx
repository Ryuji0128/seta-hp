"use client";

import { useState } from "react";
import { Box, Container, Dialog, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import CloseIcon from "@mui/icons-material/Close";
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
const FALLBACK_IMAGE_BG = "rgb(246, 246, 244)";

// カード余白（contain のレターボックス部）は静的な淡いグレー背景＋微グラデで統一する。
// 以前は各画像を canvas で再ダウンロードしてドミナントカラーを抽出していたが、
// ギャラリーの画像帯域が2倍になるため廃止（#199）。
function GalleryCardImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        bgcolor: FALLBACK_IMAGE_BG,
        backgroundImage: `linear-gradient(180deg, ${FALLBACK_IMAGE_BG} 0%, rgba(255,255,255,0.45) 100%)`,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
        style={{ objectFit: "contain", objectPosition: "center center" }}
      />
    </Box>
  );
}

const GalleryGrid: React.FC<Props> = ({ works }) => {
  const theme = useTheme();
  const fontDisplay = theme.custom.fonts.display;
  const fontItalic = theme.custom.fonts.italic;
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

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
              role={work.image ? "button" : undefined}
              tabIndex={work.image ? 0 : undefined}
              aria-label={work.image ? `${work.title} を拡大表示` : undefined}
              onClick={() => {
                if (work.image) setSelectedWork(work);
              }}
              onKeyDown={(e) => {
                if (!work.image) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedWork(work);
                }
              }}
              sx={{
                display: "flex",
                flexDirection: "column",
                cursor: work.image ? "zoom-in" : "default",
                transition: "transform 0.4s",
                "&:hover": { transform: "translateY(-4px)" },
                "&:hover .gallery-img": {
                  borderColor: "#0A0A0A",
                },
                "&:focus-visible": {
                  outline: "2px solid #0A0A0A",
                  outlineOffset: 6,
                },
              }}
            >
              <Box
                className="gallery-img"
                sx={{
                  position: "relative",
                  aspectRatio: "4 / 5",
                  bgcolor: FALLBACK_IMAGE_BG,
                  overflow: "hidden",
                  borderRadius: "4px",
                  border: "1px solid #E5E5E0",
                  transition: "border-color 0.3s",
                }}
              >
                {work.image ? (
                  <GalleryCardImage src={work.image} alt={work.title} />
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
                    mb: 2,
                  }}
                >
                  {work.title}
                </Box>
                <Box
                  component={Link}
                  href={`/contact?display=${encodeURIComponent(work.title)}`}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderRadius: "999px",
                    border: "1px solid #E5E5E0",
                    color: "#0A0A0A",
                    textDecoration: "none",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "#B45309",
                      color: "#B45309",
                      bgcolor: "rgba(180,83,9,0.04)",
                    },
                  }}
                >
                  このディスプレイについて問い合わせる <span>→</span>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>

      <Dialog
        open={Boolean(selectedWork)}
        onClose={() => setSelectedWork(null)}
        maxWidth={false}
        PaperProps={{
          sx: {
            bgcolor: "transparent",
            boxShadow: "none",
            overflow: "visible",
            width: "min(92vw, 1200px)",
            m: 0,
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              bgcolor: "rgba(10,10,10,0.82)",
              backdropFilter: "blur(8px)",
            },
          },
        }}
      >
        {selectedWork?.image && (
          <Box sx={{ position: "relative" }}>
            <IconButton
              aria-label="拡大画像を閉じる"
              onClick={() => setSelectedWork(null)}
              sx={{
                position: "absolute",
                top: { xs: -44, md: -52 },
                right: 0,
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.22)",
                bgcolor: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.14)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>

            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "min(78vh, 1100px)",
                borderRadius: "10px",
                overflow: "hidden",
                bgcolor: "#F6F6F4",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <Image
                src={selectedWork.image}
                alt={selectedWork.title}
                fill
                sizes="92vw"
                style={{ objectFit: "contain", objectPosition: "center center" }}
                priority
              />
            </Box>

            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 2,
                color: "#FFFFFF",
              }}
            >
              <Box
                sx={{
                  fontFamily: fontDisplay,
                  fontSize: { xs: "18px", md: "24px" },
                  fontWeight: 700,
                  letterSpacing: "-0.015em",
                }}
              >
                {selectedWork.title}
              </Box>
              <Box
                sx={{
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.72)",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                {getGalleryCategoryLabel(selectedWork.category)}
              </Box>
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default GalleryGrid;
