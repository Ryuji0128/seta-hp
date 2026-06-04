import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RestoreIcon from "@mui/icons-material/Restore";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { type ReviewComment, Z_OVERLAY, formatDate } from "./types";

interface CommentPopoverProps {
  comment: ReviewComment;
  anchorEl: HTMLElement;
  replyDraft: string;
  authorName: string;
  onClose: () => void;
  onReplyDraftChange: (value: string) => void;
  onSubmitReply: (commentId: number) => void;
  onToggleStatus: (comment: ReviewComment) => void;
  onDelete: (id: number) => void;
  onDeleteReply: (commentId: number, replyId: number) => void;
}

export default function CommentPopover({
  comment: c,
  anchorEl,
  replyDraft,
  authorName,
  onClose,
  onReplyDraftChange,
  onSubmitReply,
  onToggleStatus,
  onDelete,
  onDeleteReply,
}: CommentPopoverProps) {
  return (
    <Popover
      open
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      PaperProps={{ "data-review-ui": "true", sx: { zIndex: Z_OVERLAY + 10 } } as Record<string, unknown>}
    >
      <Box sx={{ width: 340, p: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Chip
            size="small"
            label={c.status === "open" ? "未対応" : "解決済み"}
            color={c.status === "open" ? "warning" : "success"}
          />
          <Typography variant="caption" color="text.secondary">
            {c.authorName} ・ {formatDate(c.createdAt)}
          </Typography>
        </Stack>
        <Typography
          variant="body2"
          sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", mb: 1.5 }}
        >
          {c.content}
        </Typography>

        {c.replies.length > 0 && (
          <Stack spacing={1} sx={{ mb: 1.5 }}>
            <Divider />
            {c.replies.map((r) => (
              <Box key={r.id} sx={{ pl: 1, borderLeft: "2px solid", borderColor: "divider" }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    {r.authorName} ・ {formatDate(r.createdAt)}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => onDeleteReply(c.id, r.id)}
                    aria-label="返信を削除"
                    sx={{ ml: "auto" }}
                  >
                    <DeleteOutlineIcon fontSize="inherit" />
                  </IconButton>
                </Stack>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {r.content}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}

        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <TextField
            size="small"
            fullWidth
            multiline
            maxRows={4}
            placeholder={authorName ? "返信を書く…" : "先に名前を設定してください"}
            value={replyDraft}
            onChange={(e) => onReplyDraftChange(e.target.value)}
            disabled={!authorName}
          />
          <IconButton
            color="primary"
            onClick={() => onSubmitReply(c.id)}
            disabled={!replyDraft.trim() || !authorName}
            aria-label="返信送信"
          >
            <SendIcon />
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button
            size="small"
            startIcon={c.status === "open" ? <CheckCircleIcon /> : <RestoreIcon />}
            onClick={() => onToggleStatus(c)}
            variant="outlined"
          >
            {c.status === "open" ? "解決" : "再オープン"}
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => onDelete(c.id)}
          >
            削除
          </Button>
        </Stack>
      </Box>
    </Popover>
  );
}
