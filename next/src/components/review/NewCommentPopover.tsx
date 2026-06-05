import { Box, Button, Popover, Stack, TextField, Typography } from "@mui/material";
import { type RefObject } from "react";
import { Z_OVERLAY, Z_PIN } from "./types";

interface PendingPin {
  xRatio: number;
  yAbsolute: number;
  elementSelector: string;
}

interface NewCommentPopoverProps {
  pendingPin: PendingPin;
  authorName: string;
  draftContent: string;
  draftAnchorRef: RefObject<HTMLDivElement | null>;
  onDraftContentChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function NewCommentPopover({
  pendingPin,
  authorName,
  draftContent,
  draftAnchorRef,
  onDraftContentChange,
  onSubmit,
  onCancel,
}: NewCommentPopoverProps) {
  return (
    <>
      <Box
        ref={draftAnchorRef}
        data-review-ui="true"
        sx={{
          position: "absolute",
          top: pendingPin.yAbsolute,
          left: `${pendingPin.xRatio * 100}%`,
          width: 0,
          height: 0,
          zIndex: Z_PIN,
        }}
      />
      <Popover
        open
        anchorEl={draftAnchorRef.current}
        onClose={onCancel}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        PaperProps={{ "data-review-ui": "true", sx: { zIndex: Z_OVERLAY + 10 } } as Record<string, unknown>}
      >
        <Box sx={{ width: 320, p: 2 }}>
          <Typography variant="caption" color="text.secondary">
            投稿者: {authorName || "(未設定)"}
          </Typography>
          <TextField
            size="small"
            fullWidth
            multiline
            minRows={3}
            maxRows={8}
            placeholder="気になる点を入力…"
            value={draftContent}
            onChange={(e) => onDraftContentChange(e.target.value)}
            autoFocus
            sx={{ mt: 1 }}
          />
          <Stack direction="row" spacing={1} sx={{ mt: 1.5, justifyContent: "flex-end" }}>
            <Button size="small" onClick={onCancel}>
              キャンセル
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={onSubmit}
              disabled={!draftContent.trim() || !authorName}
            >
              投稿
            </Button>
          </Stack>
        </Box>
      </Popover>
    </>
  );
}
