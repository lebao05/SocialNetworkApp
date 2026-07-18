import { useCallback, useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Send, X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { createConversationApi, getConversationByUserIdApi } from "../../apis/conversationApi";
import { sendMessageApi } from "../../apis/messageApi";
import { markStoryAsSeenApi, toggleStoryLikeApi } from "../../apis/storyApi";

const TEXT_IMAGE_DURATION = 10000;

function formatCount(n) {
  const num = Number(n) || 0;
  if (num < 1000) return String(num);
  if (num < 1_000_000) {
    const v = (num / 1000).toFixed(num % 1000 < 100 ? 1 : 0);
    return `${v.replace(/\.0$/, "")}K`;
  }
  const v = (num / 1_000_000).toFixed(num % 1_000_000 < 100_000 ? 1 : 0);
  return `${v.replace(/\.0$/, "")}M`;
}

function ProgressBar({ filled, width }) {
  return (
    <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
      <div
        className="h-full rounded-full bg-white"
        style={{
          width: filled ? "100%" : `${width}%`,
          transition: filled ? "width 300ms ease-out" : "none",
        }}
      />
    </div>
  );
}

function ProgressBars({ total, current, progress }) {
  return (
    <div className="absolute left-0 right-0 top-0 z-30 flex h-1 gap-1 px-4 pt-3">
      {Array.from({ length: total }).map((_, index) => {
        const filled = index < current;
        const width = index === current ? progress : 0;
        return <ProgressBar key={index} filled={filled} width={width} />;
      })}
    </div>
  );
}

function VideoStory({ src, onEnded, onProgress, isPaused }) {
  const videoRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => onEnded();

    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [onEnded]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tick = () => {
      if (video.duration) {
        onProgress((video.currentTime / video.duration) * 100);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    if (isPaused) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      video.pause();
    } else {
      video.play().catch(() => {});
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [src, isPaused, onProgress]);

  return (
    <video
      ref={videoRef}
      src={src}
      className="absolute inset-0 h-full w-full object-cover"
      muted
      playsInline
    />
  );
}

function UserStoryStage({
  group,
  storyIndex,
  storiesCount,
  progress,
  onProgress,
  onVideoEnded,
  isPaused,
  onTogglePaused,
  onNext,
  onStoryPrev,
  onClose,
  isLiked,
  likeCount,
  viewCount,
  onLike,
  replyText,
  replyStatus,
  isSendingReply,
  onReplyTextChange,
  onSendReply,
}) {
  const replyInputRef = useRef(null);
  const story = group?.stories?.[storyIndex];

  if (!story) return null;

  const canReply = !story.isOwnStory;
  const mediaUrl = story.mediaUrl || story.bg;
  const isVideo = story?.mediaType === "video";
  const hasBgMedia = Boolean(
    mediaUrl &&
      mediaUrl !== import.meta.env.VITE_DEFAULT_AVATAR &&
      story?.mediaType !== "text"
  );
  const bgStyle = story.backgroundGradient
    ? { background: story.backgroundGradient }
    : {
        backgroundImage: `url(${mediaUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };

  const textStyle = {
    fontFamily: story.fontFamily || "Georgia, serif",
    fontSize: story.fontSize || 32,
    fontWeight: story.fontWeight || "400",
    textShadow: story.textShadow || "none",
    color: story.textColor || "#ffffff",
    textAlign: story.textAlign || "center",
  };
  const textPosX = story.textPositionX ? parseFloat(story.textPositionX) : 50;
  const textPosY = story.textPositionY ? parseFloat(story.textPositionY) : 50;

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-black"
      onClick={onTogglePaused}
    >
      {/* Background: video, image, or gradient */}
      {isVideo ? (
        <VideoStory
          src={mediaUrl}
          onEnded={onVideoEnded}
          onProgress={onProgress}
          isPaused={isPaused}
        />
      ) : hasBgMedia ? (
        <img
          src={mediaUrl}
          alt={group?.user}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0" style={bgStyle} />
      )}

      {/* Top gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

      {/* Bottom gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      <ProgressBars total={storiesCount} current={storyIndex} progress={progress} />

      {/* Header */}
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 pt-8">
        <Link
          to={group?.userId ? `/profile/${group.userId}` : "#"}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-3"
        >
          <img
            src={group?.avatar}
            alt={group?.user}
            className="h-9 w-9 rounded-full border-2 border-white object-cover"
          />
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold leading-tight text-white">
              {group?.user}
            </span>
            <span className="text-[11px] leading-tight text-white/60">
              {story.timestamp || "Just now"}
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white transition-all duration-200 hover:scale-110 hover:bg-white/20 active:scale-95"
          aria-label="Close"
        >
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Story text — respects saved position */}
      <div className="absolute inset-0 z-20 px-6" style={{ pointerEvents: "none" }}>
        <p
          className="select-none"
          style={{
            position: "absolute",
            left: `${textPosX}%`,
            top: `${textPosY}%`,
            transform: "translate(-50%, -50%)",
            fontFamily: textStyle.fontFamily,
            fontSize: `${textStyle.fontSize}px`,
            fontWeight: textStyle.fontWeight,
            textShadow: textStyle.textShadow,
            color: textStyle.color,
            textAlign: textStyle.textAlign,
            maxWidth: "85%",
          }}
        >
          {story.label}
        </p>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-6">
        {/* Story nav arrows */}
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStoryPrev();
            }}
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white transition-all hover:scale-110 hover:bg-white/10 active:scale-95 ${
              storyIndex > 0 ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-label="Previous"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white transition-all hover:scale-110 hover:bg-white/10 active:scale-95"
            aria-label="Next user"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Views + likes — prominent row above the reply input */}
        <div className="mb-3 flex items-center justify-center gap-6 rounded-2xl bg-black/40 px-4 py-2.5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-white">
            <Eye size={20} strokeWidth={2.5} className="text-white/85" />
            <span className="text-xl font-bold leading-none tabular-nums">
              {formatCount(viewCount)}
            </span>
            <span className="text-[13px] font-medium text-white/80">views</span>
          </div>
          <span className="h-6 w-px bg-white/25" />
          <div className="flex items-center gap-2 text-white">
            <Heart
              size={20}
              strokeWidth={2.5}
              className={isLiked ? "fill-red-500 text-red-500" : "text-white/85"}
            />
            <span className="text-xl font-bold leading-none tabular-nums">
              {formatCount(likeCount)}
            </span>
            <span className="text-[13px] font-medium text-white/80">likes</span>
          </div>
        </div>

        {/* Reply input + actions */}
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSendReply();
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {canReply && (
            <input
              ref={replyInputRef}
              type="text"
              value={replyText}
              placeholder={`Reply to ${group?.user}...`}
              onChange={(e) => onReplyTextChange(e.target.value)}
              className="flex-1 rounded-full border border-white/25 bg-white/15 px-4 py-2.5 text-sm text-white placeholder:text-white/50 outline-none backdrop-blur-sm transition focus:border-white/50 focus:bg-white/20 disabled:opacity-70"
              disabled={isSendingReply}
            />
          )}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onLike(); }}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-all hover:scale-110 hover:bg-white/10 active:scale-95"
            aria-label={isLiked ? "Unlike" : "Like"}
          >
            <Heart size={21} className={isLiked ? "fill-red-500 text-red-500" : ""} />
          </button>
          {canReply && (
            <>
              <button
                type="button"
                onClick={() => replyInputRef.current?.focus()}
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-all hover:scale-110 hover:bg-white/10 active:scale-95"
                aria-label="Message"
              >
                <MessageCircle size={21} />
              </button>
              <button
                type="submit"
                disabled={!replyText.trim() || isSendingReply}
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-all hover:scale-110 hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45"
                aria-label="Send"
              >
                <Send size={21} />
              </button>
            </>
          )}
        </form>
        {replyStatus && (
          <p className={`mt-2 px-3 text-xs ${replyStatus.type === "error" ? "text-red-200" : "text-white/70"}`}>
            {replyStatus.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default function UserStoryViewer({ group, onClose }) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [localLikes, setLocalLikes] = useState({});
  const [localLikeCounts, setLocalLikeCounts] = useState({});
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState(null);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const rafRef = useRef(null);
  const touchStartX = useRef(null);
  const seenStoryIdsRef = useRef(new Set());
  const pendingSeenRequestsRef = useRef(new Map());
  const totalStoriesInGroup = group?.stories?.length || 0;

  const currentStory = group?.stories?.[currentStoryIndex];
  const isVideo = currentStory?.mediaType === "video";

  const handleClose = useCallback(async () => {
    const pendingSeenRequests = Array.from(pendingSeenRequestsRef.current.values());

    if (pendingSeenRequests.length > 0) {
      await Promise.allSettled(pendingSeenRequests);
    }

    await onClose();
  }, [onClose]);

  const goNextStory = useCallback(() => {
    if (currentStoryIndex < totalStoriesInGroup - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      handleClose();
    }
  }, [currentStoryIndex, totalStoriesInGroup, handleClose]);

  const goPrevStory = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
      setProgress(0);
    } else {
      handleClose();
    }
  }, [currentStoryIndex, handleClose]);

  const handleLike = useCallback(async () => {
    if (!currentStory) return;
    const wasLiked = localLikes[currentStory.id] ?? currentStory.isLikedByCurrentUser ?? false;
    const prevCount = localLikeCounts[currentStory.id] ?? currentStory.likeCount ?? 0;

    setLocalLikes((prev) => ({ ...prev, [currentStory.id]: !wasLiked }));
    setLocalLikeCounts((prev) => ({
      ...prev,
      [currentStory.id]: wasLiked ? prevCount - 1 : prevCount + 1,
    }));
    try {
      const result = await toggleStoryLikeApi(currentStory.id);
      setLocalLikes((prev) => ({ ...prev, [currentStory.id]: result.isLiked }));
      setLocalLikeCounts((prev) => ({
        ...prev,
        [currentStory.id]: result.likeCount,
      }));
    } catch {
      setLocalLikes((prev) => ({ ...prev, [currentStory.id]: wasLiked }));
      setLocalLikeCounts((prev) => ({ ...prev, [currentStory.id]: prevCount }));
    }
  }, [currentStory, localLikes, localLikeCounts]);

  const handleSendReply = useCallback(async () => {
    const content = replyText.trim();
    if (!content || !group?.userId || currentStory?.isOwnStory || isSendingReply) return;

    setIsSendingReply(true);
    setReplyStatus(null);

    try {
      let conversation = await getConversationByUserIdApi(group.userId);

      if (conversation?.isVirtual) {
        conversation = await createConversationApi({
          participantIds: [group.userId],
          name: null,
        });
      }

      if (!conversation?.id) {
        throw new Error("Conversation was not created.");
      }

      await sendMessageApi({
        conversationId: conversation.id,
        content,
      });

      setReplyText("");
      setReplyStatus({ type: "success", message: "Message sent" });
    } catch (err) {
      console.error("Failed to send story reply:", err);
      setReplyStatus({ type: "error", message: "Could not send message" });
    } finally {
      setIsSendingReply(false);
    }
  }, [currentStory?.isOwnStory, group?.userId, isSendingReply, replyText]);

  // Mark story as seen when index changes
  useEffect(() => {
    if (!currentStory) return;
    if (seenStoryIdsRef.current.has(currentStory.id)) return;

    const seenRequest = markStoryAsSeenApi(currentStory.id).catch((err) =>
      console.error("Failed to mark story as seen:", err)
    );

    seenStoryIdsRef.current.add(currentStory.id);
    pendingSeenRequestsRef.current.set(currentStory.id, seenRequest);
    seenRequest.finally(() => {
      pendingSeenRequestsRef.current.delete(currentStory.id);
    });
  }, [currentStoryIndex, currentStory]);

  // RAF-based progress for text/image stories
  useEffect(() => {
    if (isVideo || isPaused) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const p = Math.min(100, (elapsed / TEXT_IMAGE_DURATION) * 100);
      setProgress(p);
      if (elapsed < TEXT_IMAGE_DURATION) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [currentStoryIndex, isPaused, isVideo]);

  useEffect(() => {
    setReplyText("");
    setReplyStatus(null);
  }, [currentStoryIndex]);

  useEffect(() => {
    const handleKey = (e) => {
      const isTyping = ["INPUT", "TEXTAREA"].includes(e.target?.tagName);
      if (isTyping) return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNextStory();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrevStory();
      if (e.key === " ") {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNextStory, goPrevStory, handleClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95">
      <div
        className="relative flex h-full w-full max-w-[500px] overflow-hidden lg:h-[calc(100vh-48px)] lg:max-h-[unset] lg:rounded-3xl"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const delta = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(delta) > 40) {
            delta > 0 ? goNextStory() : goPrevStory();
          }
          touchStartX.current = null;
        }}
      >
        <UserStoryStage
          group={group}
          storyIndex={currentStoryIndex}
          storiesCount={totalStoriesInGroup}
          progress={progress}
          onProgress={setProgress}
          onVideoEnded={goNextStory}
          isPaused={isPaused}
          onTogglePaused={() => setIsPaused((prev) => !prev)}
          onNext={goNextStory}
          onStoryPrev={goPrevStory}
          onClose={handleClose}
          isLiked={localLikes[currentStory?.id] ?? currentStory?.isLikedByCurrentUser ?? false}
          likeCount={localLikeCounts[currentStory?.id] ?? currentStory?.likeCount ?? 0}
          viewCount={currentStory?.viewCount ?? 0}
          onLike={handleLike}
          replyText={replyText}
          replyStatus={replyStatus}
          isSendingReply={isSendingReply}
          onReplyTextChange={setReplyText}
          onSendReply={handleSendReply}
        />
      </div>
    </div>
  );
}
