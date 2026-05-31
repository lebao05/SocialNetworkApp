import React, { useState } from "react";
import { ChevronDown, ChevronUp, Heart, MessageCircle, MoreHorizontal, Play, Send, ThumbsUp, Volume2 } from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import { reels } from "../data/reelsMockData";

function ReelActions({ reel }) {
  const actions = [
    { icon: ThumbsUp, label: reel.likes },
    { icon: MessageCircle, label: reel.comments },
    { icon: Send, label: reel.shares },
    { icon: MoreHorizontal, label: "" },
  ];

  return (
    <div className="absolute bottom-5 left-full ml-4 hidden flex-col items-center gap-5 text-[#050505] md:flex">
      {actions.map(({ icon: Icon, label }, index) => (
        <button key={index} type="button" className="flex flex-col items-center gap-1 text-[12px] font-semibold">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/10 hover:bg-[#f2f2f2]">
            <Icon size={22} />
          </span>
          {label !== "" && <span>{label}</span>}
        </button>
      ))}
    </div>
  );
}

function ReelCard({ reel }) {
  return (
    <article className="relative h-[calc(100vh-84px)] max-h-[860px] min-h-[640px] w-[min(520px,calc(100vw-24px))] overflow-hidden rounded-lg bg-black shadow-sm">
      <img src={reel.poster} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/75" />

      <button type="button" className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white hover:bg-black/50">
        <Play size={22} fill="currentColor" />
      </button>
      <button type="button" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white hover:bg-black/50">
        <Volume2 size={21} />
      </button>

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
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

      <div className="absolute bottom-4 right-4 flex gap-1 md:hidden">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white">
          <Heart size={18} />
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white">
          <MessageCircle size={18} />
        </span>
      </div>

      <ReelActions reel={reel} />
    </article>
  );
}

export default function ReelsPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeReel = reels[activeIndex];

  const goPrev = () => setActiveIndex((index) => Math.max(0, index - 1));
  const goNext = () => setActiveIndex((index) => Math.min(reels.length - 1, index + 1));

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#050505]">
      <Navbar />
      <main className="flex min-h-screen items-center justify-center px-3 pb-3 pt-16">
        <div className="relative">
          <ReelCard reel={activeReel} />

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
              disabled={activeIndex === reels.length - 1}
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
