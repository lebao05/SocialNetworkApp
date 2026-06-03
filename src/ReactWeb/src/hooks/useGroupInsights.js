import { useCallback, useEffect, useState } from "react";
import { getGroupInsightsApi } from "../apis/groupApi";

const DEFAULTS = {
  totalMembers: 0,
  requests: 0,
  reviewed: 0,
  approved: 0,
  declined: 0,
  posts: 0,
  comments: 0,
  reactions: 0,
  activeMembers: 0,
  topDays: [],
  peakHours: [],
  growthChart: [],
  engagementChart: [],
};

const getErrorMessage = (err, fallback) =>
  err?.response?.data?.message || err?.response?.data || err?.message || fallback;

/**
 * Fetches group insight statistics.
 *
 * @param {number} groupId
 * @param {{ fromDate?: string, toDate?: string, autoFetch?: boolean }} options
 */
export function useGroupInsights(
  groupId,
  { fromDate = null, toDate = null, autoFetch = true } = {}
) {
  const [insights, setInsights] = useState(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = useCallback(async () => {
    if (!groupId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getGroupInsightsApi(groupId, { fromDate, toDate });
      setInsights({
        ...DEFAULTS,
        ...data,
        topDays: data.topDays ?? DEFAULTS.topDays,
        peakHours: data.peakHours ?? DEFAULTS.peakHours,
        growthChart: data.growthChart ?? DEFAULTS.growthChart,
        engagementChart: data.engagementChart ?? DEFAULTS.engagementChart,
      });
    } catch (err) {
      console.error("Failed to load group insights:", err);
      setError(getErrorMessage(err, "Failed to load group insights"));
    } finally {
      setLoading(false);
    }
  }, [groupId, fromDate, toDate]);

  useEffect(() => {
    if (!autoFetch || !groupId) return;
    fetchInsights();
  }, [autoFetch, groupId, fetchInsights]);

  return {
    insights,
    loading,
    error,
    fetchInsights,
  };
}
