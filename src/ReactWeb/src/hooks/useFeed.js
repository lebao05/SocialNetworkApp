import { useCallback, useEffect, useState } from "react";
import { getFeedPostsApi, generateFeedApi, markLatestAsSeenApi, createPostApi, getPostApi } from "../apis/postApi";

export function useFeed({ initialPage = 1, pageSize = 10 } = {}) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const normalizeResponse = (data) => {
    // Accept either array or { items, totalCount }
    if (!data) return { items: [], totalCount: 0 };
    if (Array.isArray(data)) return { items: data, totalCount: data.length };
    if (data.items) return { items: data.items, totalCount: data.totalCount ?? data.items.length };
    return { items: [], totalCount: 0 };
  };

  const loadPage = useCallback(async (p = 1, isRefresh = false) => {
    setIsLoading(true);
    try {
      const data = await getFeedPostsApi(p, pageSize, isRefresh);
      const { items } = normalizeResponse(data);

      if (p === 1) {
        setPosts(items);
      } else {
        setPosts((prev) => [...prev, ...items]);
      }

      if (items.length < pageSize || items.some((item) => item.isSeen)) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

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
      await loadPage(1, true);
    } finally {
      setIsRefreshing(false);
    }
  };

  const createPost = async (postPayload) => {
    try {
      // postPayload should match createPostApi signature
      const postId = await createPostApi(postPayload);

      // Fetch the full post object from the server
      const newPost = await getPostApi(postId);

      // Optimistically prepend to the feed
      setPosts((prev) => [
        {
          id: newPost.id, // FeedItem's ID
          score: 1.0,
          feedType: 0,
          isSeen: false,
          feedCreatedAt: newPost.createdAt,
          post: newPost
        },
        ...prev
      ]);

      return postId;
    } catch (err) {
      console.error("Create post failed:", err);
      throw err;
    }
  };

  const generateFeed = async () => {
    try {
      const data = await generateFeedApi();
      return data;
    } catch (err) {
      console.error("Generate feed failed:", err);
      throw err;
    }
  };

  const markLatestAsSeen = useCallback(async (feedIds = []) => {
    try {
      const data = await markLatestAsSeenApi(feedIds);
      setPosts((prev) =>
        prev.map((item) =>
          feedIds.includes(item.feedId)
            ? { ...item, isSeen: true }
            : item
        )
      );
      return data;
    } catch (err) {
      console.error("Mark feed as seen failed:", err);
      throw err;
    }
  }, []);

  useEffect(() => {

    if (hasMore === false && !isGenerating && !isLoading) {
      const timer = setTimeout(async () => {
        setIsGenerating(true);
        try {
          await generateFeed();
          setHasMore(true);
          setPage(1);
          await loadPage(1);
        } catch (err) {
          console.error("Auto pre-generation of feed failed:", err);
        } finally {
          setIsGenerating(false);
        }
      }, 2000); // delay in ms

      return () => clearTimeout(timer);
    }
  }, [posts, isGenerating, isLoading]);

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
