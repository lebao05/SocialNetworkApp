import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { useStories } from "../../contexts/StoriesContext";
import StoryBarRing from "./StoryBarRing";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;
const CREATE_STORY_LOADING_MIN_MS = 700; // keep spinner visible briefly so it reads as "loading", not a flick

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      className="animate-spin"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="9" stroke="white" strokeOpacity="0.35" strokeWidth="2.5" />
      <path
        d="M11 2a9 9 0 0 1 9 9"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StoryCard({ group, onClick }) {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-shrink-0 w-20 group cursor-pointer">
      <div className="relative">
        <StoryBarRing
          avatarUrl={group.avatar}
          name={group.user}
          hasActiveStories={group.stories.length > 0}
          hasUnseenStories={group.hasUnseenStories}
          onClick={() => onClick(group.userId)}
        />
        {group.stories.length > 1 && group.hasUnseenStories && (
          <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#0866ff] text-white text-[8px] font-bold flex items-center justify-center border-2 border-white pointer-events-none">
            {group.stories.length}
          </span>
        )}
      </div>
      <span className="text-[11px] text-[#65676b] font-medium truncate w-full text-center leading-tight group-hover:underline">
        {group.user}
      </span>
    </div>
  );
}

export default function StoryBar() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { timelineGroups: groups, timelineLoading: isLoading } = useStories();
  const [isCreatingStory, setIsCreatingStory] = useState(false);

  const displayUser = useMemo(() => ({
    avatar: currentUser?.avatarUrl || DEFAULT_AVATAR,
  }), [currentUser]);

  const handleOpenCreateStory = () => {
    if (isCreatingStory) return;
    setIsCreatingStory(true);

    // Minimum visible spinner time so the state reads as "loading" instead of
    // a quick click → page swap flicker. Real navigation kicks off after the
    // minimum so the user sees the spinner briefly.
    setTimeout(() => {
      navigate("/stories/create");
    }, CREATE_STORY_LOADING_MIN_MS);

    // Failsafe: if navigation never resolves (e.g. user blocks navigation),
    // reset the button after 3s so it isn't stuck disabled.
    setTimeout(() => {
      setIsCreatingStory(false);
    }, 3000);
  };

  const handleOpenUserStory = (userId) => {
    if (!userId) return;
    navigate(`/profile/${userId}/stories`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#dddfe2] px-4 py-3">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          type="button"
          onClick={handleOpenCreateStory}
          disabled={isCreatingStory}
          aria-busy={isCreatingStory}
          aria-label={isCreatingStory ? "Loading create story page" : "Create story"}
          className="flex flex-col items-center gap-1.5 flex-shrink-0 w-20 group cursor-pointer focus:outline-none disabled:cursor-wait"
        >
          <div className="relative w-[72px] h-[72px]">
            {/* Avatar — same outer dimensions as StoryBarRing (72px) so friend
                cards and this card align vertically. */}
            <div
              className={`absolute inset-0 rounded-full overflow-hidden transition-opacity duration-200 ${
                isCreatingStory ? "opacity-60" : "opacity-100"
              }`}
            >
              <img
                src={displayUser.avatar}
                alt="me"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Spinner overlay — shown only while navigation is in flight. */}
            {isCreatingStory && (
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center bg-black/35 backdrop-blur-[1px]"
                role="status"
                aria-live="polite"
              >
                <SpinnerIcon />
              </div>
            )}
            {/* Plus badge — centered horizontally on the 72px wrapper, with a
                white ring so it sits "on top of" the avatar edge. */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-[#0866ff] flex items-center justify-center border-[3px] border-white shadow-sm">
                <PlusIcon />
              </div>
            </div>
          </div>
          <span className="text-[11px] text-[#65676b] font-medium text-center leading-tight">
            {isCreatingStory ? "Loading…" : "Create story"}
          </span>
        </button>

        <div className="w-px h-10 bg-[#dddfe2] shrink-0 mx-1" />

        {isLoading ? (
          <div className="flex h-[92px] min-w-[160px] flex-1 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e4e6eb] border-t-[#0866ff]" />
          </div>
        ) : (
          groups.map((group) => (
            <StoryCard
              key={group.userId}
              group={group}
              onClick={handleOpenUserStory}
            />
          ))
        )}
      </div>
    </div>
  );
}
