import React from "react";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

// ── Animated colorful ring ───────────────────────────────────────────────────
// Two states:
//   - unseen stories: full rainbow conic gradient, ~6s per spin
//   - seen stories:   cool green→blue conic gradient, ~12s per spin (calmer)
const RING_GRADIENT_UNSEEN =
  "conic-gradient(from 0deg, #f9ca24, #f0932b, #eb4d4b, #a55eea, #686de0, #1877f2, #25d366, #f9ca24)";
const RING_GRADIENT_SEEN =
  "conic-gradient(from 0deg, #25d366, #2dd4bf, #0ea5e9, #6366f1, #2dd4bf, #25d366)";

// ── Keyframes ────────────────────────────────────────────────────────────────
const keyframes = `
  @keyframes story-bar-ring-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes story-bar-ring-spin-reverse {
    from { transform: rotate(0deg); }
    to   { transform: rotate(-360deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    .story-bar-ring-anim { animation: none !important; }
  }
`;

if (typeof document !== "undefined" && !document.getElementById("story-bar-ring-keyframes")) {
  const styleEl = document.createElement("style");
  styleEl.id = "story-bar-ring-keyframes";
  styleEl.textContent = keyframes;
  document.head.appendChild(styleEl);
}

// ── Sizing ───────────────────────────────────────────────────────────────────
// Story bar uses a single 72px wrapper. Ring thickness scales with wrapper.
const AVATAR_PX = 72;
const RING_W = 5;
const INNER_PX = AVATAR_PX - 2 * RING_W; // 62

// ── StoryBarRing ─────────────────────────────────────────────────────────────
// Lightweight ring used ONLY in the feed's StoryBar. No menus, no nav, no
// upload — just an avatar wrapped in a colored spinning ring.
export default function StoryBarRing({
  avatarUrl,
  name,
  hasActiveStories = false,
  hasUnseenStories = true,
  onClick,
}) {
  const handleClick = () => {
    if (onClick) onClick();
  };

  // No stories → plain neutral ring matching the card background.
  if (!hasActiveStories) {
    return (
      <div
        className="rounded-full bg-white shrink-0 cursor-pointer"
        style={{ width: AVATAR_PX, height: AVATAR_PX }}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <div
          className="rounded-full overflow-hidden bg-white"
          style={{ width: INNER_PX, height: INNER_PX, margin: RING_W }}
        >
          <img
            src={avatarUrl || DEFAULT_AVATAR}
            alt={name || ""}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
      </div>
    );
  }

  // Stories exist → pick gradient + spin speed based on seen/unseen.
  const isUnseen = hasUnseenStories;
  const gradient = isUnseen ? RING_GRADIENT_UNSEEN : RING_GRADIENT_SEEN;
  const animation = isUnseen
    ? "story-bar-ring-spin 6s linear infinite"
    : "story-bar-ring-spin-reverse 12s linear infinite";

  return (
    <div
      className="story-bar-ring-anim rounded-full shrink-0 cursor-pointer relative"
      style={{
        width: AVATAR_PX,
        height: AVATAR_PX,
        background: gradient,
        animation,
        transformOrigin: "50% 50%",
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`${name || "User"} story`}
    >
      {/* White inset that masks the gradient into a ring, then clips the avatar. */}
      <div
        className="rounded-full bg-white"
        style={{ position: "absolute", inset: RING_W }}
      >
        <div className="rounded-full overflow-hidden w-full h-full">
          <img
            src={avatarUrl || DEFAULT_AVATAR}
            alt={name || ""}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}