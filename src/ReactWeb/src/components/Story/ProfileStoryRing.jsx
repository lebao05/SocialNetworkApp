import React from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

function StoryRing({ children, hasActiveStories, size = "md" }) {
  const sizeClasses = {
    sm: "w-[44px] h-[44px] p-[2px]",
    md: "w-[168px] h-[168px] p-[3px]",
    lg: "w-[72px] h-[72px] p-[3px]",
  };

  const innerSizes = {
    sm: "w-[40px] h-[40px]",
    md: "w-[162px] h-[162px]",
    lg: "w-[66px] h-[66px]",
  };

  if (!hasActiveStories) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-[#dbdbdb] shrink-0`}>
        <div className={`w-full h-full rounded-full bg-white p-[3px]`}>
          <div className={`w-full h-full rounded-full overflow-hidden ${innerSizes[size]}`}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full p-[3px] bg-gradient-to-tr from-[#f9ca24] via-[#f0932b] via-30% via-[#eb4d4b] via-60% via-[#a55eea] to-[#686de0] shrink-0 cursor-pointer`}
    >
      <div className="w-full h-full rounded-full bg-white p-[3px]">
        <div className={`w-full h-full rounded-full overflow-hidden ${innerSizes[size]}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ProfileStoryRing({
  userId,
  avatarUrl,
  name,
  hasActiveStories = false,
  size = "md",
  onStoryClick,
  className,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onStoryClick) {
      onStoryClick(userId);
      return;
    }

    if (hasActiveStories && userId) {
      navigate(`/profile/${userId}/stories`);
    }
  };

  const interactive = hasActiveStories || onStoryClick;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!interactive}
      className={`relative ${interactive ? "cursor-pointer" : "cursor-default"} focus:outline-none group ${className ?? ""}`}
      title={hasActiveStories ? `View ${name}'s story` : undefined}
    >
      <StoryRing hasActiveStories={hasActiveStories} size={size}>
        <img
          src={avatarUrl || DEFAULT_AVATAR}
          alt={name || "User"}
          className="w-full h-full object-cover transition duration-200 group-hover:scale-105"
        />
      </StoryRing>
    </button>
  );
}
