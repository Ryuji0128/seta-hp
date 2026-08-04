"use client";

import { Button, Divider, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";

interface Props {
  label: string;
}

/** Googleサインインボタン + 「または」区切り（ログイン/新規登録で共用） */
export default function GoogleSignInButton({ label }: Props) {
  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<GoogleIcon />}
        onClick={() => signIn("google", { callbackUrl: "/" })}
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
        {label}
      </Button>

      <Divider sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ color: "#999", px: 2 }}>
          または
        </Typography>
      </Divider>
    </>
  );
}
