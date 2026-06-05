import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Heart, MessageCircle, MoreHorizontal, Play, Send, Volume2, X } from "lucide-react";

function ReelCard({ reel, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-black text-left shadow-sm"
    >
      <img src={reel.poster} alt={reel.caption} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80" />
      <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm">
        <Play size={18} fill="currentColor" />
      </div>
      <div className="absolute right-3 top-3 rounded-full bg-black/35 px-2.5 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
        {reel.likes} likes
      </div>
      <div className="absolute left-3 top-14 rounded-full bg-black/35 px-2.5 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
        {reel.views} views
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
        <div className="mb-2 flex items-center gap-2">
          <img src={reel.avatar} alt={reel.author} className="h-9 w-9 rounded-full border border-white/40 object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold">{reel.author}</p>
            <p className="truncate text-[12px] text-white/75">{reel.handle}</p>
          </div>
        </div>
        <p className="line-clamp-2 text-[13px] font-medium leading-snug text-white/95">{reel.caption}</p>
      </div>
    </button>
  );
}

function ReelViewer({ reel, onClose, onPrev, onNext, hasPrev, hasNext }) {
  if (!reel) return null;

  const actions = [
    { icon: Heart, label: reel.likes },
    { icon: MessageCircle, label: reel.comments },
    { icon: Eye, label: reel.views },
    { icon: Send, label: reel.userReaction || "Reacted" },
    { icon: MoreHorizontal, label: "" },
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/35"
      >
        <X size={22} />
      </button>

      {hasPrev && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/35"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {hasNext && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/35"
        >
          <ChevronRight size={24} />
        </button>
      )}

      <div className="relative flex max-h-[90vh] w-[min(520px,calc(100vw-32px))] items-center justify-center" onClick={(event) => event.stopPropagation()}>
        <article className="relative h-[min(86vh,860px)] w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
          <img src={reel.poster} alt={reel.caption} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/80" />
          <button type="button" className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white">
            <Play size={21} fill="currentColor" />
          </button>
          <button type="button" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white">
            <Volume2 size={20} />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="mb-3 flex items-center gap-2.5">
              <img src={reel.avatar} alt={reel.author} className="h-10 w-10 rounded-full border border-white/40 object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-[14px] font-bold">
                  <span className="truncate">{reel.author}</span>
                  {reel.verified && <span className="text-[#58a6ff]">●</span>}
                  <span className="font-semibold text-white/80">· Follow</span>
                </div>
                <p className="truncate text-[12px] text-white/75">{reel.handle}</p>
              </div>
            </div>
            <p className="text-[13px] font-medium leading-snug text-white/95">{reel.caption}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] font-semibold text-white/80">
              <span className="rounded-full bg-white/10 px-2.5 py-1">{reel.views} views</span>
              {reel.userReaction && <span className="rounded-full bg-white/10 px-2.5 py-1">Your reaction: {reel.userReaction}</span>}
              {reel.duration && <span className="rounded-full bg-white/10 px-2.5 py-1">{reel.duration}</span>}
            </div>
          </div>
        </article>

        <div className="absolute bottom-5 left-full ml-4 hidden flex-col items-center gap-5 text-[#050505] md:flex">
          {actions.map(({ icon: Icon, label }, index) => (
            <button key={index} type="button" className="flex flex-col items-center gap-1 text-[12px] font-semibold text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30">
                <Icon size={20} />
              </span>
              {label !== "" && <span>{label}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProfileReelsTab({ theme, reels = [], onCreateReel, canCreate = false, isLoading = false, error = null }) {
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (activeIndex === null) return;
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") setActiveIndex((current) => (current > 0 ? current - 1 : current));
      if (event.key === "ArrowRight") setActiveIndex((current) => (current < reels.length - 1 ? current + 1 : current));
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, reels.length]);

  const activeReel = activeIndex !== null ? reels[activeIndex] : null;

  return (
    <>
      <ReelViewer
        reel={activeReel}
        onClose={() => setActiveIndex(null)}
        onPrev={() => setActiveIndex((current) => Math.max(0, current - 1))}
        onNext={() => setActiveIndex((current) => Math.min(reels.length - 1, current + 1))}
        hasPrev={activeIndex > 0}
        hasNext={activeIndex !== null && activeIndex < reels.length - 1}
      />

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
              className="rounded-lg cursor-pointer bg-[#1877f2] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
            >
              Create reel
            </button>
          )}
        </div>

        {isLoading ? (
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
                className="mt-5 rounded-lg cursor-pointer bg-[#e7f3ff] px-4 py-2 text-sm font-semibold text-[#1877f2] transition-colors hover:bg-[#dbeeff]"
              >
                Make your first reel
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {reels.map((reel, index) => (
              <ReelCard key={reel.id} reel={reel} onClick={() => setActiveIndex(index)} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
