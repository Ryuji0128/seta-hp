import { Box } from "@mui/material";
import { FONT_DISPLAY } from "@/theme/themeConstants";

export interface LegalInfoRow {
  label: string;
  value: string;
}

interface Props {
  rows: LegalInfoRow[];
}

/**
 * label / value の縦並びテーブル(規約・会社情報用)
 * 細罫線スタイルの label / value テーブル
 * サーバーコンポーネント（フォントは themeConstants から直接参照）
 */
const LegalInfoTable: React.FC<Props> = ({ rows }) => {
  const fontDisplay = FONT_DISPLAY;

  return (
    <Box
      sx={{
        border: "1px solid #E5E5E0",
        borderRadius: "6px",
        overflow: "hidden",
      }}
    >
      {rows.map((row, i) => (
        <Box
          key={row.label}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "200px 1fr" },
            ...(i < rows.length - 1 && {
              borderBottom: "1px solid #E5E5E0",
            }),
          }}
        >
          <Box
            sx={{
              bgcolor: "#F6F6F4",
              px: { xs: 2, sm: 3 },
              py: { xs: 1.75, sm: 2.5 },
              fontFamily: fontDisplay,
              fontWeight: 600,
              fontSize: "13.5px",
              letterSpacing: "-0.01em",
              color: "#0A0A0A",
              borderRight: { xs: "none", sm: "1px solid #E5E5E0" },
              borderBottom: { xs: "1px solid #E5E5E0", sm: "none" },
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            {row.label}
          </Box>
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: { xs: 1.75, sm: 2.5 },
              fontSize: "14px",
              color: "#2A2A2A",
              lineHeight: 1.8,
              whiteSpace: "pre-line",
            }}
          >
            {row.value}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default LegalInfoTable;
