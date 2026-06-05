import { Box, Container, Skeleton } from "@mui/material";

export default function ProductDetailLoading() {
  return (
    <Box sx={{ bgcolor: "#FFFFFF" }}>
      <Container maxWidth="xl" sx={{ maxWidth: "1320px !important", py: { xs: 4, md: 8 } }}>
        <Skeleton variant="text" width={200} height={16} sx={{ mb: 4 }} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
            gap: { xs: 5, md: 8 },
          }}
        >
          <Skeleton variant="rectangular" sx={{ aspectRatio: "1/1", borderRadius: 1 }} />
          <Box>
            <Skeleton variant="text" width={80} height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={44} sx={{ mb: 3 }} />
            <Skeleton variant="text" width={160} height={48} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" height={28} width={100} sx={{ borderRadius: "999px", mb: 4 }} />
            <Skeleton variant="text" width="100%" height={18} />
            <Skeleton variant="text" width="100%" height={18} />
            <Skeleton variant="text" width="80%" height={18} sx={{ mb: 4 }} />
            <Skeleton variant="rectangular" height={48} sx={{ borderRadius: "999px" }} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
