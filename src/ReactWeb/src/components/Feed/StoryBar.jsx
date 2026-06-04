import React from "react";
import { useNavigate } from "react-router-dom";
import { storyGroups, currentUser } from "../../data/mockData";

function StoryRing({ children, isSeen }) {
  if (isSeen) {
    return (
      <div className="relative w-[72px] h-[72px]">
        <div className="absolute inset-0 rounded-full bg-[#dbdbdb] p-[2px]">
          <div className="w-full h-full rounded-full bg-white p-[2px]">
            <div className="w-full h-full rounded-full overflow-hidden">{children}</div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="relative w-[72px] h-[72px] p-[3px] bg-gradient-to-tr from-[#f9ca24] via-[#f0932b] via-30% via-[#eb4d4b] via-60% via-[#a55eea] to-[#686de0] rounded-full">
      <div className="w-full h-full rounded-full bg-white p-[2px]">
        <div className="w-full h-full rounded-full overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function StoryCard({ group, isSeen, onClick }) {
  const firstStory = group.stories[0];

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 group cursor-pointer flex-shrink-0 w-20 focus:outline-none"
    >
      <StoryRing isSeen={isSeen}>
        <img
          src={group.avatar}
          alt={group.user}
          className="w-full h-full object-cover"
        />
      </StoryRing>
      <span className="text-[11px] text-[#65676b] font-medium truncate w-full text-center leading-tight group-hover:underline">
        {group.user}
      </span>
      {group.stories.length > 1 && !isSeen && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0866ff] text-white text-[8px] font-bold flex items-center justify-center">
          {group.stories.length}
        </span>
      )}
    </button>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function StoryBar() {
  const navigate = useNavigate();

  const handleOpenStories = () => {
    navigate("/stories");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#dddfe2] px-4 py-3">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {/* Add story */}
        <button
          type="button"
          onClick={handleOpenStories}
          className="flex flex-col items-center gap-1.5 flex-shrink-0 w-20 group cursor-pointer focus:outline-none"
        >
          <div className="relative w-[72px] h-[72px]">
            <div className="absolute inset-0 rounded-full border border-[#dbdbdb] p-[2px]">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src={currentUser.avatar}
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
          <span className="text-[11px] text-[#65676b] font-medium text-center leading-tight">Tạo tin</span>
        </button>

        <div className="w-px h-10 bg-[#dddfe2] shrink-0 mx-1" />

        {/* Story groups */}
        {storyGroups.map((group) => (
          <StoryCard
            key={group.id}
            group={group}
            isSeen={false}
            onClick={handleOpenStories}
          />
        ))}
      </div>
    </div>
  );
}
