import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import PostComment from "../Feed/PostComment";

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
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Normalize ReelCommentDto fields to PostComment's expected shape
function normalizeForPostComment(comments) {
  return comments.map((c) => ({
    id: c.id,
    parentId: c.parentCommentId ?? null,
    user: c.userName,
    avatar: c.userAvatarUrl ?? `https://i.pravatar.cc/40?u=${c.userId}`,
    text: c.content,
    time: timeAgo(c.createdAt),
    replyCount: c.replyCount ?? 0,
    replies: (c.replies ?? []).map((r) => ({
      id: r.id,
      user: r.userName,
      avatar: r.userAvatarUrl ?? `https://i.pravatar.cc/40?u=${r.userId}`,
      text: r.content,
      time: timeAgo(r.createdAt),
      repliedUserName: r.repliedUserName ?? null,
      repliedAvatarUrl: r.repliedAvatarUrl ?? null,
    })),
    reactedUserName: c.reactedUserName ?? null,
    userReaction: c.userReaction ?? null,
    likes: c.reactionCount ?? null,
  }));
}

export default function ReelCommentModal({
  isOpen,
  onClose,
  reel,
  comments,
  newComment,
  onNewCommentChange,
  onSubmitComment,
  isSubmitting,
  isLoadingComments,
  error,
  hasMoreComments,
  onLoadMoreComments,
  onLoadReplies,
  loadingReplyParentIds,
  replyTarget,
  onStartReply,
  onCancelReply,
  onReactComment,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Pause video when modal opens, resume on close
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  if (!isOpen || !reel) return null;

  const normalizedComments = normalizeForPostComment(comments);

  return (
    <div className="fixed inset-0 z-[10000] flex bg-black/80">
      {/* Left: Video — takes 70% */}
      <div className="relative flex h-full w-[70%] flex-col items-center justify-center bg-black">
        <video
          ref={videoRef}
          src={reel.videoUrl}
          poster={reel.poster || reel.thumbnailUrl}
          className="max-h-full max-w-full object-contain"
          controls
          playsInline
        />

        {/* Author + caption overlay on video */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2">
            <img
              src={reel.avatar || reel.authorAvatarUrl}
              alt={reel.author || reel.authorName}
              className="h-10 w-10 rounded-full border-2 border-white/40 object-cover"
            />
            <div>
              <div className="text-sm font-bold text-white">{reel.author || reel.authorName}</div>
              <div className="text-xs text-white/70">@{reel.handle ?? ""}</div>
            </div>
          </div>
          {reel.caption && (
            <p className="mt-2 text-sm text-white/90">{reel.caption}</p>
          )}
        </div>
      </div>

      {/* Right: Comments panel — 30%, with close button */}
      <div className="relative flex h-full w-[30%] flex-col bg-white">
        {/* Header with close button */}
        <div className="flex items-center justify-between border-b border-[#E4E6EB] px-5 py-4">
          <h2 className="text-base font-semibold text-[#050505]">
            {reel.commentCount ?? 0} {reel.commentCount === 1 ? "comment" : "comments"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-[#F2F4F7] text-[#050505] transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Comments list — scrollable */}
        <div className="flex-1 overflow-y-auto p-5">
          <PostComment
            comments={normalizedComments}
            newComment={newComment}
            onNewCommentChange={onNewCommentChange}
            onSubmitComment={onSubmitComment}
            isSubmitting={isSubmitting}
            error={error}
            isLoading={isLoadingComments}
            hasMoreComments={hasMoreComments}
            onLoadMoreComments={onLoadMoreComments}
            onLoadReplies={onLoadReplies}
            loadingReplyParentIds={loadingReplyParentIds}
            replyTarget={replyTarget}
            onStartReply={onStartReply}
            onCancelReply={onCancelReply}
            onReactComment={onReactComment}
          />
        </div>
      </div>
    </div>
  );
}
