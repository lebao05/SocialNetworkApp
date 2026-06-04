import { useCallback, useEffect, useState } from "react";
import { getGroupsApi } from "../apis/groupApi";

const getErrorMessage = (err, fallback) =>
  err?.response?.data?.message || err?.response?.data || err?.message || fallback;

/**
 * Fetches groups the current user HAS joined (for the Your Groups tab).
 */
export function useYourGroups({ page = 1, pageSize = 12, searchTerm = null, autoFetch = true } = {}) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGroupsApi({ isJoining: true, page, pageSize, searchTerm });
      setGroups(data.items ?? []);
      setTotalCount(data.totalCount ?? 0);
    } catch (err) {
      console.error("Failed to load your groups:", err);
      setError(getErrorMessage(err, "Failed to load groups"));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchTerm]);

  useEffect(() => {
    if (!autoFetch) return;
    fetch();
  }, [autoFetch, fetch]);

  return {
    groups,
    loading,
    error,
    totalCount,
    fetch,
    hasMore: groups.length < totalCount,
  };
}
