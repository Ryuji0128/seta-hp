export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;
export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

const MAX_IMAGE_SIZE_MB = 5;
export const MAX_IMAGE_SIZE = MAX_IMAGE_SIZE_MB * 1024 * 1024;
export const IMAGE_ACCEPT = ALLOWED_IMAGE_TYPES.join(",");
export const IMAGE_UPLOAD_HINT =
  "JPG, PNG, GIF, WebP (最大" + MAX_IMAGE_SIZE_MB + "MB)";
