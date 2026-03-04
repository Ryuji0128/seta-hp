import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProductManagement from "./ProductManagement";
import BaseContainer from "@/components/BaseContainer";
import { Box, Typography } from "@mui/material";

export default async function ProductsPage() {
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
          商品管理
        </Typography>
        <ProductManagement session={session} />
      </Box>
    </BaseContainer>
  );
}
