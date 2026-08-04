import { Box, Typography } from "@mui/material";
import BaseContainer from "@/components/BaseContainer";

interface Props {
  title: string;
  children: React.ReactNode;
}

/** 管理ページ共通のレイアウト（コンテナ + 中央見出し） */
export default function AdminPageShell({ title, children }: Props) {
  return (
    <BaseContainer>
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ textAlign: "center", mb: 4, fontWeight: 600 }}
        >
          {title}
        </Typography>
        {children}
      </Box>
    </BaseContainer>
  );
}
