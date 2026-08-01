import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  Bell,
  Camera,
  CheckCircle2,
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
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useMedias } from "../hooks/useMedias";
import { useAllMembers } from "../hooks/useAllMembers";
import { useGroupPosts } from "../hooks/useGroupPosts";
import { createPostApi } from "../apis/postApi";
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
import { GROUP_REPORT_REASONS } from "../apis/reportApi";
import {
  groupAvatarSeeds,
  groupInfo,
  groupMediaImages,
  groupTabs,
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

function HeaderButton({ children, primary = false, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-9 cursor-pointer items-center gap-2 rounded-md px-3 text-[15px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${primary ? "bg-[#0866ff] text-white hover:bg-[#075ce5]" : "bg-[#e4e6eb] text-[#050505] hover:bg-[#d8dadf]"
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
                className={`h-8 cursor-pointer rounded-full px-3 text-[13px] font-semibold transition-colors ${peopleTab === tab
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
                          import.meta.env.VITE_DEFAULT_AVATAR
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
  const [viewerIndex, setViewerIndex] = useState(null);
  const { medias, isLoading, hasMore, error, loadMore } = useMedias({
    groupId,
    mediaType: activeMediaType,
    pageSize: 24,
  });

  const isVideoTab = activeMediaType === "video";

  useEffect(() => {
    setViewerIndex(null);
  }, [activeMediaType]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (viewerIndex === null) return;

      if (event.key === "Escape") {
        setViewerIndex(null);
      }

      if (!isVideoTab && event.key === "ArrowLeft") {
        setViewerIndex((current) => (current > 0 ? current - 1 : current));
      }

      if (!isVideoTab && event.key === "ArrowRight") {
        setViewerIndex((current) => (current < medias.length - 1 ? current + 1 : current));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewerIndex, isVideoTab, medias.length]);

  const activeItem = viewerIndex !== null ? medias[viewerIndex] : null;

  return (
    <>
      {activeItem && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setViewerIndex(null)}
        >
          <button
            type="button"
            onClick={() => setViewerIndex(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-2xl text-white transition-colors hover:bg-white/40"
          >
            ✕
          </button>

          {!isVideoTab && viewerIndex > 0 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setViewerIndex((current) => current - 1);
              }}
              className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-2xl text-white transition-colors hover:bg-white/40"
            >
              ‹
            </button>
          )}

          {!isVideoTab && viewerIndex < medias.length - 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setViewerIndex((current) => current + 1);
              }}
              className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-2xl text-white transition-colors hover:bg-white/40"
            >
              ›
            </button>
          )}

          {isVideoTab ? (
            <video
              src={activeItem.mediaUrl}
              controls
              autoPlay
              className="max-h-[90vh] max-w-[90vw] rounded-lg bg-black object-contain shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            />
          ) : (
            <img
              src={activeItem.mediaUrl}
              alt=""
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            />
          )}

          {!isVideoTab && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-sm font-medium text-white/80">
              {viewerIndex + 1} / {medias.length}
            </div>
          )}
        </div>
      )}

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
                {medias.map((item, index) =>
                  isVideoTab ? (
                    <div
                      key={item.id}
                      onClick={() => setViewerIndex(index)}
                      className="relative aspect-square w-full overflow-hidden bg-black cursor-pointer"
                    >
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
                      onClick={() => setViewerIndex(index)}
                      src={item.mediaUrl}
                      alt=""
                      className="aspect-square w-full cursor-pointer object-cover"
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
    </>
  );
}

function GroupHome({ activeTab, setActiveTab, contentOffsetClass, displayUser, groupDetail, groupId, isAdmin, isOwner, uploadCoverPhoto, posts, setIsCreateModalOpen, rules, fetchRules, postsLoading, postsHasNext, loadMorePosts, isMineFilter, setIsMineFilter, fromDateFilter, setFromDateFilter, onDeletePost, onUpdatePost, isMember = false, hasPendingRequest = false, membershipStatusLoading = false, onJoinGroup, onLeaveGroup, onCancelJoinRequest, onDeleteGroup, onReportGroup }) {
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isJoinMenuOpen, setJoinMenuOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reportState, setReportState] = useState("idle"); // idle | submitting | success | error
  const [reportError, setReportError] = useState(null);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    if (!isJoinMenuOpen) return;
    const handleClose = () => setJoinMenuOpen(false);
    document.addEventListener("click", handleClose);
    return () => document.removeEventListener("click", handleClose);
  }, [isJoinMenuOpen]);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await onDeleteGroup?.();
      // When the hook marks the group inactive, the parent `GroupPage` renders
      // the overlay automatically. We don't close the modal here so the user
      // can see the success state and read the message.
    } catch (err) {
      setDeleteError(err?.message || "Unable to delete group.");
    } finally {
      setIsDeleting(false);
    }
  };

  const closeReportModal = () => {
    if (reportState === "submitting") return;
    setReportModalOpen(false);
    setReportReason("");
    setReportDetails("");
    setReportState("idle");
    setReportError(null);
  };

  const handleSubmitReport = async () => {
    if (!reportReason || !onReportGroup) return;
    setReportState("submitting");
    setReportError(null);
    try {
      await onReportGroup({ reason: reportReason, details: reportDetails.trim() || null });
      setReportState("success");
    } catch (err) {
      setReportError(err?.message || "Unable to submit your report. Please try again.");
      setReportState("idle");
    }
  };

  const handleUploadCover = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCover(true);
    try {
      await uploadCoverPhoto(file);
    } catch (err) {
      console.error("Failed to upload cover photo:", err);
    } finally {
      setIsUploadingCover(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const theme = {
    card: "bg-white text-[#050505]",
    textSub: "text-[#65676b]",
    tabHover: "hover:bg-[#f2f2f2]",
  };
  const privacyLabel = getPrivacyLabel(groupDetail);
  const memberCount = groupDetail?.memberCount ?? groupDetail?.MemberCount ?? 0;
  const groupName = groupDetail?.name ?? groupDetail?.Name ?? groupInfo.name;
  const description = groupDetail?.description ?? groupDetail?.Description ?? "No description available for this group.";
  const coverPhotoUrl = groupDetail?.coverPhotoUrl ?? groupDetail?.CoverPhotoUrl ?? groupInfo.cover ?? import.meta.env.VITE_DEFAULT_GROUP_COVER;

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
            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingCover}
                  className="absolute bottom-3 right-3 flex h-9 cursor-pointer items-center gap-2 rounded-md bg-white/90 px-3 text-[13px] font-semibold text-[#050505] hover:bg-white disabled:opacity-60"
                >
                  <Camera size={15} />
                  {isUploadingCover ? "Uploading..." : "Upload cover"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadCover}
                  className="hidden"
                />
              </>
            )}
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
              <div className="flex flex-wrap items-center gap-2">
                {isMember ? (
                  <div className="relative">
                    <div onClick={(e) => { e.stopPropagation(); setJoinMenuOpen((prev) => !prev); }}>
                      <HeaderButton primary type="button">
                        <Users size={17} fill="currentColor" />
                        Joined
                        <ChevronDown size={16} />
                      </HeaderButton>
                    </div>
                    {isJoinMenuOpen && (
                      <div
                        className="absolute left-0 top-full z-20 mt-1 w-44 rounded-md border border-[#ced0d4] bg-white py-1 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            setJoinMenuOpen(false);
                            try { await onLeaveGroup?.(); } catch (err) { console.error("Leave group failed:", err); }
                          }}
                          className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-[14px] text-[#050505] hover:bg-[#f2f2f2]"
                        >
                          <History size={15} />
                          Leave group
                        </button>
                      </div>
                    )}
                  </div>
                ) : hasPendingRequest ? (
                  <button
                    type="button"
                    onClick={async () => {
                      try { await onCancelJoinRequest?.(); } catch (err) { console.error("Cancel request failed:", err); }
                    }}
                    disabled={membershipStatusLoading}
                    className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-[#0866ff] bg-white px-3 text-[15px] font-semibold text-[#0866ff] transition-colors hover:bg-[#f0f7ff] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <History size={17} />
                    {membershipStatusLoading ? "Cancelling..." : "Cancel request"}
                  </button>
                ) : (
                  <HeaderButton
                    primary
                    onClick={async () => {
                      try { await onJoinGroup?.(); } catch (err) { console.error("Join group failed:", err); }
                    }}
                    disabled={membershipStatusLoading}
                  >
                    <UserPlus size={17} fill="currentColor" />
                    {membershipStatusLoading ? "Joining..." : "Join Group"}
                  </HeaderButton>
                )}

                {isMember && (
                  <HeaderButton onClick={() => setIsCreateModalOpen(true)}>
                    <Plus size={17} />
                    Create Post
                  </HeaderButton>
                )}

                {!isOwner && (
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(true)}
                    className="flex cursor-pointer items-center gap-2 rounded-md border border-red-500 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    <AlertCircle size={17} />
                    Report
                  </button>
                )}

                {isOwner && (
                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(true)}
                    className="flex cursor-pointer items-center gap-2 rounded-md border border-red-600 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Delete group
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <nav className="flex min-w-0 items-center gap-1 overflow-x-auto">
                {groupTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`h-12 cursor-pointer shrink-0 px-3 text-[14px] font-semibold ${activeTab === tab ? "border-b-2 border-[#0866ff] text-[#0866ff]" : "rounded-md text-[#65676b] hover:bg-[#f2f2f2]"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            
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
      ) : activeTab === "People" ? (
        <PeopleTab contentOffsetClass={contentOffsetClass} groupId={groupId} />
      ) : activeTab === "Media" ? (
        <MediaTab contentOffsetClass={contentOffsetClass} groupId={groupId} />
      ) : (
        <main className={contentOffsetClass}>
          <div className="mx-auto w-full max-w-[580px] space-y-3 px-3 py-3">
            {isMember && (
              <CreatePost
                displayUser={displayUser}
                setIsCreateModalOpen={setIsCreateModalOpen}
                isOwnProfile={true}
                theme={theme}
                darkMode={false}
              />
            )}


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

              </div>
            </div>

            {postsLoading && posts.length === 0 ? (
              <div className="rounded-lg border border-[#dddfe2] bg-white p-8 text-center text-[15px] text-[#65676b] shadow-sm">
                Loading posts...
              </div>
            ) : posts.length > 0 ? (
              <>
                {posts.map((post) => <PostCard key={post.id} post={post} onDelete={onDeletePost} onUpdate={onUpdatePost} />)}
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

      {isOwner && isDeleteModalOpen && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-group-title"
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
          onClick={() => !isDeleting && setDeleteModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <div className="min-w-0">
                <h2 id="delete-group-title" className="text-[18px] font-bold text-[#050505]">
                  Delete this group?
                </h2>
                <p className="mt-1 text-[14px] leading-snug text-[#65676b]">
                  This will permanently remove the group for all members. Posts, comments, and
                  member activity will no longer be visible.
                </p>
              </div>
            </div>

            {deleteError && (
              <p className="mt-3 text-[13px] font-semibold text-red-600">{deleteError}</p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
                className="h-9 cursor-pointer rounded-md bg-[#e4e6eb] px-4 text-[14px] font-semibold text-[#050505] hover:bg-[#d8dadf] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="h-9 cursor-pointer rounded-md bg-red-600 px-4 text-[14px] font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete group"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isReportModalOpen && !isOwner && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="report-group-title"
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
          onClick={closeReportModal}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {reportState === "success" ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h3 id="report-group-title" className="text-[16px] font-bold text-[#050505]">
                    Report submitted
                  </h3>
                  <button
                    type="button"
                    onClick={closeReportModal}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#65676b] hover:bg-[#f2f2f2] hover:text-[#050505]"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="flex flex-col items-center gap-3 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle2 size={22} />
                  </span>
                  <p className="text-[13px] leading-snug text-[#65676b]">
                    Thank you. We&apos;ll review this group and take appropriate action.
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={closeReportModal}
                    className="h-9 cursor-pointer rounded-md bg-[#0866ff] px-6 text-[14px] font-semibold text-white hover:bg-[#075ce5]"
                  >
                    Done
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h3 id="report-group-title" className="text-[16px] font-bold text-[#050505]">
                    Report this group
                  </h3>
                  <button
                    type="button"
                    onClick={closeReportModal}
                    disabled={reportState === "submitting"}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#65676b] hover:bg-[#f2f2f2] hover:text-[#050505] disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
                <p className="mb-3 text-[13px] text-[#65676b]">
                  Why are you reporting this group?
                </p>
                <div className="flex max-h-72 flex-col gap-1 overflow-y-auto">
                  {GROUP_REPORT_REASONS.map((option) => {
                    const selected = reportReason === option.value;
                    return (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-[13px] transition-colors ${
                          selected
                            ? "bg-blue-50 text-[#0866ff] ring-1 ring-blue-200"
                            : "text-[#050505] hover:bg-[#f2f2f2]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="report-reason"
                          value={option.value}
                          checked={selected}
                          onChange={(e) => setReportReason(e.target.value)}
                          className="sr-only"
                        />
                        <span
                          className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 text-[9px] font-bold transition-colors ${
                            selected ? "border-[#0866ff] bg-[#0866ff] text-white" : "border-[#ccd0d5]"
                          }`}
                        >
                          {selected ? "✓" : ""}
                        </span>
                        {option.label}
                      </label>
                    );
                  })}
                </div>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Additional details (optional)"
                  rows={2}
                  className="mt-3 w-full resize-none rounded-md border border-[#dddfe2] bg-[#f0f2f5] px-3 py-2 text-[13px] text-[#050505] outline-none placeholder:text-[#8a8d91] focus:border-[#0866ff]"
                />
                {reportError && (
                  <p className="mt-3 text-[13px] font-semibold text-red-600">{reportError}</p>
                )}
                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeReportModal}
                    disabled={reportState === "submitting"}
                    className="h-9 cursor-pointer rounded-md px-4 text-[14px] font-semibold text-[#65676b] hover:bg-[#f2f2f2] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitReport}
                    disabled={!reportReason || reportState === "submitting"}
                    className="flex h-9 cursor-pointer items-center gap-2 rounded-md bg-red-600 px-4 text-[14px] font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {reportState === "submitting" && (
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    )}
                    {reportState === "submitting" ? "Submitting…" : "Submit Report"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
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
  const navigate = useNavigate();
  const numericGroupId = Number(groupId);
  const { user: currentUser } = useAuth();
  const { groupDetail, loading, error, rules, fetchRules, uploadCoverPhoto, isInactive, inactiveReason, inactiveState, isMember, hasPendingRequest, joinGroup, leaveGroup, cancelJoinRequest, deleteGroup, reportGroup, membershipStatusLoading } = useGroup(numericGroupId);
  const [activeTab, setActiveTab] = useState("Discussion");
  const [isMineFilter, setIsMineFilter] = useState(false);
  const [fromDateFilter, setFromDateFilter] = useState(null);
  const groupDeleted = inactiveState?.deleted ?? groupDetail?.isDeleted ?? groupDetail?.IsDeleted ?? false;
  const adminView = searchParams.get("tab") || "home";

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
    deletePost: deleteGroupPost,
    updatePost: updateGroupPost,
  } = useGroupPosts(numericGroupId, {
    isMine: isMineFilter,
    pageSize: 20,
    autoFetch: true,
  });
  const currentUserRole = groupDetail?.role ?? groupDetail?.Role;
  const isAdmin = ["admin", "moderator"].includes(normalizeRole(currentUserRole));
  const isOwner = currentUser?.id != null
    && (groupDetail?.ownerUserId ?? groupDetail?.OwnerUserId) === currentUser.id;
  const contentOffsetClass = isAdmin ? "lg:pl-[292px]" : "";
  const displayUser = {
    name: currentUser ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || "You" : "You",
    avatar: currentUser?.avatarUrl || currentUser?.avatar || import.meta.env.VITE_DEFAULT_AVATAR,
  };

  const handleCreatePost = async (payload) => {
    try {
      await createPostApi(payload);
      await refreshPosts();
    } catch (err) {
      console.error("Create group post failed:", err);
      throw err;
    }
  };

  const handleJoinGroup = async () => {
    if (!numericGroupId) return;
    try {
      await joinGroup(numericGroupId);
    } catch (err) {
      console.error("Join group failed:", err);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await leaveGroup();
    } catch (err) {
      console.error("Leave group failed:", err);
    }
  };

  const handleCancelJoinRequest = async () => {
    try {
      await cancelJoinRequest();
    } catch (err) {
      console.error("Cancel join request failed:", err);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await deleteGroup();
    } catch (err) {
      console.error("Delete group failed:", err);
      throw err;
    }
  };

  const handleReportGroup = async ({ reason, details = null }) => {
    try {
      const result = await reportGroup({ reason, details });
      return result;
    } catch (err) {
      console.error("Report group failed:", err);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#050505]">
      <Navbar />
      {isAdmin && <GroupAdminSidebar activeView={adminView} onViewChange={setAdminView} groupDetail={groupDetail} userRole={currentUserRole} />}

      {isInactive && (
        <div
          role="alert"
          aria-modal="true"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md"
        >
          <div className="mx-4 max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-bold text-[#050505]">
              {groupDeleted ? "Group deleted" : "Group locked"}
            </h2>
            <p className="text-[15px] text-[#65676b]">
              {inactiveReason || "This group is currently unavailable."}
            </p>
            <button
              type="button"
              onClick={() => navigate("/groups")}
              className="mt-5 h-10 cursor-pointer rounded-md bg-[#0866ff] px-5 text-[14px] font-semibold text-white hover:bg-[#075ce5]"
            >
              Go to groups
            </button>
          </div>
        </div>
      )}

      <div className={isInactive ? "pointer-events-none select-none opacity-0" : ""}>

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
          isAdmin={isAdmin}
          isOwner={isOwner}
          uploadCoverPhoto={uploadCoverPhoto}
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
          onDeletePost={deleteGroupPost}
          onUpdatePost={updateGroupPost}
          isMember={isMember}
          hasPendingRequest={hasPendingRequest}
          membershipStatusLoading={membershipStatusLoading}
          onJoinGroup={handleJoinGroup}
          onLeaveGroup={handleLeaveGroup}
          onCancelJoinRequest={handleCancelJoinRequest}
          onDeleteGroup={handleDeleteGroup}
          onReportGroup={handleReportGroup}
        />
      )}

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        displayUser={displayUser}
        onSubmit={handleCreatePost}
        groupId={numericGroupId}
        allowAnonymousPost={groupDetail?.allowAnonymousPost ?? groupDetail?.AllowAnonymousPost ?? false}
      />

      <button
        type="button"
        className="fixed bottom-5 right-5 hidden h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/10 hover:bg-[#f2f2f2] sm:flex"
      >
        <FileText size={20} />
      </button>
      </div>
    </div>
  );
}
