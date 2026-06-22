import axios from "./axios";

export async function getStoryTimelineApi(page = 1, pageSize = 10) {
  const response = await axios.get("/stories/timeline", {
    params: { page, pageSize },
  });

  return response.data;
}

export async function getProfileStoriesApi(userId) {
  const response = await axios.get(`/stories/user/${userId}`);
  return response.data;
}

export async function createStoryApi(payload) {
  const response = await axios.post("/stories/create", payload);
  return response.data;
}

export async function markStoryAsSeenApi(storyId) {
  const response = await axios.post(`/stories/${storyId}/seen`);
  return response.data;
}

export async function toggleStoryLikeApi(storyId) {
  const response = await axios.post(`/stories/${storyId}/like`);
  return response.data;
}

export async function uploadStoryMediaApi(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post("/stories/upload-media", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}
