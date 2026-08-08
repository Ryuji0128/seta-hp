import {
  ALLOWED_IMAGE_TYPES,
  type AllowedImageType,
} from "@/lib/image-upload-constants";

export { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/image-upload-constants";

/**
 * ファイルのマジックナンバー（先頭バイト列）によるMIMEタイプ検証
 */
export function getActualMimeType(buffer: Buffer): string | null {
  const signatures: { mime: string; bytes: number[] }[] = [
    { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
    { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
    { mime: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38] },
    { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] },
  ];

  for (const sig of signatures) {
    if (buffer.length >= sig.bytes.length) {
      const match = sig.bytes.every((byte, index) => buffer[index] === byte);
      if (match) {
        if (sig.mime === "image/webp") {
          if (buffer.length >= 12 && buffer.toString("ascii", 8, 12) === "WEBP") {
            return sig.mime;
          }
          continue;
        }
        return sig.mime;
      }
    }
  }
  return null;
}

export function isAllowedImageType(mimeType: string): mimeType is AllowedImageType {
  return (ALLOWED_IMAGE_TYPES as readonly string[]).includes(mimeType);
}
const MIME_TO_EXT: Record<AllowedImageType, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
};

export function getExtensionFromMimeType(mimeType: AllowedImageType): string {
  return MIME_TO_EXT[mimeType];
}
