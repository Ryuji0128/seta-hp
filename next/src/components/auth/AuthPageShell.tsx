import { Box, Container } from "@mui/material";
import type { ReactNode } from "react";

export default function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh", py: { xs: 4, md: 8 } }}>
      <Container maxWidth="sm">{children}</Container>
    </Box>
  );
}
