import React, { useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Clapperboard, FileText, Search, Users, UsersRound } from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import PostCard from "../components/Feed/PostCard";
import { useSearchEngineContext, SEARCH_TABS } from "../contexts/SearchEngineContext";

const DEFAULT_AVATAR =
  import.meta.env.VITE_DEFAULT_AVATAR ?? "https://i.pravatar.cc/150?img=1";

const iconMap = { Clapperboard, FileText, Users, UsersRound };

function SidebarTab({ tab, active, onClick }) {
  const Icon = iconMap[tab.icon] ?? FileText;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-12 w-full items-center gap-3 rounded-lg px-2 text-left ${
        active ? "bg-[#e7f3ff] text-[#0866ff]" : "text-[#050505] hover:bg-[#f2f2f2]"
      }`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full ${
          active ? "bg-[#0866ff] text-white" : "bg-[#e4e6eb]"
        }`}
      >
        <Icon size={18} />
      </span>
      <span className="text-[14px] font-semibold">{tab.label}</span>
    </button>
  );
}

function SearchSidebar({ activeTab, onTabChange }) {
  return (
    <aside className="fixed left-0 top-14 z-20 hidden h-[calc(100vh-56px)] w-[280px] overflow-y-auto border-r border-[#dddfe2] bg-white p-2 lg:block">
      <h1 className="px-1 py-2 text-[22px] font-bold">Search results</h1>
      <div className="my-2 border-t border-[#dddfe2]" />
      <div className="px-1 pb-2 text-[13px] font-semibold text-[#65676b]">Filters</div>
      <div className="space-y-1">
        {SEARCH_TABS.map((tab) => (
          <SidebarTab
            key={tab.key}
            tab={tab}
            active={activeTab === tab.key}
            onClick={() => onTabChange(tab.key)}
          />
        ))}
      </div>
    </aside>
  );
}

function GroupResult({ group }) {
  return (
    <article className="grid grid-cols-[56px_1fr_auto] gap-3 py-2">
      <img
        src={group.coverPhotoUrl ?? DEFAULT_AVATAR}
        alt={group.name}
        className="h-14 w-14 rounded-md object-cover"
      />
      <div className="min-w-0">
        <h3 className="truncate text-[15px] font-bold">{group.name}</h3>
        <p className="text-[12px] text-[#65676b]">
          {group.privacyType}
          {" · "}
          {group.memberCount.toLocaleString()} member{group.memberCount !== 1 ? "s" : ""}
          {group.avgPostsLast30Days ? ` · ${group.avgPostsLast30Days} posts/day` : ""}
        </p>
        {group.friendCount > 0 && (
          <p className="mt-1 text-[12px] text-[#65676b]">
            {group.friendCount} friend{group.friendCount !== 1 ? "s" : ""} in this group
          </p>
        )}
      </div>
      <button
        type="button"
        className="self-center rounded-md bg-[#e7f3ff] px-4 py-2 text-[13px] font-semibold text-[#0866ff] hover:bg-[#dbeeff]"
      >
        Join
      </button>
    </article>
  );
}

function GroupsResults({ results, loading }) {
  if (!loading && results.length === 0) {
    return (
      <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
        <h2 className="text-[18px] font-bold">Groups</h2>
        <p className="mt-2 text-[14px] text-[#65676b]">No groups found.</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
      <h2 className="text-[18px] font-bold">Groups</h2>
      <div className="mt-2 divide-y divide-[#f0f2f5]">
        {results.map((group) => (
          <GroupResult key={group.id} group={group} />
        ))}
      </div>
    </section>
  );
}

function PostsResults({ results, loading }) {
  if (!loading && results.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-[14px] text-[#65676b]">No posts found.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {results.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function PeopleResults({ results, loading }) {
  if (!loading && results.length === 0) {
    return (
      <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
        <h2 className="text-[18px] font-bold">People</h2>
        <p className="mt-2 text-[14px] text-[#65676b]">No people found.</p>
      </section>
    );
  }
  return (
    <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
      <h2 className="text-[18px] font-bold">People</h2>
      <div className="mt-2 divide-y divide-[#f0f2f5]">
        {results.map((person) => (
          <article
            key={person.id}
            className="grid grid-cols-[56px_1fr_auto] gap-3 py-3"
          >
            <Link to={`/profile/${person.id}`}>
              <img
                src={person.avatarUrl ?? DEFAULT_AVATAR}
                alt={`${person.firstName} ${person.lastName}`}
                className="h-14 w-14 rounded-full object-cover"
              />
            </Link>
            <div>
              <Link to={`/profile/${person.id}`} className="hover:underline">
                <h3 className="text-[15px] font-bold">
                  {person.firstName} {person.lastName}
                </h3>
              </Link>
              <p className="text-[13px] text-[#65676b]">
                {person.mutualFriendCount > 0
                  ? `${person.mutualFriendCount} mutual friend${
                      person.mutualFriendCount !== 1 ? "s" : ""
                    }`
                  : "Facebook user"}
              </p>
            </div>
            <Link
              to={`/profile/${person.id}`}
              type="button"
              className="self-center rounded-md bg-[#e4e6eb] px-4 py-2 text-[13px] font-semibold hover:bg-[#d8dadf]"
            >
              View
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReelsResults({ results, loading }) {
  if (!loading && results.length === 0) {
    return (
      <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
        <h2 className="text-[18px] font-bold">Reels</h2>
        <p className="mt-2 text-[14px] text-[#65676b]">No reels found.</p>
      </section>
    );
  }
  return (
    <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
      <h2 className="text-[18px] font-bold">Reels</h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {results.map((reel) => (
          <article key={reel.id} className="overflow-hidden rounded-lg border border-[#dddfe2]">
            <img
              src={reel.thumbnailUrl ?? DEFAULT_AVATAR}
              alt={reel.caption ?? "Reel"}
              className="aspect-[9/14] w-full object-cover"
            />
            <div className="p-3">
              <h3 className="line-clamp-2 text-[14px] font-bold">{reel.caption ?? ""}</h3>
              <Link
                to={`/profile/${reel.authorId}`}
                className="mt-1 text-[12px] text-[#65676b] hover:underline"
              >
                {reel.authorName}
              </Link>
              <p className="text-[12px] text-[#65676b]">
                {reel.viewCount.toLocaleString()} views
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e4e6eb] border-t-[#0866ff]" />
    </div>
  );
}

export default function SearchPage() {
  const { query, setQuery, activeTab, tabStates, search, loadMore, switchTab } =
    useSearchEngineContext();

  const mainRef = useRef(null);

  const activeState = tabStates[activeTab] ?? {
    results: [],
    loading: false,
    error: null,
    hasMore: false,
  };
  const { results, loading, error, hasMore } = activeState;

  const handleTabChange = useCallback(
    (tab) => {
      switchTab(tab);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [switchTab]
  );

  const handleSearchKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        search(e.target.value.trim());
        e.target.blur();
      }
    },
    [search]
  );

  const title = SEARCH_TABS.find((t) => t.key === activeTab)?.label ?? "Posts";

  // Infinite scroll
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight - scrollTop - clientHeight < 400) {
        loadMore(activeTab);
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [loadMore, activeTab]);

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#050505]">
      <Navbar />
      <SearchSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <main ref={mainRef} className="h-screen overflow-y-auto pt-14 lg:pl-[280px]">
        <div className="mx-auto w-full max-w-[620px] px-3 py-6">

          {/* Search bar */}
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-white p-3 shadow-sm ring-1 ring-[#dddfe2]">
            <Search size={16} className="text-[#65676b]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search posts, people, groups, reels…"
              className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#65676b]"
            />
          </div>

          <h1 className="mb-3 text-[20px] font-bold lg:hidden">{title}</h1>

          {error && (
            <div className="mb-3 rounded-lg bg-red-50 p-3 text-[13px] text-red-600">
              {error}
            </div>
          )}

          {activeTab === "posts" && <PostsResults results={results} loading={loading} />}
          {activeTab === "people" && <PeopleResults results={results} loading={loading} />}
          {activeTab === "groups" && <GroupsResults results={results} loading={loading} />}
          {activeTab === "reels" && <ReelsResults results={results} loading={loading} />}

          {loading && <LoadingSpinner />}

          {!hasMore && results.length > 0 && (
            <p className="py-6 text-center text-[13px] text-[#65676b]">
              You&apos;ve seen it all.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
