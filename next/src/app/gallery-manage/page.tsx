import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import GalleryManagement from "./GalleryManagement";
import BaseContainer from "@/components/BaseContainer";
import { Box, Typography } from "@mui/material";

export const metadata: Metadata = {
  title: "ギャラリー管理",
  robots: { index: false, follow: false },
};

export default async function GalleryManagePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    redirect("/");
  }

  return (
    <BaseContainer>
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ textAlign: "center", mb: 4, fontWeight: 600 }}
        >
          ギャラリー管理
        </Typography>
        <GalleryManagement session={session} />
      </Box>
    </BaseContainer>
  );
}
