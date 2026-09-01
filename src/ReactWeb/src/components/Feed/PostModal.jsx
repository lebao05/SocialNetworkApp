import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { GrLike } from "react-icons/gr";
import { PiShareFatLight } from "react-icons/pi";
import { MoreHorizontal, Flag, X, Check, AlertTriangle } from "lucide-react";
import PostComment from "./PostComment";
import MediaGallery from "./MediaGallery";
import ShareModal from "./ShareModal";
import UpdatingPostModal from "./UpdatingPostModal";
import { useAuth } from "../../contexts/authContext";
import { reportPostApi } from "../../apis/postApi";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

function renderTaggedUsers(tags) {
  if (!Array.isArray(tags) || tags.length === 0) return null;
  const list = tags.filter((t) => t && t.tagName);
  if (list.length === 0) return null;

  const linkClass = "font-semibold text-[#1877F2] hover:underline cursor-pointer";

  const renderName = (tag, key) => {
    const inner = <span className={linkClass}>{tag.tagName}</span>;
    return tag.id != null ? (
      <Link key={key} to={`/profile/${tag.id}`} className="no-underline">
        {inner}
      </Link>
    ) : (
      <span key={key}>{inner}</span>
    );
  };

  if (list.length <= 2) {
    return (
      <span>
        with {list.map((tag, i) => (
          <React.Fragment key={tag.id ?? tag.tagName}>
            {i > 0 && ", "}
            {renderName(tag, tag.id ?? tag.tagName)}
          </React.Fragment>
        ))}
      </span>
    );
  }

  const first = list[0];
  const second = list[1];
  const remaining = list.length - 2;
  return (
    <span>
      with {renderName(first, first.id ?? first.tagName)},{" "}
      {renderName(second, second.id ?? second.tagName)} and{" "}
      <span className="font-semibold text-[#050505]">{remaining} others</span>
    </span>
  );
}

const ReactionBtn = ({ icon, label, onClick, active, onMouseEnter, onMouseLeave }) => (
  <button
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F2F4F7] text-sm font-semibold transition-colors ${active ? "text-blue-600" : "text-gray-500"}`}
  >
    <span className={active && typeof icon === "string" ? "scale-110" : ""}>{icon}</span> {label}
  </button>
);

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const VISIBILITY_ICON = {
  0: "🌐",
  1: "👥",
  2: "🔒",
};

const REPORT_REASONS = [
  { value: "Spam", label: "Spam" },
  { value: "Harassment", label: "Harassment" },
  { value: "HateSpeech", label: "Hate speech" },
  { value: "Violence", label: "Violence" },
  { value: "Misinformation", label: "Misinformation" },
  { value: "NudityOrSexual", label: "Nudity or sexual content" },
  { value: "IntellectualProperty", label: "Intellectual property violation" },
  { value: "Other", label: "Other" },
];

export default function PostModal({
  isOpen,
  onClose,
  post,
  authorName,
  authorAvatar,
  likes,
  liked,
  comments,
  commentCount,
  onLike,
  onSubmitComment,
  newComment,
  onNewCommentChange,
  isSubmittingComment,
  commentError,
  isLoadingComments,
  hasMoreComments,
  onLoadMoreComments,
  onLoadReplies,
  loadingReplyParentIds,
  reaction,
  reactionHover,
  reactionOptions,
  handleReactionSelect,
  handleMouseEnter,
  handleMouseLeave,
  replyTarget,
  onStartReply,
  onCancelReply,
  onReactComment,
  topReactionIcon,
  transparentOverlay = false,
  currentUserAvatar,
  onDelete,
  onUpdate,
}) {
  const { user } = useAuth();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("idle"); // 'idle' | 'confirm' | 'deleting'
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetail, setReportDetail] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const dropdownRef = useRef(null);

  const isOwner = !!(user && (post.authorId === user.id || post.AuthorId === user.id));

  // Close dropdown on outside click
  useEffect(() => {
    if (!showOptions) return;
    const handle = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [showOptions]);

  const handleOpenReport = () => {
    setShowOptions(false);
    setReportReason("");
    setReportDetail("");
    setReportSubmitted(false);
    setShowReportModal(true);
  };

  const handleSubmitReport = async () => {
    if (!reportReason || isReporting) return;
    setIsReporting(true);
    try {
      await reportPostApi({ postId: post.id, reason: reportReason, details: reportDetail || null });
      setReportSubmitted(true);
    } catch {
      console.error("Failed to submit report");
    } finally {
      setIsReporting(false);
    }
  };

  const handleOpenDelete = () => {
    setShowOptions(false);
    setDeleteConfirm("confirm");
  };

  const handleConfirmDelete = async () => {
    if (!onDelete) {
      setDeleteConfirm("idle");
      return;
    }
    setDeleteConfirm("deleting");
    try {
      await onDelete(post.id);
      setDeleteConfirm("idle");
    } catch (err) {
      console.error("Failed to delete post:", err);
      setDeleteConfirm("idle");
    }
  };

  const handleUpdateSubmit = async (payload) => {
    if (!onUpdate) return;
    try {
      await onUpdate(payload);
      setOpenUpdateModal(false);
    } catch (err) {
      console.error("Failed to update post:", err);
    }
  };

  const handleUpdateCancel = () => {
    setOpenUpdateModal(false);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[10000] flex items-center justify-center px-4 py-6 ${transparentOverlay ? "bg-black/20 backdrop-blur-sm" : "bg-black/70"}`}>
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E4E6EB] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[#050505]">Post details</h2>
            <p className="text-sm text-[#65676B]">See the post, like count, and comments in one place.</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Options dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowOptions((v) => !v)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#F2F4F7] transition-colors text-[#050505]"
              >
                <MoreHorizontal size={22} />
              </button>
              {showOptions && (
                <div className="absolute right-0 top-full mt-1 z-[10002] w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                  {isOwner && (
                    <>
                      <button
                        type="button"
                        onClick={() => { setShowOptions(false); setOpenUpdateModal(true); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[15px] font-semibold text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-600">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Edit post
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenDelete}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[15px] font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                        </svg>
                        Delete post
                      </button>
                    </>
                  )}
                  {!isOwner && (
                    <button
                      type="button"
                      onClick={handleOpenReport}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[15px] font-semibold text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <Flag size={18} className="text-gray-600" />
                      Report post
                    </button>
                  )}
                </div>
              )}
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#F2F4F7] transition-colors text-[#050505] text-xl">
              ✕
            </button>
          </div>
        </div>

        <div className="max-h-[80vh] overflow-y-auto">
          <div className="p-5">
            <div className="flex items-start gap-3">
              {post.authorId || post.AuthorId ? (
                <Link
                  to={`/profile/${post.authorId ?? post.AuthorId}`}
                  className="no-underline text-inherit"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img src={authorAvatar} alt={authorName} className="w-12 h-12 rounded-full object-cover border cursor-pointer" />
                </Link>
              ) : (
                <img src={authorAvatar} alt={authorName} className="w-12 h-12 rounded-full object-cover border" />
              )}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {post.authorId || post.AuthorId ? (
                    <Link
                      to={`/profile/${post.authorId ?? post.AuthorId}`}
                      className="font-semibold text-gray-800 hover:underline no-underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {authorName}
                    </Link>
                  ) : (
                    <span className="font-semibold text-gray-800">{authorName}</span>
                  )}
                  <span className="text-sm text-gray-500">{post.locationTag ? `${post.locationTag}` : ""}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {post.createdAt ? timeAgo(post.createdAt) : post.time} · {VISIBILITY_ICON[post.visibility] ?? VISIBILITY_ICON[0]}
                </p>
              </div>
            </div>

            {/* Shared Post Preview */}
            {post.sharePost && (
              <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden bg-[#F8FAFC]">
                <div className="flex items-center gap-2 p-3 border-b border-gray-100">
                  <img
                    src={post.sharePost.authorAvatarUrl || post.sharePost.avatar || DEFAULT_AVATAR}
                    alt={post.sharePost.authorName || post.sharePost.user || "User"}
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-800 truncate">
                      {post.sharePost.authorName || post.sharePost.user || "Unknown"}
                    </p>
                  </div>
                </div>
                <div className="px-3 py-2">
                  {post.sharePost.content && (
                    <p className="text-[13px] text-gray-700 leading-relaxed line-clamp-3">
                      {post.sharePost.content}
                    </p>
                  )}
                  {post.sharePost.media?.length > 0 && (
                    <div className="mt-2">
                      <MediaGallery media={post.sharePost.media} compact={true} disableInteraction={true} />
                    </div>
                  )}
                  {!post.sharePost.media?.length && post.sharePost.image && (
                    <div className="mt-2 rounded-lg overflow-hidden">
                      <img
                        src={post.sharePost.image}
                        alt="shared"
                        className="w-full object-cover max-h-[200px]"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {post.content && (
              <p className="mt-4 text-[15px] leading-relaxed text-gray-800">{post.content}</p>
            )}

            {renderTaggedUsers(post.tags) && (
              <p className="mt-2 text-[14px] text-gray-500">
                {renderTaggedUsers(post.tags)}
              </p>
            )}

            <div className="mt-4">
              <MediaGallery media={post.media} />
              {!post.media?.length && post.image && (
                <div className="mt-4 w-full rounded-2xl overflow-hidden">
                  <img src={post.image} alt="post" className="w-full object-cover" />
                </div>
              )}
            </div>

            <div className="mt-5 rounded-3xl border border-[#E4E6EB] bg-[#F8FAFC] p-4">
              <div className="flex items-center justify-between text-sm text-gray-500 pb-3 border-b border-gray-200/60">
                <div className="flex items-center gap-3">
                  <span className="cursor-pointer hover:underline">{likes.toLocaleString()} {likes === 1 ? "like" : "likes"}</span>
                  <span className="text-gray-300 select-none">|</span>
                  <span className="cursor-pointer hover:underline">{commentCount} {commentCount === 1 ? "comment" : "comments"}</span>
                  <span className="text-gray-300 select-none">|</span>
                  <span className="cursor-pointer hover:underline">{post.shares || 0} shares</span>
                </div>
                {topReactionIcon ? (
                  <div className="flex items-center tracking-[-0.2em] pr-1 select-none text-base">
                    <span>{topReactionIcon}</span>
                  </div>
                ) : null}
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <ReactionBtn
                      icon={reaction || <GrLike size={18} />}
                      label={reaction ? "Liked" : "Like"}
                      onClick={onLike}
                      active={liked}
                    />

                    {reactionHover && (
                      <div
                        className="absolute left-0 bottom-full mb-2 flex items-center gap-2 rounded-full bg-white p-2 shadow-lg ring-1 ring-black/5 z-[10001] animate-in fade-in slide-in-from-bottom-2 duration-200"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        {reactionOptions.map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            onClick={() => handleReactionSelect(icon)}
                            className="h-10 w-10 rounded-full flex items-center justify-center text-xl hover:bg-[#F2F4F7] transition-transform hover:scale-125 duration-150"
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <ReactionBtn icon={<PiShareFatLight size={18} />} label="Share" onClick={() => setShareModalOpen(true)} />
                </div>
                <div className="flex items-center text-gray-500 text-xs"></div>
              </div>
            </div>

            <PostComment
              comments={comments}
              newComment={newComment}
              onNewCommentChange={onNewCommentChange}
              onSubmitComment={onSubmitComment}
              isSubmitting={isSubmittingComment}
              error={commentError}
              isLoading={isLoadingComments}
              hasMoreComments={hasMoreComments}
              onLoadMoreComments={onLoadMoreComments}
              onLoadReplies={onLoadReplies}
              loadingReplyParentIds={loadingReplyParentIds}
              replyTargetId={replyTarget?.id}
              onStartReply={onStartReply}
              onCancelReply={onCancelReply}
              replyTarget={replyTarget}
              onReactComment={onReactComment}
            />
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        post={post}
        authorName={authorName}
        authorAvatar={authorAvatar}
        currentUserAvatar={currentUserAvatar}
      />

      {/* Edit modal */}
      <UpdatingPostModal
        isOpen={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        post={post}
        authorName={authorName}
        authorAvatar={authorAvatar}
        onSubmit={handleUpdateSubmit}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== "idle" && (
        <div className="fixed inset-0 z-[10001] bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="flex flex-col items-center gap-3 p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete this post?</h3>
              <p className="text-[13px] text-gray-500 leading-snug">
                This post will be permanently removed and cannot be recovered.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 pb-6">
              <button
                type="button"
                onClick={() => setDeleteConfirm("idle")}
                disabled={deleteConfirm === "deleting"}
                className="px-4 py-2 text-[14px] font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteConfirm === "deleting"}
                className="flex items-center gap-2 px-4 py-2 text-[14px] font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60 cursor-pointer"
              >
                {deleteConfirm === "deleting" && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {deleteConfirm === "deleting" ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-[10001] bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Report post</h2>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="p-6 flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <Check size={28} className="text-green-600" />
                </div>
                <p className="text-[15px] font-bold text-gray-900">Report submitted</p>
                <p className="text-[13px] text-gray-500">
                  Thank you. We&apos;ll review this post and take appropriate action.
                </p>
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="mt-2 px-6 py-2 bg-[#1877F2] text-white text-[15px] font-bold rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="p-4 flex flex-col gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Reason for reporting</label>
                  <div className="grid grid-cols-2 gap-2">
                    {REPORT_REASONS.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setReportReason(r.value)}
                        className={`px-3 py-2 rounded-lg text-[13px] font-semibold border transition-colors cursor-pointer text-left ${reportReason === r.value
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">
                    Additional details <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    value={reportDetail}
                    onChange={(e) => setReportDetail(e.target.value)}
                    placeholder="Provide more context..."
                    rows={3}
                    className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[14px] text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:bg-white transition-colors"
                  />
                </div>

                <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3">
                  <AlertTriangle size={15} className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-[12px] text-red-700 leading-relaxed">
                    Only submit a report if you believe this content violates community standards. False reports may result in action against your account.
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 text-[14px] font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitReport}
                    disabled={!reportReason || isReporting}
                    className="px-4 py-2 text-[14px] font-bold text-white bg-[#dc3545] rounded-lg hover:bg-[#c82333] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isReporting ? "Submitting..." : "Submit report"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
