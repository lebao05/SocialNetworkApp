import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import ReelView from "../components/Reels/ReelView";
import { useReels } from "../contexts/ReelsContext";
import { toggleLikeReelApi, deleteReelApi } from "../apis/reelApi";

export default function ReelsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reelIdParam = searchParams.get("reelId");

  const {
    reelsList,
    isLoading,
    isLoadingMore,
    fetchRecommended,
    fetchRecommendedWithReel,
    updateReel,
    removeReel,
  } = useReels();

  const wheelTimerRef = useRef(null);
  const initDoneRef = useRef(false);

  // Slide animation state: direction + flag to trigger animation
  const [slideAnim, setSlideAnim] = useState(null); // { direction: 'down'|'up', reelId: string }

  // reelChosen = reel in list matching the URL reelId
  const reelChosen = useMemo(() => {
    if (!reelIdParam || reelsList.length === 0) return null;
    return reelsList.find((r) => String(r.id) === String(reelIdParam)) ?? null;
  }, [reelIdParam, reelsList]);

  const chosenIndex = useMemo(() => {
    if (!reelChosen) return -1;
    return reelsList.findIndex((r) => r.id === reelChosen.id);
  }, [reelChosen, reelsList]);

  // Track reelId changes → set slide animation
  const prevIndexRef = useRef(-1);

  useEffect(() => {
    if (!reelIdParam) return;
    const direction = prevIndexRef.current < chosenIndex ? "down" : "up";
    setSlideAnim({ direction, reelId: reelIdParam });
    prevIndexRef.current = chosenIndex;
    const timer = setTimeout(() => setSlideAnim(null), 450);
    return () => clearTimeout(timer);
  }, [reelIdParam, chosenIndex]);

  // Initial load: if no reelId in URL, load recommended and pick first
  useEffect(() => {
    if (initDoneRef.current) return;
    if (reelsList.length > 0) return;

    initDoneRef.current = true;
    fetchRecommended();
  }, []);

  // Once reels are loaded and no reelId in URL, set first reel
  useEffect(() => {
    if (!reelIdParam && reelsList.length > 0) {
      prevIndexRef.current = 0;
      navigate(`/watch?reelId=${reelsList[0].id}`, { replace: true });
    }
  }, [reelIdParam, reelsList.length]);

  // reelId in URL but not in list — fetch with that reel at top
  useEffect(() => {
    if (!reelIdParam) return;
    if (reelsList.length > 0 && reelChosen) return;

    fetchRecommendedWithReel(Number(reelIdParam));
  }, [reelIdParam]);

  // Wheel navigation → change URL reelId + trigger slide animation
  const navigateToReel = useCallback((reelId, direction) => {
    prevIndexRef.current = chosenIndex;
    setSlideAnim({ direction, reelId });
    navigate(`/watch?reelId=${reelId}`, { replace: true });
  }, [chosenIndex, navigate]);

  useEffect(() => {
    const handleWheel = (e) => {
      // Only intercept genuine vertical scroll gestures (deltaY threshold to avoid accidental flicks)
      if (Math.abs(e.deltaY) < 5) return;

      e.preventDefault();

      if (wheelTimerRef.current) return;
      wheelTimerRef.current = setTimeout(() => { wheelTimerRef.current = null; }, 500);

      if (e.deltaY > 0) {
        if (chosenIndex < reelsList.length - 1) {
          navigateToReel(reelsList[chosenIndex + 1].id, "down");
        }
      } else {
        if (chosenIndex > 0) {
          navigateToReel(reelsList[chosenIndex - 1].id, "up");
        }
      }
    };

    // Capture phase so no child element can stopPropagation on the event
    document.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    return () => document.removeEventListener("wheel", handleWheel, { capture: true });
  }, [chosenIndex, reelsList, navigateToReel]);

  // Handle like
  const handleLike = useCallback(async (reelId) => {
    const target = reelsList.find((r) => r.id === reelId);
    if (!target) return;
    const wasLiked = target.isLikedByCurrentUser;

    updateReel({
      id: reelId,
      isLikedByCurrentUser: !wasLiked,
      likeCount: wasLiked ? target.likeCount - 1 : target.likeCount + 1,
    });

    try {
      const result = await toggleLikeReelApi(reelId);
      updateReel({ id: reelId, isLikedByCurrentUser: result.isLiked, likeCount: result.likeCount ?? target.likeCount });
    } catch {
      updateReel({ id: reelId, isLikedByCurrentUser: wasLiked, likeCount: target.likeCount });
    }
  }, [reelsList, updateReel]);

  // Handle delete
  const handleDelete = useCallback(async (reelId) => {
    await deleteReelApi(reelId);
    removeReel(reelId);

    const updatedList = reelsList.filter((r) => r.id !== reelId);
    if (updatedList.length > 0) {
      const next = reelsList.find((r) => r.id === reelId) ?? reelsList[0];
      navigate(`/watch?reelId=${next.id}`, { replace: true });
    } else {
      navigate("/watch", { replace: true });
    }
  }, [reelsList, removeReel, navigate]);

  const goClose = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  // Build slide animation class
  const slideClass = slideAnim
    ? slideAnim.direction === "down"
      ? "animate-slide-down"
      : "animate-slide-up"
    : "";

  return (
    <>
      {/* Keyframe styles injected once */}
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-8%) scale(0.96); opacity: 0; }
          to   { transform: translateY(0)      scale(1);    opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(8%)  scale(0.96); opacity: 0; }
          to   { transform: translateY(0)  scale(1);    opacity: 1; }
        }
        .animate-slide-down {
          animation: slideDown 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        .animate-slide-up {
          animation: slideUp  0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        @keyframes bounceDown {
          0%   { transform: translateY(0); }
          30%  { transform: translateY(6px); }
          60%  { transform: translateY(-2px); }
          100% { transform: translateY(0); }
        }
        @keyframes bounceUp {
          0%   { transform: translateY(0); }
          30%  { transform: translateY(-6px); }
          60%  { transform: translateY(2px); }
          100% { transform: translateY(0); }
        }
        .animate-bounce-down { animation: bounceDown 0.6s ease-in-out; }
        .animate-bounce-up   { animation: bounceUp   0.6s ease-in-out; }
      `}</style>

      <div className="relative h-screen w-full overflow-hidden bg-white">
        <Navbar />

        {/* Spinner */}
        {isLoading && !reelChosen && (
          <div className="absolute inset-0 z-[800] flex items-center justify-center bg-white pt-16">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#1877f2] border-t-transparent" />
              <p className="text-[#65676b] text-sm">Loading reels...</p>
            </div>
          </div>
        )}

        {/* Reel viewer — 40% width, 95% height, centered on white bg */}
        {reelChosen && (
          <div className="absolute inset-0 flex items-center justify-center pt-16">
            <ReelView
              key={reelChosen.id}
              reel={reelChosen}
              className={`w-[40%] h-[95%] ${slideClass}`}
              onClose={goClose}
              onLike={handleLike}
              onDelete={handleDelete}
              canDelete={reelChosen.isOwnReel}
              direction={slideAnim?.direction ?? null}
            />
          </div>
        )}

        {/* Loading more indicator */}
        {isLoadingMore && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-white backdrop-blur-sm">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span className="text-sm font-medium">Loading more...</span>
          </div>
        )}
      </div>
    </>
  );
}
