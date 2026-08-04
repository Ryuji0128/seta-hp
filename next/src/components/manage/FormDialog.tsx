"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface Props {
  open: boolean;
  title: string;
  submitLabel: string;
  submitDisabled?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
}

/** 管理画面共通の作成/編集フォームダイアログ（フィールドは children で渡す） */
export default function FormDialog({
  open,
  title,
  submitLabel,
  submitDisabled = false,
  onClose,
  onSubmit,
  children,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>{children}</Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose}>キャンセル</Button>
        <Button variant="contained" onClick={onSubmit} disabled={submitDisabled}>
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
