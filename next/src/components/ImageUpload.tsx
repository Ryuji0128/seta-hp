"use client";

import { useState, useRef } from "react";
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

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        onChange(data.url);
      } else {
        setError(data.error || "アップロードに失敗しました");
      }
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        disabled={disabled || uploading}
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
            disabled={disabled}
          >
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Box>
      ) : (
        <Button
          variant="outlined"
          startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
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
        JPG, PNG, GIF, WebP (最大5MB)
      </Typography>
    </Box>
  );
}
