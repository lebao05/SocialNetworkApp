import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  MessageCircle,
  Play,
  Send,
  Square,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

function formatCount(value) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return "0";
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(num);
}

export default function ReelViewModal({
  reel,
  reelsList,
  onClose,
  onLike,
  onDelete,
  canDelete,
  onNext,
  onPrev,
  hasPrev,
  hasNext,
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    setIsMuted(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }, [reel?.id]);

  useEffect(() => {
    if (!hasNext || !onNext) return;
    const video = videoRef.current;
    if (!video) return;
    const handleEnded = () => onNext();
    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [hasNext, onNext]);

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
    onClose();
  }, [reel, canDelete, onDelete, onClose]);

  useEffect(() => {
    if (!reel) return;
    const handleKey = (e) => {
      if (e.key === " " || e.key === "k") { e.preventDefault(); togglePlay(); }
      if (e.key === "m") toggleMute();
      if (e.key === "ArrowUp") { e.preventDefault(); if (hasPrev) onPrev?.(); }
      if (e.key === "ArrowDown") { e.preventDefault(); if (hasNext) onNext?.(); }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [reel, togglePlay, toggleMute, onNext, onPrev, onClose, hasPrev, hasNext]);

  if (!reel) return null;

  const actions = [
    {
      icon: Heart,
      label: formatCount(reel.likeCount),
      onClick: handleLike,
      active: reel.isLikedByCurrentUser,
      activeColor: "text-rose-500",
      fill: reel.isLikedByCurrentUser,
    },
    {
      icon: MessageCircle,
      label: formatCount(reel.commentCount),
      onClick: () => {},
      active: false,
    },
    {
      icon: Send,
      label: "Share",
      onClick: () => {
        if (navigator.share) {
          navigator.share({ url: window.location.href });
        } else {
          navigator.clipboard.writeText(window.location.href);
        }
      },
      active: false,
    },
    {
      icon: Eye,
      label: formatCount(reel.viewCount),
      onClick: () => {},
      active: false,
    },
    ...(canDelete
      ? [{
          icon: Trash2,
          label: "",
          onClick: handleDelete,
          active: false,
          danger: true,
        }]
      : []),
  ];

  return (
    <div
      className="fixed inset-0 z-[900] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      {/* Small centered reel card */}
      <div
        className="relative flex w-[min(400px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            {hasPrev && (
              <button
                type="button"
                onClick={onPrev}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                aria-label="Previous"
              >
                <ChevronLeft size={18} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Video area */}
        <div className="relative aspect-[9/16] w-full bg-black">
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

          {/* Play button overlay */}
          {!isPlaying && (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center"
              aria-label="Play"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60">
                <Play size={24} fill="currentColor" />
              </span>
            </button>
          )}

          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

          {/* Action buttons on the right side of video */}
          <div className="absolute bottom-4 right-3 flex flex-col items-center gap-4">
            {actions.map(({ icon: Icon, label, onClick, active, activeColor, fill, danger }, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => { e.stopPropagation(); onClick?.(); }}
                className={`flex flex-col items-center gap-0.5 text-white ${danger ? "hover:opacity-80" : ""}`}
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-all hover:bg-black/50 ${active ? activeColor : ""} ${danger ? "hover:bg-red-500/30" : ""}`}>
                  <Icon size={18} fill={fill ? "currentColor" : "none"} />
                </span>
                {label && <span className="text-[10px] font-semibold">{label}</span>}
              </button>
            ))}
          </div>

          {/* Next button on video */}
          {hasNext && (
            <button
              type="button"
              onClick={onNext}
              className="absolute bottom-4 left-3 flex items-center gap-1 rounded-full bg-black/30 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-black/50"
              aria-label="Next reel"
            >
              <ChevronRight size={14} />
              Next
            </button>
          )}
        </div>

        {/* Bottom info */}
        <div className="bg-black px-3 pb-4 pt-2">
          {/* Author */}
          <div className="mb-2 flex items-center gap-2">
            <img
              src={reel.avatar || reel.authorAvatarUrl}
              alt={reel.author || reel.authorName}
              className="h-8 w-8 rounded-full border border-white/30 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold text-white">{reel.author || reel.authorName}</p>
              {reel.audioTitle && (
                <p className="truncate text-[11px] text-white/60">{reel.audioTitle}</p>
              )}
            </div>
          </div>
          {reel.caption && (
            <p className="line-clamp-2 text-[12px] font-medium leading-snug text-white/90">
              {reel.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
