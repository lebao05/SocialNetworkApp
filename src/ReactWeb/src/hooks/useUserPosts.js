import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { getUserPostsApi, createPostApi, updatePostApi, getPostApi, deletePostApi } from "../apis/postApi";

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
      await refresh();
      return created;
    } catch (err) {
      console.error("Create user post failed:", err);
      throw err;
    }
  };

  const updatePost = async (postId, updatePayload) => {
    try {
      await updatePostApi(postId, updatePayload);
      // Backend returns 204 NoContent → re-fetch single post to sync UI.
      const fresh = await getPostApi(postId);
      setPosts((prev) => prev.map((p) => (p.id === postId ? fresh : p)));
      return fresh;
    } catch (err) {
      console.error("Update post failed:", err);
      throw err;
    }
  };

  const deletePost = async (postId) => {
    try {
      await deletePostApi(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      return true;
    } catch (err) {
      console.error("Delete post failed:", err);
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
    deletePost,
  };
}
