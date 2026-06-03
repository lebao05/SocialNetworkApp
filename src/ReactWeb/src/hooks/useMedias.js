import { useCallback, useEffect, useState } from "react";
import { getPostMediasByGroupApi, getPostMediasByUserApi } from "../apis/postApi";

const normalizePaged = (data, pageSize) => {
  if (!data) return { items: [], hasMore: false, totalCount: 0 };

  if (Array.isArray(data)) {
    return {
      items: data,
      hasMore: data.length >= pageSize,
      totalCount: data.length,
    };
  }

  const items = data.items || data.Items || [];
  const totalCount = data.totalCount ?? data.TotalCount ?? items.length;
  const hasNextPage = data.hasNextPage ?? data.HasNextPage;
  const hasMore =
    hasNextPage ??
    (data.pageNumber ?? data.PageNumber ?? 1) * (data.pageSize ?? data.PageSize ?? pageSize) < totalCount;

  return { items, hasMore, totalCount };
};

const normalizeMediaItem = (item) => ({
  id: item.id ?? item.Id,
  postId: item.postId ?? item.PostId,
  mediaType: item.mediaType ?? item.MediaType,
  mediaUrl: item.mediaUrl ?? item.MediaUrl,
  thumbnailUrl: item.thumbnailUrl ?? item.ThumbnailUrl,
  metadata: item.metadata ?? item.Metadata,
  uploadedAt: item.uploadedAt ?? item.UploadedAt,
});

export function useMedias({ groupId = null, userId = null, mediaType = "image", pageSize = 24 } = {}) {
  const [medias, setMedias] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const scopeId = groupId ?? userId;
  const isGroupScope = groupId != null && groupId !== "";

  const loadPage = useCallback(
    async (type, p = 1) => {
      if (!scopeId) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = isGroupScope
          ? await getPostMediasByGroupApi(groupId, type, p, pageSize)
          : await getPostMediasByUserApi(userId, type, p, pageSize);

        const { items, hasMore: nextHasMore, totalCount: total } = normalizePaged(data, pageSize);
        const normalizedItems = items.map(normalizeMediaItem);

        setMedias((prev) => (p === 1 ? normalizedItems : [...prev, ...normalizedItems]));
        setHasMore(nextHasMore);
        setTotalCount(total);
        setPage(p);
      } catch (err) {
        console.error("Failed to load medias:", err);
        setError(err?.response?.data?.message || err?.message || "Failed to load media");
        if (p === 1) {
          setMedias([]);
          setHasMore(false);
          setTotalCount(0);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [scopeId, isGroupScope, groupId, userId, pageSize]
  );

  useEffect(() => {
    setMedias([]);
    setPage(1);
    setHasMore(true);
    loadPage(mediaType, 1);
  }, [mediaType, loadPage]);

  const loadMore = () => {
    if (!hasMore || isLoading) return;
    loadPage(mediaType, page + 1);
  };

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      await loadPage(mediaType, 1);
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    medias,
    isLoading,
    isRefreshing,
    hasMore,
    totalCount,
    error,
    loadMore,
    refresh,
  };
}
