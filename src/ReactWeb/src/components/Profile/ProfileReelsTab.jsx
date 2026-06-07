import React, { useEffect, useRef, useState, useCallback } from "react";
import { Eye, Heart, Play } from "lucide-react";
import ReelView from "../Reels/ReelView";
import { toggleLikeReelApi } from "../../apis/reelApi";

function ReelCard({ reel, onClick, onLike }) {
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    if (isLiking) return;
    setIsLiking(true);
    onLike(reel.id);
    setTimeout(() => setIsLiking(false), 500);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-black text-left shadow-sm"
    >
      <img
        src={reel.poster}
        alt={reel.caption}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80" />
      <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm">
        <Play size={18} fill="currentColor" />
      </div>
      <div className="absolute right-3 top-3 flex flex-col items-end gap-1">
        <button
          type="button"
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-1 rounded-full bg-black/35 px-2.5 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm transition hover:brightness-110 ${isLiking ? "opacity-60" : ""}`}
        >
          <Heart
            size={12}
            fill={reel.isLikedByCurrentUser ? "#f43f5e" : "currentColor"}
            className={reel.isLikedByCurrentUser ? "text-rose-500" : ""}
          />
          {reel.likes}
        </button>
        <div className="rounded-full bg-black/35 px-2.5 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
          <Eye size={12} className="mr-1 inline" />
          {reel.views}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
        <div className="mb-2 flex items-center gap-2">
          <img
            src={reel.avatar}
            alt={reel.author}
            className="h-9 w-9 rounded-full border border-white/40 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold">{reel.author}</p>
            <p className="truncate text-[12px] text-white/75">{reel.handle}</p>
          </div>
        </div>
        <p className="line-clamp-2 text-[13px] font-medium leading-snug text-white/95">
          {reel.caption}
        </p>
      </div>
    </button>
  );
}

export default function ProfileReelsTab({
  theme,
  reels = [],
  onCreateReel,
  canCreate = false,
  isLoading = false,
  error = null,
  hasMore = false,
  loadMore,
  onLike,
  onDelete,
}) {
  const [chosenReel, setChosenReel] = useState(null);
  const loadMoreRef = useRef(null);

  const chosenIndex = chosenReel
    ? reels.findIndex((r) => r.id === chosenReel.id)
    : -1;

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || !loadMore) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: "200px" }
    );
    const sentinel = loadMoreRef.current;
    if (sentinel) observer.observe(sentinel);
    return () => { if (sentinel) observer.unobserve(sentinel); };
  }, [hasMore, loadMore]);

  const handleOpenReel = (reel) => setChosenReel(reel);
  const handleCloseReel = () => setChosenReel(null);
  const handleNextReel = () => {
    if (chosenIndex < reels.length - 1) setChosenReel(reels[chosenIndex + 1]);
  };
  const handlePrevReel = () => {
    if (chosenIndex > 0) setChosenReel(reels[chosenIndex - 1]);
  };

  const handleLike = useCallback(async (reelId) => {
    const target = reels.find((r) => r.id === reelId);
    if (!target) return;
    const wasLiked = target.isLikedByCurrentUser;
    onLike?.(reelId);
    if (chosenReel?.id === reelId) {
      setChosenReel((prev) => ({
        ...prev,
        isLikedByCurrentUser: !wasLiked,
        likeCount: wasLiked ? prev.likeCount - 1 : prev.likeCount + 1,
      }));
    }
    try {
      const result = await toggleLikeReelApi(reelId);
      if (chosenReel?.id === reelId) {
        setChosenReel((prev) => ({
          ...prev,
          isLikedByCurrentUser: result.isLiked,
          likeCount: result.likeCount ?? prev.likeCount,
        }));
      }
    } catch {
      onLike?.(reelId); // revert
    }
  }, [reels, chosenReel, onLike]);

  const handleDelete = useCallback(async (reelId) => {
    onDelete?.(reelId);
    setChosenReel(null);
  }, [onDelete]);

  return (
    <>
      {/* Profile reel viewer — local state, full-screen centered */}
      {chosenReel && (
        <div className="fixed inset-0 z-[900] flex items-center justify-center bg-black/80 pt-16">
          <div className="h-[95%] w-[40%]">
            <ReelView
              key={chosenReel.id}
              reel={chosenReel}
              onClose={handleCloseReel}
              onLike={handleLike}
              onDelete={handleDelete}
              canDelete={canCreate}
              onNext={handleNextReel}
              onPrev={handlePrevReel}
              hasPrev={chosenIndex > 0}
              hasNext={chosenIndex < reels.length - 1}
            />
          </div>
        </div>
      )}

      <div className={`${theme.card} rounded-xl shadow p-6 transition-colors duration-200`}>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className={`text-xl font-bold ${theme.text}`}>Reels</h2>
            <p className={`text-sm ${theme.textSub}`}>Short videos and creative highlights</p>
          </div>
          {canCreate && (
            <button
              type="button"
              onClick={onCreateReel}
              className="cursor-pointer rounded-lg bg-[#1877f2] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
            >
              Create reel
            </button>
          )}
        </div>

        {isLoading && reels.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d8dadf] py-16 text-center">
            <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-[#1877f2] border-t-transparent" />
            <p className={`text-sm ${theme.textSub}`}>Loading reels...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-12 text-center">
            <h3 className="text-lg font-bold text-red-600">Unable to load reels</h3>
            <p className="mt-2 max-w-md text-sm text-red-500">{error}</p>
          </div>
        ) : reels.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d8dadf] py-16 text-center">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f2f5] text-[#1877f2]">
              <Play size={28} fill="currentColor" />
            </div>
            <h3 className={`text-lg font-bold ${theme.text}`}>No reels yet</h3>
            <p className={`mt-2 max-w-md text-sm ${theme.textSub}`}>
              Share short videos, behind-the-scenes moments, and trending edits here.
            </p>
            {canCreate && (
              <button
                type="button"
                onClick={onCreateReel}
                className="mt-5 cursor-pointer rounded-lg bg-[#e7f3ff] px-4 py-2 text-sm font-semibold text-[#1877f2] transition-colors hover:bg-[#dbeeff]"
              >
                Make your first reel
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {reels.map((reel) => (
                <ReelCard
                  key={reel.id}
                  reel={reel}
                  onClick={() => handleOpenReel(reel)}
                  onLike={handleLike}
                />
              ))}
            </div>

            {hasMore && (
              <div ref={loadMoreRef} className="mt-4 flex justify-center py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1877f2] border-t-transparent" />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
