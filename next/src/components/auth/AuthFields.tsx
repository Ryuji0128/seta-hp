import type { ChangeEventHandler } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface AuthEmailFieldProps {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export function AuthEmailField({ value, onChange }: AuthEmailFieldProps) {
  return (
    <TextField
      fullWidth
      label="メールアドレス"
      type="email"
      value={value}
      onChange={onChange}
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
  );
}

interface AuthPasswordFieldProps {
  label?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  visible: boolean;
  onToggleVisibility?: () => void;
  helperText?: string;
  marginBottom?: number;
}

export function AuthPasswordField({
  label = "パスワード",
  value,
  onChange,
  visible,
  onToggleVisibility,
  helperText,
  marginBottom = 2,
}: AuthPasswordFieldProps) {
  return (
    <TextField
      fullWidth
      label={label}
      type={visible ? "text" : "password"}
      value={value}
      onChange={onChange}
      required
      helperText={helperText}
      sx={{ mb: marginBottom }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlinedIcon sx={{ color: "#999" }} />
            </InputAdornment>
          ),
          ...(onToggleVisibility
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={onToggleVisibility} edge="end" aria-label="パスワード表示を切り替える">
                      {visible ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            : {}),
        },
      }}
    />
  );
}
