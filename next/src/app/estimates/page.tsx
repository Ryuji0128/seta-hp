import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import EstimateManagement from "./EstimateManagement";
import BaseContainer from "@/components/BaseContainer";
import { Box, Typography } from "@mui/material";

export default async function EstimatesPage() {
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
          見積書管理
        </Typography>
        <EstimateManagement session={session} />
      </Box>
    </BaseContainer>
  );
}
