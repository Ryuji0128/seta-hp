import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Box, Container } from "@mui/material";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await auth();

  // ログイン済みの場合はホームへリダイレクト
  if (session) {
    redirect("/");
  }

  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh", py: { xs: 4, md: 8 } }}>
      <Container maxWidth="sm">
        <LoginForm />
      </Container>
    </Box>
  );
}
