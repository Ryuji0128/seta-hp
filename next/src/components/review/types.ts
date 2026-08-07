interface Reply {
  id: number;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface ReviewComment {
  id: number;
  pageUrl: string;
  xRatio: number;
  yAbsolute: number;
  elementSelector: string | null;
  authorName: string;
  content: string;
  status: "open" | "resolved";
  createdAt: string;
  updatedAt: string;
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

export function describeElement(el: Element | null): string {
  if (!el || !(el instanceof HTMLElement)) return "";
  const parts: string[] = [];
  let current: Element | null = el;
  let depth = 0;
  while (current && depth < 4) {
    const tag = current.tagName.toLowerCase();
    const id = current.id ? `#${current.id}` : "";
    const cls =
      typeof current.className === "string" && current.className.trim()
        ? "." +
          current.className
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .join(".")
        : "";
    parts.unshift(`${tag}${id}${cls}`);
    if (current.id) break;
    current = current.parentElement;
    depth += 1;
  }
  return parts.join(" > ").slice(0, 500);
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
