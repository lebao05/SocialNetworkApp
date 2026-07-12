import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostModal from "../components/Feed/PostModal";
import { getPostApi, getCommentsApi, createCommentApi, reactToPostApi, reactToCommentApi } from "../apis/postApi";
import { useAuth } from "../contexts/authContext";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

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

const REACTION_VALUE_FROM_NAME = Object.fromEntries(
  Object.entries(REACTION_NAME_FROM_VALUE).map(([value, name]) => [name, Number(value)])
);

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

function normalizePost(raw) {
  return {
    id: raw.id,
    authorId: raw.authorId ?? raw.AuthorId ?? null,
    authorName: raw.authorName ?? raw.AuthorName ?? null,
    authorAvatarUrl: raw.authorAvatarUrl ?? raw.AuthorAvatarUrl ?? null,
    groupId: raw.groupId ?? raw.GroupId ?? null,
    content: raw.content ?? raw.Content ?? null,
    visibility: raw.visibility ?? raw.Visibility ?? 0,
    sharePostId: raw.sharePostId ?? raw.SharePostId ?? null,
    locationTag: raw.locationTag ?? raw.LocationTag ?? null,
    feelingActivity: raw.feelingActivity ?? raw.FeelingActivity ?? null,
    createdAt: raw.createdAt ?? raw.CreatedAt ?? null,
    updatedAt: raw.updatedAt ?? raw.UpdatedAt ?? null,
    deletedAt: raw.deletedAt ?? raw.DeletedAt ?? null,
    media: Array.isArray(raw.media) ? raw.media : (Array.isArray(raw.Media) ? raw.Media : []),
    reactionCounts: Array.isArray(raw.reactionCounts)
      ? raw.reactionCounts
      : Array.isArray(raw.ReactionCounts) ? raw.ReactionCounts : [],
    commentCount: raw.commentCount ?? raw.CommentCount ?? 0,
    group: raw.group ?? raw.Group ?? null,
    sharePost: raw.sharePost ?? raw.SharePost ?? null,
    userReaction: raw.userReaction ?? raw.UserReaction ?? null,
    isHiddenFromGroup: raw.isHiddenFromGroup ?? raw.IsHiddenFromGroup ?? false,
    hiddenAt: raw.hiddenAt ?? raw.HiddenAt ?? null,
    hideReason: raw.hideReason ?? raw.HideReason ?? null,
    approvalStatus: raw.approvalStatus ?? raw.ApprovalStatus ?? null,
    isAnonymous: raw.isAnonymous ?? raw.IsAnonymous ?? false,
  };
}

export default function PostDetailPage({backgroundLocation}) {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [liked, setLiked] = useState(false);
  const [reactionCounts, setReactionCounts] = useState([]);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [loadingReplyParentIds, setLoadingReplyParentIds] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [reactionHover, setReactionHover] = useState(false);
  const [reaction, setReaction] = useState("");
  const reactionOptions = ["👍", "❤️", "😂", "😮", "😢", "😡"];

  const hoverTimerRef = useRef(null);
  const leaveTimerRef = useRef(null);

  // ─── Fetch post on mount ──────────────────────────────────────────────────
  useEffect(() => {
    if (!postId) {
      setError("Missing post ID.");
      setIsLoading(false);
      return;
    }

    const loadPost = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const raw = await getPostApi(postId);
        const normalized = normalizePost(raw);
        setPost(normalized);
        setReactionCounts(normalized.reactionCounts);
        setLikes(getReactionTotal(normalized.reactionCounts));
        setLiked(normalized.userReaction != null);
        setReaction(getReactionIcon(normalized.userReaction));
        setCommentCount(normalized.commentCount);
      } catch (err) {
        console.error("Failed to load post:", err);
        setError("Could not load post. It may not exist or you don't have permission to view it.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  // ─── Comment loading ──────────────────────────────────────────────────────
  const mergeComments = (prev, incoming) => {
    const existingIds = new Set(prev.map((c) => c.id));
    return [...prev, ...incoming.filter((c) => !existingIds.has(c.id))];
  };

  const loadComments = useCallback(async (pageToLoad = 1) => {
    if (!post || isLoadingComments) return;
    setIsLoadingComments(true);
    setCommentError("");
    try {
      const data = await getCommentsApi(post.id, { page: pageToLoad, pageSize: 10 });
      const { items, hasNextPage } = normalizePagedItems(data);
      setComments((prev) => {
        const repliesAndTemps = prev.filter((c) => c.parentId || String(c.id).startsWith("temp-"));
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
  }, [post, isLoadingComments]);

  const loadMoreComments = useCallback(() => {
    if (!hasMoreComments || isLoadingComments) return;
    loadComments(commentPage + 1);
  }, [hasMoreComments, isLoadingComments, commentPage, loadComments]);

  const loadReplies = useCallback(async (parentCommentId) => {
    if (!post || !parentCommentId || loadingReplyParentIds.includes(parentCommentId)) return;
    const loadedReplyCount = comments.filter((c) => c.parentId === parentCommentId).length;
    const nextPage = Math.floor(loadedReplyCount / 10) + 1;
    setLoadingReplyParentIds((prev) => [...prev, parentCommentId]);
    setCommentError("");
    try {
      const data = await getCommentsApi(post.id, { parentCommentId, page: nextPage, pageSize: 10 });
      const { items } = normalizePagedItems(data);
      setComments((prev) => mergeComments(prev, items));
    } catch (error) {
      setCommentError("Could not load replies. Try again.");
      console.error("Failed to load replies", error);
    } finally {
      setLoadingReplyParentIds((prev) => prev.filter((id) => id !== parentCommentId));
    }
  }, [post, loadingReplyParentIds, comments]);

  // ─── Like / reaction ─────────────────────────────────────────────────────
  const updateReactionCounts = useCallback((oldReaction, newReaction) => {
    const oldName = getReactionName(oldReaction);
    const newName = getReactionName(newReaction);
    if (oldName === newName) return reactionCounts;
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
    if (oldName) adjustCount(oldName, -1);
    if (newName) adjustCount(newName, 1);
    return next.filter((item) => item.count > 0);
  }, [reactionCounts]);

  const handleMouseEnter = () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    hoverTimerRef.current = setTimeout(() => setReactionHover(true), 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    leaveTimerRef.current = setTimeout(() => setReactionHover(false), 300);
  };

  const handleLike = async () => {
    const oldLiked = liked;
    const oldReaction = reaction;
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
      setReactionCounts(reactionCounts);
      setLikes((prev) => prev + (oldLiked ? 1 : -1));
      console.error("Failed to update post reaction", error);
    }
  };

  const handleReactionSelect = async (icon) => {
    const oldReaction = reaction;
    const oldLiked = liked;
    const oldCounts = reactionCounts;
    const wasNewReaction = !oldLiked;
    setLiked(true);
    setReaction(icon);
    setReactionCounts(updateReactionCounts(oldReaction, icon));
    if (wasNewReaction) setLikes((prev) => prev + 1);
    setReactionHover(false);
    try {
      await reactToPostApi(post.id, REACTION_TYPE_MAP[icon]);
    } catch (error) {
      setLiked(oldLiked);
      setReaction(oldReaction);
      setReactionCounts(oldCounts);
      if (wasNewReaction) setLikes((prev) => prev - 1);
      console.error("Failed to set post reaction", error);
    }
  };

  const handleReactComment = async (commentId) => {
    if (String(commentId).startsWith("temp-")) return;
    const comment = comments.find((c) => c.id === commentId);
    const isLiked = comment?.userReaction === "Like";
    const oldLikes = comment?.likes ?? 0;
    const oldReaction = comment?.userReaction || "";
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, likes: isLiked ? oldLikes - 1 : oldLikes + 1, userReaction: isLiked ? "" : "Like" }
          : c
      )
    );
    try {
      await reactToCommentApi(commentId, isLiked ? null : "Like");
    } catch (error) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, likes: oldLikes, userReaction: oldReaction } : c
        )
      );
      console.error("Failed to react to comment", error);
    }
  };

  // ─── Comments ────────────────────────────────────────────────────────────
  const handleSubmitComment = async () => {
    const trimmed = newComment.trim();
    if (!trimmed || isSubmittingComment || !post) return;
    const targetComment = comments.find((c) => c.id === replyToCommentId);
    const topLevelParentId = targetComment
      ? targetComment.parentId || targetComment.id
      : null;
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
        prev.map((c) =>
          c.id === topLevelParentId ? { ...c, replyCount: (c.replyCount || 0) + 1 } : c
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
        prev.map((c) => (c.id === tempId ? { ...c, id: createdCommentId || tempId } : c))
      );
    } catch (error) {
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      if (topLevelParentId) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === topLevelParentId
              ? { ...c, replyCount: Math.max(0, (c.replyCount || 0) - 1) }
              : c
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

  const handleStartReply = (commentId) => {
    setReplyToCommentId(commentId);
  };

  const handleCancelReply = () => setReplyToCommentId(null);

  // ─── Modal open/close ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!commentsLoaded && post) {
      loadComments(1);
    }
  }, [post, commentsLoaded, loadComments]);

  const handleClose = useCallback(() => {
    navigate(backgroundLocation);
  }, [backgroundLocation, navigate]);

  // ─── Derived values ─────────────────────────────────────────────────────
  const authorName = post
    ? `${post.authorName ?? ""}`
    : "";

  const authorAvatar = post?.authorAvatarUrl || DEFAULT_AVATAR;

  const topReactionIcon = getTopReactionIcon(reactionCounts);

  // ─── Render ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[10000] bg-black/70 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="fixed inset-0 z-[10000] bg-black/70 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center shadow-2xl">
          <p className="text-[15px] font-semibold text-[#050505] mb-2">
            {error || "Post not found"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-[#1877f2] text-white text-[14px] font-semibold rounded-lg hover:bg-[#166fe5] transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <PostModal
      isOpen={true}
      onClose={handleClose}
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
      reaction={reaction}
      reactionHover={reactionHover}
      reactionOptions={reactionOptions}
      replyTarget={comments.find((c) => c.id === replyToCommentId)}
      onStartReply={handleStartReply}
      onCancelReply={handleCancelReply}
      onReactComment={handleReactComment}
      handleReactionSelect={handleReactionSelect}
      handleMouseEnter={handleMouseEnter}
      handleMouseLeave={handleMouseLeave}
      transparentOverlay={true}
    />
  );
}
