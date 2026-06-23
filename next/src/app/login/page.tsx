import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Box, Container } from "@mui/material";
import { isGoogleAuthEnabled } from "@/lib/runtime-config";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "ログイン",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await auth();

  // ログイン済みの場合はホームへリダイレクト
  if (session) {
    redirect("/");
  }

  const googleAuthEnabled = isGoogleAuthEnabled();

  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh", py: { xs: 4, md: 8 } }}>
      <Container maxWidth="sm">
        <LoginForm isGoogleEnabled={googleAuthEnabled} />
      </Container>
    </Box>
  );
}
