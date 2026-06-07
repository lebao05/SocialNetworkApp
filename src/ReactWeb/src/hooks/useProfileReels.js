import { useCallback, useEffect, useState } from "react";
import { deleteReelApi, getUserReelsApi, toggleLikeReelApi } from "../apis/reelApi";

function formatCompactCount(value) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return "0";
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(num);
}

function normalizeReel(reel) {
  const thumbnailUrl = reel.thumbnailUrl || reel.videoUrl;

  return {
    id: reel.id,
    reelId: reel.id,
    authorId: reel.authorId,
    author: reel.authorName || "User",
    authorName: reel.authorName || "User",
    avatar: reel.authorAvatarUrl || import.meta.env.VITE_DEFAULT_AVATAR,
    authorAvatarUrl: reel.authorAvatarUrl || import.meta.env.VITE_DEFAULT_AVATAR,
    poster: thumbnailUrl,
    thumbnailUrl,
    videoUrl: reel.videoUrl,
    caption: reel.caption || "",
    audioTitle: reel.audioTitle || "Original audio",
    duration: reel.duration || "",
    visibility: reel.visibility,
    likes: formatCompactCount(reel.likeCount),
    likeCount: reel.likeCount || 0,
    comments: formatCompactCount(reel.commentCount),
    commentCount: reel.commentCount || 0,
    views: formatCompactCount(reel.viewCount),
    viewCount: reel.viewCount || 0,
    isOwnReel: Boolean(reel.isOwnReel),
    isLikedByCurrentUser: Boolean(reel.isLikedByCurrentUser),
    createdAt: reel.createdAt,
    updatedAt: reel.updatedAt,
    verified: false,
    handle: reel.authorName ? `@${reel.authorName.toLowerCase().replace(/\s+/g, "")}` : "@user",
  };
}

export function useProfileReels(profileUserId, { initialPage = 1, pageSize = 12 } = {}) {
  const [reels, setReels] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadPage = useCallback(async (nextPage = 1) => {
    if (!profileUserId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getUserReelsApi(profileUserId, nextPage, pageSize);
      const items = data.items ?? [];
      const normalized = items.map(normalizeReel);

      setReels((prev) => (nextPage === 1 ? normalized : [...prev, ...normalized]));
      setHasMore(Boolean(data.hasNextPage));
      setPage(nextPage);
    } catch (err) {
      console.error("Failed to load profile reels:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to load reels.");
    } finally {
      setIsLoading(false);
    }
  }, [profileUserId, pageSize]);

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await loadPage(1);
    } finally {
      setIsRefreshing(false);
    }
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    loadPage(page + 1);
  }, [hasMore, isLoading, loadPage, page]);

  const toggleLike = useCallback(async (reelId) => {
    const target = reels.find((r) => r.id === reelId);
    if (!target) return;

    const wasLiked = target.isLikedByCurrentUser;
    const prevCount = target.likeCount;

    // Optimistic update
    setReels((prev) =>
      prev.map((r) =>
        r.id === reelId
          ? {
              ...r,
              isLikedByCurrentUser: !wasLiked,
              likeCount: wasLiked ? r.likeCount - 1 : r.likeCount + 1,
              likes: formatCompactCount(wasLiked ? r.likeCount - 1 : r.likeCount + 1),
            }
          : r
      )
    );

    try {
      const result = await toggleLikeReelApi(reelId);
      // Sync with server response
      setReels((prev) =>
        prev.map((r) =>
          r.id === reelId
            ? {
                ...r,
                isLikedByCurrentUser: result.isLiked,
                likeCount: result.likeCount ?? r.likeCount,
                likes: formatCompactCount(result.likeCount ?? r.likeCount),
              }
            : r
        )
      );
    } catch (err) {
      // Revert on failure
      setReels((prev) =>
        prev.map((r) =>
          r.id === reelId
            ? {
                ...r,
                isLikedByCurrentUser: wasLiked,
                likeCount: prevCount,
                likes: formatCompactCount(prevCount),
              }
            : r
        )
      );
      console.error("Failed to toggle like:", err);
    }
  }, [reels]);

  const deleteReel = useCallback(async (reelId) => {
    const prevReels = reels;
    setReels((prev) => prev.filter((r) => r.id !== reelId));

    try {
      await deleteReelApi(reelId);
    } catch (err) {
      setReels(prevReels);
      console.error("Failed to delete reel:", err);
    }
  }, [reels]);

  return {
    reels,
    isLoading,
    isRefreshing,
    hasMore,
    page,
    error,
    refresh,
    loadMore,
    toggleLike,
    deleteReel,
  };
}
