import { useCallback, useEffect, useState } from "react";
import { getProfileStoriesApi } from "../apis/storyApi";
import { buildStoryGroupFromApi } from "../components/Story/storyMappers";

export function useProfileStories(userId) {
  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStories = useCallback(async () => {
    if (!userId) {
      setGroup(null);
      setIsLoading(false);
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const stories = await getProfileStoriesApi(userId);
      const author = stories?.[0];
      const mappedGroup = buildStoryGroupFromApi({
        userId,
        authorName: author?.authorName,
        authorAvatarUrl: author?.authorAvatarUrl,
        hasUnseenStories: stories.some((story) => !story.isSeenByCurrentUser),
        latestStoryCreatedAt: stories[0]?.createdAt,
        stories,
      });

      setGroup(mappedGroup);
      return mappedGroup;
    } catch (err) {
      console.error("Failed to load profile stories:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to load story.");
      setGroup(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  return {
    group,
    stories: group?.stories ?? [],
    hasStories: Boolean(group?.stories?.length),
    isLoading,
    error,
    refresh: loadStories,
  };
}
