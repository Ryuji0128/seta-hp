import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface ResourceActionsProps {
  primaryLabel: string;
  onPrimary: () => void;
  onDelete?: () => void;
  mode?: "button" | "icon";
}

/** 管理テーブルの編集（または詳細）・削除操作。 */
export default function ResourceActions({
  primaryLabel,
  onPrimary,
  onDelete,
  mode = "button",
}: ResourceActionsProps) {
  if (mode === "icon") {
    return (
      <>
        <IconButton size="small" onClick={onPrimary} color="primary" aria-label={primaryLabel}>
          <EditIcon fontSize="small" />
        </IconButton>
        {onDelete && (
          <IconButton size="small" onClick={onDelete} color="error" aria-label="削除">
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </>
    );
  }

  return (
    <>
      <Button variant="outlined" size="small" onClick={onPrimary} sx={{ m: "2px" }}>
        {primaryLabel}
      </Button>
      {onDelete && (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={onDelete}
          sx={{ m: "2px" }}
        >
          削除
        </Button>
      )}
    </>
  );
}
