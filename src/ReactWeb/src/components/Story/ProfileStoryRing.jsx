import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Play } from "lucide-react";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

// ── Avatar + ring sizing ─────────────────────────────────────────────────────
// Three properties per size:
//   - avatarPx: outer colored disc diameter (= avatar diameter + 2*ringW)
//   - ringW:    thickness of the colorful ring around the avatar
//   - innerPx:  diameter of the avatar circle inside the ring
const RING_SIZE = {
  xl: { avatarPx: 168, ringW: 8,  innerPx: 152 },
  md: { avatarPx: 168, ringW: 6,  innerPx: 156 },
  lg: { avatarPx: 72,  ringW: 5,  innerPx: 62  },
  sm: { avatarPx: 44,  ringW: 3,  innerPx: 38  },
};

// ── Animated colorful ring ───────────────────────────────────────────────────
// A conic-gradient on a square div, rotated around its center — looks like a
// spinning ring of color surrounding the avatar. Two speeds:
//   - "unseen" stories: full rainbow, ~6s per revolution (eye-catching)
//   - "seen" stories:    cool greens-blues, ~12s per revolution (calmer)
const RING_GRADIENT_UNSEEN =
  "conic-gradient(from 0deg, #f9ca24, #f0932b, #eb4d4b, #a55eea, #686de0, #1877f2, #25d366, #f9ca24)";
const RING_GRADIENT_SEEN =
  "conic-gradient(from 0deg, #25d366, #2dd4bf, #0ea5e9, #6366f1, #2dd4bf, #25d366)";

const keyframes = `
  @keyframes story-ring-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes story-ring-spin-reverse {
    from { transform: rotate(0deg); }
    to   { transform: rotate(-360deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    .story-ring-anim { animation: none !important; }
  }
`;

if (typeof document !== "undefined" && !document.getElementById("story-ring-keyframes")) {
  const styleEl = document.createElement("style");
  styleEl.id = "story-ring-keyframes";
  styleEl.textContent = keyframes;
  document.head.appendChild(styleEl);
}

// ─── Story Ring ──────────────────────────────────────────────────────────────
function StoryRing({ children, hasActiveStories, hasUnseenStories = true, size = "md" }) {
  const { avatarPx, ringW, innerPx } = RING_SIZE[size];

  // If no stories exist, show a standard neutral ring matching the card.
  if (!hasActiveStories) {
    return (
      <div
        className="rounded-full bg-white dark:bg-[#242526] shrink-0"
        style={{ width: avatarPx, height: avatarPx }}
      >
        <div
          className="rounded-full overflow-hidden bg-white dark:bg-[#242526]"
          style={{ width: innerPx, height: innerPx, margin: ringW }}
        >
          {children}
        </div>
      </div>
    );
  }

  // Pick gradient + animation based on seen/unseen.
  const isUnseen = hasUnseenStories;
  const gradient = isUnseen ? RING_GRADIENT_UNSEEN : RING_GRADIENT_SEEN;
  const animation = isUnseen
    ? "story-ring-spin 6s linear infinite"
    : "story-ring-spin-reverse 12s linear infinite";

  // Wrapper = the full colored disc. The colorful ring lives BETWEEN this
  // outer circle and the inset avatar circle. Rotating the wrapper animates
  // the ring like a spinning color wheel.
  return (
    <div
      className="story-ring-anim rounded-full shrink-0 cursor-pointer relative"
      style={{
        width: avatarPx,
        height: avatarPx,
        background: gradient,
        animation,
        transformOrigin: "50% 50%",
      }}
    >
      {/* White inset that masks the gradient into a ring, then clips the avatar. */}
      <div
        className="rounded-full bg-white dark:bg-[#18191a]"
        style={{ position: "absolute", inset: ringW }}
      >
        <div
          className="rounded-full overflow-hidden w-full h-full"
        >
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
