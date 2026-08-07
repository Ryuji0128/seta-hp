"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { uploadImage } from "@/lib/api-client";

export const IMAGE_ACCEPT = "image/jpeg,image/png,image/gif,image/webp";
export const IMAGE_UPLOAD_HINT = "JPG, PNG, GIF, WebP (最大5MB)";

interface UseImageUploadOptions {
  currentCount: number;
  maxFiles: number;
  onUploaded: (urls: string[]) => void;
}

/** 単一・複数画像アップロードで共通のinput状態とアップロード処理を管理する。 */
export function useImageUpload({
  currentCount,
  maxFiles,
  onUploaded,
}: UseImageUploadOptions) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length === 0) return;

    const remaining = Math.max(0, maxFiles - currentCount);
    if (remaining === 0) {
      setError(`最大${maxFiles}枚までアップロードできます`);
      event.target.value = "";
      return;
    }

    setUploading(true);
    setError(null);

    const uploadedUrls: string[] = [];
    let nextError =
      selectedFiles.length > remaining
        ? `最大${maxFiles}枚までアップロードできます`
        : null;

    try {
      for (const file of selectedFiles.slice(0, remaining)) {
        try {
          uploadedUrls.push(await uploadImage(file));
        } catch (uploadError) {
          nextError =
            uploadError instanceof Error
              ? uploadError.message
              : `${file.name}のアップロードに失敗しました`;
          break;
        }
      }

      if (uploadedUrls.length > 0) {
        onUploaded(uploadedUrls);
      }
      setError(nextError);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return {
    error,
    uploading,
    fileInputRef,
    handleFileSelect,
    openFileDialog: () => fileInputRef.current?.click(),
  };
}
