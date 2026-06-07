import { createContext, useCallback, useContext, useMemo } from "react";
import { useStoriesTimeline } from "../hooks/useStoriesTimeline";
import { useCreateStory } from "../hooks/useCreateStory";

const StoriesContext = createContext(null);

export function StoriesProvider({ children }) {
  const timeline = useStoriesTimeline({ pageSize: 15 });
  const createStoryState = useCreateStory();

  const refreshTimeline = useCallback(() => timeline.loadPage(1), [timeline]);

  const createStory = useCallback(async (payload) => {
    const result = await createStoryState.createStory(payload);

    if (result.success) {
      await refreshTimeline();
    }

    return result;
  }, [createStoryState, refreshTimeline]);

  const refreshAfterCreate = useCallback(async () => {
    await refreshTimeline();
  }, [refreshTimeline]);

  const value = useMemo(() => ({
    timelineGroups: timeline.groups,
    timelinePage: timeline.page,
    timelineHasNextPage: timeline.hasNextPage,
    timelineLoading: timeline.isLoading,
    timelineError: timeline.error,
    refreshTimeline,
    loadTimelinePage: timeline.loadPage,
    createStory,
    createStoryError: createStoryState.error,
    isCreatingStory: createStoryState.isSubmitting,
    clearCreateStoryError: createStoryState.clearError,
    refreshAfterCreate,
  }), [
    timeline.groups,
    timeline.page,
    timeline.hasNextPage,
    timeline.isLoading,
    timeline.error,
    refreshTimeline,
    timeline.loadPage,
    createStory,
    createStoryState.error,
    createStoryState.isSubmitting,
    createStoryState.clearError,
    refreshAfterCreate,
  ]);

  return <StoriesContext.Provider value={value}>{children}</StoriesContext.Provider>;
}

export function useStories() {
  const ctx = useContext(StoriesContext);

  if (!ctx) {
    throw new Error("useStories must be used within a StoriesProvider.");
  }

  return ctx;
}
