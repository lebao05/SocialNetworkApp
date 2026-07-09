import React from "react";
import { GrLike } from "react-icons/gr";
import { PiShareFatLight } from "react-icons/pi";
import PostComment from "./PostComment";
import MediaGallery from "./MediaGallery";

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
}) {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[10000] flex items-center justify-center px-4 py-6 ${transparentOverlay ? "bg-black/20 backdrop-blur-sm" : "bg-black/70"}`}>
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#E4E6EB] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[#050505]">Post details</h2>
            <p className="text-sm text-[#65676B]">See the post, like count, and comments in one place.</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#F2F4F7] transition-colors text-[#050505] text-xl">
            ✕
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto">
          <div className="p-5">
            <div className="flex items-start gap-3">
              <img src={authorAvatar} alt={authorName} className="w-12 h-12 rounded-full object-cover border" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-gray-800">{authorName}</span>
                  <span className="text-sm text-gray-500">{post.locationTag ? `${post.locationTag}` : ""}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {post.createdAt ? timeAgo(post.createdAt) : post.time} · {VISIBILITY_ICON[post.visibility] ?? VISIBILITY_ICON[0]}
                </p>
              </div>
            </div>

            {post.content && (
              <p className="mt-4 text-[15px] leading-relaxed text-gray-800">{post.content}</p>
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

                  <ReactionBtn icon={<PiShareFatLight size={18} />} label="Share" />
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
    </div>
  );
}
