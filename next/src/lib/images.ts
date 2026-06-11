const SAME_SITE_IMAGE_HOSTS = new Set([
  "kaza-love.com",
  "www.kaza-love.com",
  "setaseisakusyo.com",
  "www.setaseisakusyo.com",
]);

export function normalizeImageUrl(value: string | null | undefined): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("/")) return trimmed;
  if (trimmed.startsWith("uploads/")) return `/${trimmed}`;

  try {
    const url = new URL(trimmed);
    if (SAME_SITE_IMAGE_HOSTS.has(url.hostname)) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
    return trimmed;
  } catch {
    return trimmed;
  }
}
