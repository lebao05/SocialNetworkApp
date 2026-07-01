import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import LeftSidebar from "../components/Sidebar/LeftSidebar";
import PostCard from "../components/Feed/PostCard";
import { Bookmark, Search, X } from "lucide-react";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

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
    },
    savedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 106,
    post: {
      id: 106,
      content: "Beautiful sunset at the beach 🌅 Nothing beats the calm of the ocean.",
      visibility: 0,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      author: {
        id: 7,
        firstName: "Lan",
        lastName: "Anh",
        avatarUrl: "https://i.pravatar.cc/150?img=47",
      },
      media: [{ id: 5, mediaUrl: "https://picsum.photos/seed/post06/680/420", mediaType: "image" }],
      reactionCounts: [{ reactionType: 0, count: 876 }, { reactionType: 1, count: 45 }],
      commentCount: 120,
    },
    savedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const COLLECTIONS = [
  {
    id: "all",
    name: "Tất cả ảnh đã lưu",
    icon: <Bookmark size={16} className="text-[#1877f2]" />,
  },
  {
    id: "profile",
    name: "Ảnh trên trang cá nhân của bạn",
    icon: <Bookmark size={16} className="text-[#65676b]" />,
  },
  {
    id: "withyou",
    name: "Ảnh có bạn",
    icon: <Bookmark size={16} className="text-[#65676b]" />,
  },
  {
    id: "saveditems",
    name: "Mục đã lưu",
    icon: <Bookmark size={16} className="text-[#65676b]" />,
  },
];

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState("saved");
  const [activeCollection, setActiveCollection] = useState("all");
  const [search, setSearch] = useState("");
  const [savedItems, setSavedItems] = useState(MOCK_SAVED);
  const [removingId, setRemovingId] = useState(null);

  const filtered = savedItems.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.post.content?.toLowerCase().includes(q) ||
      `${item.post.author?.firstName} ${item.post.author?.lastName}`.toLowerCase().includes(q)
    );
  });

  const handleUnsave = async (savedItemId) => {
    setRemovingId(savedItemId);
    await new Promise((r) => setTimeout(r, 400));
    setSavedItems((prev) => prev.filter((s) => s.id !== savedItemId));
    setRemovingId(null);
  };

  return (
    <div className="bg-[#f0f2f5] min-h-screen">
      <Navbar />

      <div className="pt-14 flex">
        {/* ── Left Sidebar ── */}
        <LeftSidebar />

        {/* ── Main Content ── */}
        <main className="flex-1 min-h-[calc(100vh-56px)] ml-[280px]">
          {/* ── Tabs header ── */}
          <div className="sticky top-14 z-10 bg-white border-b border-[#ddd]">
            <div className="flex items-center px-6">
              <button
                type="button"
                onClick={() => setActiveTab("collections")}
                className={`px-5 py-3 text-[15px] font-semibold border-b-2 transition-colors ${
                  activeTab === "collections"
                    ? "border-[#1877f2] text-[#1877f2]"
                    : "border-transparent text-[#65676b] hover:text-[#050505]"
                }`}
              >
                Bộ sưu tập
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("saved")}
                className={`px-5 py-3 text-[15px] font-semibold border-b-2 transition-colors ${
                  activeTab === "saved"
                    ? "border-[#1877f2] text-[#1877f2]"
                    : "border-transparent text-[#65676b] hover:text-[#050505]"
                }`}
              >
                Đã lưu
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "collections" && (
              <div className="max-w-sm">
                <p className="mb-4 text-[13px] text-[#65676b] font-medium">Bộ sưu tập của bạn</p>
                <div className="space-y-1">
                  {COLLECTIONS.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setActiveCollection(col.id)}
                      className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                        activeCollection === col.id
                          ? "bg-[#e7f3ff] text-[#1877f2]"
                          : "text-[#050505] hover:bg-[#f2f2f2]"
                      }`}
                    >
                      {col.icon}
                      <span className="text-[14px] font-medium">{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "saved" && (
              <>
                {/* Search bar */}
                <div className="relative mb-5 max-w-md">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#65676b]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search your saved posts"
                    className="h-9 w-full rounded-lg border border-[#ddd] bg-white pl-9 pr-3 text-[14px] text-[#050505] placeholder-[#bcc0c4] outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2]/20"
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

                {/* Saved count */}
                <p className="mb-4 text-[14px] text-[#65676b] font-medium">
                  {savedItems.length} mục đã lưu
                </p>

                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#f0f2f5]">
                      <Bookmark size={36} className="text-[#bcc0c4]" />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-[#050505]">No saved posts</h2>
                    <p className="max-w-sm text-[15px] text-[#65676b] leading-relaxed">
                      Save posts you want to revisit later. Click the <span className="font-semibold text-[#050505]">bookmark</span> icon on any post to save it here.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filtered.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-[#ddd]">
                        {/* Author header */}
                        <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                          <img
                            src={item.post.author.avatarUrl || DEFAULT_AVATAR}
                            alt={item.post.author.firstName}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-semibold text-[#050505]">
                              {item.post.author.firstName} {item.post.author.lastName}
                            </p>
                            <p className="text-[12px] text-[#65676b]">
                              {new Date(item.post.createdAt).toLocaleDateString("vi-VN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                              {item.post.visibility === 0 ? " · 🌎" : " · 👥"}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUnsave(item.id)}
                            disabled={removingId === item.id}
                            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold text-[#65676b] border border-[#ddd] transition-colors hover:bg-[#f2f2f2] hover:text-[#050505] disabled:opacity-50"
                          >
                            <Bookmark size={14} />
                            {removingId === item.id ? "..." : "Unsave"}
                          </button>
                        </div>

                        {/* Content */}
                        {item.post.content && (
                          <div className="px-4 pb-3">
                            <p className="text-[14px] text-[#050505] whitespace-pre-line leading-relaxed">
                              {item.post.content}
                            </p>
                          </div>
                        )}

                        {/* Media */}
                        {item.post.media?.[0] && (
                          <div className="w-full">
                            <img
                              src={item.post.media[0].mediaUrl}
                              alt="post"
                              className="w-full object-cover max-h-96"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
