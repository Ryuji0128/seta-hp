import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ListAltIcon from "@mui/icons-material/ListAlt";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { Box, Chip, Fab, IconButton, Paper, Stack, Tooltip } from "@mui/material";
import { Z_OVERLAY } from "./types";

interface ToolbarFabProps {
  pinning: boolean;
  authorName: string;
  openCount: number;
  onTogglePinning: () => void;
  onOpenDrawer: () => void;
  onOpenNameDialog: () => void;
}

export default function ToolbarFab({
  pinning,
  authorName,
  openCount,
  onTogglePinning,
  onOpenDrawer,
  onOpenNameDialog,
}: ToolbarFabProps) {
  return (
    <Box
      data-review-ui="true"
      sx={{
        position: "fixed",
        left: { xs: 16, md: 24 },
        bottom: { xs: 16, md: 24 },
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
        alignItems: "flex-start",
        zIndex: Z_OVERLAY,
      }}
    >
      {pinning && (
        <Paper
          elevation={3}
          sx={{
            px: 1.5,
            py: 0.75,
            backgroundColor: "warning.light",
            color: "warning.contrastText",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          ページ内をクリックしてピンを立ててください
        </Paper>
      )}
      <Stack direction="row" spacing={1.25} alignItems="center">
        <Tooltip title={pinning ? "コメントモードを終了" : "コメントを追加"}>
          <Fab
            size="medium"
            color={pinning ? "warning" : "secondary"}
            onClick={onTogglePinning}
            aria-label="レビューコメントを追加"
          >
            {pinning ? <CloseIcon /> : <RateReviewIcon />}
          </Fab>
        </Tooltip>
        <Tooltip title="コメント一覧を開く">
          <Fab
            size="small"
            onClick={onOpenDrawer}
            aria-label="コメント一覧"
            sx={{ position: "relative" }}
          >
            <ListAltIcon />
            {openCount > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  minWidth: 18,
                  height: 18,
                  px: 0.5,
                  borderRadius: "9px",
                  backgroundColor: "error.main",
                  color: "#fff",
                  fontSize: 11,
                  lineHeight: "18px",
                  textAlign: "center",
                  fontWeight: 700,
                }}
              >
                {openCount}
              </Box>
            )}
          </Fab>
        </Tooltip>
        <Tooltip title="名前を変更">
          <IconButton
            size="small"
            onClick={onOpenNameDialog}
            aria-label="名前変更"
            sx={{
              bgcolor: "background.paper",
              boxShadow: 1,
              "&:hover": { bgcolor: "background.paper" },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        {authorName && (
          <Chip
            size="small"
            label={authorName}
            sx={{ bgcolor: "background.paper", boxShadow: 1 }}
          />
        )}
      </Stack>
    </Box>
  );
}
