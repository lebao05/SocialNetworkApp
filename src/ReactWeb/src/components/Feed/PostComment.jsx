import React, { useRef, useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";

// ─── Reply Bubble ────────────────────────────────────────────────────────────
function ReplyBubble({ reply, onReactComment, onReply }) {
  return (
    <div className="flex items-start gap-2">
      <img src={reply.avatar} alt={reply.user} className="mt-0.5 h-8 w-8 rounded-full object-cover" />
      <div className="min-w-0 flex-1">
        <div className="inline-block max-w-full rounded-2xl bg-[#F0F2F5] px-3 py-2">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-[13px] font-semibold leading-4 text-gray-900">{reply.user}</span>
            <span className="text-[11px] leading-4 text-gray-500">{reply.time}</span>
          </div>

          {reply.repliedUserName && (
            <div className="mt-1 flex items-center gap-1 text-[11px] leading-4 text-gray-500">
              <span>Replying to</span>

              <div className="flex items-center gap-1 rounded-full bg-gray-100 px-1.5 py-0.5">
                {reply.repliedAvatarUrl && (
                  <img
                    src={reply.repliedAvatarUrl}
                    alt={reply.repliedUserName}
                    className="h-4 w-4 rounded-full object-cover"
                  />
                )}

                <span className="font-medium text-gray-700">
                  {reply.repliedUserName}
                </span>
              </div>
            </div>
          )}

          <p className="mt-1 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-[13px] leading-5 text-gray-800">
            {reply.text}
          </p>
        </div>

        <div className="ml-3 mt-1 flex items-center gap-3 text-xs text-gray-500">
          <button
            type="button"
            onClick={() => onReactComment(reply.id)}
            className={`font-semibold ${reply.userReaction === "Like" ? "text-[#1877f2]" : "hover:text-[#1877f2]"}`}
          >
            {reply.userReaction === "Like" ? "Liked" : "Like"}
            {reply.likes != null && ` · ${reply.likes}`}
          </button>
          <button type="button" className="font-semibold hover:text-[#1877f2]" onClick={() => onReply(reply.id)}>
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Comment Bubble ───────────────────────────────────────────────────────────
function CommentBubble({ comment, replies, onReply, onReactComment, onLoadReplies, isLoadingReplies }) {
  const hiddenReplyCount = Math.max(0, (comment.replyCount || 0) - replies.length);

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <img src={comment.avatar} alt={comment.user} className="mt-0.5 h-9 w-9 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <div className="inline-block max-w-full rounded-2xl bg-[#F0F2F5] px-3 py-2">
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="text-[13px] font-semibold leading-4 text-gray-900">{comment.user}</span>
              <span className="text-[11px] leading-4 text-gray-500">{comment.time}</span>
            </div>
            <p className="mt-1 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-[13px] leading-5 text-gray-800">
              {comment.text}
            </p>
          </div>

          <div className="ml-3 mt-1 flex items-center gap-3 text-xs text-gray-500">
            <button
              type="button"
              onClick={() => onReactComment(comment.id)}
              className={`font-semibold ${comment.userReaction === "Like" ? "text-[#1877f2]" : "hover:text-[#1877f2]"}`}
            >
              {comment.userReaction === "Like" ? "Liked" : "Like"}
              {comment.likes != null && ` · ${comment.likes}`}
            </button>
            <button type="button" className="font-semibold hover:text-[#1877f2]" onClick={() => onReply(comment.id)}>
              Reply
            </button>
          </div>
        </div>
      </div>

      {replies.length > 0 && (
        <div className="ml-11 space-y-2">
          <div className="border-l-2 border-[#D3D7DB] pl-3 space-y-2">
            {replies.map((reply) => (
              <ReplyBubble key={reply.id} reply={reply} onReactComment={onReactComment} onReply={onReply} />
            ))}
          </div>
        </div>
      )}

      {hiddenReplyCount > 0 && (
        <div className="ml-12">
          <button
            type="button"
            onClick={() => onLoadReplies(comment.id)}
            disabled={isLoadingReplies}
            className="text-xs font-semibold text-[#1877f2] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingReplies
              ? "Loading replies…"
              : `${replies.length > 0 ? "View more" : "View"} ${hiddenReplyCount} ${hiddenReplyCount === 1 ? "reply" : "replies"}`}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Comment Input Box (with reply chip + emoji picker) ──────────────────────
function CommentInputBox({ newComment, onNewCommentChange, onSubmitComment, isSubmitting, replyTarget, onCancelReply }) {
  const inputRef = useRef(null);
  const pickerRef = useRef(null);
  const [showPicker, setShowPicker] = useState(false);

  // Auto-focus when replyTarget changes
  useEffect(() => {
    if (replyTarget && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyTarget]);

  // Close picker on outside click
  useEffect(() => {
    if (!showPicker) return;
    const handle = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [showPicker]);

  const handleKeyDown = (e) => {
    // Backspace with empty input & a reply target → cancel reply
    if (e.key === "Backspace" && newComment === "" && replyTarget) {
      e.preventDefault();
      onCancelReply();
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmitComment();
    }
  };

  const handleEmojiClick = (emojiData) => {
    onNewCommentChange(newComment + emojiData.emoji);
    setShowPicker(false);
    inputRef.current?.focus();
  };

  return (
    <div className="mt-4 flex items-end gap-2">
      {/* Input wrapper */}
      <div className="relative flex-1">
        {/* Reply chip inside the box (top-left, above the input line) */}
        <div
          className={`
            flex items-center gap-1.5 rounded-full border border-[#D3D7DB]
            bg-white px-3 transition-all duration-200
            ${replyTarget ? "pt-2 pb-1" : "py-2.5"}
          `}
        >
          {replyTarget && (
            <span className="flex items-center gap-1 rounded-full bg-[#E7F3FF] px-2 py-0.5 text-[12px] font-semibold text-[#1877f2] shrink-0">
              ↩ {replyTarget.user}
              <button
                type="button"
                onClick={onCancelReply}
                className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#1877f2] text-white text-[9px] hover:bg-blue-700 transition-colors"
                title="Cancel reply"
              >
                ✕
              </button>
            </span>
          )}

          <input
            ref={inputRef}
            value={newComment}
            onChange={(e) => onNewCommentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
            placeholder={replyTarget ? "Write a reply…" : "Write a comment…"}
          />

          {/* Emoji trigger button */}
          <button
            type="button"
            onClick={() => setShowPicker((v) => !v)}
            className="shrink-0 text-[18px] leading-none text-gray-400 hover:text-yellow-400 transition-colors"
            title="Add emoji"
          >
            😊
          </button>
        </div>

        {/* Emoji picker popover */}
        {showPicker && (
          <div
            ref={pickerRef}
            className="absolute bottom-full right-0 mb-2 z-[10010] shadow-2xl rounded-2xl overflow-hidden"
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              searchDisabled={false}
              skinTonesDisabled
              height={380}
              width={320}
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}
      </div>

      {/* Post button */}
      <button
        onClick={onSubmitComment}
        disabled={isSubmitting || !newComment.trim()}
        className="shrink-0 rounded-full bg-[#1877F2] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Posting…" : "Post"}
      </button>
    </div>
  );
}

// ─── Main PostComment ─────────────────────────────────────────────────────────
export default function PostComment({
  comments,
  newComment,
  onNewCommentChange,
  onSubmitComment,
  isSubmitting = false,
  isLoading = false,
  error = "",
  hasMoreComments = false,
  onLoadMoreComments,
  onLoadReplies,
  loadingReplyParentIds = [],
  onStartReply,
  onCancelReply,
  replyTarget,
  onReactComment,
}) {
  const grouped = comments.reduce((acc, comment) => {
    const parentId = comment.parentId || null;
    if (!acc[parentId]) acc[parentId] = [];
    acc[parentId].push(comment);
    return acc;
  }, {});

  const topLevelComments = grouped[null] || [];

  return (
    <>
      {/* Comment list */}
      <div className="mt-4 space-y-3">
        {isLoading && topLevelComments.length === 0 ? (
          <div className="rounded-3xl border border-[#E4E6EB] bg-white p-4 text-sm text-gray-500">
            Loading comments…
          </div>
        ) : topLevelComments.length === 0 ? (
          <div className="rounded-3xl border border-[#E4E6EB] bg-white p-4 text-sm text-gray-500">
            No comments yet. Be the first to comment.
          </div>
        ) : (
          topLevelComments.map((comment) => (
            <CommentBubble
              key={comment.id}
              comment={comment}
              replies={grouped[comment.id] || []}
              onReply={onStartReply}
              onReactComment={onReactComment}
              onLoadReplies={onLoadReplies}
              isLoadingReplies={loadingReplyParentIds.includes(comment.id)}
            />
          ))
        )}
      </div>

      {hasMoreComments && (
        <button
          type="button"
          onClick={onLoadMoreComments}
          disabled={isLoading}
          className="mt-4 text-sm font-semibold text-[#1877f2] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Loading comments…" : "View more comments"}
        </button>
      )}

      {error && (
        <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Comment input with reply chip + emoji */}
      <CommentInputBox
        newComment={newComment}
        onNewCommentChange={onNewCommentChange}
        onSubmitComment={onSubmitComment}
        isSubmitting={isSubmitting}
        replyTarget={replyTarget}
        onCancelReply={onCancelReply}
      />
    </>
  );
}
