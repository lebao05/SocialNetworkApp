import { useCallback, useEffect, useState } from "react";
import { getReportedContentsApi, executeReportedContentApi } from "../apis/groupApi";

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
 * Fetches reported content for a group and provides hide/dismiss actions.
 *
 * @param {number} groupId
 * @param {{ pageSize?: number, autoFetch?: boolean }} options
 */
export function useReportedContent(
  groupId,
  { pageSize = 20, autoFetch = true } = {}
) {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // reportId currently being acted on

  const loadPage = useCallback(
    async (p = 1, status = null) => {
      if (!groupId) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await getReportedContentsApi(groupId, {
          page: p,
          pageSize,
          status,
        });

        const { items, hasNextPage: next, totalCount: total } = normalizePaged(data, pageSize);

        setReports((prev) => (p === 1 ? items : [...prev, ...items]));
        setHasNextPage(next);
        setTotalCount(total);
        setPage(p);
      } catch (err) {
        console.error("Failed to load reported content:", err);
        setError(
          err?.response?.data?.message ||
            err?.response?.data ||
            err?.message ||
            "Failed to load reported content"
        );
        if (p === 1) {
          setReports([]);
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
    setReports([]);
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
   * Hide the reported post and mark the report as reviewed.
   */
  const hideReport = useCallback(
    async (reportId) => {
      setActionLoading(reportId);
      try {
        await executeReportedContentApi(groupId, reportId, { hidePost: true });
        setReports((prev) =>
          prev.map((r) =>
            (r.id ?? r.Id) === reportId
              ? {
                  ...r,
                  status: "Reviewed",
                  Status: "Reviewed",
                  ReviewedAt: new Date().toISOString(),
                }
              : r
          )
        );
        setTotalCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Failed to hide report:", err);
        throw err;
      } finally {
        setActionLoading(null);
      }
    },
    [groupId]
  );

  /**
   * Dismiss the report without hiding the post.
   */
  const dismissReport = useCallback(
    async (reportId) => {
      setActionLoading(reportId);
      try {
        await executeReportedContentApi(groupId, reportId, { hidePost: false });
        setReports((prev) =>
          prev.map((r) =>
            (r.id ?? r.Id) === reportId
              ? {
                  ...r,
                  status: "Dismissed",
                  Status: "Dismissed",
                  ReviewedAt: new Date().toISOString(),
                }
              : r
          )
        );
        setTotalCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Failed to dismiss report:", err);
        throw err;
      } finally {
        setActionLoading(null);
      }
    },
    [groupId]
  );

  return {
    reports,
    isLoading,
    isRefreshing,
    hasNextPage,
    totalCount,
    page,
    error,
    actionLoading,
    loadMore,
    refresh,
    hideReport,
    dismissReport,
  };
}
