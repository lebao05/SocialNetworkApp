import { useCallback, useEffect, useState } from "react";
import { getPostApi, updatePostApi, deletePostApi } from "../apis/postApi";

/**
 * Hook for managing a single post — used by PostDetailPage and any
 * parent that needs to display / update / soft-delete a post.
 *
 * - `post` is normalized for UI consumption.
 * - `updatePost(postId, payload)` → calls UpdatePost API, then re-fetches
 *   the post via `getPostApi` so the local state stays in sync with backend.
 * - `deletePost(postId)` → soft-deletes the post and clears local state.
 * - `refresh()` → re-fetches current post from API.
 *
 * The hook does NOT own UI / modal state. Components are expected to pass
 * their update / delete callbacks to the modal as props, where the modal
 * invokes `onSubmit={...}` after a successful save.
 */
export function usePost(postId) {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMutating, setIsMutating] = useState(false);

  const refresh = useCallback(async () => {
    if (!postId) return;
    setIsLoading(true);
    setError(null);
    try {
      const raw = await getPostApi(postId);
      setPost(raw);
      return raw;
    } catch (err) {
      console.error("Failed to load post:", err);
      setError("Could not load post.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    setPost(null);
    if (postId) refresh();
  }, [postId, refresh]);

  const updatePost = useCallback(async (id, payload) => {
    setIsMutating(true);
    try {
      await updatePostApi(id, payload);
      // backend returns 204 NoContent → refetch to sync UI
      const fresh = await getPostApi(id);
      setPost(fresh);
      return fresh;
    } catch (err) {
      console.error("Update post failed:", err);
      throw err;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const deletePost = useCallback(async (id) => {
    setIsMutating(true);
    try {
      await deletePostApi(id);
      setPost(null);
      return true;
    } catch (err) {
      console.error("Delete post failed:", err);
      throw err;
    } finally {
      setIsMutating(false);
    }
  }, []);

  return {
    post,
    setPost,
    isLoading,
    error,
    isMutating,
    refresh,
    updatePost,
    deletePost,
  };
}