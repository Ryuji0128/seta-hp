import type { ReactNode } from "react";
import { Box } from "@mui/material";
import { FONT_DISPLAY } from "@/theme/themeConstants";

interface AboutTwoColumnProps {
  lead: ReactNode;
  children: ReactNode;
}

export default function AboutTwoColumn({ lead, children }: AboutTwoColumnProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1.4fr" },
        gap: { xs: 4, md: 10 },
      }}
    >
      <Box
        sx={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 500,
          fontSize: "clamp(32px, 3.8vw, 56px)",
          lineHeight: 1.2,
          letterSpacing: "-0.025em",
          color: "text.primary",
        }}
      >
        {lead}
      </Box>
      <Box sx={{ pt: 2 }}>{children}</Box>
    </Box>
  );
}
