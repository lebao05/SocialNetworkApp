import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Eye,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Play,
  Square,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useReelComments } from "../../hooks/useReelComments";
import { recordReelViewApi } from "../../apis/reelApi";
import ReelCommentModal from "./ReelCommentModal";

function formatCount(value) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return "0";
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(num);
}

export default function ReelView({
  reel,
  className = "",
  onClose,
  onLike,
  onDelete,
  canDelete = false,
  direction = null, // 'up' | 'down' | null
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [directionVisible, setDirectionVisible] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const directionHintRef = useRef(null);
  const viewedRef = useRef(false);

  const {
    comments,
    hasMore: hasMoreComments,
    isLoading: isLoadingComments,
    isSubmitting,
    error: commentError,
    replyTarget,
    loadingReplyParentIds,
    loadMore: loadMoreComments,
    refresh: refreshComments,
    submitComment,
    startReply,
    cancelReply,
    loadReplies,
  } = useReelComments(isCommentModalOpen ? reel?.id : null);

  const handleSubmitComment = useCallback(async () => {
    if (!newComment.trim()) return;
    try {
      await submitComment({
        content: newComment,
        parentCommentId: replyTarget?.id ?? null,
        repliedUserId: null,
      });
      setNewComment("");
    } catch {
      // error handled in hook
    }
  }, [newComment, replyTarget, submitComment]);

  // Show direction hint, fade out after 600ms
  useEffect(() => {
    if (!direction) return;
    setDirectionVisible(true);
    clearTimeout(directionHintRef.current);
    directionHintRef.current = setTimeout(() => setDirectionVisible(false), 600);
    return () => clearTimeout(directionHintRef.current);
  }, [direction, reel?.id]);

  // Reset video + record view when reel changes
  useEffect(() => {
    setIsPlaying(false);
    setIsMuted(false);
    viewedRef.current = false;

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
      const id = setTimeout(() => {
        videoRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
      }, 80);
      return () => clearTimeout(id);
    }
  }, [reel?.id]);

  // Record a view — fires once per reel session (debounced by viewedRef)
  useEffect(() => {
    if (!reel?.id || viewedRef.current) return;
    viewedRef.current = true;
    const timer = setTimeout(() => {
      recordReelViewApi(reel.id).catch(() => {});
    }, 2000);
    return () => clearTimeout(timer);
  }, [reel?.id]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  }, []);

  const handleLike = useCallback(() => {
    if (!reel || isLiking) return;
    setIsLiking(true);
    onLike(reel.id);
    setTimeout(() => setIsLiking(false), 500);
  }, [reel, isLiking, onLike]);

  const handleDelete = useCallback(() => {
    if (!reel || !canDelete) return;
    onDelete(reel.id);
  }, [reel, canDelete, onDelete]);

  const handleOpenComments = useCallback(() => {
    setIsCommentModalOpen(true);
  }, []);

  const handleCloseComments = useCallback(() => {
    setIsCommentModalOpen(false);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    if (!reel) return;
    const handleKey = (e) => {
      if (e.key === " " || e.key === "k") { e.preventDefault(); togglePlay(); }
      if (e.key === "m") toggleMute();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [reel, togglePlay, toggleMute, onClose]);

  if (!reel) return null;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-black ${className}`}>
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute left-3 top-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {/* Video fills the container */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        poster={reel.poster || reel.thumbnailUrl}
        className="h-full w-full object-cover"
        playsInline
        preload="metadata"
        muted={isMuted}
        autoPlay
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
      />

      {/* Play/pause overlay */}
      <button
        type="button"
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {!isPlaying && (
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/30 text-white">
            <Play size={24} fill="currentColor" />
          </span>
        )}
      </button>

      {/* Direction hint — fades out after appearing */}
      {direction && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-opacity duration-300 ${
              direction === "down" ? "animate-bounce-down" : "animate-bounce-up"
            }`}
            style={{ opacity: directionVisible ? 1 : 0 }}
          >
            {direction === "down" ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z" />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* Views badge — below close button */}
      <div className="absolute left-3 top-14 z-10 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
        <Eye size={11} className="mr-1 inline" />
        {formatCount(reel.viewCount)} views
      </div>

      {/* Top right controls */}
      <div className="absolute right-14 top-3 z-10 flex items-center gap-1.5">
        <button
          type="button"
          onClick={togglePlay}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>

      {/* Bottom info — left side, clear of sidebar */}
      <div className="absolute bottom-0 left-0 right-16 flex items-end gap-3 p-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {/* Author */}
          <div className="flex items-center gap-2">
            <img
              src={reel.avatar || reel.authorAvatarUrl}
              alt={reel.author || reel.authorName}
              className="h-9 w-9 flex-shrink-0 rounded-full border-2 border-white/40 object-cover"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="truncate text-[14px] font-bold text-white">
                  {reel.author || reel.authorName}
                </span>
                {reel.verified && (
                  <svg className="h-3.5 w-3.5 flex-shrink-0 text-[#58a6ff]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </div>
              <p className="truncate text-[11px] text-white/70">{reel.handle}</p>
            </div>
            <button
              type="button"
              className="flex-shrink-0 rounded-full border border-white px-2.5 py-0.5 text-[11px] font-semibold text-white transition-colors hover:bg-white hover:text-black"
            >
              Follow
            </button>
          </div>

          {/* Caption */}
          {reel.caption && (
            <p className="line-clamp-2 text-[13px] font-medium leading-snug text-white">
              {reel.caption}
            </p>
          )}

          {/* Audio */}
          {reel.audioTitle && (
            <div className="flex items-center gap-1.5 text-[12px] text-white">
              <svg className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
              <span className="truncate">{reel.audioTitle}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right sidebar actions */}
      <div className="absolute bottom-0 right-0 flex flex-col items-center gap-4 p-4">
        {/* Like */}
        <button type="button" onClick={handleLike} className="flex flex-col items-center gap-0.5 text-white">
          <span className={`flex h-10 w-10 items-center justify-center rounded-full bg-black/20 transition-all hover:scale-110 ${reel.isLikedByCurrentUser ? "text-rose-500" : ""}`}>
            <Heart size={20} fill={reel.isLikedByCurrentUser ? "currentColor" : "none"} />
          </span>
          <span className="text-[11px] font-semibold">{formatCount(reel.likeCount)}</span>
        </button>

        {/* Comment */}
        <button type="button" onClick={handleOpenComments} className="flex flex-col items-center gap-0.5 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 hover:scale-110">
            <MessageCircle size={20} />
          </span>
          <span className="text-[11px] font-semibold">{formatCount(reel.commentCount)}</span>
        </button>

        {/* Bookmark */}
        <button type="button" className="flex flex-col items-center gap-0.5 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 hover:scale-110">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          <span className="text-[11px] font-semibold">Save</span>
        </button>

        {/* Share */}
        <button
          type="button"
          className="flex flex-col items-center gap-0.5 text-white"
          onClick={() => {
            if (navigator.share) {
              navigator.share({ url: window.location.href });
            } else {
              navigator.clipboard.writeText(window.location.href);
            }
          }}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 hover:scale-110">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </span>
          <span className="text-[11px] font-semibold">Share</span>
        </button>

        {/* More */}
        <button type="button" className="flex flex-col items-center gap-0.5 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 hover:scale-110">
            <MoreHorizontal size={20} />
          </span>
        </button>

        {/* Delete */}
        {canDelete && (
          <button type="button" onClick={handleDelete} className="flex flex-col items-center gap-0.5 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-red-400 hover:scale-110 hover:bg-red-500/20">
              <Trash2 size={20} />
            </span>
            <span className="text-[11px] font-semibold">Delete</span>
          </button>
        )}

        {/* Audio disc */}
        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border-2 border-white/30">
          <img
            src={reel.avatar || reel.authorAvatarUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Comment modal */}
      <ReelCommentModal
        isOpen={isCommentModalOpen}
        onClose={handleCloseComments}
        reel={reel}
        comments={comments}
        newComment={newComment}
        onNewCommentChange={setNewComment}
        onSubmitComment={handleSubmitComment}
        isSubmitting={isSubmitting}
        isLoadingComments={isLoadingComments}
        error={commentError}
        hasMoreComments={hasMoreComments}
        onLoadMoreComments={loadMoreComments}
        onLoadReplies={loadReplies}
        loadingReplyParentIds={loadingReplyParentIds}
        replyTarget={replyTarget}
        onStartReply={startReply}
        onCancelReply={cancelReply}
        onReactComment={() => {}}
      />
    </div>
  );
}
