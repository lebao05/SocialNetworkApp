import { useCallback, useEffect, useRef, useState } from "react";
import { getReelCommentsApi, createReelCommentApi } from "../apis/reelApi";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Match the flat shape PostComment expects (same as PostCard's normalizeComment).
// ReelCommentDto already exposes parentCommentId; we just rename fields so PostComment
// can group replies via parentId without losing nesting on the screen.
function normalizeComment(comment) {
  if (!comment) return null;
  return {
    id: comment.id,
    reelId: comment.reelId,
    userId: comment.userId,
    user: comment.userName || "User",
    avatar: comment.userAvatarUrl || DEFAULT_AVATAR,
    parentId: comment.parentCommentId ?? null,
    repliedUserId: comment.repliedUserId ?? null,
    repliedUserName: comment.repliedUserName ?? null,
    repliedAvatarUrl: comment.repliedAvatarUrl ?? null,
    text: comment.content || "",
    time: comment.createdAt ? timeAgo(comment.createdAt) : "",
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt ?? null,
    replyCount: comment.replyCount ?? 0,
    likes: 0,
    reactionCounts: [],
    userReaction: "",
  };
}

function normalizePagedItems(data) {
  if (!data) return { items: [], totalCount: 0 };
  if (Array.isArray(data)) {
    const items = data.map(normalizeComment).filter(Boolean);
    return { items, totalCount: items.length };
  }
  const items = (data.items || []).map(normalizeComment).filter(Boolean);
  return { items, totalCount: data.totalCount ?? items.length };
}

function mergeComments(prev, incoming) {
  const existingIds = new Set(prev.map((c) => c.id));
  return [...prev, ...incoming.filter((c) => !existingIds.has(c.id))];
}

export function useReelComments(reelId) {
  const [comments, setComments] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [replyTarget, setReplyTarget] = useState(null); // { id, userId, user, avatar }
  const [loadingReplyParentIds, setLoadingReplyParentIds] = useState([]);

  const pageRef = useRef(1);
  const pageSize = 10;

  const loadComments = useCallback(
    async (page = 1, parentCommentId = null) => {
      setIsLoading(true);
      setError("");
      try {
        const data = await getReelCommentsApi(reelId, { parentCommentId, page, pageSize });
        const { items, totalCount } = normalizePagedItems(data);

        if (parentCommentId !== null) {
          // Loading replies for a specific parent comment.
          // Keep optimistic / previously loaded replies + the freshly fetched page.
          setComments((prev) => mergeComments(prev, items));
        } else if (page === 1) {
          setComments(items);
        } else {
          setComments((prev) => mergeComments(prev, items));
        }

        setHasMore(items.length === pageSize || (parentCommentId == null && items.length < totalCount));
        pageRef.current = page;
      } catch (err) {
        setError(err?.response?.data?.error?.message ?? "Failed to load comments.");
      } finally {
        setIsLoading(false);
      }
    },
    [reelId]
  );

  // Load top-level comments on mount or reelId change
  useEffect(() => {
    if (!reelId) return;
    pageRef.current = 1;
    setComments([]);
    setHasMore(true);
    setReplyTarget(null);
    setError("");
    loadComments(1, null);
  }, [reelId, loadComments]);

  const loadMore = () => {
    if (!hasMore || isLoading) return;
    loadComments(pageRef.current + 1, null);
  };

  const refresh = useCallback(() => {
    pageRef.current = 1;
    return loadComments(1, null);
  }, [loadComments]);

  const submitComment = useCallback(
    async ({ content, parentCommentId = null, repliedUserId = null }) => {
      if (!content?.trim()) return;
      setIsSubmitting(true);
      setError("");
      try {
        await createReelCommentApi(reelId, {
          content: content.trim(),
          parentCommentId,
          repliedUserId,
        });
        if (parentCommentId) {
          // Bump parent's replyCount locally and fetch newly created replies.
          setComments((prev) =>
            prev.map((c) =>
              c.id === parentCommentId
                ? { ...c, replyCount: (c.replyCount ?? 0) + 1 }
                : c
            )
          );
          await loadComments(1, parentCommentId);
        } else {
          // Re-pull first page so replyCount and ordering come back fresh from server.
          await refresh();
        }
        setReplyTarget(null);
      } catch (err) {
        setError(err?.response?.data?.error?.message ?? "Failed to post comment.");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [reelId, loadComments, refresh]
  );

  const startReply = useCallback(
    (commentId) => {
      const comment = comments.find((c) => c.id === commentId);
      if (!comment) return;
      setReplyTarget({
        id: comment.id,
        userId: comment.userId,
        user: comment.user,
        avatar: comment.avatar,
      });
    },
    [comments]
  );

  const cancelReply = useCallback(() => {
    setReplyTarget(null);
  }, []);

  const loadReplies = useCallback(
    async (parentCommentId) => {
      if (!parentCommentId || loadingReplyParentIds.includes(parentCommentId)) return;

      const alreadyLoaded = comments.filter((c) => c.parentId === parentCommentId).length;
      const nextPage = Math.floor(alreadyLoaded / pageSize) + 1;

      setLoadingReplyParentIds((prev) => [...prev, parentCommentId]);
      setError("");
      try {
        await loadComments(nextPage, parentCommentId);
      } catch (err) {
        setError("Could not load replies. Try again.");
        console.error("Failed to load replies:", err);
      } finally {
        setLoadingReplyParentIds((prev) => prev.filter((id) => id !== parentCommentId));
      }
    },
    [comments, loadComments, loadingReplyParentIds]
  );

  return {
    comments,
    hasMore,
    isLoading,
    isSubmitting,
    error,
    replyTarget,
    loadingReplyParentIds,
    loadMore,
    refresh,
    submitComment,
    startReply,
    cancelReply,
    loadReplies,
  };
}