import React from "react";

function ReplyBubble({ reply, onReactComment }) {
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
            <div className="mt-1 flex items-center gap-1.5 text-[11px] leading-4 text-gray-500">
              {reply.repliedAvatarUrl && (
                <img src={reply.repliedAvatarUrl} alt={reply.repliedUserName} className="h-4 w-4 rounded-full object-cover" />
              )}
              <span>
                Replying to <span className="font-semibold text-gray-700">{reply.repliedUserName}</span>
              </span>
            </div>
          )}

          <p className="mt-1 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-[13px] leading-5 text-gray-800">{reply.text}</p>
        </div>

        <div className="ml-3 mt-1 flex items-center gap-3 text-xs text-gray-500">
          <button
            type="button"
            onClick={() => onReactComment(reply.id)}
            className={`font-semibold ${reply.userReaction === "Like" ? "text-[#1877f2]" : "hover:text-[#1877f2]"}`}
          >
            {reply.userReaction === "Like" ? "Liked" : "Like"}
            {reply.likes != null && ` - ${reply.likes}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function CommentBubble({
  comment,
  replies,
  onReply,
  onReactComment,
  onLoadReplies,
  isLoadingReplies,
}) {
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
            <p className="mt-1 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-[13px] leading-5 text-gray-800">{comment.text}</p>
          </div>

          <div className="ml-3 mt-1 flex items-center gap-3 text-xs text-gray-500">
            <button
              type="button"
              onClick={() => onReactComment(comment.id)}
              className={`font-semibold ${comment.userReaction === "Like" ? "text-[#1877f2]" : "hover:text-[#1877f2]"}`}
            >
              {comment.userReaction === "Like" ? "Liked" : "Like"}
              {comment.likes != null && ` - ${comment.likes}`}
            </button>
            {!comment.parentId && (
              <button type="button" className="font-semibold hover:text-[#1877f2]" onClick={() => onReply(comment.id)}>
                Reply
              </button>
            )}
          </div>
        </div>
      </div>

      {replies.length > 0 && (
        <div className="ml-11 space-y-2">
          <div className="border-l-2 border-[#D3D7DB] pl-3 space-y-2">
            {replies.map((reply) => (
              <ReplyBubble key={reply.id} reply={reply} onReactComment={onReactComment} />
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
              ? "Loading replies"
              : `${replies.length > 0 ? "View more" : "View"} ${hiddenReplyCount} ${hiddenReplyCount === 1 ? "reply" : "replies"}`}
          </button>
        </div>
      )}
    </div>
  );
}

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
      {replyTarget && (
        <div className="mb-4 rounded-3xl border border-[#D3D7DB] bg-[#F8FAFC] px-4 py-3 text-sm text-gray-700 flex items-center justify-between gap-4">
          <div>
            Replying to <span className="font-semibold text-gray-900">{replyTarget.user}</span>
          </div>
          <button
            type="button"
            onClick={onCancelReply}
            className="text-[#1877f2] font-semibold hover:underline"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="mt-4 space-y-3">
        {isLoading && topLevelComments.length === 0 ? (
          <div className="rounded-3xl border border-[#E4E6EB] bg-white p-4 text-sm text-gray-500">
            Loading comments...
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
          {isLoading ? "Loading comments" : "View more comments"}
        </button>
      )}

      {error && (
        <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-5 flex gap-2">
        <input
          value={newComment}
          onChange={(e) => onNewCommentChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmitComment()}
          disabled={isSubmitting}
          className="flex-1 rounded-full border border-[#D3D7DB] bg-white px-4 py-3 text-sm outline-none focus:border-[#1877f2]"
          placeholder={replyTarget ? `Reply to ${replyTarget.user}...` : "Write a comment..."}
        />
        <button
          onClick={onSubmitComment}
          disabled={isSubmitting || !newComment.trim()}
          className="rounded-full bg-[#1877F2] px-4 py-3 text-sm font-semibold text-white hover:bg-blue-600 transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Posting" : "Post"}
        </button>
      </div>
    </>
  );
}
