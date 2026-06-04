import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Star, Users, X } from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import { useSearchGroups } from "../hooks/useSearchGroups";
import { useYourGroups } from "../hooks/useYourGroups";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

function SidebarItem({ icon: Icon, label, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left ${
        active ? "bg-[#e7f3ff]" : "hover:bg-[#f2f2f2]"
      }`}
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${active ? "bg-[#0866ff] text-white" : "bg-[#e4e6eb]"}`}>
        <Icon size={18} />
      </span>
      <span className="text-[15px] font-semibold">{label}</span>
    </button>
  );
}

function FriendAvatars({ friends = [] }) {
  if (friends.length === 0) return null;
  return (
    <div className="flex shrink-0">
      {friends.slice(0, 3).map((f, i) => (
        <img
          key={f.userId || i}
          src={f.avatarUrl || DEFAULT_AVATAR}
          alt={f.fullName}
          title={f.fullName}
          className={`h-6 w-6 rounded-full border-2 border-white bg-[#e4e6eb] object-cover ${i > 0 ? "-ml-2" : ""}`}
        />
      ))}
    </div>
  );
}

function SuggestedGroupCard({ group, onJoin }) {
  const friendCount = group.friendCount ?? 0;
  const friendsLabel = friendCount > 0
    ? `${friendCount} friend${friendCount !== 1 ? "s" : ""} in this group`
    : "Many posts that might suit you";

  return (
    <article className="overflow-hidden rounded-lg border border-[#dddfe2] bg-white shadow-sm">
      <div className="relative">
        <img
          src={group.coverPhotoUrl || `https://picsum.photos/seed/group${group.id}/420/220`}
          alt={group.name}
          className="aspect-[1.9/1] w-full object-cover"
        />
        <button
          type="button"
          aria-label="Dismiss suggestion"
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/55"
        >
          <X size={16} />
        </button>
      </div>
      <div className="p-3">
        <h2 className="line-clamp-2 min-h-[40px] text-[15px] font-bold leading-snug text-[#050505]">
          {group.name}
        </h2>
        <p className="mt-1 text-[13px] text-[#65676b]">
          {group.memberCount.toLocaleString()} member{group.memberCount !== 1 ? "s" : ""}
          {group.avgPostsLast30Days > 0 && ` · ~${group.avgPostsLast30Days} posts/day`}
        </p>
        <div className="mt-2 flex min-h-[34px] items-center gap-2">
          <FriendAvatars friends={group.friendPreview} />
          <p className="line-clamp-2 text-[12px] leading-snug text-[#65676b]">{friendsLabel}</p>
        </div>
        <Link
          to={`/groups/${group.id}`}
          className="mt-3 flex h-9 w-full items-center justify-center rounded-md bg-[#e4e6eb] text-[14px] font-semibold hover:bg-[#d8dadf]"
        >
          Join group
        </Link>
      </div>
    </article>
  );
}

function GroupCard({ group }) {
  const avgPerDay = group.avgPostsLast30Days;
  return (
    <article className="overflow-hidden rounded-lg border border-[#dddfe2] bg-white shadow-sm">
      <Link to={`/groups/${group.id}`} className="block">
        <img
          src={group.coverPhotoUrl || `https://picsum.photos/seed/group${group.id}/420/220`}
          alt={group.name}
          className="aspect-[16/9] w-full object-cover"
        />
      </Link>
      <div className="p-4">
        <h2 className="line-clamp-2 min-h-[44px] text-[16px] font-bold leading-snug text-[#050505]">
          {group.name}
        </h2>
        <p className="mt-1 text-[13px] text-[#65676b]">
          {group.memberCount.toLocaleString()} member{group.memberCount !== 1 ? "s" : ""}
        </p>
        {avgPerDay > 0 && (
          <p className="mt-1 text-[13px] text-[#65676b]">
            ~{avgPerDay} posts/day
          </p>
        )}
        {group.friendCount > 0 && (
          <p className="mt-1 text-[13px] text-[#65676b]">
            {group.friendCount} friend{group.friendCount !== 1 ? "s" : ""} in this group
          </p>
        )}
        <Link
          to={`/groups/${group.id}`}
          className="mt-4 flex h-9 w-full items-center justify-center rounded-md bg-[#e7f3ff] text-[14px] font-semibold text-[#0866ff] hover:bg-[#dbeeff]"
        >
          View group
        </Link>
      </div>
    </article>
  );
}

function GroupsGrid({ groups, loading, error, children, emptyMessage }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[14px] text-[#65676b]">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="py-8 text-center text-[14px] text-red-500">{error}</div>
    );
  }
  if (groups.length === 0) {
    return (
      <div className="py-20 text-center text-[14px] text-[#65676b]">
        {emptyMessage || "No groups found."}
      </div>
    );
  }
  return children;
}

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState("discover");
  const isDiscover = activeTab === "discover";

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [page, setPage] = useState(1);
  const debounceTimer = useRef(null);

  // Reset page when tab or search changes
  useEffect(() => {
    setPage(1);
  }, [activeTab, debouncedTerm]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedTerm(value), 400);
  };

  const { groups: discoverGroups, loading: discoverLoading, error: discoverError, totalCount: discoverTotal, fetch: fetchDiscover } =
    useSearchGroups({ page, pageSize: 12, searchTerm: debouncedTerm });

  const { groups: yourGroups, loading: yourLoading, error: yourError, totalCount: yourTotal, fetch: fetchYour } =
    useYourGroups({ page, pageSize: 12, searchTerm: debouncedTerm });

  const groups = isDiscover ? discoverGroups : yourGroups;
  const loading = isDiscover ? discoverLoading : yourLoading;
  const error = isDiscover ? discoverError : yourError;
  const totalCount = isDiscover ? discoverTotal : yourTotal;

  const handleJoin = async (groupId) => {
    try {
      const { joinGroupApi } = await import("../apis/groupApi");
      await joinGroupApi(groupId);
      fetchDiscover();
      fetchYour();
    } catch (err) {
      console.error("Failed to join group:", err);
    }
  };

  const emptyDiscover = debouncedTerm
    ? `No groups match "${debouncedTerm}"`
    : "No groups to suggest yet.";
  const emptyYour = debouncedTerm
    ? `No groups match "${debouncedTerm}"`
    : "You haven't joined any groups yet.";

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#050505]">
      <Navbar />

      <aside className="fixed left-0 top-14 z-20 hidden h-[calc(100vh-56px)] w-[280px] overflow-y-auto border-r border-[#dddfe2] bg-white p-2 lg:block">
        <h1 className="mb-3 text-[22px] font-bold">Groups</h1>

        <SidebarItem icon={Star} label="Discover" active={isDiscover} onClick={() => setActiveTab("discover")} />
        <SidebarItem icon={Users} label="Your groups" active={!isDiscover} onClick={() => setActiveTab("joined")} />

        <Link
          to="/groups/create"
          className="my-3 flex h-9 w-full items-center justify-center gap-2 rounded-md bg-[#e7f3ff] text-[14px] font-semibold text-[#0866ff] hover:bg-[#dbeeff]"
        >
          <Plus size={16} />
          Create new group
        </Link>
      </aside>

      <main className="pt-14 lg:pl-[280px]">
        <div className="mx-auto max-w-[1120px] px-4 py-6">
          <div className="mb-4 grid grid-cols-2 gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setActiveTab("discover")}
              className={`h-10 rounded-md text-[14px] font-semibold ${isDiscover ? "bg-[#0866ff] text-white" : "bg-white text-[#050505]"}`}
            >
              Discover
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("joined")}
              className={`h-10 rounded-md text-[14px] font-semibold ${!isDiscover ? "bg-[#0866ff] text-white" : "bg-white text-[#050505]"}`}
            >
              Your groups
            </button>
          </div>

          <div className="mb-4 flex flex-col gap-3 border-b border-[#ced0d4] pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-[24px] font-bold">{isDiscover ? "Discover" : "Your groups"}</h1>
              <p className="mt-1 text-[14px] text-[#65676b]">
                {isDiscover
                  ? "Find groups and communities you might be interested in."
                  : "All groups you are a member of."}
                {totalCount > 0 && ` (${totalCount})`}
              </p>
            </div>
            <div className="flex h-10 items-center gap-2 rounded-full bg-white px-3 text-[#65676b] shadow-sm ring-1 ring-[#dddfe2] sm:w-[280px]">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search groups"
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#65676b]"
              />
              {searchTerm && (
                <button type="button" onClick={() => { setSearchTerm(""); setDebouncedTerm(""); }} className="hover:text-[#050505]">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <GroupsGrid
            groups={groups}
            loading={loading}
            error={error}
            emptyMessage={isDiscover ? emptyDiscover : emptyYour}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {groups.map((group) =>
                isDiscover ? (
                  <SuggestedGroupCard key={group.id} group={group} onJoin={handleJoin} />
                ) : (
                  <GroupCard key={group.id} group={group} />
                )
              )}
            </div>
          </GroupsGrid>

          {groups.length > 0 && groups.length < totalCount && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                className="h-10 rounded-md bg-[#e4e6eb] px-6 text-[14px] font-semibold hover:bg-[#d8dadf]"
              >
                Load more groups
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
