import { useCallback, useEffect, useState } from "react";
import { getFeedPostsApi, generateFeedApi, markLatestAsSeenApi } from "../apis/feedApi";
import { createPostApi } from "../apis/postApi";

export function useFeed({ initialPage = 1, pageSize = 20 } = {}) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const normalizeResponse = (data) => {
    // Accept either array or { items, totalCount }
    if (!data) return { items: [], totalCount: 0 };
    if (Array.isArray(data)) return { items: data, totalCount: data.length };
    if (data.items) return { items: data.items, totalCount: data.totalCount ?? data.items.length };
    return { items: [], totalCount: 0 };
  };

  const loadPage = useCallback(async (p = 1) => {
    setIsLoading(true);
    try {
      const data = await getFeedPostsApi(p, pageSize);
      const { items } = normalizeResponse(data);

      if (p === 1) {
        setPosts(items);
      } else {
        setPosts((prev) => [...prev, ...items]);
      }

      if (items.length < pageSize) setHasMore(false);
      else setHasMore(true);

      setPage(p);
    } catch (err) {
      console.error("Failed to load feed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  const loadMore = () => {
    if (!hasMore || isLoading) return;
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

  const createPost = async (postPayload) => {
    try {
      // postPayload should match createPostApi signature
      const result = await createPostApi(postPayload);

      // After creating, refresh the feed (reload first page)
      await refresh();

      return result;
    } catch (err) {
      console.error("Create post failed:", err);
      throw err;
    }
  };

  const generateFeed = async (candidateLimit = 500, feedItemLimit = 100) => {
    try {
      const data = await generateFeedApi(candidateLimit, feedItemLimit);
      return data;
    } catch (err) {
      console.error("Generate feed failed:", err);
      throw err;
    }
  };

  const markLatestAsSeen = async () => {
    try {
      const data = await markLatestAsSeenApi();
      return data;
    } catch (err) {
      console.error("Mark latest feed as seen failed:", err);
      throw err;
    }
  };

  return {
    posts,
    isLoading,
    isRefreshing,
    hasMore,
    page,
    loadMore,
    refresh,
    createPost,
    generateFeed,
    markLatestAsSeen,
  };
}
