import axios from "./axios";

/**
 * Trigger feed generation (admin/dev): POST /api/feed/generate?candidateLimit=...&feedItemLimit=...
 */
export async function generateFeedApi(candidateLimit = 500, feedItemLimit = 100) {
  const response = await axios.post("/feed/generate", null, {
    params: { candidateLimit, feedItemLimit },
  });

  return response.data;
}

/**
 * Get paginated feed posts: GET /api/feed/posts?page=..&pageSize=..
 */
export async function getFeedPostsApi(page = 1, pageSize = 20) {
  const response = await axios.get("/feed/posts", {
    params: { page, pageSize },
  });

  return response.data;
}

/**
 * Mark latest feed items as seen: POST /api/feed/seen/latest
 */
export async function markLatestAsSeenApi() {
  const response = await axios.post("/feed/seen/latest");
  return response.data;
}
