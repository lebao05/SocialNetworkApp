export function buildStoryGroupFromApi(group) {
  const stories = (group?.stories ?? []).map((story) => {
    const style = resolveTextStyle(story);
    return {
      id: story.id,
      bg: story.mediaUrl || import.meta.env.VITE_DEFAULT_AVATAR,
      label: story.textContent || "Shared a story",
      timestamp: formatStoryTimestamp(story.createdAt),
      createdAt: story.createdAt,
      expiresAt: story.expiresAt,
      mediaType: story.mediaType,
      isSeenByCurrentUser: story.isSeenByCurrentUser,
      isLikedByCurrentUser: story.isLikedByCurrentUser,
      backgroundGradient: story.backgroundGradient,
      textColor: style.color,
      textStyle: story.textStyle,
      textPositionX: story.textPositionX,
      textPositionY: story.textPositionY,
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      textShadow: style.textShadow,
      textAlign: style.textAlign,
    };
  });

  return {
    id: group.userId,
    userId: group.userId,
    user: group.authorName || "User",
    avatar: group.authorAvatarUrl || import.meta.env.VITE_DEFAULT_AVATAR,
    hasUnseenStories: Boolean(group.hasUnseenStories),
    latestStoryCreatedAt: group.latestStoryCreatedAt,
    isFriend: group.isFriend ?? false,
    stories,
  };
}

const TEXT_STYLE_MAP = Object.fromEntries(
  [
    { id: "classic", fontFamily: "Georgia, serif", fontSize: 32, fontWeight: "400", textShadow: "none", color: "#ffffff", textAlign: "center" },
    { id: "bold", fontFamily: "Impact, sans-serif", fontSize: 36, fontWeight: "900", textShadow: "none", color: "#ffffff", textAlign: "center" },
    { id: "shadow", fontFamily: "Arial Black, sans-serif", fontSize: 30, fontWeight: "900", textShadow: "2px 2px 8px #000", color: "#ffffff", textAlign: "center" },
    { id: "colorful", fontFamily: "Georgia, serif", fontSize: 32, fontWeight: "400", textShadow: "none", color: "#ffdf5d", textAlign: "center" },
    { id: "glossy", fontFamily: "Arial, sans-serif", fontSize: 28, fontWeight: "700", textShadow: "0 0 10px #fff", color: "#ffffff", textAlign: "center" },
    { id: "vintage", fontFamily: "Times New Roman, serif", fontSize: 30, fontWeight: "400", textShadow: "1px 1px 0 #000", color: "#ffe066", textAlign: "center" },
  ].map((s) => [s.id, s])
);

function resolveTextStyle(story) {
  const savedStyle = story.textStyle ? TEXT_STYLE_MAP[story.textStyle] : null;
  return {
    fontFamily: story.fontFamily || savedStyle?.fontFamily || "Georgia, serif",
    fontSize: savedStyle?.fontSize || 32,
    fontWeight: savedStyle?.fontWeight || "400",
    textShadow: savedStyle?.textShadow || "none",
    color: story.textColor || savedStyle?.color || "#ffffff",
    textAlign: savedStyle?.textAlign || "center",
  };
}

function formatStoryTimestamp(value) {
  if (!value) return "Just now";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d`;
}
