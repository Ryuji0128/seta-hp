"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import Link from "next/link";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";

// Google認証が有効かどうか
const isGoogleEnabled = !!process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED;

export default function RegisterPage() {
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

    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      return;
    }

    if (!/[a-zA-Z]/.test(password)) {
      setError("パスワードには英字を含めてください");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("パスワードには数字を含めてください");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      // 登録成功後、自動ログイン
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
    } catch {
      setError("エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh", py: { xs: 4, md: 8 } }}>
      <Container maxWidth="sm">
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            border: "1px solid #EAEAEA",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.5rem", md: "1.8rem" },
              color: "#333",
              textAlign: "center",
              mb: 1,
            }}
          >
            新規登録
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#666", textAlign: "center", mb: 4 }}
          >
            アカウントを作成して、お買い物をはじめましょう
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Googleログインボタン（環境変数が設定されている場合のみ表示） */}
          {isGoogleEnabled && (
            <>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleSignIn}
                sx={{
                  py: 1.5,
                  color: "#333",
                  borderColor: "#DDD",
                  borderRadius: "50px",
                  fontWeight: 500,
                  mb: 3,
                  "&:hover": {
                    borderColor: "#333",
                    bgcolor: "transparent",
                  },
                }}
              >
                Googleで登録
              </Button>

              <Divider sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: "#999", px: 2 }}>
                  または
                </Typography>
              </Divider>
            </>
          )}

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
              helperText="8文字以上、英字と数字を含む"
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
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
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
              sx={{
                py: 1.5,
                bgcolor: "#FF5722",
                color: "white",
                fontWeight: 600,
                borderRadius: "50px",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#E64A19",
                },
                "&:disabled": {
                  bgcolor: "#CCC",
                },
              }}
            >
              {isLoading ? "登録中..." : "アカウントを作成"}
            </Button>
          </Box>

          <Typography
            variant="body2"
            sx={{ color: "#666", textAlign: "center", mt: 3 }}
          >
            すでにアカウントをお持ちですか？{" "}
            <Link
              href="/login"
              style={{ color: "#FF5722", fontWeight: 500, textDecoration: "none" }}
            >
              ログイン
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
