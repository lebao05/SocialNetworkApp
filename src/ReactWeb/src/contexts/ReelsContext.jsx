import { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import { getRecommendedReelsApi, getRecommendedReelsWithReelApi, getReelByIdApi } from "../apis/reelApi";

const ReelsContext = createContext(null);

function formatCompactCount(value) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return "0";
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(num);
}

function normalizeReel(reel) {
  const thumbnailUrl = reel.thumbnailUrl || reel.videoUrl;
  return {
    id: reel.id,
    reelId: reel.id,
    authorId: reel.authorId,
    author: reel.authorName || "User",
    authorName: reel.authorName || "User",
    avatar: reel.authorAvatarUrl || import.meta.env.VITE_DEFAULT_AVATAR,
    authorAvatarUrl: reel.authorAvatarUrl || import.meta.env.VITE_DEFAULT_AVATAR,
    poster: thumbnailUrl,
    thumbnailUrl,
    videoUrl: reel.videoUrl,
    caption: reel.caption || "",
    audioTitle: reel.audioTitle || "Original audio",
    duration: reel.duration || "",
    visibility: reel.visibility,
    likes: formatCompactCount(reel.likeCount),
    likeCount: reel.likeCount || 0,
    comments: formatCompactCount(reel.commentCount),
    commentCount: reel.commentCount || 0,
    views: formatCompactCount(reel.viewCount),
    viewCount: reel.viewCount || 0,
    isOwnReel: Boolean(reel.isOwnReel),
    isLikedByCurrentUser: Boolean(reel.isLikedByCurrentUser),
    createdAt: reel.createdAt,
    updatedAt: reel.updatedAt,
    verified: false,
    handle: reel.authorName
      ? `@${reel.authorName.toLowerCase().replace(/\s+/g, "")}`
      : "@user",
  };
}

function reelsReducer(state, action) {
  switch (action.type) {
    case "SET_REELS":
      return {
        ...state,
        reelsList: action.reels,
        hasMore: action.hasMore ?? false,
        isLoading: false,
        isLoadingMore: false,
        error: null,
      };

    case "APPEND_REELS":
      return {
        ...state,
        reelsList: [...state.reelsList, ...action.reels],
        hasMore: action.hasMore ?? state.hasMore,
        isLoading: false,
        isLoadingMore: false,
      };

    case "SET_LOADING":
      return { ...state, isLoading: action.value };

    case "SET_LOADING_MORE":
      return { ...state, isLoadingMore: action.value };

    case "SET_ERROR":
      return { ...state, error: action.error, isLoading: false, isLoadingMore: false };

    case "UPDATE_REEL":
      return {
        ...state,
        reelsList: state.reelsList.map((r) =>
          r.id === action.reel.id ? { ...r, ...action.reel } : r
        ),
      };

    case "REMOVE_REEL": {
      const filtered = state.reelsList.filter((r) => r.id !== action.reelId);
      return {
        ...state,
        reelsList: filtered,
      };
    }

    default:
      return state;
  }
}

const initialState = {
  reelsList: [],
  hasMore: false,
  isLoading: false,
  isLoadingMore: false,
  error: null,
};

export function ReelsProvider({ children }) {
  const [state, dispatch] = useReducer(reelsReducer, initialState);
  singletonDispatch = dispatch;

  // reelChosen is always derived from reelId + reelsList (kept in URL/page, not here)
  const reelChosen = useMemo(() => {
    if (!state.reelsList.length) return null;
    // reelId comes from the page via URL, not stored in context
    return null;
  }, [state.reelsList]);

  const fetchRecommended = useCallback(async () => {
    dispatch({ type: "SET_LOADING", value: true });
    try {
      const data = await getRecommendedReelsApi();
      const items = data.items ?? [];
      const normalized = items.map(normalizeReel);
      dispatch({
        type: "SET_REELS",
        reels: normalized,
        hasMore: Boolean(data.hasNextPage),
      });
      return normalized;
    } catch (err) {
      console.error("[ReelsContext] fetchRecommended failed:", err);
      dispatch({ type: "SET_ERROR", error: "Failed to load recommended reels." });
      return null;
    }
  }, []);

  const fetchRecommendedWithReel = useCallback(async (targetReelId) => {
    dispatch({ type: "SET_LOADING", value: true });
    try {
      const { target, list } = await getRecommendedReelsWithReelApi(targetReelId);
      const normalized = list.map(normalizeReel);
      const normalizedTarget = normalizeReel(target);

      // Prepend target reel at index 0 if not already in list
      const targetInList = normalized.findIndex((r) => r.id === targetReelId);
      const reels = targetInList === -1
        ? [normalizedTarget, ...normalized]
        : normalized;

      dispatch({
        type: "SET_REELS",
        reels,
        hasMore: true,
      });
      return reels;
    } catch (err) {
      console.error("[ReelsContext] fetchRecommendedWithReel failed:", err);
      dispatch({ type: "SET_ERROR", error: "Failed to load reels." });
      return null;
    }
  }, []);

  const setReels = useCallback((reels) => {
    dispatch({ type: "SET_REELS", reels, hasMore: false });
  }, []);

  const updateReel = useCallback((reel) => {
    dispatch({ type: "UPDATE_REEL", reel });
  }, []);

  const removeReel = useCallback((reelId) => {
    dispatch({ type: "REMOVE_REEL", reelId });
  }, []);

  const value = {
    reelsList: state.reelsList,
    reelChosen,
    hasMore: state.hasMore,
    isLoading: state.isLoading,
    isLoadingMore: state.isLoadingMore,
    error: state.error,
    fetchRecommended,
    fetchRecommendedWithReel,
    setReels,
    updateReel,
    removeReel,
  };

  return <ReelsContext.Provider value={value}>{children}</ReelsContext.Provider>;
}

export function useReels() {
  const ctx = useContext(ReelsContext);
  if (!ctx) {
    throw new Error("useReels must be used within a ReelsProvider.");
  }
  return ctx;
}

export function setReelsContext(reels) {
  // Dispatch directly via a singleton dispatch holder — must be called inside provider
  if (!singletonDispatch) return;
  singletonDispatch({ type: "SET_REELS", reels, hasMore: false });
}

// Singleton dispatch reference — set by the provider on mount
let singletonDispatch = null;
