"use client";

import { useState, useRef } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export default function MultiImageUpload({
  value,
  onChange,
  maxImages = 10,
  disabled,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setUploading(true);

    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        if (value.length + newUrls.length >= maxImages) {
          setError(`最大${maxImages}枚までアップロードできます`);
          break;
        }

        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (res.ok) {
          newUrls.push(data.url);
        } else {
          setError(data.error || `${file.name}のアップロードに失敗しました`);
          break;
        }
      }

      if (newUrls.length > 0) {
        onChange([...value, ...newUrls]);
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

  const handleRemove = (index: number) => {
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...value];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    onChange(newImages);
  };

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple
        onChange={handleFileSelect}
        style={{ display: "none" }}
        disabled={disabled || uploading}
      />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {value.map((url, index) => (
          <Box
            key={index}
            sx={{
              position: "relative",
              width: 120,
              height: 120,
              borderRadius: 1,
              overflow: "hidden",
              border: index === 0 ? "2px solid" : "1px solid",
              borderColor: index === 0 ? "primary.main" : "grey.300",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`画像 ${index + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
              onClick={() => handleMoveUp(index)}
            />
            {index === 0 && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  bgcolor: "primary.main",
                  color: "white",
                  fontSize: "10px",
                  textAlign: "center",
                  py: 0.25,
                }}
              >
                メイン
              </Box>
            )}
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                top: 2,
                right: 2,
                bgcolor: "rgba(255,255,255,0.9)",
                p: 0.5,
                "&:hover": { bgcolor: "rgba(255,255,255,1)" },
              }}
              onClick={() => handleRemove(index)}
              disabled={disabled}
            >
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          </Box>
        ))}

        {value.length < maxImages && (
          <Button
            variant="outlined"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
            sx={{
              width: 120,
              height: 120,
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              borderStyle: "dashed",
            }}
          >
            {uploading ? (
              <CircularProgress size={24} />
            ) : (
              <>
                <AddPhotoAlternateIcon />
                <Typography variant="caption">追加</Typography>
              </>
            )}
          </Button>
        )}
      </Box>

      {error && (
        <Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
          {error}
        </Typography>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
        JPG, PNG, GIF, WebP (最大5MB) - {value.length}/{maxImages}枚
        {value.length > 1 && " - クリックで順番変更"}
      </Typography>
    </Box>
  );
}
