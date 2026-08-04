"use client";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

/**
 * モバイル判定（sm ブレークポイント未満）。
 * 各管理コンポーネントで重複していた useMediaQuery 呼び出しを一元化。
 */
export function useIsMobile(): boolean {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("sm"));
}
