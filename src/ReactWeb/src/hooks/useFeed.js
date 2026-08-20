import { useCallback, useEffect, useState } from "react";
import { getFeedPostsApi, generateFeedApi, markLatestAsSeenApi, createPostApi, getPostApi, deletePostApi, updatePostApi } from "../apis/postApi";

/**
 * Infinite-scroll feed hook.
 *
 * The backend no longer supports page-based pagination. Each call to
 * `getFeedPostsApi(pageSize, isRefresh)` returns up to `pageSize` unseen feed
 * items. We collect every batch into a flat list and expose `loadMore` for
 * the UI to drain that list.
 *
 * When the user has consumed everything (empty response or all items are
 * isSeen=true), `hasMore` flips to false. The next scroll automatically
 * triggers `generateFeed()` to build a fresh batch.
 *
 * A single `isLoading` flag covers both API fetch and feed generation.
 */
export function useFeed({ pageSize = 10 } = {}) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const normalizeResponse = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.items) return data.items;
    return [];
  };

  const fetchBatch = useCallback(async (isRefresh = false) => {
    const data = await getFeedPostsApi(pageSize, isRefresh);
    return normalizeResponse(data);
  }, [pageSize]);

  // First entry into the page — isRefresh=true so the backend falls back to
  // history when there is nothing unseen.
  const loadInitial = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await fetchBatch(true);
      setPosts(items);
      const allSeen = items.length > 0 && items.every((item) => item.isSeen);
      setHasMore(!allSeen);
    } catch (err) {
      console.error("Failed to load feed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchBatch]);

  // Infinite scroll — only fetch fresh unseen items. Never use isRefresh here:
  // refresh-mode would re-pull already-seen history, breaking the "newest
  // unseen first" semantics.
  const loadMore = useCallback(async () => {
    if (isLoading || isRefreshing) return;
    if (!hasMore) return;

    setIsLoading(true);
    try {
      const items = await fetchBatch(false);

      // Empty response or all items already seen → nothing left to show.
      if (items.length === 0 || items.every((item) => item.isSeen)) {
        setHasMore(false);
        return;
      }

      setPosts((prev) => {
        const existingIds = new Set(prev.map((item) => item.feedId ?? item.id));
        const fresh = items.filter((item) => !existingIds.has(item.feedId ?? item.id));
        return [...prev, ...fresh];
      });

      if (items.length < pageSize) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load more feed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchBatch, pageSize, isLoading, isRefreshing, hasMore]);

  // Pull-to-refresh — first-entry semantics, just like loadInitial.
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const items = await fetchBatch(true);
      setPosts(items);
      const allSeen = items.length > 0 && items.every((item) => item.isSeen);
      setHasMore(!allSeen);
    } catch (err) {
      console.error("Failed to refresh feed:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchBatch]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const createPost = async (postPayload) => {
    try {
      const postId = await createPostApi(postPayload);
      const newPost = await getPostApi(postId);

      setPosts((prev) => [
        {
          id: newPost.id,
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

  const deletePost = async (postId) => {
    try {
      await deletePostApi(postId);
      setPosts((prev) => prev.filter((item) => item.post?.id !== postId));
      return true;
    } catch (err) {
      console.error("Delete feed post failed:", err);
      throw err;
    }
  };

  const updatePost = async (postId, updatePayload) => {
    try {
      await updatePostApi(postId, updatePayload);
      const fresh = await getPostApi(postId);
      setPosts((prev) =>
        prev.map((item) =>
          item.post?.id === postId
            ? { ...item, post: fresh, feedCreatedAt: fresh.createdAt ?? item.feedCreatedAt }
            : item
        )
      );
      return fresh;
    } catch (err) {
      console.error("Update feed post failed:", err);
      throw err;
    }
  };

  // Auto pre-generation: when hasMore is false and the user scrolls again,
  // ask the backend to build a fresh batch, then re-run the first-entry fetch
  // (isRefresh=true) so the next `loadMore` has fresh unseen items to drain.
  useEffect(() => {
    if (hasMore || isLoading || isRefreshing) return;

    const timer = setTimeout(async () => {
      try {
        await generateFeed();
        await loadInitial();
      } catch (err) {
        console.error("Auto pre-generation of feed failed:", err);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [hasMore, isLoading, isRefreshing, loadInitial]);

  return {
    posts,
    isLoading,
    isRefreshing,
    hasMore,
    loadMore,
    refresh,
    createPost,
    generateFeed,
    markLatestAsSeen,
    deletePost,
    updatePost,
  };
}