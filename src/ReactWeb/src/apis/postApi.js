import axios from "./axios";

/**
 * Create a post with optional attachments (multipart/form-data)
 * Maps to POST /api/posts/create
 */
export async function createPostApi({
  groupId = null,
  content = null,
  visibility = 0,
  sharePostId = null,
  locationTag = null,
  feelingActivity = null,
  taggedUserIds = [],
  attachments = [],
}) {
  const formData = new FormData();

  if (groupId !== null) formData.append("GroupId", groupId);
  if (content !== null) formData.append("Content", content);
  if (visibility !== null) formData.append("Visibility", visibility);
  if (sharePostId !== null) formData.append("SharePostId", sharePostId);
  if (locationTag !== null) formData.append("LocationTag", locationTag);
  if (feelingActivity !== null) formData.append("FeelingActivity", feelingActivity);

  // Append tagged user ids as repeated fields
  if (Array.isArray(taggedUserIds)) {
    taggedUserIds.forEach((id) => formData.append("TaggedUserIds", id));
  }

  // Append attachments (File objects)
  if (Array.isArray(attachments)) {
    attachments.forEach((file) => formData.append("Attachments", file));
  }

  const response = await axios.post("/posts/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data; // expected to return created post id
}

/**
 * Get a single post by id: GET /api/posts/{id}
 */
export async function getPostApi(postId) {
  const response = await axios.get(`/posts/${postId}`);
  return response.data;
}

/**
 * Get posts by user: GET /api/posts/user/{userId}?page=&pageSize=
 */
export async function getUserPostsApi(userId, page = 1, pageSize = 10) {
  const response = await axios.get(`/posts/user/${userId}`, {
    params: { page, pageSize },
  });

  return response.data;
}

/**
 * Get posts by group: GET /api/posts/group/{groupId}?page=&pageSize=&onlyMine=
 */
export async function getPostsByGroupApi(groupId, page = 1, pageSize = 10, onlyMine = false) {
  const response = await axios.get(`/posts/group/${groupId}`, {
    params: { page, pageSize, onlyMine },
  });

  return response.data;
}

/**
 * Get paginated media from posts in a group:
 * GET /api/posts/group/{groupId}/medias?page=&pageSize=&type=image|video
 */
export async function getPostMediasByGroupApi(groupId, type, page = 1, pageSize = 20) {
  const response = await axios.get(`/posts/group/${groupId}/medias`, {
    params: { page, pageSize, type },
  });

  return response.data;
}

/**
 * Get paginated media from posts by user:
 * GET /api/posts/user/{userId}/medias?page=&pageSize=&type=image|video
 */
export async function getPostMediasByUserApi(userId, type, page = 1, pageSize = 20) {
  const response = await axios.get(`/posts/user/${userId}/medias`, {
    params: { page, pageSize, type },
  });

  return response.data;
}

/**
 * Update a post: PUT /api/posts/{id}
 */
export async function updatePostApi(postId, { content, visibility, locationTag = null, feelingActivity = null }) {
  const response = await axios.put(`/posts/${postId}`, {
    content,
    visibility,
    locationTag,
    feelingActivity,
  });

  return response.data;
}

/**
 * Maps frontend reaction names to backend ReactionType enum values.
 */
const REACTION_TYPE_VALUES = {
  Like: 0,
  Love: 1,
  Haha: 2,
  Wow: 3,
  Sad: 4,
  Angry: 5,
};

function normalizeReactionType(reactionType) {
  if (reactionType === null || reactionType === undefined) {
    return null;
  }

  if (typeof reactionType === "string") {
    return REACTION_TYPE_VALUES[reactionType] ?? reactionType;
  }

  return reactionType;
}

/**
 * React to a post: POST /api/posts/{id}/react
 */
export async function reactToPostApi(postId, reactionType) {
  const response = await axios.post(`/posts/${postId}/react`, {
    reactionType: normalizeReactionType(reactionType),
  });

  return response.data;
}

/**
 * React to a comment: POST /api/posts/comments/{id}/react
 */
export async function reactToCommentApi(commentId, reactionType) {
  const response = await axios.post(`/posts/comments/${commentId}/react`, {
    reactionType: normalizeReactionType(reactionType),
  });

  return response.data;
}

/**
 * Create a comment on a post: POST /api/posts/{postId}/comments
 */
export async function createCommentApi(postId, { content, parentCommentId = null, repliedUserId = null }) {
  const response = await axios.post(`/posts/${postId}/comments`, {
    content,
    parentCommentId,
    repliedUserId,
  });

  return response.data;
}

/**
 * Get comments for a post: GET /api/posts/{postId}/comments?parentCommentId=&page=&pageSize=
 * Omitting parentCommentId returns top-level comments. Passing it returns replies.
 */
export async function getCommentsApi(postId, { parentCommentId = null, page = 1, pageSize = 10 } = {}) {
  const response = await axios.get(`/posts/${postId}/comments`, {
    params: {
      parentCommentId,
      page,
      pageSize,
    },
  });

  return response.data;
}

/**
 * Save a post: POST /api/posts/{id}/save
 */
export async function savePostApi(postId) {
  const response = await axios.post(`/posts/${postId}/save`);
  return response.data;
}

/**
 * Unsave a post: DELETE /api/posts/{id}/save
 */
export async function unsavePostApi(postId) {
  const response = await axios.delete(`/posts/${postId}/save`);
  return response.data;
}

/**
 * Get possible tags: GET /api/posts/tags/search
 */
export async function getPossibleTagsApi(searchQuery = null, groupId = null, page = 1, pageSize = 10) {
  const response = await axios.get(`/posts/tags/search`, {
    params: { searchQuery, groupId, page, pageSize },
  });

  return response.data;
}

/**
 * Trigger feed generation (admin/dev): POST /api/posts/feed/generate
 */
export async function generateFeedApi() {
  const response = await axios.post("/posts/feed/generate");
  return response.data;
}

/**
 * Get paginated feed posts: GET /api/posts/feed/posts?page=..&pageSize=..
 */
export async function getFeedPostsApi(page = 1, pageSize = 20, isRefresh = false) {
  const response = await axios.get("/posts/feed/posts", {
    params: { page, pageSize, isRefresh },
  });

  return response.data;
}

/**
 * Mark feed items as seen: POST /api/posts/feed/seen
 */
export async function markLatestAsSeenApi(feedIds = []) {
  const response = await axios.post("/posts/feed/seen", feedIds);
  return response.data;
}
