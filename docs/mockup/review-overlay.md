# Review Overlay 機能 移植ガイド

ページ内に「ピン」を立てて社内レビュー（気になる点・指摘）を残せる機能の、別プロジェクトへの移植手順を 1 枚にまとめたものです。
このファイルと既存の HTML/Next.js プロジェクトを Claude Code（または開発者）に渡せば、コピペベースで実装できます。

---

## 1. この機能でできること

- **左下の💬ボタン**でコメントモードを ON → ページ内任意箇所をクリック → ピンを立てて本文入力
- ピンは座標保存。リロード・別端末からも同じ場所に表示される
- ピンクリックで吹き出しが開き、**返信 / 解決済みトグル / 削除**が可能
- **右からスライドするドロワー**で全コメント一覧（解決済みフィルタ、未対応件数バッジ付き）
- **名前**は localStorage に保存（初回入力 / 後から変更可、認証は無し）
- **環境変数 `NEXT_PUBLIC_ENABLE_COMMENTS=true` の時だけ**有効。本番では UI も API も完全に消える（API は 404）

---

## 2. 前提スタック

このドキュメントは以下の構成を前提にしています。違う場合は読み替えが必要です。

| 項目 | バージョン目安 | 必須 |
| --- | --- | --- |
| Next.js (App Router) | 14 / 15 系 | 必須（`app/` directory、`route.ts` 形式） |
| React | 18 / 19 | 必須 |
| TypeScript | 5+ | 必須（JS でも書けますが本ガイドは TS 前提） |
| Prisma + DB（MySQL / PostgreSQL / SQLite いずれも可） | Prisma 5 / 6 系 | 必須（モデルとマイグレーション） |
| MUI (`@mui/material` + `@mui/icons-material`) | v5 / v6 | 必須（オーバーレイ UI 全部 MUI） |
| `xss` (npm) | 1.x | サニタイズ用、必須 |

> MUI を使っていないプロジェクトの場合は、本文末尾の「カスタマイズ・置き換え」を参照。

---

## 3. インストール

```bash
npm install xss
# 既に入っていなければ
npm install @prisma/client @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install -D prisma
```

---

## 4. 環境変数

`.env`（または開発用の compose / docker / .env.local）に追加:

```bash
NEXT_PUBLIC_ENABLE_COMMENTS=true
```

**本番環境では設定しないこと。** 未設定だと API が 404 を返し、UI も非マウントになる。

> Docker Compose を使う場合の例（開発のみ有効化）:
> ```yaml
> # docker-compose.override.yml
> services:
>   next:
>     environment:
>       NEXT_PUBLIC_ENABLE_COMMENTS: "true"
> ```

---

## 5. ファイル一覧

実装で追加するのは以下の 6 ファイル + 既存ファイル 1 箇所への追記です。

```
prisma/
  schema.prisma                              ← モデル追加
src/
  app/
    layout.tsx                               ← 1 行マウント
    api/
      review-comments/
        route.ts                             ← 新規 (GET, POST)
        [id]/
          route.ts                           ← 新規 (PATCH, DELETE)
          replies/
            route.ts                         ← 新規 (POST, DELETE)
  components/
    ReviewOverlay.tsx                        ← 新規 (UI 本体)
  lib/
    db.ts                                    ← 既存なら不要
    rateLimit.ts                             ← 既存なら不要
    reviewCommentsGuard.ts                   ← 新規
```

---

## 6. DB スキーマ (Prisma)

`prisma/schema.prisma` に追加。`@db.Text` は MySQL/PostgreSQL での long text 指定なので、SQLite を使う場合は外す。

```prisma
model ReviewComment {
  id              Int                  @id @default(autoincrement())
  createdAt       DateTime             @default(now())
  updatedAt       DateTime             @updatedAt
  pageUrl         String               // 例: /, /vision, /products
  xRatio          Float                // ビューポート幅基準の比率 0.0–1.0
  yAbsolute       Float                // ページ上端からの絶対 px
  elementSelector String?              @db.Text
  authorName      String
  content         String               @db.Text
  status          String               @default("open") // "open" | "resolved"
  replies         ReviewCommentReply[]

  @@index([pageUrl])
}

model ReviewCommentReply {
  id         Int           @id @default(autoincrement())
  createdAt  DateTime      @default(now())
  commentId  Int
  comment    ReviewComment @relation(fields: [commentId], references: [id], onDelete: Cascade)
  authorName String
  content    String        @db.Text

  @@index([commentId])
}
```

適用:

```bash
npx prisma generate
npx prisma db push        # 開発時の手早い反映
# 本番運用するなら: npx prisma migrate dev --name add-review-comments
```

---

## 7. 共通 lib

### 7.1 `src/lib/db.ts`（既存なら不要）

```ts
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;

export const getPrismaClient = () => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};
```

### 7.2 `src/lib/rateLimit.ts`（既存なら不要）

現行実装では共通のDBストアを既定で使うレート制限。必要に応じて `RATE_LIMIT_STORE=memory` に切り替え可能。

```ts
import { NextRequest } from "next/server";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitOptions {
  windowMs?: number;
  max?: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function getClientIp(req: NextRequest): string {
  const cfIp = req.headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp;
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const hops = forwardedFor.split(",").map((v) => v.trim()).filter(Boolean);
    if (hops.length > 0) return hops[0];
  }
  return "unknown";
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) rateLimitMap.delete(key);
  }
}, 60_000);

export function isRateLimited(
  req: NextRequest,
  options: RateLimitOptions = {}
): boolean {
  const { windowMs = 60_000, max = 5 } = options;
  const ip = getClientIp(req);
  const key = `${ip}:${req.nextUrl.pathname}`;
  const now = Date.now();

  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }

  entry.count += 1;
  return entry.count > max;
}
```

### 7.3 `src/lib/reviewCommentsGuard.ts`（新規）

API 全エンドポイントの先頭で呼ぶ env ガード。**これが入っていないと本番で API が剥き出しになる。**

```ts
/**
 * 社内レビューコメント API の有効化ガード
 *
 * UI 側 (layout.tsx) と同じ NEXT_PUBLIC_ENABLE_COMMENTS フラグで API も完全に閉じる。
 * 本番デプロイ時は環境変数を設定しないことで、エンドポイント自体が 404 を返す。
 */

import { NextResponse } from "next/server";

export function reviewCommentsDisabledResponse(): NextResponse | null {
  if (process.env.NEXT_PUBLIC_ENABLE_COMMENTS !== "true") {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  return null;
}
```

---

## 8. API ルート

### 8.1 `src/app/api/review-comments/route.ts`

```ts
/**
 * 社内レビュー用ページ内コメント API
 *
 * GET  /api/review-comments?page=/vision   … 当該ページのコメント＋返信を返す
 * POST /api/review-comments                … 新規コメント作成
 */

import { getPrismaClient } from "@/lib/db";
import { isRateLimited } from "@/lib/rateLimit";
import { reviewCommentsDisabledResponse } from "@/lib/reviewCommentsGuard";
import { NextRequest, NextResponse } from "next/server";
import xss from "xss";

const prisma = getPrismaClient();

const MAX_CONTENT = 2000;
const MAX_NAME = 80;
const MAX_SELECTOR = 500;

function clean(value: unknown, max: number): string {
  return xss(String(value ?? "")).trim().slice(0, max);
}

export async function GET(req: NextRequest) {
  const disabled = reviewCommentsDisabledResponse();
  if (disabled) return disabled;

  const page = req.nextUrl.searchParams.get("page");
  if (!page) {
    return NextResponse.json({ error: "page is required" }, { status: 400 });
  }

  try {
    const comments = await prisma.reviewComment.findMany({
      where: { pageUrl: page },
      orderBy: { createdAt: "asc" },
      include: { replies: { orderBy: { createdAt: "asc" } } },
    });
    return NextResponse.json({ comments });
  } catch (error) {
    console.error("レビューコメント取得エラー:", error);
    return NextResponse.json({ error: "取得に失敗しました" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const disabled = reviewCommentsDisabledResponse();
  if (disabled) return disabled;

  if (isRateLimited(req, { windowMs: 60_000, max: 30 })) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const pageUrl = clean(body.pageUrl, 500);
    const authorName = clean(body.authorName, MAX_NAME);
    const content = clean(body.content, MAX_CONTENT);
    const elementSelector = body.elementSelector
      ? clean(body.elementSelector, MAX_SELECTOR)
      : null;
    const xRatio = Number(body.xRatio);
    const yAbsolute = Number(body.yAbsolute);

    if (!pageUrl || !authorName || !content) {
      return NextResponse.json(
        { error: "pageUrl / authorName / content は必須です" },
        { status: 400 }
      );
    }
    if (
      !Number.isFinite(xRatio) ||
      !Number.isFinite(yAbsolute) ||
      xRatio < 0 ||
      xRatio > 1 ||
      yAbsolute < 0
    ) {
      return NextResponse.json({ error: "座標が不正です" }, { status: 400 });
    }

    const created = await prisma.reviewComment.create({
      data: {
        pageUrl,
        authorName,
        content,
        elementSelector,
        xRatio,
        yAbsolute,
      },
      include: { replies: true },
    });

    return NextResponse.json({ comment: created }, { status: 201 });
  } catch (error) {
    console.error("レビューコメント作成エラー:", error);
    return NextResponse.json({ error: "作成に失敗しました" }, { status: 500 });
  }
}
```

### 8.2 `src/app/api/review-comments/[id]/route.ts`

```ts
/**
 * レビューコメント個別操作 API
 *
 * PATCH  /api/review-comments/:id  … status の切替（open <-> resolved）
 * DELETE /api/review-comments/:id  … 削除（社内利用なので誰でも可）
 */

import { getPrismaClient } from "@/lib/db";
import { isRateLimited } from "@/lib/rateLimit";
import { reviewCommentsDisabledResponse } from "@/lib/reviewCommentsGuard";
import { NextRequest, NextResponse } from "next/server";

const prisma = getPrismaClient();

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const disabled = reviewCommentsDisabledResponse();
  if (disabled) return disabled;

  if (isRateLimited(req, { windowMs: 60_000, max: 60 })) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) return NextResponse.json({ error: "invalid id" }, { status: 400 });

  try {
    const body = await req.json();
    const status = body.status === "resolved" ? "resolved" : "open";

    const updated = await prisma.reviewComment.update({
      where: { id },
      data: { status },
      include: { replies: { orderBy: { createdAt: "asc" } } },
    });
    return NextResponse.json({ comment: updated });
  } catch (error) {
    console.error("レビューコメント更新エラー:", error);
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const disabled = reviewCommentsDisabledResponse();
  if (disabled) return disabled;

  if (isRateLimited(req, { windowMs: 60_000, max: 30 })) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) return NextResponse.json({ error: "invalid id" }, { status: 400 });

  try {
    await prisma.reviewComment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("レビューコメント削除エラー:", error);
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
}
```

### 8.3 `src/app/api/review-comments/[id]/replies/route.ts`

```ts
/**
 * レビューコメントへの返信 API
 *
 * POST   /api/review-comments/:id/replies            … 返信追加
 * DELETE /api/review-comments/:id/replies?replyId=N  … 返信削除
 *
 * 注意: DELETE は commentId と replyId の組で絞ること。replyId 単独で消すと
 *       任意のコメントの返信を別 URL から消せてしまう（権限問題）。
 */

import { getPrismaClient } from "@/lib/db";
import { isRateLimited } from "@/lib/rateLimit";
import { reviewCommentsDisabledResponse } from "@/lib/reviewCommentsGuard";
import { NextRequest, NextResponse } from "next/server";
import xss from "xss";

const prisma = getPrismaClient();

const MAX_CONTENT = 2000;
const MAX_NAME = 80;

function clean(value: unknown, max: number): string {
  return xss(String(value ?? "")).trim().slice(0, max);
}

function parseId(raw: string | null): number | null {
  if (!raw) return null;
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const disabled = reviewCommentsDisabledResponse();
  if (disabled) return disabled;

  if (isRateLimited(req, { windowMs: 60_000, max: 30 })) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { id: rawId } = await params;
  const commentId = parseId(rawId);
  if (!commentId)
    return NextResponse.json({ error: "invalid id" }, { status: 400 });

  try {
    const body = await req.json();
    const authorName = clean(body.authorName, MAX_NAME);
    const content = clean(body.content, MAX_CONTENT);

    if (!authorName || !content) {
      return NextResponse.json(
        { error: "authorName / content は必須です" },
        { status: 400 }
      );
    }

    const reply = await prisma.reviewCommentReply.create({
      data: { commentId, authorName, content },
    });
    return NextResponse.json({ reply }, { status: 201 });
  } catch (error) {
    console.error("レビュー返信作成エラー:", error);
    return NextResponse.json({ error: "作成に失敗しました" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const disabled = reviewCommentsDisabledResponse();
  if (disabled) return disabled;

  if (isRateLimited(req, { windowMs: 60_000, max: 30 })) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { id: rawId } = await params;
  const commentId = parseId(rawId);
  if (!commentId)
    return NextResponse.json({ error: "invalid id" }, { status: 400 });

  const replyId = parseId(req.nextUrl.searchParams.get("replyId"));
  if (!replyId)
    return NextResponse.json({ error: "replyId is required" }, { status: 400 });

  try {
    const result = await prisma.reviewCommentReply.deleteMany({
      where: { id: replyId, commentId },
    });
    if (result.count === 0) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("レビュー返信削除エラー:", error);
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
}
```

---

## 9. UI コンポーネント `src/components/ReviewOverlay.tsx`

そのままコピペで使えます（依存は MUI と `next/navigation` のみ）。

```tsx
"use client";

/**
 * 社内レビュー用のページ内コメントオーバーレイ
 *
 * NEXT_PUBLIC_ENABLE_COMMENTS=true の環境（社内開発サーバ）でのみマウントする想定。
 * - 左下にトグル「💬 レビュー」を表示
 * - ピン作成モード ON で、ページ内任意箇所をクリック → ピンを立ててコメント入力
 * - 既存ピンは常に表示。クリックで本文・返信・解決/再オープン・削除が可能
 * - サイドパネルで全コメント一覧（解決済みフィルタ付き）
 * - 名前は localStorage に保存（初回入力 / 後から変更可）
 */

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import ListAltIcon from "@mui/icons-material/ListAlt";
import RateReviewIcon from "@mui/icons-material/RateReview";
import RestoreIcon from "@mui/icons-material/Restore";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  Fab,
  FormControlLabel,
  IconButton,
  Paper,
  Popover,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Reply {
  id: number;
  authorName: string;
  content: string;
  createdAt: string;
}

interface ReviewComment {
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

const NAME_STORAGE_KEY = "review-overlay-name";  // ← プロジェクトごとに変えて良い
const Z_OVERLAY = 1400;
const Z_PIN = 1399;

function readStoredName(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(NAME_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function writeStoredName(value: string) {
  try {
    window.localStorage.setItem(NAME_STORAGE_KEY, value);
  } catch {
    /* localStorage 不可環境では無視 */
  }
}

function describeElement(el: Element | null): string {
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

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${m}/${day} ${hh}:${mm}`;
}

export default function ReviewOverlay() {
  const pathname = usePathname();
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [pinning, setPinning] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showResolved, setShowResolved] = useState(false);

  const [authorName, setAuthorName] = useState("");
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

  const [pendingPin, setPendingPin] = useState<{
    xRatio: number;
    yAbsolute: number;
    elementSelector: string;
  } | null>(null);
  const [draftContent, setDraftContent] = useState("");
  const draftAnchorRef = useRef<HTMLDivElement>(null);

  const [openCommentId, setOpenCommentId] = useState<number | null>(null);
  const popoverAnchorsRef = useRef<Map<number, HTMLElement>>(new Map());
  const [replyDraft, setReplyDraft] = useState("");

  useEffect(() => {
    setAuthorName(readStoredName());
  }, []);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/review-comments?page=${encodeURIComponent(pathname)}`,
        { cache: "no-store" }
      );
      if (!res.ok) return;
      const data = await res.json();
      setComments(Array.isArray(data.comments) ? data.comments : []);
    } catch (err) {
      console.error("review comments fetch error:", err);
    }
  }, [pathname]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!pinning) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-review-ui]")) return;

      e.preventDefault();
      e.stopPropagation();

      const docWidth = document.documentElement.clientWidth || 1;
      const xRatio = Math.max(0, Math.min(1, e.pageX / docWidth));
      const yAbsolute = Math.max(0, e.pageY);
      const selector = describeElement(target);

      if (!authorName) {
        setPendingPin({ xRatio, yAbsolute, elementSelector: selector });
        setNameDraft("");
        setNameDialogOpen(true);
        setPinning(false);
        return;
      }

      setPendingPin({ xRatio, yAbsolute, elementSelector: selector });
      setDraftContent("");
      setPinning(false);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pinning, authorName]);

  useEffect(() => {
    if (!pinning) return;
    const prev = document.body.style.cursor;
    document.body.style.cursor = "crosshair";
    return () => {
      document.body.style.cursor = prev;
    };
  }, [pinning]);

  const submitNewComment = async () => {
    if (!pendingPin || !authorName || !draftContent.trim()) return;
    try {
      const res = await fetch("/api/review-comments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          pageUrl: pathname,
          authorName,
          content: draftContent.trim(),
          xRatio: pendingPin.xRatio,
          yAbsolute: pendingPin.yAbsolute,
          elementSelector: pendingPin.elementSelector || null,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.comment) setComments((prev) => [...prev, data.comment]);
    } catch (err) {
      console.error(err);
      alert("コメント保存に失敗しました");
    } finally {
      setPendingPin(null);
      setDraftContent("");
    }
  };

  const confirmName = () => {
    const trimmed = nameDraft.trim().slice(0, 80);
    if (!trimmed) return;
    setAuthorName(trimmed);
    writeStoredName(trimmed);
    setNameDialogOpen(false);
  };

  const toggleStatus = async (c: ReviewComment) => {
    const next = c.status === "open" ? "resolved" : "open";
    try {
      const res = await fetch(`/api/review-comments/${c.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.comment) {
        setComments((prev) =>
          prev.map((x) => (x.id === c.id ? data.comment : x))
        );
      }
    } catch (err) {
      console.error(err);
      alert("更新に失敗しました");
    }
  };

  const deleteComment = async (id: number) => {
    if (!confirm("このコメントを削除しますか？（返信もすべて消えます）")) return;
    try {
      const res = await fetch(`/api/review-comments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setComments((prev) => prev.filter((x) => x.id !== id));
      setOpenCommentId(null);
    } catch (err) {
      console.error(err);
      alert("削除に失敗しました");
    }
  };

  const submitReply = async (commentId: number) => {
    const text = replyDraft.trim();
    if (!text || !authorName) return;
    try {
      const res = await fetch(`/api/review-comments/${commentId}/replies`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ authorName, content: text }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.reply) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, replies: [...c.replies, data.reply] }
              : c
          )
        );
      }
      setReplyDraft("");
    } catch (err) {
      console.error(err);
      alert("返信送信に失敗しました");
    }
  };

  const deleteReply = async (commentId: number, replyId: number) => {
    if (!confirm("この返信を削除しますか？")) return;
    try {
      const res = await fetch(
        `/api/review-comments/${commentId}/replies?replyId=${replyId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, replies: c.replies.filter((r) => r.id !== replyId) }
            : c
        )
      );
    } catch (err) {
      console.error(err);
      alert("返信削除に失敗しました");
    }
  };

  const visibleComments = useMemo(
    () =>
      showResolved
        ? comments
        : comments.filter((c) => c.status === "open"),
    [comments, showResolved]
  );

  const openCount = comments.filter((c) => c.status === "open").length;

  return (
    <>
      {visibleComments.map((c, idx) => (
        <PinMarker
          key={c.id}
          comment={c}
          index={idx + 1}
          registerAnchor={(el) => {
            if (el) popoverAnchorsRef.current.set(c.id, el);
            else popoverAnchorsRef.current.delete(c.id);
          }}
          onOpen={() => {
            setOpenCommentId(c.id);
            setReplyDraft("");
          }}
        />
      ))}

      {openCommentId !== null &&
        (() => {
          const c = comments.find((x) => x.id === openCommentId);
          const anchor = popoverAnchorsRef.current.get(openCommentId);
          if (!c || !anchor) return null;
          return (
            <Popover
              open
              anchorEl={anchor}
              onClose={() => setOpenCommentId(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              transformOrigin={{ vertical: "top", horizontal: "center" }}
              slotProps={{ paper: { "data-review-ui": "true", sx: { zIndex: Z_OVERLAY + 10 } } }}
            >
              <Box sx={{ width: 340, p: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Chip
                    size="small"
                    label={c.status === "open" ? "未対応" : "解決済み"}
                    color={c.status === "open" ? "warning" : "success"}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {c.authorName} ・ {formatDate(c.createdAt)}
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", mb: 1.5 }}
                >
                  {c.content}
                </Typography>

                {c.replies.length > 0 && (
                  <Stack spacing={1} sx={{ mb: 1.5 }}>
                    <Divider />
                    {c.replies.map((r) => (
                      <Box key={r.id} sx={{ pl: 1, borderLeft: "2px solid", borderColor: "divider" }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="caption" color="text.secondary">
                            {r.authorName} ・ {formatDate(r.createdAt)}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => deleteReply(c.id, r.id)}
                            aria-label="返信を削除"
                            sx={{ ml: "auto" }}
                          >
                            <DeleteOutlineIcon fontSize="inherit" />
                          </IconButton>
                        </Stack>
                        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                          {r.content}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}

                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <TextField
                    size="small"
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder={authorName ? "返信を書く…" : "先に名前を設定してください"}
                    value={replyDraft}
                    onChange={(e) => setReplyDraft(e.target.value)}
                    disabled={!authorName}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => submitReply(c.id)}
                    disabled={!replyDraft.trim() || !authorName}
                    aria-label="返信送信"
                  >
                    <SendIcon />
                  </IconButton>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button
                    size="small"
                    startIcon={c.status === "open" ? <CheckCircleIcon /> : <RestoreIcon />}
                    onClick={() => toggleStatus(c)}
                    variant="outlined"
                  >
                    {c.status === "open" ? "解決" : "再オープン"}
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => deleteComment(c.id)}
                  >
                    削除
                  </Button>
                </Stack>
              </Box>
            </Popover>
          );
        })()}

      {pendingPin && (
        <>
          <Box
            ref={draftAnchorRef}
            data-review-ui="true"
            sx={{
              position: "absolute",
              top: pendingPin.yAbsolute,
              left: `${pendingPin.xRatio * 100}%`,
              width: 0,
              height: 0,
              zIndex: Z_PIN,
            }}
          />
          <Popover
            open
            anchorEl={draftAnchorRef.current}
            onClose={() => {
              setPendingPin(null);
              setDraftContent("");
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            slotProps={{ paper: { "data-review-ui": "true", sx: { zIndex: Z_OVERLAY + 10 } } }}
          >
            <Box sx={{ width: 320, p: 2 }}>
              <Typography variant="caption" color="text.secondary">
                投稿者: {authorName || "(未設定)"}
              </Typography>
              <TextField
                size="small"
                fullWidth
                multiline
                minRows={3}
                maxRows={8}
                placeholder="気になる点を入力…"
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                autoFocus
                sx={{ mt: 1 }}
              />
              <Stack direction="row" spacing={1} sx={{ mt: 1.5, justifyContent: "flex-end" }}>
                <Button
                  size="small"
                  onClick={() => {
                    setPendingPin(null);
                    setDraftContent("");
                  }}
                >
                  キャンセル
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={submitNewComment}
                  disabled={!draftContent.trim() || !authorName}
                >
                  投稿
                </Button>
              </Stack>
            </Box>
          </Popover>
        </>
      )}

      <Box
        data-review-ui="true"
        sx={{
          position: "fixed",
          left: { xs: 16, md: 24 },
          bottom: { xs: 16, md: 24 },
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          alignItems: "flex-start",
          zIndex: Z_OVERLAY,
        }}
      >
        {pinning && (
          <Paper
            elevation={3}
            sx={{
              px: 1.5,
              py: 0.75,
              backgroundColor: "warning.light",
              color: "warning.contrastText",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            ページ内をクリックしてピンを立ててください
          </Paper>
        )}
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Tooltip title={pinning ? "コメントモードを終了" : "コメントを追加"}>
            <Fab
              size="medium"
              color={pinning ? "warning" : "secondary"}
              onClick={() => {
                if (!authorName) {
                  setNameDraft("");
                  setNameDialogOpen(true);
                  return;
                }
                setPinning((prev) => !prev);
              }}
              aria-label="レビューコメントを追加"
            >
              {pinning ? <CloseIcon /> : <RateReviewIcon />}
            </Fab>
          </Tooltip>
          <Tooltip title="コメント一覧を開く">
            <Fab
              size="small"
              onClick={() => setDrawerOpen(true)}
              aria-label="コメント一覧"
              sx={{ position: "relative" }}
            >
              <ListAltIcon />
              {openCount > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    minWidth: 18,
                    height: 18,
                    px: 0.5,
                    borderRadius: "9px",
                    backgroundColor: "error.main",
                    color: "#fff",
                    fontSize: 11,
                    lineHeight: "18px",
                    textAlign: "center",
                    fontWeight: 700,
                  }}
                >
                  {openCount}
                </Box>
              )}
            </Fab>
          </Tooltip>
          <Tooltip title="名前を変更">
            <IconButton
              size="small"
              onClick={() => {
                setNameDraft(authorName);
                setNameDialogOpen(true);
              }}
              aria-label="名前変更"
              sx={{
                bgcolor: "background.paper",
                boxShadow: 1,
                "&:hover": { bgcolor: "background.paper" },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {authorName && (
            <Chip
              size="small"
              label={authorName}
              sx={{ bgcolor: "background.paper", boxShadow: 1 }}
            />
          )}
        </Stack>
      </Box>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { "data-review-ui": "true", sx: { width: { xs: "90vw", sm: 400 } } } }}
      >
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ flex: 1 }}>
              レビューコメント
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)} aria-label="閉じる">
              <CloseIcon />
            </IconButton>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {pathname} の {comments.length} 件（未対応 {openCount}）
          </Typography>
          <FormControlLabel
            sx={{ mt: 1 }}
            control={
              <Switch
                size="small"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
              />
            }
            label="解決済みも表示"
          />
          <Divider sx={{ my: 1 }} />
          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {visibleComments.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                コメントはまだありません
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {visibleComments.map((c, idx) => (
                  <Paper
                    key={c.id}
                    variant="outlined"
                    sx={{ p: 1.5, cursor: "pointer" }}
                    onClick={() => {
                      window.scrollTo({
                        top: Math.max(0, c.yAbsolute - 120),
                        behavior: "smooth",
                      });
                      setDrawerOpen(false);
                      setOpenCommentId(c.id);
                      setReplyDraft("");
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Chip size="small" label={`#${idx + 1}`} sx={{ height: 20 }} />
                      <Chip
                        size="small"
                        label={c.status === "open" ? "未対応" : "解決済み"}
                        color={c.status === "open" ? "warning" : "success"}
                        sx={{ height: 20 }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
                        {formatDate(c.createdAt)}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {c.authorName}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        mt: 0.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {c.content}
                    </Typography>
                    {c.replies.length > 0 && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                        返信 {c.replies.length} 件
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        </Box>
      </Drawer>

      <Dialog
        open={nameDialogOpen}
        onClose={() => setNameDialogOpen(false)}
        slotProps={{ paper: { "data-review-ui": "true" } }}
      >
        <DialogTitle>お名前を入力してください</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            この端末に保存されます（社内レビュー用）。
          </Typography>
          <TextField
            autoFocus
            fullWidth
            size="small"
            placeholder="例: 山田"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                e.preventDefault();
                confirmName();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNameDialogOpen(false)}>キャンセル</Button>
          <Button onClick={confirmName} variant="contained" disabled={!nameDraft.trim()}>
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

interface PinMarkerProps {
  comment: ReviewComment;
  index: number;
  onOpen: () => void;
  registerAnchor: (el: HTMLButtonElement | null) => void;
}

function PinMarker({ comment, index, onOpen, registerAnchor }: PinMarkerProps) {
  const isResolved = comment.status === "resolved";
  return (
    <Box
      data-review-ui="true"
      sx={{
        position: "absolute",
        top: comment.yAbsolute,
        left: `${comment.xRatio * 100}%`,
        zIndex: Z_PIN,
        transform: "translate(-50%, -100%)",
        pointerEvents: "auto",
      }}
    >
      <Tooltip
        title={
          <Box sx={{ maxWidth: 220 }}>
            <Typography variant="caption" sx={{ display: "block", opacity: 0.8 }}>
              {comment.authorName}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                whiteSpace: "pre-wrap",
              }}
            >
              {comment.content}
            </Typography>
          </Box>
        }
        arrow
      >
        <Box
          component="button"
          ref={registerAnchor}
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: "14px 14px 14px 2px",
            border: "2px solid #fff",
            backgroundColor: isResolved ? "success.main" : "warning.main",
            color: "#fff",
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            opacity: isResolved ? 0.7 : 1,
            transition: "transform 120ms ease",
            "&:hover": { transform: "scale(1.1)" },
          }}
          aria-label={`コメント #${index} を開く`}
        >
          {index}
        </Box>
      </Tooltip>
    </Box>
  );
}
```

---

## 10. layout への組み込み

`src/app/layout.tsx`（または相当のルートレイアウト）の末尾、`<Footer />` などの並びに追加します。

```tsx
import ReviewOverlay from "@/components/ReviewOverlay";

// ...

<body>
  {/* ... 既存の Provider, Header, children, Footer ... */}
  {process.env.NEXT_PUBLIC_ENABLE_COMMENTS === "true" && <ReviewOverlay />}
</body>
```

> **MUI Theme が必須**: `<ReviewOverlay />` は `<ThemeProvider>` の内側に配置してください。MUI が無い場合は §13 を参照。

---

## 11. 動作確認

```bash
# 1. DB マイグレーション
npx prisma generate
npx prisma db push

# 2. dev 起動
npm run dev

# 3. ブラウザで開く（環境変数が効いていれば左下に💬ボタンが出る）
open http://localhost:3000

# 4. API 単体疎通
curl "http://localhost:3000/api/review-comments?page=/"
# → {"comments":[]}

# 5. コメント作成
curl -X POST http://localhost:3000/api/review-comments \
  -H "content-type: application/json" \
  -d '{"pageUrl":"/","authorName":"テスト","content":"動作確認","xRatio":0.5,"yAbsolute":300}'
# → {"comment":{...,"id":1,...}}

# 6. 環境変数を外して 404 を確認
NEXT_PUBLIC_ENABLE_COMMENTS= npm run dev
curl -i "http://localhost:3000/api/review-comments?page=/" | head -1
# → HTTP/1.1 404 Not Found
```

UI 動作チェックリスト:

- [ ] 左下に💬ボタンが表示される
- [ ] 初回クリック → 名前入力ダイアログ → 保存後にチップ表示
- [ ] コメントモード ON でカーソルが十字に
- [ ] ページ内任意の場所をクリックでピン（黄色の番号）が立つ
- [ ] 吹き出しに本文を書いて投稿、ピンが永続化
- [ ] ピンクリックで本文・返信欄・解決ボタン・削除ボタンが出る
- [ ] 返信送信できる、削除できる
- [ ] 解決ボタンで色が緑に変わり、未対応バッジが減る
- [ ] 隣の📋ボタンでドロワーが開き、ドロワーから選んだコメントの位置にスクロール
- [ ] 別端末/シークレットで開いてもピンが見える（DB 共有を確認）

---

## 12. セキュリティ・運用上の注意

| 項目 | 内容 |
| --- | --- |
| **本番に晒さない** | 環境変数を本番に設定しない。設定すると誰でも書き込める状態になる |
| **認証は無い** | 名前は自己申告。Slack 等で「誰がコメントしたか追えない可能性がある」前提で運用 |
| **CSRF** | 認証クッキーが無いので CSRF リスクは低いが、社内 IP 制限（nginx の `allow` 等）と併用するとより安全 |
| **レート制限** | 現行実装の既定値はDB共有ストア。ローカル簡易運用では `memory` に切り替え可能 |
| **XSS** | 本文・名前は `xss` でサニタイズ + 表示時 `whiteSpace: pre-wrap` で文字列扱い。`dangerouslySetInnerHTML` を使わないこと |
| **ピン位置のずれ** | レイアウトを大きく変更すると過去のピンの位置が外れる。`elementSelector` を使った復元ロジックは未実装（必要なら拡張ポイント） |
| **本番データへ混入** | 本番 DB のテーブルが余分に増える。気になるなら本番マイグレーションから外す or 開発用 DB を分ける |

---

## 13. カスタマイズ・置き換え

### MUI を使っていない場合

`ReviewOverlay.tsx` を参考に Tailwind / Headless UI / 素の React で書き直す必要あり。骨格（state、API 呼び出し、座標計算、`document` クリックハンドラ）は流用可。

### 別フレームワーク（Express, FastAPI 等）に乗せ換え

API 仕様だけ抽出すれば移植可能:

```
GET    /api/review-comments?page=<pathname>
POST   /api/review-comments        body: {pageUrl,authorName,content,xRatio,yAbsolute,elementSelector?}
PATCH  /api/review-comments/:id    body: {status: "open"|"resolved"}
DELETE /api/review-comments/:id
POST   /api/review-comments/:id/replies            body: {authorName,content}
DELETE /api/review-comments/:id/replies?replyId=N  ← commentId と replyId の組で絞ること
```

レスポンス形:

```json
{
  "comments": [
    {
      "id": 1,
      "pageUrl": "/",
      "xRatio": 0.5,
      "yAbsolute": 300,
      "elementSelector": "div#main > p.title",
      "authorName": "山田",
      "content": "気になる",
      "status": "open",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z",
      "replies": [
        {
          "id": 1,
          "commentId": 1,
          "authorName": "佐藤",
          "content": "了解",
          "createdAt": "2026-01-01T00:01:00.000Z"
        }
      ]
    }
  ]
}
```

### 認証を入れたい

- `reviewCommentsDisabledResponse()` の代わりに「セッション/Cookie/IP allow-list 等で社内ユーザを判定」する関数に差し替える
- `authorName` をフロント入力ではなく認証情報（メアド・社員 ID 等）から取る

### ピン色・トリガー位置・ストレージキーの変更

`ReviewOverlay.tsx` 内の以下を編集:

- `NAME_STORAGE_KEY` … プロジェクト固有の名前にする
- `Z_OVERLAY` / `Z_PIN` … 既存 UI と被るなら調整
- 左下 `Box sx={{ position:"fixed", left:..., bottom:... }}` … 配置を変える
- `PinMarker` の `backgroundColor` / `width`/`height` … ピンの見た目

---

## 14. 既知の制約・将来の拡張ポイント

- ピン位置は座標固定。レスポンシブで段組が変わると位置がずれる → `elementSelector` を使って復元するロジックを後追いで実装可能
- 大量コメント（数百〜）になると DOM が重くなる可能性 → ビューポート内のみ描画する仮想化を検討
- 通知機能なし → 必要なら POST 時に Slack Webhook を叩く処理を追加
- 画像添付なし → 必要なら `/uploads` 等を作って multipart 対応

---

以上。質問があれば実装者に投げてください。
