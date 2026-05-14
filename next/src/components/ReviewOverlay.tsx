"use client";

/**
 * 社内レビュー用のページ内コメントオーバーレイ
 *
 * NEXT_PUBLIC_ENABLE_COMMENTS=true の環境(社内開発サーバ)でのみマウントする想定。
 * - 左下にトグル「💬 レビュー」を表示
 * - ピン作成モード ON で、ページ内任意箇所をクリック → ピンを立ててコメント入力
 * - 既存ピンは常に表示。クリックで本文・返信・解決/再オープン・削除が可能
 * - サイドパネルで全コメント一覧(解決済みフィルタ付き)
 * - 名前は localStorage に保存(初回入力 / 後から変更可)
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

const NAME_STORAGE_KEY = "seta-craft-review-overlay-name";
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
    if (!confirm("このコメントを削除しますか？(返信もすべて消えます)")) return;
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
            {pathname} の {comments.length} 件(未対応 {openCount})
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
            この端末に保存されます(社内レビュー用)。
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
