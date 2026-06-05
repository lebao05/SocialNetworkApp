import { useCallback, useEffect, useState } from "react";
import { getUserReelsApi } from "../apis/reelApi";

function mapReactionTypeToLabel(reactionType) {
  if (reactionType === null || reactionType === undefined) return null;

  const reactionMap = {
    0: "Like",
    1: "Love",
    2: "Haha",
    3: "Wow",
    4: "Sad",
    5: "Angry",
  };

  return reactionMap[reactionType] ?? String(reactionType);
}

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
    userReaction: mapReactionTypeToLabel(reel.userReaction),
    userReactionType: reel.userReaction,
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
      const items = Array.isArray(data) ? data : data.items || [];
      const normalized = items.map(normalizeReel);

      setReels((prev) => (nextPage === 1 ? normalized : [...prev, ...normalized]));
      setHasMore(Array.isArray(data) ? normalized.length >= pageSize : Boolean(data.hasNextPage));
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

  return {
    reels,
    isLoading,
    isRefreshing,
    hasMore,
    page,
    error,
    refresh,
    loadMore,
  };
}
