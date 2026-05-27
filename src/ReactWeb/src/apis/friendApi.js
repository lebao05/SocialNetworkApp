import axios from "./axios";

/**
 * Sends a friend request to another user.
 * Maps to POST /api/friend/friend-request.
 */
export async function sendFriendRequestApi(receiverId) {
    const response = await axios.post("/friend/friend-request", { receiverId });
    return response.data;
}

/**
 * Accepts an incoming friend request.
 * Maps to POST /api/friend/accept.
 */
export async function acceptFriendRequestApi(requestId) {
    const response = await axios.post("/friend/accept", { requestId });
    return response.data;
}

/**
 * Fetches the current user's friends list.
 * Maps to GET /api/friend.
 */
export async function getFriendsApi(page = 1) {
    const response = await axios.get("/friend", {
        params: { page },
    });
    return response.data;
}

/**
 * Fetches incoming friend requests for the current user.
 * Maps to GET /api/friend/requests/incoming.
 */
export async function getIncomingFriendRequestsApi(page = 1) {
    const response = await axios.get("/friend/requests/incoming", {
        params: { page },
    });
    return response.data;
}

/**
 * Fetches friend recommendations for the current user.
 * Maps to GET /api/friend/recommendations.
 */
export async function getFriendRecommendationsApi(limit = 10) {
    const response = await axios.get("/friend/recommendations", {
        params: { limit },
    });
    return response.data;
}

/**
 * Fetches mutual friends between the current user and another user.
 * Maps to GET /api/friend/mutual/{otherUserId}.
 */
export async function getMutualFriendsApi(otherUserId) {
    const response = await axios.get(`/friend/mutual/${otherUserId}`);
    return response.data;
}

/**
 * Fetches the shortest friend connection path to another user.
 * Maps to GET /api/friend/shortest-path/{otherUserId}.
 */
export async function getShortestPathApi(otherUserId) {
    const response = await axios.get(`/friend/shortest-path/${otherUserId}`);
    return response.data;
}

/**
 * Triggers a sync of all friends from the server.
 * Maps to POST /api/friend/sync-all.
 */
export async function syncAllFriendsApi() {
    const response = await axios.post("/friend/sync-all");
    return response.data;
}
