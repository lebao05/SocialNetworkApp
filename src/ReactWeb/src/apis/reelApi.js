import axios from "./axios";

export async function getUserReelsApi(userId, page = 1, pageSize = 12) {
  const response = await axios.get(`/reels/user/${userId}`, {
    params: { page, pageSize },
  });
  return response.data;
}

export async function getRecommendedReelsApi({ pageSize = 12, lastReelId = null } = {}) {
  const response = await axios.get("/reels/recommended", {
    params: { pageSize, lastReelId },
  });
  return response.data;
}

export async function getTopReelsApi(pageSize = 6) {
  const response = await axios.get("/reels/top", {
    params: { pageSize },
  });
  return response.data;
}

export async function getRecommendedReelsWithReelApi(targetReelId) {
  const [reelData, listData] = await Promise.all([
    axios.get(`/reels/${targetReelId}`),
    axios.get("/reels/recommended", { params: { pageSize: 30 } }),
  ]);

  const target = reelData.data;
  const list = listData.data.items ?? [];

  return { target, list };
}

export async function getReelByIdApi(reelId) {
  const response = await axios.get(`/reels/${reelId}`);
  return response.data;
}

export async function getReelCommentsApi(reelId, { parentCommentId = null, page = 1, pageSize = 10 } = {}) {
  const response = await axios.get(`/reels/${reelId}/comments`, {
    params: { parentCommentId, page, pageSize },
  });
  return response.data;
}

export async function createReelCommentApi(reelId, { content, parentCommentId = null, repliedUserId = null } = {}) {
  const response = await axios.post(`/reels/${reelId}/comments`, {
    content,
    parentCommentId,
    repliedUserId,
  });
  return response.data;
}

export async function createReelApi({ caption, audioTitle, visibility, videoFile, thumbnailFile }) {
  const formData = new FormData();
  formData.append("Caption", caption ?? "");
  formData.append("AudioTitle", audioTitle ?? "Original audio");
  formData.append("Visibility", visibility ?? 0);
  formData.append("Video", videoFile);
  if (thumbnailFile) {
    formData.append("Thumbnail", thumbnailFile);
  }

  const response = await axios.post("/reels/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function toggleLikeReelApi(reelId) {
  const response = await axios.post(`/reels/${reelId}/like`);
  return response.data;
}

export async function deleteReelApi(reelId) {
  const response = await axios.delete(`/reels/${reelId}`);
  return response.data;
}

export async function recordReelViewApi(reelId) {
  const response = await axios.post(`/reels/${reelId}/view`);
  return response.data;
}
