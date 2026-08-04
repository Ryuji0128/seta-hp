import type { SxProps } from "@mui/material";

/** ログイン/新規登録の送信ボタン共通スタイル */
export const AUTH_SUBMIT_BUTTON_SX: SxProps = {
  py: 1.5,
  bgcolor: "#FF5722",
  color: "white",
  fontWeight: 600,
  borderRadius: "50px",
  boxShadow: "none",
  "&:hover": {
    bgcolor: "#E64A19",
  },
  "&:disabled": {
    bgcolor: "#CCC",
  },
};
