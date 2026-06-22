import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Play } from "lucide-react";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

// ─── Story Ring ──────────────────────────────────────────────────────────────
function StoryRing({ children, hasActiveStories, hasUnseenStories = true, size = "md" }) {
  const sizeClasses = {
    xl: "w-[168px] h-[168px] p-[4px]",
    sm: "w-[44px] h-[44px] p-[2px]",
    md: "w-[168px] h-[168px] p-[3px]",
    lg: "w-[72px] h-[72px] p-[3px]",
  };

  const innerSizes = {
    xl: "w-[160px] h-[160px]",
    sm: "w-[40px] h-[40px]",
    md: "w-[162px] h-[162px]",
    lg: "w-[66px] h-[66px]",
  };

  // If no stories exist, show a standard neutral border matching the card background (white/dark card bg)
  if (!hasActiveStories) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-white dark:bg-[#242526] shrink-0`}>
        <div className="w-full h-full rounded-full bg-white p-[3px] dark:bg-[#242526]">
          <div className={`w-full h-full rounded-full overflow-hidden ${innerSizes[size]}`}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  // If active stories exist but they have all been seen, the ring is gray
  if (!hasUnseenStories) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-[#e4e6eb] dark:bg-[#3e4042] shrink-0 cursor-pointer`}>
        <div className="w-full h-full rounded-full bg-white p-[3px] dark:bg-[#18191a]">
          <div className={`w-full h-full rounded-full overflow-hidden ${innerSizes[size]}`}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  // Active unseen stories get the vibrant gradient ring
  return (
    <div className={`${sizeClasses[size]} rounded-full p-[3px] bg-gradient-to-tr from-[#f9ca24] via-[#f0932b] via-30% via-[#eb4d4b] via-60% via-[#a55eea] to-[#686de0] shrink-0 cursor-pointer`}>
      <div className="w-full h-full rounded-full bg-white p-[3px] dark:bg-[#18191a]">
        <div className={`w-full h-full rounded-full overflow-hidden ${innerSizes[size]}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Profile Story Ring ──────────────────────────────────────────────────────
export default function ProfileStoryRing({
  userId,
  avatarUrl,
  name,
  hasActiveStories = false,
  hasUnseenStories = true,
  size = "md",
  isOwnProfile = false,
  onUploadAvatar,
  onSeeStories,
  onStoryClick,
  darkMode = false,
  className,
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef(null);

  const isXl = size === "xl";
  const interactive = hasActiveStories || onStoryClick || (isXl && (isOwnProfile || hasActiveStories));

  const handleStoryClick = () => {
    if (onStoryClick) {
      onStoryClick(userId);
      return;
    }
    if (hasActiveStories && userId) {
      navigate(`/profile/${userId}/stories`);
    }
  };

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    if (isXl) {
      if (isOwnProfile || hasActiveStories) {
        setMenuOpen((prev) => !prev);
      }
    } else {
      handleStoryClick();
    }
  };

  // Close dropdown menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <div className={`relative ${className ?? ""}`} ref={containerRef}>
      <button
        type="button"
        onClick={handleAvatarClick}
        disabled={!interactive}
        className={`relative ${interactive ? "cursor-pointer" : "cursor-default"} focus:outline-none group rounded-full block`}
        title={hasActiveStories && !isXl ? `View ${name}'s story` : undefined}
      >
        <StoryRing hasActiveStories={hasActiveStories} hasUnseenStories={hasUnseenStories} size={size}>
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <img
              src={avatarUrl || DEFAULT_AVATAR}
              alt={name || "User"}
              className="w-full h-full object-cover transition duration-200 group-hover:scale-105"
            />
            {/* Hover overlay — only for profile page avatar (xl size) */}
            {isXl && (isOwnProfile || hasActiveStories) && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-full">
                {isOwnProfile ? (
                  <Camera size={28} className="text-white drop-shadow" />
                ) : (
                  <Play size={28} className="text-white drop-shadow fill-white" />
                )}
              </div>
            )}
          </div>
        </StoryRing>
      </button>

      {/* Avatar dropdown menu for profile page */}
      {isXl && menuOpen && (isOwnProfile || hasActiveStories) && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-[102%] mt-2 z-50 min-w-[200px] rounded-xl shadow-xl border overflow-hidden ${
            darkMode ? "bg-[#242526] border-[#3e4042]" : "bg-white border-[#d8dadf]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {isOwnProfile && onUploadAvatar && (
            <button
              type="button"
              onClick={() => { setMenuOpen(false); onUploadAvatar(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors cursor-pointer ${
                darkMode
                  ? "text-[#e4e6eb] hover:bg-[#3a3b3c]"
                  : "text-[#050505] hover:bg-[#f2f2f2]"
              }`}
            >
              <Camera size={16} className="text-[#65676b]" />
              Upload Avatar
            </button>
          )}
          {hasActiveStories && (onSeeStories || handleStoryClick) && (
            <button
              type="button"
              onClick={() => { setMenuOpen(false); if (onSeeStories) { onSeeStories(); } else { handleStoryClick(); } }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors cursor-pointer ${isOwnProfile ? "border-t" : ""} ${
                darkMode
                  ? "text-[#e4e6eb] hover:bg-[#3a3b3c] border-[#3e4042]"
                  : "text-[#050505] hover:bg-[#f2f2f2] border-[#d8dadf]"
              }`}
            >
              <Play size={16} className="text-[#65676b]" />
              See Stories
            </button>
          )}
        </div>
      )}
    </div>
  );
}
