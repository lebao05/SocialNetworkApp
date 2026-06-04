import { useMedias } from "./useMedias";

/**
 * Fetches post images and videos for a given user.
 * Wraps useMedias with a userId scope and defaults to "image" media type.
 */
export function useUserMedias({ userId, mediaType = "image", pageSize = 24 }) {
  return useMedias({ userId, mediaType, pageSize });
}
