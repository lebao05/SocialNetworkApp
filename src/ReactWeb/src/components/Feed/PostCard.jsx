import React, { useState, useRef } from "react";
import { GrLike } from "react-icons/gr";
import { FaRegComment } from "react-icons/fa6";
import { PiShareFatLight } from "react-icons/pi";
import { createCommentApi, getCommentsApi, reactToCommentApi, reactToPostApi } from "../../apis/postApi";
import { useAuth } from "../../contexts/authContext";
import PostComment from "./PostComment";
import MediaGallery from "./MediaGallery";
import PostModal from "./PostModal";

// ─── Feeling map (matches Domain.Enums.Feeling) ───
const FEELING_MAP = {
  1: { emoji: "😊", label: "happy" },
  2: { emoji: "🙏", label: "blessed" },
  3: { emoji: "🥰", label: "loved" },
  4: { emoji: "😢", label: "sad" },
  5: { emoji: "😍", label: "lovely" },
  6: { emoji: "🙏", label: "grateful" },
  7: { emoji: "🤩", label: "excited" },
  8: { emoji: "💕", label: "in love" },
  9: { emoji: "🤪", label: "crazy" },
  10: { emoji: "😌", label: "appreciative" },
  11: { emoji: "😄", label: "joyful" },
  12: { emoji: "🤯", label: "amazing" },
  13: { emoji: "🤡", label: "silly" },
  14: { emoji: "🎉", label: "festive" },
  15: { emoji: "✨", label: "wonderful" },
  16: { emoji: "😎", label: "cool" },
  17: { emoji: "😆", label: "amused" },
  18: { emoji: "😌", label: "relaxed" },
  19: { emoji: "💪", label: "positive" },
  20: { emoji: "😊", label: "comfortable" },
  21: { emoji: "🌈", label: "hopeful" },
  22: { emoji: "🥳", label: "joyous" },
  23: { emoji: "😩", label: "tired" },
  24: { emoji: "🔥", label: "motivated" },
  25: { emoji: "😤", label: "proud" },
  26: { emoji: "😔", label: "lonely" },
};

// ─── Privacy / Visibility ───
const VISIBILITY_ICON = {
  0: "🌐", // Public
  1: "👥", // Friends
  2: "🔒", // Only Me
};

const REACTION_TYPE_MAP = {
  "👍": "Like",
  "❤️": "Love",
  "😂": "Haha",
  "😮": "Wow",
  "😢": "Sad",
  "😡": "Angry",
};

const REACTION_NAME_FROM_VALUE = {
  0: "Like",
  1: "Love",
  2: "Haha",
  3: "Wow",
  4: "Sad",
  5: "Angry",
};

const REACTION_ICON_FROM_NAME = Object.fromEntries(
  Object.entries(REACTION_TYPE_MAP).map(([icon, name]) => [name, icon])
);

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";

function getReactionIcon(reaction) {
  if (reaction == null) return "";
  if (typeof reaction === "number") {
    return REACTION_ICON_FROM_NAME[REACTION_NAME_FROM_VALUE[reaction]] || "";
  }
  if (typeof reaction === "string") {
    return REACTION_ICON_FROM_NAME[reaction] || reaction;
  }
  return "";
}

function getReactionName(reaction) {
  if (reaction == null) return null;
  if (typeof reaction === "number") return REACTION_NAME_FROM_VALUE[reaction] || null;
  if (typeof reaction === "string") return REACTION_TYPE_MAP[reaction] ? REACTION_TYPE_MAP[reaction] : reaction;
  return null;
}

function getTopReactionIcon(reactionCounts) {
  if (!Array.isArray(reactionCounts) || reactionCounts.length === 0) return "";

  const topReaction = reactionCounts
    .filter((item) => item && typeof item.count === "number")
    .sort((a, b) => b.count - a.count)[0];

  if (!topReaction || topReaction.count === 0) return "";
  return REACTION_ICON_FROM_NAME[REACTION_NAME_FROM_VALUE[topReaction.reactionType]] || "";
}

function getReactionTotal(reactionCounts) {
  if (!Array.isArray(reactionCounts)) return 0;
  return reactionCounts.reduce((sum, item) => sum + (item?.count || 0), 0);
}

// ─── Relative time helper ───
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

function normalizeComment(comment) {
  if (!comment) return null;

  if (comment.content !== undefined || comment.userName !== undefined) {
    return {
      id: comment.id,
      postId: comment.postId,
      userId: comment.userId,
      user: comment.userName || "User",
      avatar: comment.userAvatarUrl || DEFAULT_AVATAR,
      parentId: comment.parentCommentId || null,
      repliedUserId: comment.repliedUserId || null,
      repliedUserName: comment.repliedUserName || null,
      repliedAvatarUrl: comment.repliedAvatarUrl || null,
      text: comment.content || "",
      time: comment.createdAt ? timeAgo(comment.createdAt) : "",
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      reactionCounts: comment.reactionCounts || [],
      likes: getReactionTotal(comment.reactionCounts),
      replyCount: comment.replyCount || 0,
      userReaction: getReactionName(comment.userReaction) || "",
    };
  }

  return comment;
}

function normalizePagedItems(data) {
  if (!data) return { items: [], hasNextPage: false };
  if (Array.isArray(data)) {
    return { items: data.map(normalizeComment).filter(Boolean), hasNextPage: false };
  }

  return {
    items: (data.items || []).map(normalizeComment).filter(Boolean),
    hasNextPage: Boolean(data.hasNextPage),
  };
}

// ─── Reaction Button ───
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

// ─── Main PostCard ───
export default function PostCard({ post }) {
  const { user } = useAuth();
  const initialLikes = (post.reactionCounts || []).reduce(
    (sum, item) => sum + (item?.count || 0),
    0
  );
  const initialComments = (post.commentsData || []).map(normalizeComment).filter(Boolean);
  const initialCommentCount =
    typeof post.commentCount === "number"
      ? post.commentCount
      : typeof post.comments === "number"
        ? post.comments
        : initialComments.length;

  const [liked, setLiked] = useState(post.userReaction != null);
  const [reactionCounts, setReactionCounts] = useState(post.reactionCounts || []);
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [commentsLoaded, setCommentsLoaded] = useState(initialComments.length > 0);
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [loadingReplyParentIds, setLoadingReplyParentIds] = useState([]);
  const [openPostModal, setOpenPostModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState("");

  const [reactionHover, setReactionHover] = useState(false);
  const [reaction, setReaction] = useState(getReactionIcon(post.userReaction));
  const reactionOptions = ["👍", "❤️", "😂", "😮", "😢", "😡"];

  const REACTION_VALUE_FROM_NAME = Object.fromEntries(
    Object.entries(REACTION_NAME_FROM_VALUE).map(([value, name]) => [name, Number(value)])
  );

  const updateReactionCounts = (oldReaction, newReaction) => {
    const oldName = getReactionName(oldReaction);
    const newName = getReactionName(newReaction);

    if (oldName === newName) {
      return reactionCounts;
    }

    const next = reactionCounts.map((item) => ({ ...item }));

    const adjustCount = (reactionName, delta) => {
      if (!reactionName) return;
      const reactionType = REACTION_VALUE_FROM_NAME[reactionName];
      if (reactionType == null) return;

      const existing = next.find((item) => item.reactionType === reactionType);
      if (existing) {
        existing.count = Math.max(0, existing.count + delta);
      } else if (delta > 0) {
        next.push({ reactionType, count: delta });
      }
    };

    if (oldName) {
      adjustCount(oldName, -1);
    }

    if (newName) {
      adjustCount(newName, 1);
    }

    return next.filter((item) => item.count > 0);
  };

  // Refs to hold active timer references
  const hoverTimerRef = useRef(null);
  const leaveTimerRef = useRef(null);

  const handleMouseEnter = () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setReactionHover(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    leaveTimerRef.current = setTimeout(() => {
      setReactionHover(false);
    }, 300);
  };

  const handleLike = async () => {
    const oldLiked = liked;
    const oldReaction = reaction;
    const oldReactionCounts = reactionCounts;
    const newReaction = oldLiked ? "" : "👍";

    setLiked(!oldLiked);
    setReaction(newReaction);
    setReactionCounts(updateReactionCounts(oldReaction, newReaction));
    setLikes((prev) => prev + (oldLiked ? -1 : 1));

    try {
      await reactToPostApi(post.id, newReaction ? REACTION_TYPE_MAP[newReaction] : null);
    } catch (error) {
      setLiked(oldLiked);
      setReaction(oldReaction);
      setReactionCounts(oldReactionCounts);
      setLikes((prev) => prev + (oldLiked ? 1 : -1));
      console.error("Failed to update post reaction", error);
    }
  };

  const handleReactionSelect = async (icon) => {
    const oldReaction = reaction;
    const oldLiked = liked;
    const oldReactionCounts = reactionCounts;
    const wasNewReaction = !oldLiked;

    setLiked(true);
    setReaction(icon);
    setReactionCounts(updateReactionCounts(oldReaction, icon));
    if (wasNewReaction) {
      setLikes((prev) => prev + 1);
    }
    setReactionHover(false);

    try {
      await reactToPostApi(post.id, REACTION_TYPE_MAP[icon]);
    } catch (error) {
      setLiked(oldLiked);
      setReaction(oldReaction);
      setReactionCounts(oldReactionCounts);
      if (wasNewReaction) {
        setLikes((prev) => prev - 1);
      }
      console.error("Failed to set post reaction", error);
    }
  };

  const handleReactComment = async (commentId) => {
    if (String(commentId).startsWith("temp-")) return;

    const comment = comments.find((comment) => comment.id === commentId);
    const isLiked = comment?.userReaction === "Like";
    const oldLikes = comment?.likes ?? 0;
    const oldReaction = comment?.userReaction || "";

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
            ...c,
            likes: isLiked ? oldLikes - 1 : oldLikes + 1,
            userReaction: isLiked ? "" : "Like",
          }
          : c
      )
    );

    try {
      await reactToCommentApi(commentId, isLiked ? null : "Like");
    } catch (error) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
              ...c,
              likes: oldLikes,
              userReaction: oldReaction,
            }
            : c
        )
      );
      console.error("Failed to react to comment", error);
    }
  };

  const mergeComments = (prev, incoming) => {
    const existingIds = new Set(prev.map((comment) => comment.id));
    return [...prev, ...incoming.filter((comment) => !existingIds.has(comment.id))];
  };

  const loadComments = async (pageToLoad = 1) => {
    if (isLoadingComments) return;

    setIsLoadingComments(true);
    setCommentError("");

    try {
      const data = await getCommentsApi(post.id, { page: pageToLoad, pageSize: 10 });
      const { items, hasNextPage } = normalizePagedItems(data);

      setComments((prev) => {
        const repliesAndTemps = prev.filter((comment) => comment.parentId || String(comment.id).startsWith("temp-"));
        return pageToLoad === 1 ? [...items, ...repliesAndTemps] : mergeComments(prev, items);
      });
      setCommentPage(pageToLoad);
      setHasMoreComments(hasNextPage);
      setCommentsLoaded(true);
    } catch (error) {
      setCommentError("Could not load comments. Try again.");
      console.error("Failed to load comments", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const loadMoreComments = () => {
    if (!hasMoreComments || isLoadingComments) return;
    loadComments(commentPage + 1);
  };

  const loadReplies = async (parentCommentId) => {
    if (!parentCommentId || loadingReplyParentIds.includes(parentCommentId)) return;

    const loadedReplyCount = comments.filter((comment) => comment.parentId === parentCommentId).length;
    const nextPage = Math.floor(loadedReplyCount / 10) + 1;

    setLoadingReplyParentIds((prev) => [...prev, parentCommentId]);
    setCommentError("");

    try {
      const data = await getCommentsApi(post.id, {
        parentCommentId,
        page: nextPage,
        pageSize: 10,
      });
      const { items } = normalizePagedItems(data);
      setComments((prev) => mergeComments(prev, items));
    } catch (error) {
      setCommentError("Could not load replies. Try again.");
      console.error("Failed to load replies", error);
    } finally {
      setLoadingReplyParentIds((prev) => prev.filter((id) => id !== parentCommentId));
    }
  };

  const openCommentsModal = () => {
    setOpenPostModal(true);
    if (!commentsLoaded) {
      loadComments(1);
    }
  };
  const closeCommentsModal = () => {
    setOpenPostModal(false);
    setReplyToCommentId(null);
  };

  const handleStartReply = (commentId) => {
    setReplyToCommentId(commentId);
    setOpenPostModal(true);
  };

  const handleCancelReply = () => setReplyToCommentId(null);

  const handleSubmitComment = async () => {
    const trimmed = newComment.trim();
    if (!trimmed || isSubmittingComment) return;

    const targetComment = comments.find((comment) => comment.id === replyToCommentId);
    const topLevelParentId = targetComment ? (targetComment.parentId || targetComment.id) : null;
    const tempId = `temp-${Date.now()}`;
    const optimisticComment = {
      id: tempId,
      postId: post.id,
      userId: user?.id,
      user: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "You" : "You",
      avatar: user?.avatarUrl || DEFAULT_AVATAR,
      time: "Just now",
      text: trimmed,
      parentId: topLevelParentId,
      repliedUserId: targetComment?.userId || null,
      repliedUserName: targetComment?.user || null,
      repliedAvatarUrl: targetComment?.avatar || null,
      reactionCounts: [],
      likes: 0,
      replyCount: 0,
      userReaction: "",
    };

    setCommentError("");
    setIsSubmittingComment(true);
    setComments((prev) => [...prev, optimisticComment]);
    if (topLevelParentId) {
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === topLevelParentId
            ? { ...comment, replyCount: (comment.replyCount || 0) + 1 }
            : comment
        )
      );
    }
    setCommentCount((prev) => prev + 1);
    setNewComment("");
    setReplyToCommentId(null);

    try {
      const createdCommentId = await createCommentApi(post.id, {
        content: trimmed,
        parentCommentId: topLevelParentId,
        repliedUserId: targetComment?.userId || null,
      });

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === tempId
            ? { ...comment, id: createdCommentId || tempId }
            : comment
        )
      );
    } catch (error) {
      setComments((prev) => prev.filter((comment) => comment.id !== tempId));
      if (topLevelParentId) {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === topLevelParentId
              ? { ...comment, replyCount: Math.max(0, (comment.replyCount || 0) - 1) }
              : comment
          )
        );
      }
      setCommentCount((prev) => Math.max(0, prev - 1));
      setNewComment(trimmed);
      setReplyToCommentId(replyToCommentId);
      setCommentError("Could not post comment. Try again.");
      console.error("Failed to create comment", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const authorName = post.authorName || post.user || "User";
  const authorAvatar = post.authorAvatarUrl || post.avatar || DEFAULT_AVATAR;
  const feeling = post.feelingActivity != null ? FEELING_MAP[post.feelingActivity] : null;
  const displayTime = post.createdAt ? timeAgo(post.createdAt) : (post.time || "");
  const visIcon = VISIBILITY_ICON[post.visibility] ?? VISIBILITY_ICON[0];
  const topReactionIcon = getTopReactionIcon(reactionCounts);

  return (
    <div className="bg-white rounded-xl shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <img src={authorAvatar} alt={authorName} className="w-10 h-10 rounded-full object-cover border" />
          <div>
            <p className="text-[15px] font-semibold text-gray-800 leading-tight flex items-center flex-wrap gap-1">
              <span className="font-bold hover:underline cursor-pointer">{authorName}</span>
              {feeling && (
                <span className="text-gray-500 font-normal text-[14px] flex items-center gap-0.5">
                  đang cảm thấy {feeling.emoji} <span className="font-semibold text-[#050505]">{feeling.label}</span>
                </span>
              )}
              {post.locationTag && (
                <span className="text-gray-500 font-normal text-[14px] flex items-center gap-0.5">
                  ở <span className="font-semibold text-[#050505]">{post.locationTag}</span>
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {displayTime} · {visIcon}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 rounded-full hover:bg-[#F2F4F7] flex items-center justify-center text-gray-500 font-bold text-lg">
            ···
          </button>
          <button className="w-9 h-9 rounded-full hover:bg-[#F2F4F7] flex items-center justify-center text-gray-500">
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      {post.content && <p className="px-4 pb-2 text-[15px] text-gray-800">{post.content}</p>}

      {/* Media Gallery */}
      <MediaGallery media={post.media} />

      {!post.media?.length && post.image && (
        <div className="w-full">
          <img src={post.image} alt="post" className="w-full object-cover max-h-[500px]" />
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between px-4 py-2 text-gray-500 text-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 cursor-pointer hover:underline">
            <span className="font-semibold">{likes.toLocaleString()} likes</span>
          </div>
          <span className="text-gray-300 select-none">|</span>
          <span className="cursor-pointer hover:underline" onClick={openCommentsModal}>
            {commentCount} {commentCount === 1 ? "comment" : "comments"}
          </span>
          <span className="text-gray-300 select-none">|</span>
          <span className="cursor-pointer hover:underline">{post.shares || 0} shares</span>
        </div>
        {topReactionIcon ? (
          <div className="flex items-center tracking-[-0.2em] pr-1 select-none text-base">
            <span>{topReactionIcon}</span>
          </div>
        ) : null}
      </div>

      <hr className="mx-4 border-gray-200" />

      {/* Actions Container */}
      <div className="flex items-center justify-between px-4 py-1">
        <div className="flex items-center gap-4">
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <ReactionBtn
              icon={reaction || <GrLike size={18} />}
              label={reaction ? "Liked" : "Like"}
              onClick={handleLike}
              active={liked}
            />
            {reactionHover && (
              <div
                className="absolute left-0 bottom-full mb-2 flex items-center gap-2 rounded-full bg-white p-2 shadow-lg ring-1 ring-black/5 z-10 animate-in fade-in slide-in-from-bottom-2 duration-200"
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

          <ReactionBtn icon={<FaRegComment size={18} />} label="Comment" onClick={openCommentsModal} />
          <ReactionBtn icon={<PiShareFatLight size={18} />} label="Share" />
        </div>
        <div className="flex items-center text-gray-500 text-xs"></div>
      </div>

      <PostModal
        isOpen={openPostModal}
        onClose={closeCommentsModal}
        post={post}
        authorName={authorName}
        authorAvatar={authorAvatar}
        likes={likes}
        liked={liked}
        comments={comments}
        commentCount={commentCount}
        onLike={handleLike}
        onSubmitComment={handleSubmitComment}
        newComment={newComment}
        onNewCommentChange={setNewComment}
        isSubmittingComment={isSubmittingComment}
        commentError={commentError}
        isLoadingComments={isLoadingComments}
        hasMoreComments={hasMoreComments}
        onLoadMoreComments={loadMoreComments}
        onLoadReplies={loadReplies}
        loadingReplyParentIds={loadingReplyParentIds}
        topReactionIcon={topReactionIcon}
        // Passing shared features down into your details view
        reaction={reaction}
        reactionHover={reactionHover}
        reactionOptions={reactionOptions}
        replyTarget={comments.find((comment) => comment.id === replyToCommentId)}
        onStartReply={handleStartReply}
        onCancelReply={handleCancelReply}
        onReactComment={handleReactComment}
        handleReactionSelect={handleReactionSelect}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
      />
    </div>
  );
}
