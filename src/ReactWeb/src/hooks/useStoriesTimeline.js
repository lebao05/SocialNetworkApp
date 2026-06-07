import { useCallback, useEffect, useState } from "react";
import { getStoryTimelineApi } from "../apis/storyApi";
import { buildStoryGroupFromApi } from "../components/Story/storyMappers";

export function useStoriesTimeline({ initialPage = 1, pageSize = 10 } = {}) {
  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPage = useCallback(async (nextPage = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getStoryTimelineApi(nextPage, pageSize);
      const mappedGroups = (data?.items ?? []).map(buildStoryGroupFromApi);
      setGroups(mappedGroups);
      setPage(nextPage);
      setHasNextPage(Boolean(data?.hasNextPage));
      return mappedGroups;
    } catch (err) {
      console.error("Failed to load story timeline:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to load stories.");
      setGroups([]);
      setHasNextPage(false);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    loadPage(initialPage);
  }, [initialPage, loadPage]);

  return {
    groups,
    page,
    hasNextPage,
    isLoading,
    error,
    refresh: () => loadPage(page),
    loadPage,
  };
}
