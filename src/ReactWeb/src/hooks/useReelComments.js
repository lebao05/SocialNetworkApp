import { useCallback, useEffect, useRef, useState } from "react";
import { getReelCommentsApi, createReelCommentApi } from "../apis/reelApi";

function normalizeCommentsResponse(data) {
  if (!data) return { items: [], totalCount: 0 };
  if (Array.isArray(data)) return { items: data, totalCount: data.length };
  if (data.items) return { items: data.items, totalCount: data.totalCount ?? data.items.length };
  return { items: [], totalCount: 0 };
}

export function useReelComments(reelId) {
  const [comments, setComments] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [replyTarget, setReplyTarget] = useState(null); // { id, userName, userAvatarUrl }
  const [loadingReplyParentIds, setLoadingReplyParentIds] = useState([]);

  const pageRef = useRef(1);
  const pageSize = 10;

  const loadComments = useCallback(
    async (page = 1, parentCommentId = null, isRefresh = false) => {
      setIsLoading(true);
      setError("");
      try {
        const data = await getReelCommentsApi(reelId, { parentCommentId, page, pageSize });
        const { items } = normalizeCommentsResponse(data);

        if (page === 1 && !parentCommentId) {
          setComments(isRefresh ? items : items);
        } else if (page === 1 && parentCommentId !== null) {
          // Refreshing replies — replace replies under that parent
          setComments((prev) => {
            const topLevel = prev.filter((c) => c.id !== parentCommentId);
            const updated = prev.map((c) =>
              c.id === parentCommentId ? { ...c, replies: items } : c
            );
            return isRefresh ? updated : [...topLevel, ...updated];
          });
        } else {
          setComments((prev) => [...prev, ...items]);
        }

        setHasMore(items.length >= pageSize);
        pageRef.current = page;
      } catch (err) {
        setError(err?.response?.data?.error ?? "Failed to load comments.");
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
    loadComments(1);
  }, [reelId, loadComments]);

  const loadMore = () => {
    if (!hasMore || isLoading) return;
    loadComments(pageRef.current + 1);
  };

  const refresh = () => {
    pageRef.current = 1;
    loadComments(1, undefined, true);
  };

  const submitComment = useCallback(
    async ({ content, parentCommentId = null, repliedUserId = null }) => {
      if (!content?.trim()) return;
      setIsSubmitting(true);
      setError("");
      try {
        await createReelCommentApi(reelId, { content: content.trim(), parentCommentId, repliedUserId });
        // Optimistically add the comment
        const newComment = {
          id: Date.now(), // temporary id
          reelId,
          userId: null,
          userName: "You",
          userAvatarUrl: null,
          parentCommentId,
          repliedUserId,
          repliedUserName: repliedUserId ? replyTarget?.userName ?? null : null,
          repliedAvatarUrl: repliedUserId ? replyTarget?.userAvatarUrl ?? null : null,
          content: content.trim(),
          replyCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: null,
          replies: [],
        };
        if (parentCommentId) {
          setComments((prev) =>
            prev.map((c) =>
              c.id === parentCommentId
                ? { ...c, replies: [...(c.replies ?? []), newComment], replyCount: (c.replyCount ?? 0) + 1 }
                : c
            )
          );
        } else {
          setComments((prev) => [newComment, ...prev]);
        }
        setReplyTarget(null);
      } catch (err) {
        setError(err?.response?.data?.error ?? "Failed to post comment.");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [reelId, replyTarget]
  );

  const startReply = useCallback(
    (commentId) => {
      const comment = comments.find((c) => c.id === commentId);
      if (!comment) return;
      setReplyTarget({
        id: comment.id,
        userName: comment.userName,
        userAvatarUrl: comment.userAvatarUrl,
      });
    },
    [comments]
  );

  const cancelReply = useCallback(() => {
    setReplyTarget(null);
  }, []);

  const loadReplies = useCallback(
    async (parentCommentId) => {
      if (loadingReplyParentIds.includes(parentCommentId)) return;
      setLoadingReplyParentIds((prev) => [...prev, parentCommentId]);
      try {
        const data = await getReelCommentsApi(reelId, { parentCommentId, page: 1, pageSize: 20 });
        const { items } = normalizeCommentsResponse(data);
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentCommentId ? { ...c, replies: items } : c
          )
        );
      } catch (err) {
        console.error("Failed to load replies:", err);
      } finally {
        setLoadingReplyParentIds((prev) => prev.filter((id) => id !== parentCommentId));
      }
    },
    [reelId, loadingReplyParentIds]
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
