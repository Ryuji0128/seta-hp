"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, TextField, Button, InputAdornment, IconButton } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { signIn } from "next-auth/react";
import AuthCard from "@/components/auth/AuthCard";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { AUTH_SUBMIT_BUTTON_SX } from "@/components/auth/authStyles";

interface LoginFormProps {
  isGoogleEnabled: boolean;
}

export default function LoginForm({ isGoogleEnabled }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("メールアドレスまたはパスワードが正しくありません");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="ログイン"
      subtitle="アカウントにログインしてください"
      error={error}
      footerText="アカウントをお持ちでないですか？"
      footerLinkHref="/register"
      footerLinkLabel="新規登録"
    >
      {/* Googleログインボタン（環境変数が設定されている場合のみ表示） */}
      {isGoogleEnabled && <GoogleSignInButton label="Googleでログイン" />}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="メールアドレス"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ mb: 2 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon sx={{ color: "#999" }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          fullWidth
          label="パスワード"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ mb: 3 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: "#999" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
          sx={AUTH_SUBMIT_BUTTON_SX}
        >
          {isLoading ? "ログイン中..." : "ログイン"}
        </Button>
      </Box>
    </AuthCard>
  );
}
