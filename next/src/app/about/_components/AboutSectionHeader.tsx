import { Box } from "@mui/material";
import { FONT_ITALIC } from "@/theme/themeConstants";

interface AboutSectionHeaderProps {
  number: string;
  title: string;
  titleJa: string;
  marginBottom?: number;
}

/** Aboutページ各節の番号付き共通見出し。 */
export default function AboutSectionHeader({
  number,
  title,
  titleJa,
  marginBottom = 8,
}: AboutSectionHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "baseline",
        gap: 3,
        borderTop: "1px solid",
        borderTopColor: "text.primary",
        pt: 3.5,
        mb: marginBottom,
        fontFamily: FONT_ITALIC,
        fontStyle: "italic",
        fontSize: "16px",
        letterSpacing: "0.05em",
      }}
    >
      <Box sx={{ color: "primary.main" }}>— {number}</Box>
      <Box sx={{ color: "text.primary" }}>{title}</Box>
      <Box sx={{ color: "text.secondary", fontSize: "14px" }}>／　{titleJa}</Box>
    </Box>
  );
}
