import type { Metadata } from "next";
import { Box, Typography } from "@mui/material";
import BaseContainer from "@/components/BaseContainer";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import WorkManagement from "./WorkManagement";

export const metadata: Metadata = {
  title: "制作事例管理",
  robots: "noindex, nofollow",
};

export default async function WorksManagePage() {
  const session = await auth();

  if (!session) {
    redirect("/portal-login");
  }

  return (
    <BaseContainer>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
          制作事例管理
        </Typography>
        <WorkManagement session={session} />
      </Box>
    </BaseContainer>
  );
}
