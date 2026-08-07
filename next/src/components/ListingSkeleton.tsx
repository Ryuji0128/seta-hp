import { Box, Skeleton } from "@mui/material";
import SectionContainer from "@/components/SectionContainer";

interface ListingSkeletonProps {
  titleWidth: number;
  subtitleWidth: number;
  imageAspectRatio: string;
  lineWidths: Array<string | number>;
}

/** 商品・制作事例一覧で共有するローディング表示。 */
export default function ListingSkeleton({
  titleWidth,
  subtitleWidth,
  imageAspectRatio,
  lineWidths,
}: ListingSkeletonProps) {
  return (
    <Box sx={{ bgcolor: "#FFFFFF", py: { xs: 4, md: 8 } }}>
      <SectionContainer>
        <Skeleton variant="text" width={titleWidth} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={subtitleWidth} height={24} sx={{ mb: 4 }} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            gap: 3,
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <Box key={index}>
              <Skeleton
                variant="rectangular"
                sx={{ aspectRatio: imageAspectRatio, borderRadius: 1, mb: 1.5 }}
              />
              {lineWidths.map((width, lineIndex) => (
                <Skeleton
                  key={lineIndex}
                  variant="text"
                  width={width}
                  height={lineIndex === 1 ? 24 : 20}
                />
              ))}
            </Box>
          ))}
        </Box>
      </SectionContainer>
    </Box>
  );
}
