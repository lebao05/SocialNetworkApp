import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { useStories } from "../../contexts/StoriesContext";
import ProfileStoryRing from "../Story/ProfileStoryRing";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function StoryCard({ group, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(group.userId)}
      className="flex flex-col items-center gap-1.5 group cursor-pointer flex-shrink-0 w-20 focus:outline-none"
    >
      <div className="relative">
        <ProfileStoryRing
          userId={group.userId}
          avatarUrl={group.avatar}
          name={group.user}
          hasActiveStories={group.stories.length > 0}
          hasUnseenStories={group.hasUnseenStories}
          size="lg"
          onStoryClick={onClick}
        />
        {group.stories.length > 1 && group.hasUnseenStories && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0866ff] text-white text-[8px] font-bold flex items-center justify-center">
            {group.stories.length}
          </span>
        )}
      </div>
      <span className="text-[11px] text-[#65676b] font-medium truncate w-full text-center leading-tight group-hover:underline">
        {group.user}
      </span>
    </button>
  );
}

export default function StoryBar() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { timelineGroups: groups, timelineLoading: isLoading } = useStories();

  const displayUser = useMemo(() => ({
    avatar: currentUser?.avatarUrl || DEFAULT_AVATAR,
  }), [currentUser]);

  const handleOpenCreateStory = () => {
    navigate("/stories/create");
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
          className="flex flex-col items-center gap-1.5 flex-shrink-0 w-20 group cursor-pointer focus:outline-none"
        >
          <div className="relative w-[72px] h-[72px]">
            <div className="absolute inset-0 rounded-full border border-[#dbdbdb] p-[2px]">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src={displayUser.avatar}
                  alt="me"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-[#0866ff] flex items-center justify-center border-[3px] border-white">
                <PlusIcon />
              </div>
            </div>
          </div>
          <span className="text-[11px] text-[#65676b] font-medium text-center leading-tight">Create story</span>
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
