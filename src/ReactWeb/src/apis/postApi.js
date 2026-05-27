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
 * Get posts by group: GET /api/posts/group/{groupId}?page=&pageSize=
 */
export async function getPostsByGroupApi(groupId, page = 1, pageSize = 10) {
  const response = await axios.get(`/posts/group/${groupId}`, {
    params: { page, pageSize },
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
