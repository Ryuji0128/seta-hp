import { Box, Tooltip, Typography } from "@mui/material";
import { type ReviewComment, Z_PIN } from "./types";

interface PinMarkerProps {
  comment: ReviewComment;
  index: number;
  onOpen: () => void;
  registerAnchor: (el: HTMLButtonElement | null) => void;
}

export default function PinMarker({ comment, index, onOpen, registerAnchor }: PinMarkerProps) {
  const isResolved = comment.status === "resolved";
  return (
    <Box
      data-review-ui="true"
      sx={{
        position: "absolute",
        top: comment.yAbsolute,
        left: `${comment.xRatio * 100}%`,
        zIndex: Z_PIN,
        transform: "translate(-50%, -100%)",
        pointerEvents: "auto",
      }}
    >
      <Tooltip
        title={
          <Box sx={{ maxWidth: 220 }}>
            <Typography variant="caption" sx={{ display: "block", opacity: 0.8 }}>
              {comment.authorName}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                whiteSpace: "pre-wrap",
              }}
            >
              {comment.content}
            </Typography>
          </Box>
        }
        arrow
      >
        <Box
          component="button"
          ref={registerAnchor}
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: "14px 14px 14px 2px",
            border: "2px solid #fff",
            backgroundColor: isResolved ? "success.main" : "warning.main",
            color: "#fff",
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            opacity: isResolved ? 0.7 : 1,
            transition: "transform 120ms ease",
            "&:hover": { transform: "scale(1.1)" },
          }}
          aria-label={`コメント #${index} を開く`}
        >
          {index}
        </Box>
      </Tooltip>
    </Box>
  );
}
