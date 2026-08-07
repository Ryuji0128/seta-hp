interface Reply {
  id: number;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface ReviewComment {
  id: number;
  xRatio: number;
  yAbsolute: number;
  authorName: string;
  content: string;
  status: "open" | "resolved";
  createdAt: string;
  replies: Reply[];
}

const NAME_STORAGE_KEY = "seta-hp-review-overlay-name";
export const Z_OVERLAY = 1400;
export const Z_PIN = 1399;

export function readStoredName(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(NAME_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function writeStoredName(value: string) {
  try {
    window.localStorage.setItem(NAME_STORAGE_KEY, value);
  } catch {
    /* localStorage 不可環境では無視 */
  }
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${m}/${day} ${hh}:${mm}`;
}
