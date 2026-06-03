import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  Earth,
  Eye,
  FileText,
  History,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Share2,
  UserPlus,
  Users,
} from "lucide-react";
import { useMedias } from "../hooks/useMedias";
import { useAllMembers } from "../hooks/useAllMembers";
import { useGroupPosts } from "../hooks/useGroupPosts";
import Navbar from "../components/Navbar/Navbar";
import CreatePost from "../components/Feed/CreatePost";
import CreatePostModal from "../components/Profile/CreatePostModal";
import PostCard from "../components/Feed/PostCard";
import GroupAdminInsights from "../components/group/GroupAdminInsights";
import GroupAdminManage from "../components/group/GroupAdminManage";
import GroupAdminSettings from "../components/group/GroupAdminSettings";
import GroupAdminSidebar from "../components/group/GroupAdminSidebar";
import { useAuth } from "../contexts/authContext";
import { useGroup } from "../hooks/useGroup";
import {
  groupAvatarSeeds,
  groupInfo,
  groupMediaImages,
  groupTabs,
  mockGroupRole,
} from "../data/groupMockData";

const settingsViews = ["group-settings", "features"];
const insightViews = ["growth", "engagement", "admins", "members"];

function normalizeRole(value) {
  return String(value || "").trim().toLowerCase();
}

function hasAdminRole(user) {
  const roleValues = [
    user?.role,
    user?.Role,
    user?.groupRole,
    user?.GroupRole,
    user?.membershipRole,
    user?.MembershipRole,
    ...(Array.isArray(user?.roles) ? user.roles : []),
    ...(Array.isArray(user?.Roles) ? user.Roles : []),
    ...(Array.isArray(user?.groupRoles) ? user.groupRoles : []),
  ];

  return roleValues.some((role) => ["admin", "administrator", "quan tri vien", "quản trị viên"].includes(normalizeRole(role)));
}

function getPrivacyLabel(groupDetail) {
  const privacy = String(groupDetail?.privacyType ?? groupDetail?.PrivacyType ?? "").toLowerCase();
  return privacy.includes("private") || privacy === "1" ? "Private" : "Public";
}

function AvatarStack({ count = 12, size = "h-8 w-8" }) {
  return (
    <div className="flex items-center">
      {groupAvatarSeeds.slice(0, count).map((seed, index) => (
        <img
          key={seed}
          src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`}
          alt=""
          className={`${size} rounded-full border-2 border-white bg-[#e4e6eb] object-cover ${index > 0 ? "-ml-2" : ""}`}
        />
      ))}
    </div>
  );
}

function HeaderButton({ children, primary = false }) {
  return (
    <button
      type="button"
      className={`flex h-9 cursor-pointer items-center gap-2 rounded-md px-3 text-[15px] font-semibold transition-colors ${
        primary ? "bg-[#0866ff] text-white hover:bg-[#075ce5]" : "bg-[#e4e6eb] text-[#050505] hover:bg-[#d8dadf]"
      }`}
    >
      {children}
    </button>
  );
}

function InfoRow({ icon, title, children }) {
  return (
    <div className="flex gap-3">
      {React.createElement(icon, {
        size: 20,
        className: "mt-0.5 shrink-0 text-[#65676b]",
        fill: "currentColor",
        strokeWidth: 1.8,
      })}
      <div>
        <div className="text-[15px] font-semibold text-[#050505]">{title}</div>
        <div className="text-[13px] leading-snug text-[#65676b]">{children}</div>
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-1 border-b border-[#ced0d4] pb-3">
        <h2 className="text-[17px] font-bold text-[#050505]">{title}</h2>
        {subtitle && <span className="text-[15px] text-[#65676b]">· {subtitle}</span>}
      </div>
      {children}
    </section>
  );
}

function FeaturedTab({ contentOffsetClass, posts }) {
  return (
    <main className={contentOffsetClass}>
      <div className="mx-auto grid w-full max-w-[1000px] grid-cols-1 gap-3 px-3 py-3 lg:grid-cols-[minmax(0,580px)_330px]">
        <div className="space-y-3">
          {posts.slice(0, 2).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <aside className="hidden space-y-3 lg:block">
          <SectionCard title="About">
            <p className="mb-3 text-[13px] leading-relaxed text-[#050505]">
              We can&apos;t talk passion with someone who never had it.
            </p>
            <div className="space-y-3">
              <InfoRow icon={Earth} title="Public">Anyone can see everyone in the group and what they post.</InfoRow>
              <InfoRow icon={Eye} title="Visible">Anyone can find this group.</InfoRow>
            </div>
          </SectionCard>
          <SectionCard title="Recent media">
            <div className="grid grid-cols-2 gap-1 overflow-hidden rounded-md">
              {groupMediaImages.slice(0, 4).map((src) => (
                <img key={src} src={src} alt="" className="aspect-square w-full object-cover" />
              ))}
            </div>
            <button type="button" className="mt-3 h-9 w-full cursor-pointer rounded-md bg-[#e4e6eb] text-[14px] font-semibold hover:bg-[#d8dadf]">
              See all
            </button>
          </SectionCard>
        </aside>
      </div>
    </main>
  );
}

function PeopleTab({ contentOffsetClass, groupId }) {
  const [peopleTab, setPeopleTab] = useState("all");
  const [searchVal, setSearchVal] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search so we don't fire an API call on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchVal), 300);
    return () => clearTimeout(timer);
  }, [searchVal]);

  const {
    members: allMembers,
    isLoading,
    isRefreshing,
    hasNextPage,
    totalCount,
    error,
    loadMore,
    refresh,
  } = useAllMembers(groupId, {
    searchTerm: debouncedSearch,
    role: peopleTab,
    pageSize: 24,
    autoFetch: true,
  });

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
  };

  return (
    <main className={contentOffsetClass}>
      <div className="mx-auto w-full max-w-[580px] px-3 py-3">
        <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
          <h2 className="text-[17px] font-bold">
            Members · {totalCount > 0 ? totalCount.toLocaleString() : "..."}
          </h2>
          <p className="mt-1 text-[13px] text-[#65676b]">
            New people and Pages who join this group will appear here.{" "}
            <button className="cursor-pointer font-semibold text-[#050505] hover:underline">Learn more</button>
          </p>

          <div className="mt-3 flex h-9 items-center gap-2 rounded-full bg-[#f0f2f5] px-3 text-[#65676b]">
            <Search size={16} />
            <input
              type="text"
              placeholder="Find members"
              value={searchVal}
              onChange={handleSearchChange}
              className="flex-1 bg-transparent text-[14px] text-[#050505] outline-none placeholder:text-[#65676b]"
            />
          </div>

          <div className="mt-3 flex gap-2 flex-wrap">
            {["all", "admin", "moderator", "member"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setPeopleTab(tab)}
                className={`h-8 cursor-pointer rounded-full px-3 text-[13px] font-semibold transition-colors ${
                  peopleTab === tab
                    ? "bg-[#0866ff] text-white"
                    : "bg-[#e4e6eb] text-[#050505] hover:bg-[#d8dadf]"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="mt-4 border-t border-[#ced0d4] pt-4">
            {error && (
              <p className="mb-3 text-[13px] font-semibold text-red-600">{error}</p>
            )}

            {isLoading && allMembers.length === 0 ? (
              <div className="py-10 text-center text-[14px] text-[#65676b]">Loading...</div>
            ) : allMembers.length === 0 ? (
              <div className="py-10 text-center text-[14px] text-[#65676b]">No members found.</div>
            ) : (
              <>
                <div className="space-y-3">
                  {allMembers.map((member) => (
                    <div key={member.userId} className="flex items-center gap-3">
                      <img
                        src={
                          member.avatarUrl ||
                          `https://api.dicebear.com/9.x/avataaars/svg?seed=${member.userId}`
                        }
                        alt=""
                        className="h-12 w-12 rounded-full bg-[#e4e6eb] object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[14px] font-bold">{member.fullName}</div>
                        <div className="text-[12px] font-semibold text-[#0866ff]">
                          {member.roleLabel}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="flex h-9 cursor-pointer items-center gap-2 rounded-md bg-[#e4e6eb] px-3 text-[13px] font-semibold hover:bg-[#d8dadf]"
                      >
                        <UserPlus size={15} /> Follow
                      </button>
                    </div>
                  ))}
                </div>

                {hasNextPage && (
                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={loadMore}
                      disabled={isLoading}
                      className="h-9 cursor-pointer rounded-md bg-[#e4e6eb] px-4 text-[14px] font-semibold hover:bg-[#d8dadf] disabled:opacity-60"
                    >
                      {isLoading ? "Loading..." : "See more"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function MediaTab({ contentOffsetClass, groupId }) {
  const [activeMediaType, setActiveMediaType] = useState("image");
  const { medias, isLoading, hasMore, error, loadMore } = useMedias({
    groupId,
    mediaType: activeMediaType,
    pageSize: 24,
  });

  const isVideoTab = activeMediaType === "video";

  return (
    <main className={contentOffsetClass}>
      <div className="mx-auto w-full max-w-[900px] px-3 py-3">
        <section className="rounded-lg border border-[#dddfe2] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold">Media</h2>
          </div>
          <div className="mt-4 flex gap-5 border-b border-[#ced0d4] text-[14px] font-semibold">
            <button
              type="button"
              onClick={() => setActiveMediaType("image")}
              className={`cursor-pointer pb-3 ${activeMediaType === "image" ? "border-b-2 border-[#0866ff] text-[#0866ff]" : "text-[#65676b]"}`}
            >
              Photos
            </button>
            <button
              type="button"
              onClick={() => setActiveMediaType("video")}
              className={`cursor-pointer pb-3 ${activeMediaType === "video" ? "border-b-2 border-[#0866ff] text-[#0866ff]" : "text-[#65676b]"}`}
            >
              Video
            </button>
          </div>

          {error && (
            <p className="mt-3 text-[13px] font-semibold text-red-600">{error}</p>
          )}

          {isLoading && medias.length === 0 ? (
            <div className="mt-3 py-10 text-center text-[14px] text-[#65676b]">Loading...</div>
          ) : medias.length === 0 ? (
            <div className="mt-3 py-10 text-center text-[14px] text-[#65676b]">
              {isVideoTab ? "No videos yet." : "No photos yet."}
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-6">
              {medias.map((item) =>
                isVideoTab ? (
                  <div key={item.id} className="relative aspect-square w-full overflow-hidden bg-black">
                    <img
                      src={item.thumbnailUrl || item.mediaUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white">
                        <Play size={18} fill="currentColor" />
                      </span>
                    </div>
                  </div>
                ) : (
                  <img
                    key={item.id}
                    src={item.mediaUrl}
                    alt=""
                    className="aspect-square w-full object-cover"
                  />
                )
              )}
            </div>
          )}

          {hasMore && medias.length > 0 && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={isLoading}
                className="h-9 cursor-pointer rounded-md bg-[#e4e6eb] px-4 text-[14px] font-semibold hover:bg-[#d8dadf] disabled:opacity-60"
              >
                {isLoading ? "Loading..." : "See more"}
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function GroupHome({ activeTab, setActiveTab, contentOffsetClass, displayUser, groupDetail, groupId, posts, setIsCreateModalOpen, rules, fetchRules, postsLoading, postsHasNext, loadMorePosts, isMineFilter, setIsMineFilter, fromDateFilter, setFromDateFilter }) {
  const theme = {
    card: "bg-white text-[#050505]",
    textSub: "text-[#65676b]",
    tabHover: "hover:bg-[#f2f2f2]",
  };
  const privacyLabel = getPrivacyLabel(groupDetail);
  const memberCount = groupDetail?.memberCount ?? groupDetail?.MemberCount ?? 0;
  const groupName = groupDetail?.name ?? groupDetail?.Name ?? groupInfo.name;
  const description = groupDetail?.description ?? groupDetail?.Description ?? "No description available for this group.";
  const coverPhotoUrl = groupDetail?.coverPhotoUrl ?? groupDetail?.CoverPhotoUrl ?? groupInfo.cover;

  useEffect(() => {
    if (activeTab === "About" && fetchRules) {
      fetchRules();
    }
  }, [activeTab, fetchRules]);

  const formattedCreatedDate = groupDetail?.createdAt || groupDetail?.CreatedAt
    ? new Date(groupDetail.createdAt || groupDetail.CreatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "March 17, 2018";

  return (
    <>
      <header className={`${contentOffsetClass} bg-white pt-14 shadow-sm`}>
        <div className="mx-auto max-w-[1000px]">
          <div className="relative h-[280px] overflow-hidden rounded-b-lg bg-[#d8dadf] sm:h-[320px]">
            <img src={coverPhotoUrl} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 bg-[#007c9b] px-4 py-2 text-[13px] font-semibold text-white">
              {groupName}
            </div>
          </div>

          <div className="px-4 py-5">
            <h1 className="text-[28px] font-bold leading-tight sm:text-[32px]">{groupName}</h1>
            <div className="mt-1 flex items-center gap-1 text-[14px] text-[#65676b]">
              <Earth size={15} />
              <span>{privacyLabel}</span>
              <span>·</span>
              <span>{memberCount} {memberCount === 1 ? "member" : "members"}</span>
            </div>

            <div className="mt-3 flex flex-col gap-4 border-b border-[#ced0d4] pb-5 lg:flex-row lg:items-end lg:justify-between">
              <AvatarStack />
              <div className="flex flex-wrap items-center gap-2">
                <HeaderButton primary>
                  <Plus size={18} />
                  Invite
                </HeaderButton>
                <HeaderButton>
                  <Share2 size={17} fill="currentColor" />
                  Share
                </HeaderButton>
                <HeaderButton>
                  <Users size={17} fill="currentColor" />
                  Joined
                  <ChevronDown size={16} />
                </HeaderButton>
                <button type="button" className="flex h-9 w-10 cursor-pointer items-center justify-center rounded-md bg-[#e4e6eb] hover:bg-[#d8dadf]">
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <nav className="flex min-w-0 items-center gap-1 overflow-x-auto">
                {groupTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`h-12 cursor-pointer shrink-0 px-3 text-[14px] font-semibold ${
                      activeTab === tab ? "border-b-2 border-[#0866ff] text-[#0866ff]" : "rounded-md text-[#65676b] hover:bg-[#f2f2f2]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
              <div className="hidden cursor-pointer items-center gap-2 pl-3 sm:flex">
                <button type="button" className="flex h-9 w-10 cursor-pointer items-center justify-center rounded-md bg-[#e4e6eb] hover:bg-[#d8dadf]">
                  <Search size={18} />
                </button>
                <button type="button" className="flex h-9 w-10 cursor-pointer items-center justify-center rounded-md bg-[#e4e6eb] hover:bg-[#d8dadf]">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {activeTab === "About" ? (
        <main className={contentOffsetClass}>
          <div className="mx-auto w-full max-w-[580px] space-y-2 px-3 py-3">
            <SectionCard title="About this group">
              <p className="mb-4 text-[14px] leading-relaxed text-[#050505]">
                {description}
              </p>
              <div className="space-y-4">
                <InfoRow icon={Earth} title={privacyLabel}>
                  {privacyLabel === "Private"
                    ? "Private group. Only members can see who's in the group and what they post."
                    : "Public group. Anyone can see who's in the group and what they post."}
                </InfoRow>
                <InfoRow icon={Eye} title="Visible">
                  Anyone can find this group.
                </InfoRow>
                <InfoRow icon={History} title="History">
                  Group created on {formattedCreatedDate}.
                </InfoRow>
              </div>
            </SectionCard>

            <SectionCard title="Group rules from the admins">
              <div className="divide-y divide-[#f0f2f5]">
                {rules && rules.length > 0 ? (
                  rules.map((rule, index) => (
                    <div key={rule.id || index} className="grid grid-cols-[24px_1fr_28px] gap-2 py-4 first:pt-0 last:pb-0">
                      <div className="pt-1 text-[13px] text-[#65676b]">{index + 1}</div>
                      <div>
                        <h3 className="text-[14px] font-bold text-[#050505]">{rule.title}</h3>
                        <p className="mt-2 text-[13px] leading-relaxed text-[#65676b]">{rule.description || rule.body}</p>
                      </div>
                      <div className="flex flex-col items-center gap-3 text-[#65676b]">
                        <ChevronUp size={18} />
                        <MoreHorizontal size={20} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-[13.5px] text-[#65676b]">
                    No group rules defined by the administrator yet.
                  </div>
                )}
              </div>
            </SectionCard>
          </div>
        </main>
      ) : activeTab === "Featured" ? (
        <FeaturedTab contentOffsetClass={contentOffsetClass} posts={posts} />
      ) : activeTab === "People" ? (
        <PeopleTab contentOffsetClass={contentOffsetClass} groupId={groupId} />
      ) : activeTab === "Media" ? (
        <MediaTab contentOffsetClass={contentOffsetClass} groupId={groupId} />
      ) : (
        <main className={contentOffsetClass}>
          <div className="mx-auto w-full max-w-[580px] space-y-3 px-3 py-3">
            <CreatePost
              displayUser={displayUser}
              setIsCreateModalOpen={setIsCreateModalOpen}
              isOwnProfile={true}
              theme={theme}
              darkMode={false}
            />

            <section className="rounded-lg border border-[#dddfe2] bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[15px] font-bold">Recent activity <Bell size={14} className="text-[#65676b]" /></div>
                  <button type="button" className="mt-1 cursor-pointer text-[13px] font-semibold text-[#0866ff] hover:underline">
                    3 new items
                  </button>
                </div>
                <ChevronDown size={18} className="cursor-pointer text-[#050505]" />
              </div>
            </section>

            <div className="flex items-center justify-between px-1 text-[14px] font-semibold text-[#006d8f]">
              <button
                type="button"
                onClick={() => setIsMineFilter((v) => !v)}
                className={`flex cursor-pointer items-center gap-1 hover:underline ${isMineFilter ? "font-bold" : ""}`}
              >
                {isMineFilter ? "Your posts" : "Most relevant"} <ChevronDown size={14} />
              </button>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={fromDateFilter || ""}
                  onChange={(e) => setFromDateFilter(e.target.value || null)}
                  className="cursor-pointer text-[13px] font-semibold text-[#006d8f] underline"
                />
                <button type="button" className="flex cursor-pointer items-center gap-1 hover:underline">
                  All topics <ChevronDown size={14} />
                </button>
              </div>
            </div>

            {postsLoading && posts.length === 0 ? (
              <div className="rounded-lg border border-[#dddfe2] bg-white p-8 text-center text-[15px] text-[#65676b] shadow-sm">
                Loading posts...
              </div>
            ) : posts.length > 0 ? (
              <>
                {posts.map((post) => <PostCard key={post.id} post={post} />)}
                {postsHasNext && (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={loadMorePosts}
                      disabled={postsLoading}
                      className="h-9 cursor-pointer rounded-md bg-[#e4e6eb] px-4 text-[14px] font-semibold hover:bg-[#d8dadf] disabled:opacity-60"
                    >
                      {postsLoading ? "Loading..." : "See more"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-lg border border-[#dddfe2] bg-white p-8 text-center text-[15px] text-[#65676b] shadow-sm">
                No posts in this group yet.
              </div>
            )}
          </div>
        </main>
      )}
    </>
  );
}

function AdminContent({ view, groupId }) {
  if (settingsViews.includes(view)) return <GroupAdminSettings view={view} groupId={groupId} />;
  if (insightViews.includes(view)) return <GroupAdminInsights view={view} groupId={groupId} />;
  return <GroupAdminManage view={view} groupId={groupId} />;
}

export default function GroupPage() {
  const { groupId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const numericGroupId = Number(groupId);
  const { user: currentUser } = useAuth();
  const { groupDetail, loading, error, rules, fetchRules } = useGroup(numericGroupId);
  const [activeTab, setActiveTab] = useState("Discussion");
  const [isMineFilter, setIsMineFilter] = useState(false);
  const [fromDateFilter, setFromDateFilter] = useState(null);
  const adminView = searchParams.get("tab") || "overview";

  const setAdminView = (view) => {
    setSearchParams({ tab: view }, { replace: true });
  };
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    posts,
    isLoading: postsLoading,
    hasNextPage: postsHasNext,
    loadMore: loadMorePosts,
    refresh: refreshPosts,
  } = useGroupPosts(numericGroupId, {
    isMine: isMineFilter,
    fromDate: fromDateFilter,
    pageSize: 20,
    autoFetch: true,
  });
  const currentUserRole = groupDetail?.role ?? groupDetail?.Role;
  const isAdmin = ["admin", "moderator"].includes(normalizeRole(currentUserRole))
    || mockGroupRole === "admin"
    || hasAdminRole(currentUser)
    || currentUser?.isAdmin === true
    || currentUser?.IsAdmin === true;
  const contentOffsetClass = isAdmin ? "lg:pl-[292px]" : "";
  const displayUser = {
    name: currentUser ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || "You" : "You",
    avatar: currentUser?.avatarUrl || currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
  };

  const handleCreatePost = async (payload) => {
    await refreshPosts();
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#050505]">
      <Navbar />
      {isAdmin && <GroupAdminSidebar activeView={adminView} onViewChange={setAdminView} />}

      {loading && !groupDetail ? (
        <main className="pt-20">
          <div className="mx-auto max-w-[580px] rounded-lg bg-white p-6 text-center text-[15px] text-[#65676b] shadow-sm">
            Loading group info...
          </div>
        </main>
      ) : error && !groupDetail ? (
        <main className="pt-20">
          <div className="mx-auto max-w-[580px] rounded-lg bg-white p-6 text-center text-[15px] font-semibold text-red-600 shadow-sm">
            {error}
          </div>
        </main>
      ) : isAdmin && adminView !== "home" ? (
        <AdminContent view={adminView} groupId={numericGroupId} />
      ) : (
        <GroupHome
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          contentOffsetClass={contentOffsetClass}
          displayUser={displayUser}
          groupDetail={groupDetail}
          groupId={numericGroupId}
          posts={posts}
          setIsCreateModalOpen={setIsCreateModalOpen}
          rules={rules}
          fetchRules={fetchRules}
          postsLoading={postsLoading}
          postsHasNext={postsHasNext}
          loadMorePosts={loadMorePosts}
          isMineFilter={isMineFilter}
          setIsMineFilter={setIsMineFilter}
          fromDateFilter={fromDateFilter}
          setFromDateFilter={setFromDateFilter}
        />
      )}

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        displayUser={displayUser}
        onSubmit={handleCreatePost}
        groupId={numericGroupId}
      />

      <button
        type="button"
        className="fixed bottom-5 right-5 hidden h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/10 hover:bg-[#f2f2f2] sm:flex"
      >
        <FileText size={20} />
      </button>
    </div>
  );
}
