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

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiJson } from "@/lib/api-client";

import CommentPopover from "./review/CommentPopover";
import CommentsDrawer from "./review/CommentsDrawer";
import NameDialog from "./review/NameDialog";
import NewCommentPopover from "./review/NewCommentPopover";
import PinMarker from "./review/PinMarker";
import ToolbarFab from "./review/ToolbarFab";
import {
  type ReviewComment,
  readStoredName,
  writeStoredName,
} from "./review/types";

export default function ReviewOverlay() {
  const pathname = usePathname();
  // ネイティブスクロール（SimpleBar 撤去 #245）
  const getScrollEl = useCallback((): HTMLElement => {
    return (document.scrollingElement as HTMLElement | null) ?? document.documentElement;
  }, []);

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
      const data = await apiJson<{ comments: ReviewComment[] }>(
        `/api/review-comments?page=${encodeURIComponent(pathname)}`,
        { cache: "no-store" }
      );
      setComments(Array.isArray(data.comments) ? data.comments : []);
    } catch (err) {
      console.error("review comments fetch error:", err);
    }
  }, [pathname]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // ピン作成モード: クリック時にピン座標を取得
  useEffect(() => {
    if (!pinning) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-review-ui]")) return;

      e.preventDefault();
      e.stopPropagation();

      const scrollEl = getScrollEl();
      const rect = scrollEl.getBoundingClientRect();
      const containerWidth = rect.width || 1;
      const xRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / containerWidth));
      const yAbsolute = Math.max(0, e.clientY - rect.top + scrollEl.scrollTop);
      if (!authorName) {
        setPendingPin({ xRatio, yAbsolute });
        setNameDraft("");
        setNameDialogOpen(true);
        setPinning(false);
        return;
      }

      setPendingPin({ xRatio, yAbsolute });
      setDraftContent("");
      setPinning(false);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pinning, authorName, getScrollEl]);

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
      const data = await apiJson<{ comment: ReviewComment }>("/api/review-comments", {
        method: "POST",
        body: {
          pageUrl: pathname,
          authorName,
          content: draftContent.trim(),
          xRatio: pendingPin.xRatio,
          yAbsolute: pendingPin.yAbsolute,
        },
      });
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
      const data = await apiJson<{ comment: ReviewComment }>(`/api/review-comments/${c.id}`, {
        method: "PATCH",
        body: { status: next },
      });
      if (data.comment) {
        setComments((prev) => prev.map((x) => (x.id === c.id ? data.comment : x)));
      }
    } catch (err) {
      console.error(err);
      alert("更新に失敗しました");
    }
  };

  const deleteComment = async (id: number) => {
    if (!confirm("このコメントを削除しますか？(返信もすべて消えます)")) return;
    try {
      await apiJson(`/api/review-comments/${id}`, { method: "DELETE" });
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
      const data = await apiJson<{ reply: ReviewComment["replies"][number] }>(
        `/api/review-comments/${commentId}/replies`,
        {
          method: "POST",
          body: { authorName, content: text },
        }
      );
      if (data.reply) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId ? { ...c, replies: [...c.replies, data.reply] } : c
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
      await apiJson(
        `/api/review-comments/${commentId}/replies?replyId=${replyId}`,
        { method: "DELETE" }
      );
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, replies: c.replies.filter((r) => r.id !== replyId) } : c
        )
      );
    } catch (err) {
      console.error(err);
      alert("返信削除に失敗しました");
    }
  };

  const visibleComments = useMemo(
    () => (showResolved ? comments : comments.filter((c) => c.status === "open")),
    [comments, showResolved]
  );

  const openCount = comments.filter((c) => c.status === "open").length;

  const openComment = openCommentId !== null ? comments.find((x) => x.id === openCommentId) : null;
  const openAnchor = openCommentId !== null ? popoverAnchorsRef.current.get(openCommentId) : null;

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

      {openComment && openAnchor && (
        <CommentPopover
          comment={openComment}
          anchorEl={openAnchor}
          replyDraft={replyDraft}
          authorName={authorName}
          onClose={() => setOpenCommentId(null)}
          onReplyDraftChange={setReplyDraft}
          onSubmitReply={submitReply}
          onToggleStatus={toggleStatus}
          onDelete={deleteComment}
          onDeleteReply={deleteReply}
        />
      )}

      {pendingPin && (
        <NewCommentPopover
          pendingPin={pendingPin}
          authorName={authorName}
          draftContent={draftContent}
          draftAnchorRef={draftAnchorRef}
          onDraftContentChange={setDraftContent}
          onSubmit={submitNewComment}
          onCancel={() => {
            setPendingPin(null);
            setDraftContent("");
          }}
        />
      )}

      <ToolbarFab
        pinning={pinning}
        authorName={authorName}
        openCount={openCount}
        onTogglePinning={() => {
          if (!authorName) {
            setNameDraft("");
            setNameDialogOpen(true);
            return;
          }
          setPinning((prev) => !prev);
        }}
        onOpenDrawer={() => setDrawerOpen(true)}
        onOpenNameDialog={() => {
          setNameDraft(authorName);
          setNameDialogOpen(true);
        }}
      />

      <CommentsDrawer
        open={drawerOpen}
        pathname={pathname}
        comments={comments}
        visibleComments={visibleComments}
        openCount={openCount}
        showResolved={showResolved}
        onClose={() => setDrawerOpen(false)}
        onShowResolvedChange={setShowResolved}
        onCommentClick={(c) => {
          getScrollEl().scrollTo({
            top: Math.max(0, c.yAbsolute - 120),
            behavior: "smooth",
          });
          setDrawerOpen(false);
          setOpenCommentId(c.id);
          setReplyDraft("");
        }}
      />

      <NameDialog
        open={nameDialogOpen}
        nameDraft={nameDraft}
        onClose={() => setNameDialogOpen(false)}
        onNameDraftChange={setNameDraft}
        onConfirm={confirmName}
      />
    </>
  );
}
