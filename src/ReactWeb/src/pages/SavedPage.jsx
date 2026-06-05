import React, { useState, useCallback, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import LeftSidebar from "../components/Sidebar/LeftSidebar";
import PostCard from "../components/Feed/PostCard";
import { Bookmark, Search, Grid, List, X, Loader } from "lucide-react";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

// ── Mock saved posts — replace with API call once GET /api/posts/saved exists ──
const MOCK_SAVED = [
  {
    id: 101,
    post: {
      id: 101,
      content: "🚀 Season 3 hackathon registration is open! This year's theme is AI for Good.\n\nTop 3 teams share prizes worth 50 million VND. Register before April 15 👇",
      visibility: 0,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      author: {
        id: 2,
        firstName: "HCMUT",
        lastName: "Programming Club",
        avatarUrl: "https://i.pravatar.cc/150?img=60",
      },
      media: [{ id: 1, mediaUrl: "https://picsum.photos/seed/post01/680/400", mediaType: "image" }],
      reactionCounts: [{ reactionType: 0, count: 3241 }, { reactionType: 1, count: 218 }],
      commentCount: 418,
      commentsData: [],
    },
    savedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 102,
    post: {
      id: 102,
      content: "Finally deployed the app to production 😭🎉 Spent a week debugging CORS only to realize one header was missing. Learned a lot from this one! #webdev #reactjs",
      visibility: 1,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      author: {
        id: 3,
        firstName: "Minh",
        lastName: "Khôi",
        avatarUrl: "https://i.pravatar.cc/150?img=8",
      },
      media: [{ id: 2, mediaUrl: "https://picsum.photos/seed/post02/680/380", mediaType: "image" }],
      reactionCounts: [{ reactionType: 1, count: 142 }],
      commentCount: 37,
      commentsData: [],
    },
    savedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 103,
    post: {
      id: 103,
      content: "The weather today is so beautiful 🌞 I left early to avoid traffic and got to enjoy the sunrise. Feels good to start the day like this.",
      visibility: 0,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      author: {
        id: 4,
        firstName: "Hà",
        lastName: "Linh",
        avatarUrl: "https://i.pravatar.cc/150?img=44",
      },
      media: [{ id: 3, mediaUrl: "https://picsum.photos/seed/post03/680/420", mediaType: "image" }],
      reactionCounts: [{ reactionType: 0, count: 521 }, { reactionType: 1, count: 89 }],
      commentCount: 64,
      commentsData: [],
    },
    savedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 104,
    post: {
      id: 104,
      content: "📢 Semester 2 exam schedule for 2025-2026 is now available on the official site.\n\nCheck your schedule carefully. Good luck with studying! 💪📚",
      visibility: 0,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      author: {
        id: 5,
        firstName: "UIT",
        lastName: "Student Union",
        avatarUrl: "https://i.pravatar.cc/150?img=61",
      },
      media: [],
      reactionCounts: [{ reactionType: 0, count: 1893 }],
      commentCount: 712,
      commentsData: [],
    },
    savedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 105,
    post: {
      id: 105,
      content: "Reached Challenger rank after 3 months of grinding!! 🏆🔥 Thanks to the team for the support. Next season, let's do it again 💪",
      visibility: 1,
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      author: {
        id: 6,
        firstName: "Tuấn",
        lastName: "Kiệt",
        avatarUrl: "https://i.pravatar.cc/150?img=11",
      },
      media: [{ id: 4, mediaUrl: "https://picsum.photos/seed/post05/680/400", mediaType: "image" }],
      reactionCounts: [{ reactionType: 0, count: 289 }],
      commentCount: 93,
      commentsData: [],
    },
    savedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

function formatRelativeDate(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d`;
  return d.toLocaleDateString("vi-VN", { day: "numeric", month: "short", year: "numeric" });
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#f0f2f5]">
        <Bookmark size={36} className="text-[#bcc0c4]" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-[#050505]">Chưa có bài viết đã lưu</h2>
      <p className="mb-8 max-w-sm text-[15px] text-[#65676b] leading-relaxed">
        Lưu bài viết mà bạn muốn xem lại sau. Nhấn vào biểu tượng <span className="font-semibold text-[#050505]">dấu trang</span> trên bất kỳ bài viết nào để lưu nó vào đây.
      </p>
      <button
        type="button"
        className="rounded-lg bg-[#1877f2] px-6 py-2.5 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-[#166fe5]"
      >
        Tìm bài viết để lưu
      </button>
    </div>
  );
}

export default function SavedPage() {
  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState("grid"); // "grid" | "list"
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "posts" | "reels"
  const [isLoading, setIsLoading] = useState(false);
  const [savedItems, setSavedItems] = useState(MOCK_SAVED);
  const [removingId, setRemovingId] = useState(null);

  const filtered = savedItems.filter((item) => {
    if (activeFilter === "posts" && (!item.post.media || item.post.media.length === 0)) return false;
    if (activeFilter === "reels" && item.post.media?.length > 0) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.post.content?.toLowerCase().includes(q) ||
      `${item.post.author?.firstName} ${item.post.author?.lastName}`.toLowerCase().includes(q)
    );
  });

  const handleUnsave = useCallback(async (savedItemId) => {
    setRemovingId(savedItemId);
    // TODO: call unsavePostApi(savedItem.post.id) once API exists
    await new Promise((r) => setTimeout(r, 400));
    setSavedItems((prev) => prev.filter((s) => s.id !== savedItemId));
    setRemovingId(null);
  }, []);

  const FILTERS = [
    { key: "all", label: "Tất cả" },
    { key: "posts", label: "Bài viết" },
    { key: "reels", label: "Reels" },
  ];

  return (
    <div className="bg-[#f0f2f5] min-h-screen">
      <Navbar />

      <div className="pt-14">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
          {/* ── Header ── */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e7f3ff]">
                <Bookmark size={22} className="text-[#1877f2]" />
              </div>
              <div>
                <h1 className="text-[22px] font-bold text-[#050505] leading-tight">Đã lưu</h1>
                <p className="text-[13px] text-[#65676b]">{savedItems.length} mục đã lưu</p>
              </div>
            </div>
          </div>

          {/* ── Toolbar ── */}
          {savedItems.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {/* Filter tabs */}
              <div className="flex items-center gap-1 rounded-lg border border-[#ddd] bg-white p-1">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setActiveFilter(f.key)}
                    className={`rounded-md px-3 py-1.5 text-[14px] font-semibold transition-colors ${
                      activeFilter === f.key
                        ? "bg-[#1877f2] text-white"
                        : "text-[#65676b] hover:bg-[#f2f2f2]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex-1" />

              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#65676b]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="h-9 w-44 rounded-lg border border-[#ddd] bg-white pl-9 pr-3 text-[14px] text-[#050505] placeholder-[#bcc0c4] outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2]/20 sm:w-56"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#bcc0c4] hover:text-[#65676b]"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Layout toggle */}
              <div className="flex items-center gap-0.5 rounded-lg border border-[#ddd] bg-white p-1">
                <button
                  type="button"
                  onClick={() => setLayout("grid")}
                  className={`rounded p-1.5 transition-colors ${layout === "grid" ? "bg-[#e7f3ff] text-[#1877f2]" : "text-[#65676b] hover:bg-[#f2f2f2]"}`}
                  title="Lưới"
                >
                  <Grid size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setLayout("list")}
                  className={`rounded p-1.5 transition-colors ${layout === "list" ? "bg-[#e7f3ff] text-[#1877f2]" : "text-[#65676b] hover:bg-[#f2f2f2]"}`}
                  title="Danh sách"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="mx-auto max-w-2xl px-4 pb-8 sm:px-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader size={28} className="animate-spin text-[#1877f2]" />
              <p className="text-[14px] text-[#65676b]">Đang tải bài viết đã lưu...</p>
            </div>
          ) : filtered.length === 0 ? (
            search ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f2f5]">
                  <Search size={24} className="text-[#bcc0c4]" />
                </div>
                <p className="text-[15px] font-semibold text-[#050505]">Không tìm thấy kết quả</p>
                <p className="mt-1 text-[13px] text-[#65676b]">Thử từ khóa khác</p>
              </div>
            ) : (
              <EmptyState />
            )
          ) : layout === "grid" ? (
            <div className="grid grid-cols-3 gap-2">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-[#f0f2f5] cursor-pointer"
                >
                  {item.post.media?.[0] ? (
                    <img
                      src={item.post.media[0].mediaUrl}
                      alt="saved"
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-white">
                      <p className="line-clamp-4 px-3 text-[13px] text-[#65676b]">{item.post.content}</p>
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex items-center gap-1.5 text-white text-[13px] font-semibold">
                      <span>
                        {(item.post.reactionCounts || []).reduce((s, r) => s + r.count, 0).toLocaleString()}
                      </span>
                      <span>👍</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleUnsave(item.id); }}
                      disabled={removingId === item.id}
                      className="flex items-center gap-1 rounded-md bg-white/20 px-2 py-1 text-[12px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30 disabled:opacity-50"
                    >
                      <Bookmark size={12} className="fill-white" />
                      {removingId === item.id ? "..." : "Bỏ lưu"}
                    </button>
                  </div>
                  {/* Saved date */}
                  <div className="absolute top-2 left-2 rounded-md bg-black/50 px-2 py-0.5 text-[11px] text-white backdrop-blur-sm">
                    Đã lưu {formatRelativeDate(item.savedAt)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((item) => (
                <div key={item.id} className="relative">
                  <PostCard key={item.id} post={item.post} />
                  <div className="absolute right-4 top-4 flex items-center gap-2">
                    <span className="rounded-md bg-black/50 px-2 py-0.5 text-[11px] text-white backdrop-blur-sm">
                      Đã lưu {formatRelativeDate(item.savedAt)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUnsave(item.id)}
                      disabled={removingId === item.id}
                      className="flex items-center gap-1 rounded-md bg-white/90 px-3 py-1.5 text-[13px] font-semibold text-[#050505] shadow-sm backdrop-blur-sm transition-colors hover:bg-white disabled:opacity-50"
                    >
                      <Bookmark size={14} className="text-[#65676b]" />
                      {removingId === item.id ? "..." : "Bỏ lưu"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <LeftSidebar />
    </div>
  );
}
