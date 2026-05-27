import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { getUserPostsApi, createPostApi, updatePostApi } from "../apis/postApi";

export function useUserPosts(profileUserId, { initialPage = 1, pageSize = 10 } = {}) {
  const { user: currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isOwner = Boolean(currentUser && profileUserId && String(currentUser.id) === String(profileUserId));

  const loadPage = useCallback(async (p = 1) => {
    if (!profileUserId) return;
    setIsLoading(true);
    try {
      const data = await getUserPostsApi(profileUserId, p, pageSize);
      // support both array or { items, totalCount }
      const items = Array.isArray(data) ? data : (data.items || []);

      if (p === 1) setPosts(items);
      else setPosts((prev) => [...prev, ...items]);

      setHasMore(items.length >= pageSize);
      setPage(p);
    } catch (err) {
      console.error("Failed to load user posts:", err);
    } finally {
      setIsLoading(false);
    }
  }, [profileUserId, pageSize]);

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
      const created = await createPostApi(postPayload);

      // optimistic: if creating for this profile, refresh
      if (!postPayload.groupId && (!postPayload.sharePostId || postPayload.sharePostId === null)) {
        // assume it's a user post; refresh list to include new post
        await refresh();
      } else {
        // still refresh to reflect changes
        await refresh();
      }

      return created;
    } catch (err) {
      console.error("Create user post failed:", err);
      throw err;
    }
  };

  const updatePost = async (postId, updatePayload) => {
    try {
      const updated = await updatePostApi(postId, updatePayload);
      // update local cache
      setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
      return updated;
    } catch (err) {
      console.error("Update post failed:", err);
      throw err;
    }
  };

  return {
    posts,
    isOwner,
    isLoading,
    isRefreshing,
    hasMore,
    page,
    loadMore,
    refresh,
    createPost,
    updatePost,
  };
}
