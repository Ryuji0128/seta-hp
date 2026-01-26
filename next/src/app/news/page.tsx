import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewsManagement from "./NewsManagement";
import BaseContainer from "@/components/BaseContainer";
import { Box, Typography } from "@mui/material";

export default async function NewsPage() {
  const session = await auth();

  if (!session) {
    redirect("/portal-login");
  }

  return (
    <BaseContainer>
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ textAlign: "center", mb: 4, fontWeight: 600 }}
        >
          お知らせ管理
        </Typography>
        <NewsManagement session={session} />
      </Box>
    </BaseContainer>
  );
}
