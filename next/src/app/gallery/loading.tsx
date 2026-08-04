import { Box, Skeleton } from "@mui/material";
import SectionContainer from "@/components/SectionContainer";

export default function GalleryLoading() {
  return (
    <Box sx={{ bgcolor: "#FFFFFF", py: { xs: 4, md: 8 } }}>
      <SectionContainer>
        <Skeleton variant="text" width={180} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={260} height={24} sx={{ mb: 4 }} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            gap: 3,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Box key={i}>
              <Skeleton variant="rectangular" sx={{ aspectRatio: "4/3", borderRadius: 1, mb: 1.5 }} />
              <Skeleton variant="text" width="70%" height={20} />
              <Skeleton variant="text" width="50%" height={18} />
            </Box>
          ))}
        </Box>
      </SectionContainer>
    </Box>
  );
}
