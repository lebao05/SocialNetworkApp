import axios from "./axios";

export async function getUserReelsApi(userId, page = 1, pageSize = 12) {
  const response = await axios.get(`/reels/user/${userId}`, {
    params: { page, pageSize },
  });

  return response.data;
}
