import { useState, useEffect, useCallback } from "react";
import { getTopReelsApi } from "../apis/reelApi";

export function useHomeReels(pageSize = 6) {
  const [reels, setReels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReels = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getTopReelsApi(pageSize);
      console.log(data);
      const items = data.items ?? [];
      setReels(items);
    } catch (err) {
      setError(err?.response?.data ?? err.message ?? "Failed to load reels");
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchReels();
  }, [fetchReels]);

  return { reels, isLoading, error, refresh: fetchReels };
}
