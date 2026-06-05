import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Play, Sparkles } from "lucide-react";
import { reels } from "../../data/reelsMockData";

function formatBadge(value) {
  return typeof value === "number" ? value.toLocaleString() : value;
}

export default function HomeReelsRail() {
  const featuredReels = reels.slice(0, 6);

  return (
    <section className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#eef0f3] px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e7f3ff] text-[#1877f2]">
            <Play size={20} fill="currentColor" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-bold text-[#050505]">Reels</h2>
              <span className="rounded-full bg-[#f0f2f5] px-2 py-0.5 text-[11px] font-semibold text-[#65676b]">
                Fresh picks
              </span>
            </div>
            <p className="text-[13px] text-[#65676b]">Short videos from creators you may like</p>
          </div>
        </div>

        <Link
          to="/watch"
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[13px] font-semibold text-[#1877f2] transition-colors hover:bg-[#f2f2f2]"
        >
          Watch all
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className="px-4 pb-4 pt-4 sm:px-5">
        <div className="scrollbar-thin -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
          {featuredReels.map((reel) => (
            <Link
              key={reel.id}
              to="/watch"
              className="group relative block aspect-[9/16] w-[150px] min-w-[150px] overflow-hidden rounded-2xl bg-black shadow-sm ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <img
                src={reel.poster}
                alt={reel.caption}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/85" />

              <div className="absolute left-3 top-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm">
                  <Play size={15} fill="currentColor" />
                </div>
                <div className="rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  {formatBadge(reel.likes)}
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <div className="mb-2 flex items-center gap-2">
                  <img
                    src={reel.avatar}
                    alt={reel.author}
                    className="h-8 w-8 rounded-full border border-white/40 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold">{reel.author}</p>
                    <p className="truncate text-[11px] text-white/70">{reel.handle}</p>
                  </div>
                </div>
                <p className="line-clamp-3 text-[12px] font-medium leading-snug text-white/95">
                  {reel.caption}
                </p>
              </div>
            </Link>
          ))}

          <Link
            to="/watch"
            className="group flex aspect-[9/16] w-[150px] min-w-[150px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#d8dadf] bg-[#f8fafc] px-4 text-center transition-colors hover:bg-[#eef6ff]"
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#e7f3ff] text-[#1877f2]">
              <Sparkles size={20} />
            </div>
            <p className="text-[14px] font-bold text-[#050505]">Discover more</p>
            <p className="mt-1 text-[12px] leading-snug text-[#65676b]">
              Explore trending reels and new creators.
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
