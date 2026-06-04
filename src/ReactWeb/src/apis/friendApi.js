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
 * Fetches the current user's followees (people they follow).
 * Maps to GET /api/friend/followees.
 * Returns: { id, fullName, avatarUrl, mutualFriendsCount, isFriend }[]
 */
export async function getFolloweesApi() {
    const response = await axios.get("/friend/followees");
    return response.data;
}

/**
 * Fetches a given user's friends, optionally filtered by a search term.
 * Maps to GET /api/friend/{userId}/friends?searchTerm=...
 * Returns: { id, userName, fullName, avatarUrl, mutualFriendsCount }[]
 */
export async function getProfileFriendsApi(userId, searchTerm = null) {
    const response = await axios.get(`/friend/${userId}/friends`, {
        params: { searchTerm: searchTerm || undefined },
    });
    return response.data;
}
