import { useCallback, useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Send, X, ChevronLeft, ChevronRight, MoreHorizontal, Pause, Play, Settings, Sparkles } from "lucide-react";
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
    <div className="absolute left-0 right-0 top-0 z-30 flex gap-1 px-4 pt-4">
      {Array.from({ length: total }).map((_, index) => {
        const fill = index < current ? 100 : index === current ? progress : 0;
        return (
          <div
            key={index}
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/25"
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

function StoryListPanel({ groups, currentGroupIndex, onSelect }) {
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-[360px] shrink-0 flex-col border-r border-[#e4e6eb] bg-white">
      <div className="border-b border-[#eef0f3] px-5 py-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#f0f2f5] text-[#050505] transition hover:bg-[#e4e6eb]"
            >
              <X size={18} />
            </button>
            <div>
              <p className="text-[24px] font-bold leading-tight text-[#050505]">Stories</p>
              <p className="mt-0.5 text-[13px] text-[#65676b]">Browse what your friends shared today</p>
            </div>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#f0f2f5] text-[#050505] transition hover:bg-[#e4e6eb]"
          >
            <Settings size={18} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate("/stories/create")}
          className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-[#dbe7ff] bg-[linear-gradient(135deg,#f3f8ff,#eef4ff)] px-4 py-4 text-left transition hover:border-[#bfd6ff] hover:shadow-sm"
        >
          <div className="relative h-14 w-14 shrink-0">
            <img
              src={currentUser?.avatar || import.meta.env.VITE_DEFAULT_AVATAR}
              alt="me"
              className="h-14 w-14 rounded-2xl object-cover ring-1 ring-black/5"
            />
            <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white bg-[#0866ff] shadow-sm">
              <PlusIcon />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-[#050505]">Create a story</p>
            <p className="mt-1 text-[13px] leading-5 text-[#65676b]">Share a photo, video, or a quick thought with friends.</p>
          </div>
        </button>
      </div>

      <div className="border-b border-[#eef0f3] px-5 py-4">
        <div className="flex items-center gap-2 rounded-2xl bg-[#f7f8fa] px-3 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e7f3ff] text-[#0866ff]">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#050505]">Following stories</p>
            <p className="text-[12px] text-[#65676b]">{groups.length} people have new story updates</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="space-y-1.5">
          {groups.map((group, groupIndex) => {
            const isActive = groupIndex === currentGroupIndex;
            const firstStory = group.stories[0];

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => onSelect(groupIndex, 0)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all ${
                  isActive
                    ? "border-[#cfe2ff] bg-[#edf5ff] shadow-sm"
                    : "border-transparent bg-white hover:border-[#e4e6eb] hover:bg-[#f7f8fa]"
                }`}
              >
                <div className="relative shrink-0">
                  <div className={`rounded-full p-[2px] ${isActive ? "bg-[#1877f2]" : "bg-[linear-gradient(135deg,#f9ca24,#eb4d4b,#a55eea,#686de0)]"}`}>
                    <img
                      src={group.avatar}
                      alt={group.user}
                      className="h-12 w-12 rounded-full border-2 border-white object-cover"
                    />
                  </div>
                  {group.stories.length > 1 && (
                    <div className="absolute -bottom-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#0866ff] px-1 text-[10px] font-bold text-white">
                      {group.stories.length}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className={`truncate text-[14px] font-semibold ${isActive ? "text-[#0866ff]" : "text-[#050505]"}`}>
                    {group.user}
                  </p>
                  <p className="mt-0.5 truncate text-[12px] text-[#65676b]">
                    {firstStory?.label}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-[#65676b]">
                    {firstStory?.timestamp || "Just now"}
                  </p>
                </div>

                <img
                  src={firstStory?.bg}
                  alt="Story thumbnail"
                  className={`h-12 w-10 shrink-0 rounded-xl object-cover ring-1 ${isActive ? "ring-[#b7d3ff]" : "ring-black/5"}`}
                />
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
  isPaused,
  onTogglePaused,
  onPrev,
  onNext,
  onStoryPrev,
  onStoryNext,
}) {
  const story = group.stories[storyIndex];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-black shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
      <img
        src={story.bg}
        alt={group.user}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      <ProgressBars total={storiesCount} current={storyIndex} progress={progress} />

      <div className="absolute left-0 right-0 top-0 z-20 flex items-start justify-between px-4 pt-8">
        <div className="flex items-center gap-3">
          <img
            src={group.avatar}
            alt={group.user}
            className="h-10 w-10 rounded-full border-2 border-white object-cover"
          />
          <div>
            <p className="text-[14px] font-semibold text-white">{group.user}</p>
            <p className="text-[11px] text-white/70">{story.timestamp || "Just now"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onTogglePaused}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/45"
            aria-label={isPaused ? "Play story" : "Pause story"}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            type="button"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/45"
            aria-label="More options"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onPrev}
        className="absolute left-0 top-0 z-20 h-full w-[16%] opacity-0"
        aria-label="Previous person"
      />

      <button
        type="button"
        onClick={storyIndex < storiesCount - 1 ? onStoryNext : onNext}
        className="absolute right-0 top-0 z-20 h-full w-[84%] opacity-0"
        aria-label="Next story"
      />

      <button
        type="button"
        onClick={onStoryPrev}
        className={`absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/15 p-2.5 text-white backdrop-blur-sm transition hover:bg-white/25 ${storyIndex > 0 ? "opacity-100" : "pointer-events-none opacity-0"}`}
        aria-label="Previous story"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        type="button"
        onClick={onStoryNext}
        className={`absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/15 p-2.5 text-white backdrop-blur-sm transition hover:bg-white/25 ${storyIndex < storiesCount - 1 ? "opacity-100" : "pointer-events-none opacity-0"}`}
        aria-label="Next story"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-5">
        <div className="mb-4 rounded-2xl bg-black/20 p-4 backdrop-blur-sm">
          <p className="text-[16px] font-semibold leading-snug text-white drop-shadow-lg">
            {story.label}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-3 rounded-full border border-white/15 bg-black/30 px-4 py-3 backdrop-blur-md">
            <input
              type="text"
              placeholder={`Reply to ${group.user}...`}
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/55 outline-none"
            />
            <button
              type="button"
              className="text-white/80 transition hover:text-white"
            >
              <Send size={16} />
            </button>
          </div>

          <button
            type="button"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/45"
          >
            <Heart size={18} />
          </button>
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/45"
          >
            <MessageCircle size={18} />
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
      if (e.key === " ") {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
      if (e.key === "Escape") navigate(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNextStory, goPrevStory, navigate]);

  if (!currentGroup) return null;

  return (
    <div className="fixed inset-0 z-[100] flex bg-[#0f1115]">
      <div className="hidden lg:flex lg:h-full lg:w-[360px] lg:shrink-0">
        <StoryListPanel
          groups={storyGroups}
          currentGroupIndex={currentGroupIndex}
          onSelect={(groupIndex, storyIdx) => {
            setCurrentGroupIndex(groupIndex);
            setCurrentStoryIndex(storyIdx);
            setProgress(0);
          }}
        />
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_#1d2433,_#0f1115_60%)] p-4 sm:p-6 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.06),_transparent_55%)]" />

        <div
          className="relative z-10 h-full w-full max-w-[560px] lg:h-[92vh]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
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
          <StoryViewerStage
            group={currentGroup}
            storyIndex={currentStoryIndex}
            storiesCount={totalStoriesInGroup}
            progress={progress}
            isPaused={isPaused}
            onTogglePaused={() => setIsPaused((prev) => !prev)}
            onPrev={goPrevGroup}
            onNext={goNextGroup}
            onStoryPrev={goPrevStory}
            onStoryNext={goNextStory}
          />

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute right-4 top-4 z-40 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/45 lg:hidden"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
