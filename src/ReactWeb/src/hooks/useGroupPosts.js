import { useCallback, useEffect, useState } from "react";
import { getPostsByGroupApi } from "../apis/postApi";

const normalizePaged = (data, pageSize) => {
  if (!data) return { items: [], hasNextPage: false, totalCount: 0, pageNumber: 1 };

  if (Array.isArray(data)) {
    return {
      items: data,
      hasNextPage: false,
      totalCount: data.length,
      pageNumber: 1,
    };
  }

  const items = data.items || data.Items || [];
  const totalCount = data.totalCount ?? data.TotalCount ?? items.length;
  const pageNumber = data.pageNumber ?? data.PageNumber ?? 1;
  const pageSizeVal = data.pageSize ?? data.PageSize ?? pageSize;
  const hasNextPage =
    data.hasNextPage ?? data.HasNextPage ?? pageNumber * pageSizeVal < totalCount;

  return { items, hasNextPage, totalCount, pageNumber };
};

/**
 * Loads group posts with pagination, owner filtering, and date filtering.
 *
 * @param {number} groupId
 * @param {{ pageSize?: number, isMine?: boolean, fromDate?: string | null, autoFetch?: boolean }} options
 *   - isMine:   when true, returns only posts authored by the current user.
 *   - fromDate: ISO date string (e.g. "2026-01-01") — returns posts created on or after this date.
 */
export function useGroupPosts(
  groupId,
  { pageSize = 20, isMine = false, fromDate = null, autoFetch = true } = {}
) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadPage = useCallback(
    async (p = 1, currentOptions = {}) => {
      if (!groupId) return;

      const { isMine: mine = false, fromDate: date = null } = currentOptions;

      setIsLoading(true);
      setError(null);

      try {
        const data = await getPostsByGroupApi(groupId, {
          page: p,
          pageSize,
          isMine: mine,
          fromDate: date,
        });

        const { items, hasNextPage: next, totalCount: total } = normalizePaged(data, pageSize);

        setPosts((prev) => (p === 1 ? items : [...prev, ...items]));
        setHasNextPage(next);
        setTotalCount(total);
        setPage(p);
      } catch (err) {
        console.error("Failed to load group posts:", err);
        setError(
          err?.response?.data?.message ||
            err?.response?.data ||
            err?.message ||
            "Failed to load group posts"
        );
        if (p === 1) {
          setPosts([]);
          setHasNextPage(false);
          setTotalCount(0);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [groupId, pageSize]
  );

  useEffect(() => {
    if (!autoFetch || !groupId) return;
    setPosts([]);
    setPage(1);
    setHasNextPage(true);
    loadPage(1, { isMine, fromDate });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, isMine, fromDate, autoFetch]);

  const loadMore = () => {
    if (!hasNextPage || isLoading) return;
    loadPage(page + 1, { isMine, fromDate });
  };

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      await loadPage(1, { isMine, fromDate });
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    posts,
    isLoading,
    isRefreshing,
    hasNextPage,
    totalCount,
    page,
    error,
    loadMore,
    refresh,
  };
}
