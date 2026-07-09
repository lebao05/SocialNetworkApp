import { useCallback, useState } from "react";
import { getSavedPostsApi } from "../apis/postApi";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

function normalizePost(raw) {
  return {
    id: raw.id,
    authorId: raw.authorId ?? raw.AuthorId ?? null,
    authorName: raw.authorName ?? raw.AuthorName ?? null,
    authorAvatarUrl: raw.authorAvatarUrl ?? raw.AuthorAvatarUrl ?? null,
    groupId: raw.groupId ?? raw.GroupId ?? null,
    content: raw.content ?? raw.Content ?? null,
    visibility: raw.visibility ?? raw.Visibility ?? 0,
    sharePostId: raw.sharePostId ?? raw.SharePostId ?? null,
    locationTag: raw.locationTag ?? raw.LocationTag ?? null,
    feelingActivity: raw.feelingActivity ?? raw.FeelingActivity ?? null,
    createdAt: raw.createdAt ?? raw.CreatedAt ?? null,
    updatedAt: raw.updatedAt ?? raw.UpdatedAt ?? null,
    deletedAt: raw.deletedAt ?? raw.DeletedAt ?? null,
    media: Array.isArray(raw.media) ? raw.media : (Array.isArray(raw.Media) ? raw.Media : []),
    reactionCounts: Array.isArray(raw.reactionCounts)
      ? raw.reactionCounts
      : Array.isArray(raw.ReactionCounts) ? raw.ReactionCounts : [],
    commentCount: raw.commentCount ?? raw.CommentCount ?? 0,
    group: raw.group ?? raw.Group ?? null,
    sharePost: raw.sharePost ?? raw.SharePost ?? null,
    userReaction: raw.userReaction ?? raw.UserReaction ?? null,
    isHiddenFromGroup: raw.isHiddenFromGroup ?? raw.IsHiddenFromGroup ?? false,
    hiddenAt: raw.hiddenAt ?? raw.HiddenAt ?? null,
    hideReason: raw.hideReason ?? raw.HideReason ?? null,
    approvalStatus: raw.approvalStatus ?? raw.ApprovalStatus ?? null,
    isAnonymous: raw.isAnonymous ?? raw.IsAnonymous ?? false,
  };
}

function normalizeSavedPost(raw) {
  return {
    id: raw.id,
    savedAt: raw.savedAt ?? raw.SavedAt ?? null,
    post: normalizePost(raw.post),
  };
}

export function useSavedPosts({ pageSize = 20 } = {}) {
  const [savedPosts, setSavedPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const normalizeResponse = (data) => {
    if (!data) return { items: [], totalCount: 0 };
    if (Array.isArray(data)) return { items: data, totalCount: data.length };
    return {
      items: data.items || [],
      totalCount: data.totalCount ?? data.items?.length ?? 0,
      hasNextPage: data.hasNextPage ?? false,
    };
  };

  const load = useCallback(async (pageToLoad = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await getSavedPostsApi(pageToLoad, pageSize);
      const { items, totalCount: total } = normalizeResponse(data);
      const normalized = items.map(normalizeSavedPost);

      if (pageToLoad === 1) {
        setSavedPosts(normalized);
      } else {
        setSavedPosts((prev) => {
          const existingIds = new Set(prev.map((s) => s.id));
          return [...prev, ...normalized.filter((s) => !existingIds.has(s.id))];
        });
      }

      setTotalCount(total);
      setPage(pageToLoad);

      const hasNext = !Array.isArray(data)
        ? data.hasNextPage
        : pageToLoad * pageSize < total;
      setHasMore(hasNext);
    } catch (err) {
      console.error("Failed to load saved posts:", err);
      setError("Could not load saved posts.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [pageSize]);

  const loadPage = useCallback((p = 1) => load(p, false), [load]);
  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;
    load(page + 1, true);
  }, [hasMore, isLoadingMore, page, load]);

  const refresh = useCallback(() => load(1, false), [load]);

  const removeSavedPost = useCallback((savedPostId) => {
    setSavedPosts((prev) => prev.filter((s) => s.id !== savedPostId));
    setTotalCount((prev) => Math.max(0, prev - 1));
  }, []);

  return {
    savedPosts,
    page,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    totalCount,
    loadPage,
    loadMore,
    refresh,
    removeSavedPost,
  };
}
