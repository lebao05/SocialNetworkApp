import { useCallback, useEffect, useState } from "react";
import { getPostsByGroupApi } from "../apis/postApi";
import { reviewGroupPostApi } from "../apis/groupApi";

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
 * Fetches pending posts for a group and provides approve/reject actions.
 *
 * @param {number} groupId
 * @param {{ pageSize?: number, autoFetch?: boolean }} options
 */
export function usePendingPosts(
  groupId,
  { pageSize = 20, autoFetch = true } = {}
) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // postId currently being acted on

  const loadPage = useCallback(
    async (p = 1) => {
      if (!groupId) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await getPostsByGroupApi(groupId, {
          page: p,
          pageSize,
          approvalStatus: "Pending",
        });

        const { items, hasNextPage: next, totalCount: total } = normalizePaged(data, pageSize);

        setPosts((prev) => (p === 1 ? items : [...prev, ...items]));
        setHasNextPage(next);
        setTotalCount(total);
        setPage(p);
      } catch (err) {
        console.error("Failed to load pending posts:", err);
        setError(
          err?.response?.data?.message ||
            err?.response?.data ||
            err?.message ||
            "Failed to load pending posts"
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
    loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, autoFetch]);

  const loadMore = () => {
    if (!hasNextPage || isLoading) return;
    loadPage(page + 1);
  };

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      await loadPage(1);
    } finally {
      setIsRefreshing(false);
    }
  };

  /**
   * Approve or reject a pending post.
   * Updates the post's approvalStatus in the local list instead of removing it.
   */
  const moderatePost = useCallback(
    async (postId, approve) => {
      setActionLoading(postId);
      try {
        await reviewGroupPostApi(groupId, postId, approve);
        const newStatus = approve ? "Approved" : "Rejected";
        setPosts((prev) =>
          prev.map((p) =>
            (p.id ?? p.Id) === postId
              ? {
                  ...p,
                  approvalStatus: newStatus,
                  ApprovalStatus: newStatus,
                }
              : p
          )
        );
        setTotalCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Failed to moderate post:", err);
        throw err;
      } finally {
        setActionLoading(null);
      }
    },
    [groupId]
  );

  const approvePost = useCallback(
    (postId) => moderatePost(postId, true),
    [moderatePost]
  );

  const rejectPost = useCallback(
    (postId) => moderatePost(postId, false),
    [moderatePost]
  );

  return {
    posts,
    isLoading,
    isRefreshing,
    hasNextPage,
    totalCount,
    page,
    error,
    actionLoading,
    loadMore,
    refresh,
    approvePost,
    rejectPost,
  };
}
