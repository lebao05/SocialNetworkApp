import axios from "./axios";

/**
 * Sends a friend request to another user.
 * Maps to POST /api/friend/friend-request.
 */
export async function sendFriendRequestApi(receiverId) {
    const response = await axios.post(`/friend/friend-request/${receiverId}` );
    return response.data;
}

/**
 * Accepts an incoming friend request.
 * Maps to POST /api/friend/accept.
 */
export async function acceptFriendRequestApi(requestId) {
    const response = await axios.post(`/friend/accept?requestId=${requestId}`);
    return response.data;
}

/**
 * Rejects (declines) an incoming friend request.
 * Maps to POST /api/friend/reject.
 */
export async function rejectFriendRequestApi(requestId) {
    const response = await axios.post(`/friend/reject?requestId=${requestId}`);
    return response.data;
}

/**
 * Cancels an outgoing friend request.
 * Maps to DELETE /api/friend/cancel-request/{receiverId}.
 */
export async function cancelFriendRequestApi(receiverId) {
    const response = await axios.delete(`/friend/cancel-request/${receiverId}`);
    return response.data;
}

/**
 * Fetches a user's friends list (defaults to current user if userId is not provided).
 * Maps to GET /api/friend.
 */
export async function getFriendsApi(page = 1, searchTerm = null, userId = null) {
    const response = await axios.get("/friend", {
        params: {
            page,
            searchTerm: searchTerm || undefined,
            userId: userId || undefined,
        },
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
 * Fetches a user's followees (people they follow).
 * Defaults to current user if userId is not provided.
 * Maps to GET /api/friend/followees.
 * Returns: { id, fullName, avatarUrl, mutualFriendsCount, isFriend }[]
 */
export async function getFolloweesApi(userId = null) {
    const response = await axios.get("/friend/followees", {
        params: { userId: userId || undefined },
    });
    return response.data;
}

/**
 * Follows a user.
 * Maps to POST /api/users/follow/{userId}.
 */
export async function followUserApi(userId) {
    const response = await axios.post(`/users/follow/${userId}`);
    return response.data;
}

/**
 * Unfollows a user.
 * Maps to POST /api/users/unfollow/{userId}.
 */
export async function unfollowUserApi(userId) {
    const response = await axios.post(`/users/unfollow/${userId}`);
    return response.data;
}

/**
 * Removes a friendship (unfriends a user).
 * Maps to DELETE /api/friend/{friendUserId}.
 */
export async function unfriendApi(friendUserId) {
    const response = await axios.delete(`/friend/${friendUserId}`);
    return response.data;
}
