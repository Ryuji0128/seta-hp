import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

interface NameDialogProps {
  open: boolean;
  nameDraft: string;
  onClose: () => void;
  onNameDraftChange: (value: string) => void;
  onConfirm: () => void;
}

export default function NameDialog({
  open,
  nameDraft,
  onClose,
  onNameDraftChange,
  onConfirm,
}: NameDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ "data-review-ui": "true" } as Record<string, unknown>}
    >
      <DialogTitle>お名前を入力してください</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          この端末に保存されます(社内レビュー用)。
        </Typography>
        <TextField
          autoFocus
          fullWidth
          size="small"
          placeholder="例: 山田"
          value={nameDraft}
          onChange={(e) => onNameDraftChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
              e.preventDefault();
              onConfirm();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={onConfirm} variant="contained" disabled={!nameDraft.trim()}>
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
}
