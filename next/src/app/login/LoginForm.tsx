"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import Link from "next/link";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";

// Google認証が有効かどうか
const isGoogleEnabled = !!process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED;

export default function LoginForm() {
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

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
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
        ログイン
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "#666", textAlign: "center", mb: 4 }}
      >
        アカウントにログインしてください
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
            Googleでログイン
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
          {isLoading ? "ログイン中..." : "ログイン"}
        </Button>
      </Box>

      <Typography
        variant="body2"
        sx={{ color: "#666", textAlign: "center", mt: 3 }}
      >
        アカウントをお持ちでないですか？{" "}
        <Link
          href="/register"
          style={{ color: "#FF5722", fontWeight: 500, textDecoration: "none" }}
        >
          新規登録
        </Link>
      </Typography>
    </Box>
  );
}
