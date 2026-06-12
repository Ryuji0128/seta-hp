"use client";

import { Box, Button, Typography } from "@mui/material";

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
  fallbackMessage?: string;
}

/**
 * 各ルートの error.tsx から利用する共通エラー表示。
 */
export default function ErrorFallback({
  error,
  reset,
  fallbackMessage = "ページの読み込みに失敗しました。",
}: ErrorFallbackProps) {
  return (
    <Box sx={{ textAlign: "center", py: 10 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        エラーが発生しました
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        {error.message || fallbackMessage}
      </Typography>
      <Button variant="contained" onClick={reset}>
        再試行
      </Button>
    </Box>
  );
}
