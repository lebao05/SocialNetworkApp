import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Heart, MessageCircle, Play, Send, ThumbsUp, Volume2, X } from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import { reels } from "../data/reelsMockData";

function ReelCommentsPanel({ reel, onClose }) {
  const [commentInput, setCommentInput] = useState("");
  const comments = reel.commentList || [];

  return (
    <aside className="flex h-[calc(100vh-84px)] min-h-[640px] w-full max-w-[420px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_18px_50px_rgba(0,0,0,0.18)] ring-1 ring-black/5">
      <div className="flex items-center justify-between border-b border-[#e4e6eb] px-4 py-4">
        <div>
          <h2 className="text-[18px] font-bold text-[#050505]">Comments</h2>
          <p className="mt-0.5 text-[12px] text-[#65676b]">{reel.comments} comments on this reel</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f2f5] text-[#050505] transition hover:bg-[#e4e6eb]"
          aria-label="Close comments"
        >
          <X size={18} />
        </button>
      </div>

      <div className="border-b border-[#e4e6eb] px-4 py-4">
        <div className="flex items-start gap-3">
          <img src={reel.avatar} alt={reel.author} className="h-11 w-11 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-[14px] font-bold text-[#050505]">
              <span className="truncate">{reel.author}</span>
              {reel.verified && <span className="text-[#1877f2]">●</span>}
            </div>
            <p className="mt-1 text-[13px] leading-5 text-[#1c1e21]">{reel.caption}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-3">
            <img src={comment.avatar} alt={comment.author} className="h-9 w-9 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <div className="rounded-2xl bg-[#f0f2f5] px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[13px] font-semibold text-[#050505]">{comment.author}</p>
                  <span className="text-[11px] text-[#65676b]">{comment.handle}</span>
                </div>
                <p className="mt-1 text-[13px] leading-5 text-[#1c1e21]">{comment.text}</p>
              </div>
              <div className="mt-1.5 flex items-center gap-4 px-2 text-[11px] font-semibold text-[#65676b]">
                <span>{comment.time}</span>
                <button type="button" className="transition hover:text-[#050505]">Like</button>
                <button type="button" className="transition hover:text-[#050505]">Reply</button>
                <span>{comment.likes} likes</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#e4e6eb] px-4 py-3">
        <div className="flex items-center gap-3 rounded-full bg-[#f0f2f5] px-4 py-2.5">
          <input
            value={commentInput}
            onChange={(event) => setCommentInput(event.target.value)}
            type="text"
            placeholder="Write a comment..."
            className="min-w-0 flex-1 bg-transparent text-sm text-[#050505] outline-none placeholder:text-[#65676b]"
          />
          <button
            type="button"
            disabled={!commentInput.trim()}
            className={`transition ${commentInput.trim() ? "text-[#1877f2] hover:text-[#0f5fd7]" : "text-[#bcc0c4]"}`}
            aria-label="Send comment"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function ReelActions({ reel, onOpenComments }) {
  const actions = [
    { icon: ThumbsUp, label: "Like", count: reel.likes },
    { icon: MessageCircle, label: "Comment", count: reel.comments, onClick: onOpenComments },
    { icon: Send, label: "Share", count: reel.shares },
  ];

  return (
    <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 text-white md:flex">
      {actions.map(({ icon: Icon, label, count, onClick }) => (
        <button
          key={label}
          type="button"
          onClick={onClick}
          className="flex flex-col items-center gap-1 text-[12px] font-semibold"
          aria-label={label}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45 ring-1 ring-white/15 backdrop-blur-sm transition hover:bg-black/60">
            <Icon size={22} />
          </span>
          <span>{count}</span>
        </button>
      ))}
    </div>
  );
}

function ReelCard({ reel, onOpenComments }) {
  return (
    <article className="relative h-[calc(100vh-84px)] max-h-[860px] min-h-[640px] w-[min(520px,calc(100vw-24px))] overflow-hidden rounded-2xl bg-black shadow-sm">
      <img src={reel.poster} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/75" />

      <button type="button" className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white hover:bg-black/50">
        <Play size={22} fill="currentColor" />
      </button>
      <button type="button" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white hover:bg-black/50 md:right-20">
        <Volume2 size={21} />
      </button>

      <div className="absolute bottom-0 left-0 right-0 p-4 pr-20 text-white md:pr-24">
        <div className="mb-2 flex items-center gap-2">
          <img src={reel.avatar} alt="" className="h-10 w-10 rounded-full border border-white/40 object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-[14px] font-bold">
              <span className="truncate">{reel.author}</span>
              {reel.verified && <span className="text-[#58a6ff]">●</span>}
              <span className="font-semibold text-white/80">· Đăng ký</span>
            </div>
            <p className="truncate text-[12px] text-white/80">{reel.handle}</p>
          </div>
        </div>
        <p className="line-clamp-2 text-[13px] font-medium leading-snug">{reel.caption}</p>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-black/30 px-3 py-2 text-white backdrop-blur-sm md:hidden">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-1.5 text-[12px] font-semibold"
          aria-label="Like reel"
        >
          <Heart size={16} />
          <span>{reel.likes}</span>
        </button>
        <button
          type="button"
          onClick={onOpenComments}
          className="flex flex-1 items-center justify-center gap-1.5 text-[12px] font-semibold"
          aria-label="Open comments"
        >
          <MessageCircle size={16} />
          <span>{reel.comments}</span>
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-1.5 text-[12px] font-semibold"
          aria-label="Share reel"
        >
          <Send size={16} />
          <span>{reel.shares}</span>
        </button>
      </div>

      <ReelActions reel={reel} onOpenComments={onOpenComments} />
    </article>
  );
}

export default function ReelsPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const activeReel = reels[activeIndex];
  const pageReels = useMemo(() => reels, []);

  const goPrev = () => {
    setActiveIndex((index) => Math.max(0, index - 1));
    setIsCommentsOpen(false);
  };

  const goNext = () => {
    setActiveIndex((index) => Math.min(pageReels.length - 1, index + 1));
    setIsCommentsOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#050505]">
      <Navbar />
      <main className="flex min-h-screen items-center justify-center px-3 pb-3 pt-16">
        <div className="relative flex w-full items-center justify-center">
          <div className={`relative flex w-full items-center justify-center ${isCommentsOpen ? "max-w-[980px] lg:gap-6" : "max-w-[520px]"}`}>
            <ReelCard reel={activeReel} onOpenComments={() => setIsCommentsOpen(true)} />

            {isCommentsOpen && <div className="fixed inset-0 z-30 bg-black/25 lg:hidden" onClick={() => setIsCommentsOpen(false)} />}

            {isCommentsOpen && (
              <div className="fixed bottom-0 right-0 top-14 z-40 w-full max-w-[430px] p-3 transition-transform duration-300 lg:static lg:w-[420px] lg:max-w-none lg:p-0">
                <ReelCommentsPanel reel={activeReel} onClose={() => setIsCommentsOpen(false)} />
              </div>
            )}
          </div>

          <div className="fixed right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
            <button
              type="button"
              onClick={goPrev}
              disabled={activeIndex === 0}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#65676b] shadow-sm ring-1 ring-black/10 hover:bg-[#f2f2f2] disabled:opacity-40"
            >
              <ChevronUp size={26} />
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={activeIndex === pageReels.length - 1}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#65676b] shadow-sm ring-1 ring-black/10 hover:bg-[#f2f2f2] disabled:opacity-40"
            >
              <ChevronDown size={26} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
