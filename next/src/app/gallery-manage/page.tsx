import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import GalleryManagement from "./GalleryManagement";
import BaseContainer from "@/components/BaseContainer";
import { Box, Typography } from "@mui/material";

export default async function GalleryManagePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
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
