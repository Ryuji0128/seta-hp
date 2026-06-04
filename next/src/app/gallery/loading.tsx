import { Box, Container, Skeleton } from "@mui/material";

export default function GalleryLoading() {
  return (
    <Box sx={{ bgcolor: "#FFFFFF", py: { xs: 4, md: 8 } }}>
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important" }}>
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
      </Container>
    </Box>
  );
}
