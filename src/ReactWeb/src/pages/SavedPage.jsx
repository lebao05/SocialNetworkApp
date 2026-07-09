import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import LeftSidebar from "../components/Sidebar/LeftSidebar";
import { Bookmark } from "lucide-react";
import { useSavedPosts } from "../hooks/useSavedPosts";
import { unsavePostApi } from "../apis/postApi";
import MediaGallery from "../components/Feed/MediaGallery";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

const VISIBILITY_ICON = {
  0: "🌐",
  1: "👥",
  2: "🔒",
};

function SavedPostItem({ savedPost, onUnsave, isRemoving }) {
  const post = savedPost.post;
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/post/${post.id}`);
  };

  const handleUnsave = async (e) => {
    e.stopPropagation();
    await onUnsave(savedPost.id, post.id);
  };

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-sm border border-[#ddd] cursor-pointer transition-shadow hover:shadow-md"
      onClick={handleCardClick}
    >
      {/* Author header */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-1.5">
        <img
          src={post.authorAvatarUrl || DEFAULT_AVATAR}
          alt={post.authorName || "User"}
          className="h-7 w-7 rounded-full object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-[#050505] truncate leading-tight">
            {post.authorName || "User"}
          </p>
          <p className="text-[11px] text-[#65676b] leading-tight">
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : ""}
            {post.visibility != null ? ` · ${VISIBILITY_ICON[post.visibility] ?? VISIBILITY_ICON[0]}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={handleUnsave}
          disabled={isRemoving}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-[#65676b] border border-[#ddd] transition-colors hover:bg-[#f2f2f2] hover:text-[#050505] disabled:opacity-50 shrink-0"
        >
          <Bookmark size={11} />
          {isRemoving ? "..." : "Unsave"}
        </button>
      </div>

      {/* Content */}
      {post.content && (
        <div className="px-3 pb-2">
          <p className="text-[12px] text-[#050505] leading-snug line-clamp-2">
            {post.content}
          </p>
        </div>
      )}

      {/* Media — reuses the same component as PostCard */}
      {post.media?.length > 0 && (
        <MediaGallery media={post.media} compact />
      )}
    </div>
  );
}

export default function SavedPage() {
  const [removingId, setRemovingId] = useState(null);

  const {
    savedPosts,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    totalCount,
    loadPage,
    loadMore,
    removeSavedPost,
  } = useSavedPosts({ pageSize: 20 });

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  const handleUnsave = useCallback(async (savedPostId, postId) => {
    setRemovingId(savedPostId);
    try {
      await unsavePostApi(postId);
      removeSavedPost(savedPostId);
    } catch (err) {
      console.error("Failed to unsave post:", err);
    } finally {
      setRemovingId(null);
    }
  }, [removeSavedPost]);

  return (
    <div className="bg-[#f0f2f5] min-h-screen">
      <Navbar />

      <div className="pt-14 flex">
        {/* ── Left Sidebar ── */}
        <LeftSidebar />

        {/* ── Main Content ── */}
        <main className="flex-1 min-h-[calc(100vh-56px)] ml-[280px]">
          <div className="max-w-xl mx-auto">
            <div className="bg-white border-b border-[#ddd] px-6 py-4">
              <h1 className="text-[18px] font-bold text-[#050505]">Saved Posts</h1>
            </div>

            <div className="p-4">
            {/* Saved count */}
            <p className="mb-3 text-[13px] text-[#65676b] font-medium">
              {totalCount > 0 ? `${totalCount} saved ${totalCount === 1 ? "item" : "items"}` : "Saved posts"}
            </p>

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-[14px] text-red-600">
                {error}
              </div>
            )}

            {/* Loading skeleton */}
            {isLoading && (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm border border-[#ddd] p-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-32 rounded bg-gray-200" />
                        <div className="h-2.5 w-20 rounded bg-gray-200" />
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="h-3 w-full rounded bg-gray-200" />
                      <div className="h-3 w-3/4 rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && savedPosts.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#f0f2f5]">
                  <Bookmark size={36} className="text-[#bcc0c4]" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-[#050505]">No saved posts</h2>
                <p className="max-w-sm text-[15px] text-[#65676b] leading-relaxed">
                  Save posts you want to revisit later. Click the bookmark icon on any post to save it here.
                </p>
              </div>
            )}

            {/* Posts list */}
            {!isLoading && savedPosts.length > 0 && (
              <>
                <div className="flex flex-col gap-3">
                  {savedPosts.map((item) => (
                    <SavedPostItem
                      key={item.id}
                      savedPost={item}
                      onUnsave={handleUnsave}
                      isRemoving={removingId === item.id}
                    />
                  ))}
                </div>

                {/* Load more */}
                {hasMore && (
                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={loadMore}
                      disabled={isLoadingMore}
                      className="px-6 py-2 text-[14px] font-semibold text-[#1877f2] hover:bg-[#e7f3ff] rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoadingMore ? "Loading..." : "See more"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}
