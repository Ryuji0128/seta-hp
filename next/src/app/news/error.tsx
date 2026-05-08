"use client";

import { Box, Button, Typography } from "@mui/material";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Box sx={{ textAlign: "center", py: 10 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        エラーが発生しました
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        {error.message || "データの読み込みに失敗しました。"}
      </Typography>
      <Button variant="contained" onClick={reset}>
        再試行
      </Button>
    </Box>
  );
}
