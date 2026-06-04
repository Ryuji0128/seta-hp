import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Chip,
  Divider,
  Drawer,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { type ReviewComment, formatDate } from "./types";

interface CommentsDrawerProps {
  open: boolean;
  pathname: string;
  comments: ReviewComment[];
  visibleComments: ReviewComment[];
  openCount: number;
  showResolved: boolean;
  onClose: () => void;
  onShowResolvedChange: (value: boolean) => void;
  onCommentClick: (comment: ReviewComment) => void;
}

export default function CommentsDrawer({
  open,
  pathname,
  comments,
  visibleComments,
  openCount,
  showResolved,
  onClose,
  onShowResolvedChange,
  onCommentClick,
}: CommentsDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ "data-review-ui": "true", sx: { width: { xs: "90vw", sm: 400 } } } as Record<string, unknown>}
    >
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
        <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ flex: 1 }}>
            レビューコメント
          </Typography>
          <IconButton onClick={onClose} aria-label="閉じる">
            <CloseIcon />
          </IconButton>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {pathname} の {comments.length} 件(未対応 {openCount})
        </Typography>
        <FormControlLabel
          sx={{ mt: 1 }}
          control={
            <Switch
              size="small"
              checked={showResolved}
              onChange={(e) => onShowResolvedChange(e.target.checked)}
            />
          }
          label="解決済みも表示"
        />
        <Divider sx={{ my: 1 }} />
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {visibleComments.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              コメントはまだありません
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {visibleComments.map((c, idx) => (
                <Paper
                  key={c.id}
                  variant="outlined"
                  sx={{ p: 1.5, cursor: "pointer" }}
                  onClick={() => onCommentClick(c)}
                >
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    <Chip size="small" label={`#${idx + 1}`} sx={{ height: 20 }} />
                    <Chip
                      size="small"
                      label={c.status === "open" ? "未対応" : "解決済み"}
                      color={c.status === "open" ? "warning" : "success"}
                      sx={{ height: 20 }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
                      {formatDate(c.createdAt)}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {c.authorName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      mt: 0.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {c.content}
                  </Typography>
                  {c.replies.length > 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                      返信 {c.replies.length} 件
                    </Typography>
                  )}
                </Paper>
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
