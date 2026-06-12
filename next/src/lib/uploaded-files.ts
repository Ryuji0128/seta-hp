import type { PrismaClient } from "@prisma/client";
import { unlink } from "fs/promises";
import path from "path";
import { normalizeImageUrl } from "@/lib/images";

type ImageRecord = {
  image?: string | null;
  images?: unknown;
};

const UPLOAD_PATH_PREFIX = "/uploads/";

function getUploadFileName(value: string | null | undefined): string | null {
  const normalized = normalizeImageUrl(value);
  if (!normalized) return null;

  let pathname: string;
  try {
    pathname = new URL(normalized, "http://localhost").pathname;
  } catch {
    return null;
  }

  if (!pathname.startsWith(UPLOAD_PATH_PREFIX)) return null;

  const fileName = decodeURIComponent(pathname.slice(UPLOAD_PATH_PREFIX.length));
  if (!fileName || fileName.includes("/") || fileName.includes("\\") || fileName === "." || fileName === "..") {
    return null;
  }

  return fileName;
}

function getUploadUrl(value: string | null | undefined): string | null {
  const fileName = getUploadFileName(value);
  return fileName ? `${UPLOAD_PATH_PREFIX}${fileName}` : null;
}

function getUploadFilePath(value: string): string | null {
  const fileName = getUploadFileName(value);
  if (!fileName) return null;

  const uploadDir = path.resolve(process.cwd(), "public", "uploads");
  const filePath = path.resolve(uploadDir, fileName);
  if (!filePath.startsWith(`${uploadDir}${path.sep}`)) return null;

  return filePath;
}

export function collectImageUrls(record: ImageRecord): string[] {
  const urls = new Set<string>();

  if (record.image) urls.add(record.image);

  if (Array.isArray(record.images)) {
    for (const image of record.images) {
      if (typeof image === "string") urls.add(image);
    }
  }

  return [...urls];
}

async function getReferencedUploadUrls(prisma: PrismaClient): Promise<Set<string>> {
  const [products, works] = await Promise.all([
    prisma.product.findMany({ select: { image: true, images: true } }),
    prisma.work.findMany({ select: { image: true } }),
  ]);

  const referenced = new Set<string>();
  for (const record of [...products, ...works]) {
    for (const image of collectImageUrls(record)) {
      const uploadUrl = getUploadUrl(image);
      if (uploadUrl) referenced.add(uploadUrl);
    }
  }

  return referenced;
}

export async function deleteUnusedUploadedFiles(prisma: PrismaClient, urls: string[]): Promise<void> {
  const candidates = new Set<string>();
  for (const url of urls) {
    const uploadUrl = getUploadUrl(url);
    if (uploadUrl) candidates.add(uploadUrl);
  }

  if (candidates.size === 0) return;

  const referenced = await getReferencedUploadUrls(prisma);
  await Promise.all(
    [...candidates]
      .filter((url) => !referenced.has(url))
      .map(async (url) => {
        const filePath = getUploadFilePath(url);
        if (!filePath) return;

        try {
          await unlink(filePath);
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
            console.error("Failed to delete uploaded file:", filePath, error);
          }
        }
      }),
  );
}
