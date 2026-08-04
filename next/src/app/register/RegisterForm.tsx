"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, TextField, Button, InputAdornment, IconButton } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { signIn } from "next-auth/react";
import AuthCard from "@/components/auth/AuthCard";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { AUTH_SUBMIT_BUTTON_SX } from "@/components/auth/authStyles";
import { apiJson } from "@/lib/api-client";
import { RegistrationSchema } from "@/lib/validation";

interface RegisterFormProps {
  isGoogleEnabled: boolean;
}

export default function RegisterForm({ isGoogleEnabled }: RegisterFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    // サーバー側（/api/register）と同じ Zod スキーマでクライアント検証する
    const parsed = RegistrationSchema.safeParse({ name, email, password });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      await apiJson("/api/register", {
        method: "POST",
        body: { name, email, password },
      });

      const signInResult = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInResult?.error) {
        router.push("/login");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="新規登録"
      subtitle="アカウントを作成して、お買い物をはじめましょう"
      error={error}
      footerText="すでにアカウントをお持ちですか？"
      footerLinkHref="/login"
      footerLinkLabel="ログイン"
    >
      {isGoogleEnabled && <GoogleSignInButton label="Googleで登録" />}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="お名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          sx={{ mb: 2 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon sx={{ color: "#999" }} />
                </InputAdornment>
              ),
            },
          }}
        />

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
          helperText="8文字以上、大文字・小文字・数字をそれぞれ含む"
          sx={{ mb: 2 }}
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

        <TextField
          fullWidth
          label="パスワード（確認）"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          sx={{ mb: 3 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: "#999" }} />
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
          {isLoading ? "登録中..." : "新規登録"}
        </Button>
      </Box>
    </AuthCard>
  );
}
