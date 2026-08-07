"use client";

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import {
  IMAGE_ACCEPT,
  IMAGE_UPLOAD_HINT,
  useImageUpload,
} from "@/lib/hooks/useImageUpload";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const { error, uploading, fileInputRef, handleFileSelect, openFileDialog } = useImageUpload({
    currentCount: 0,
    maxFiles: 1,
    onUploaded: ([url]) => onChange(url),
  });

  const handleRemove = () => {
    onChange("");
  };

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        onChange={handleFileSelect}
        style={{ display: "none" }}
        disabled={uploading}
      />

      {value ? (
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Box
            sx={{
              width: 200,
              height: 150,
              position: "relative",
              borderRadius: 1,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "grey.300",
            }}
          >
            <Image
              src={value}
              alt="アップロード画像"
              fill
              unoptimized
              style={{ objectFit: "cover" }}
            />
          </Box>
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              bgcolor: "rgba(255,255,255,0.9)",
              "&:hover": { bgcolor: "rgba(255,255,255,1)" },
            }}
            onClick={handleRemove}
          >
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Box>
      ) : (
        <Button
          variant="outlined"
          startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          onClick={openFileDialog}
          disabled={uploading}
          sx={{ height: 100, width: 200 }}
        >
          {uploading ? "アップロード中..." : "画像を選択"}
        </Button>
      )}

      {error && (
        <Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
          {error}
        </Typography>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
        {IMAGE_UPLOAD_HINT}
      </Typography>
    </Box>
  );
}
