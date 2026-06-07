import { useCallback, useState } from "react";
import { createStoryApi } from "../apis/storyApi";

export function useCreateStory() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const createStory = useCallback(async (payload) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createStoryApi(payload);
      return { success: true, data: result };
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to create story.";
      console.error("Failed to create story:", err);
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    createStory,
    isSubmitting,
    error,
    clearError: () => setError(null),
  };
}
