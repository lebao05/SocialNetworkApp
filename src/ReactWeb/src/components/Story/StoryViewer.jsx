import { useCallback, useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Send, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { currentUser, storyGroups } from "../../data/mockData";

const STORY_DURATION = 5000;

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ProgressBars({ total, current, progress }) {
  return (
    <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 px-3 pt-3">
      {Array.from({ length: total }).map((_, index) => {
        const fill =
          index < current ? 100 : index === current ? progress : 0;
        return (
          <div
            key={index}
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/20"
          >
            <div
              className="h-full rounded-full bg-white transition-[width] duration-75 ease-linear"
              style={{ width: `${fill}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

function StoryListPanel({ groups, currentGroupIndex, currentStoryIndex, onSelect }) {
  const navigate = useNavigate();

  const handleClose = () => navigate(-1);

  return (
    <div className="w-[260px] shrink-0 border-r border-[#dddfe2] bg-white flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#dddfe2] bg-white">
        <p className="text-[#050505] text-lg font-bold">Tin</p>
        <button
          type="button"
          onClick={handleClose}
          className="h-8 w-8 rounded-full bg-[#f0f2f5] text-[#65676b] hover:bg-[#e4e6eb] flex items-center justify-center transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      {/* Create story */}
      <div className="px-2 py-3 border-b border-[#dddfe2]">
        <button
          type="button"
          onClick={() => navigate("/stories/create")}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#f0f2f5] transition-colors"
        >
          <div className="relative w-11 h-11 shrink-0">
            <img
              src={currentUser?.avatar || import.meta.env.VITE_DEFAULT_AVATAR}
              alt="me"
              className="w-11 h-11 rounded-full object-cover border border-[#dddfe2]"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-[#0866ff] flex items-center justify-center border-2 border-white">
              <PlusIcon />
            </div>
          </div>
          <span className="text-[15px] font-semibold text-[#050505]">Tạo tin</span>
        </button>
      </div>

      {/* Story list */}
      <div className="flex-1 overflow-y-auto py-2 px-2 bg-white">
        <div className="flex items-center justify-between px-2 py-2 mb-1">
          <span className="text-[15px] font-semibold text-[#050505]">Tin đang theo dõi</span>
          <button
            type="button"
            className="text-[13px] font-semibold text-[#65676b] hover:underline hover:text-[#050505] transition-colors"
          >
            Xem tất cả
          </button>
        </div>

        <div className="space-y-0.5">
          {groups.map((group, groupIndex) => {
            const isActive = groupIndex === currentGroupIndex;
            const firstStory = group.stories[0];

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => onSelect(groupIndex, 0)}
                className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-all border ${
                  isActive
                    ? "bg-[#e7f3ff] border-[#1877f2]/30"
                    : "hover:bg-[#f0f2f5] border-transparent"
                }`}
              >
                {/* Avatar with ring */}
                <div className={`w-11 h-11 rounded-full shrink-0 p-0.5 bg-[#1877f2]`}>
                  <img
                    src={group.avatar}
                    alt={group.user}
                    className="w-full h-full rounded-full object-cover ring-2 ring-white"
                  />
                  {/* Multi-story indicator */}
                  {group.stories.length > 1 && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0866ff] text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                      {group.stories.length}
                    </div>
                  )}
                </div>

                {/* Text info */}
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-[13px] font-semibold leading-tight ${isActive ? "text-[#1877f2]" : "text-[#050505]"}`}>
                    {group.user}
                  </p>
                  <p className="truncate text-[11px] text-[#65676b] mt-0.5">
                    {firstStory?.timestamp || "Vừa xong"}
                  </p>
                </div>

                {/* Thumbnail stack */}
                <div className="relative w-9 h-9 shrink-0">
                  <img
                    src={firstStory?.bg}
                    alt=""
                    className={`w-9 h-9 rounded-lg object-cover border ${isActive ? "border-[#1877f2]" : "border-[#dbdbdb]"}`}
                  />
                  {group.stories.length > 1 && (
                    <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0866ff] text-white text-[8px] font-bold flex items-center justify-center border border-white">
                      {group.stories.length}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StoryViewerStage({
  group,
  storyIndex,
  storiesCount,
  progress,
  onPrev,
  onNext,
  onStoryPrev,
  onStoryNext,
}) {
  const story = group.stories[storyIndex];

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* Full-bleed story image */}
      <img
        src={story.bg}
        alt={group.user}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* Top gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-transparent to-black/70" />

      {/* Progress bars for current user's stories */}
      <ProgressBars
        total={storiesCount}
        current={storyIndex}
        progress={progress}
      />

      {/* Top bar: user info */}
      <div className="absolute left-0 right-0 top-0 z-20 flex items-start px-4 pt-7">
        <div className="flex items-center gap-2.5">
          <img
            src={group.avatar}
            alt={group.user}
            className="h-9 w-9 rounded-full border-2 border-white object-cover"
          />
          <div>
            <p className="text-white text-[13px] font-semibold">{group.user}</p>
            <p className="text-white/60 text-[11px]">{story.timestamp || "Vừa xong"}</p>
          </div>
        </div>
      </div>

      {/* Prev user zone */}
      <button
        type="button"
        onClick={onPrev}
        className="absolute left-0 top-0 z-20 h-full w-[15%] opacity-0"
        aria-label="Previous person"
      />

      {/* Next user / next story zone */}
      <button
        type="button"
        onClick={storyIndex < storiesCount - 1 ? onStoryNext : onNext}
        className="absolute right-0 top-0 z-20 h-full w-[85%] opacity-0"
        aria-label="Next"
      />

      {/* Prev story button (visible) */}
      {storyIndex > 0 && (
        <button
          type="button"
          onClick={onStoryPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 rounded-full bg-black/40 p-2 text-white hover:bg-black/65 transition-colors"
          aria-label="Story trước"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Next story button (visible) */}
      {storyIndex < storiesCount - 1 && (
        <button
          type="button"
          onClick={onStoryNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 rounded-full bg-black/40 p-2 text-white hover:bg-black/65 transition-colors"
          aria-label="Story sau"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-4 space-y-2">
        <p className="text-white text-[15px] font-semibold leading-snug drop-shadow-lg">
          {story.label}
        </p>

        {/* Reply input */}
        <div className="rounded-full border border-white/20 bg-black/35 backdrop-blur-md px-3 py-2.5">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Gửi tin nhắn..."
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
            />
            <button
              type="button"
              className="text-white/70 hover:text-white transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Reaction icons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="rounded-full bg-black/30 p-2 hover:bg-black/50 text-white transition-colors"
            >
              <Heart size={16} />
            </button>
            <button
              type="button"
              className="rounded-full bg-black/30 p-2 hover:bg-black/50 text-white transition-colors"
            >
              <MessageCircle size={16} />
            </button>
          </div>
          <button
            type="button"
            className="rounded-full bg-black/30 p-2 hover:bg-black/50 text-white transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StoryViewer() {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const rafRef = useRef(null);
  const touchStartX = useRef(null);
  const navigate = useNavigate();

  const currentGroup = storyGroups[currentGroupIndex];
  const totalStoriesInGroup = currentGroup?.stories.length || 0;

  const goToGroup = useCallback(
    (groupIndex) => {
      if (groupIndex < 0 || groupIndex >= storyGroups.length) {
        navigate(-1);
        return;
      }
      setCurrentGroupIndex(groupIndex);
      setCurrentStoryIndex(0);
      setProgress(0);
    },
    [navigate]
  );

  const goNextGroup = useCallback(() => goToGroup(currentGroupIndex + 1), [currentGroupIndex, goToGroup]);

  const goPrevGroup = useCallback(() => goToGroup(currentGroupIndex - 1), [currentGroupIndex, goToGroup]);

  const goNextStory = useCallback(() => {
    if (currentStoryIndex < totalStoriesInGroup - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      goNextGroup();
    }
  }, [currentStoryIndex, totalStoriesInGroup, goNextGroup]);

  const goPrevStory = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
      setProgress(0);
    } else {
      goPrevGroup();
    }
  }, [currentStoryIndex, goPrevGroup]);

  useEffect(() => {
    if (isPaused) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const nextProgress = Math.min(100, (elapsed / STORY_DURATION) * 100);
      setProgress(nextProgress);
      if (elapsed < STORY_DURATION) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        goNextStory();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [currentGroupIndex, currentStoryIndex, isPaused, goNextStory]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNextStory();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrevStory();
      if (e.key === "Escape") navigate(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNextStory, goPrevStory, navigate]);

  const handleClose = () => navigate(-1);

  if (!currentGroup) return null;

  return (
    <div className="fixed inset-0 z-[100] flex bg-white">
      {/* Left: compact story list */}
      <div className="hidden lg:flex lg:w-[260px] lg:shrink-0">
        <StoryListPanel
          groups={storyGroups}
          currentGroupIndex={currentGroupIndex}
          currentStoryIndex={currentStoryIndex}
          onSelect={(groupIndex, storyIdx) => {
            setCurrentGroupIndex(groupIndex);
            setCurrentStoryIndex(storyIdx);
            setProgress(0);
          }}
        />
      </div>

      {/* Right: centered story viewer */}
      <div className="flex-1 flex items-center justify-center bg-black/60">
        <div
          className="relative w-full h-full max-w-[700px] bg-black
            lg:w-[40%] lg:max-w-[700px]
            md:w-[60%] md:max-w-[500px]
            sm:w-full sm:max-w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const delta = touchStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(delta) > 40) {
              delta > 0 ? goNextStory() : goPrevStory();
            }
            touchStartX.current = null;
          }}
        >
          <StoryViewerStage
            group={currentGroup}
            storyIndex={currentStoryIndex}
            storiesCount={totalStoriesInGroup}
            progress={progress}
            onPrev={goPrevGroup}
            onNext={goNextGroup}
            onStoryPrev={goPrevStory}
            onStoryNext={goNextStory}
          />

          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-3 top-3 z-40 rounded-full bg-black/40 p-2 text-white hover:bg-black/65 transition-colors"
            aria-label="Đóng"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
