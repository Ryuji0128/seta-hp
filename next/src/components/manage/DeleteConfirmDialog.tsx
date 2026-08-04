"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface Props {
  open: boolean;
  title: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
}

/** 管理画面共通の削除確認ダイアログ */
export default function DeleteConfirmDialog({
  open,
  title,
  message = "本当に削除してよろしいですか？",
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
          削除
        </Button>
      </DialogActions>
    </Dialog>
  );
}
