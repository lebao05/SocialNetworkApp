import axios from "./axios";

/**
 * Create a new conversation (1:1 or group)
 * @param {{ participantIds: string[], name: string|null }} data
 */
export async function createConversationApi({ participantIds, name }) {
    const response = await axios.post("/conversation", {
        participantIds,
        name
    });
    return response.data;
}

/**
 * Get paginated conversations
 */
export async function getConversationsApi(pageNumber = 1, pageSize = 20) {
    const response = await axios.get("/conversation", {
        params: { pageNumber, pageSize }
    });
    return response.data;
}

/**
 * Get conversation detail by id
 */
export async function getConversationDetailApi(conversationId) {
    const response = await axios.get(`/conversation/${conversationId}`);
    return response.data;
}

/**
 * Get conversation detail by target user id (returns virtual placeholder if no chat exists)
 */
export async function getConversationByUserIdApi(targetUserId) {
    const response = await axios.get(`/conversation/user/${targetUserId}`);
    return response.data;
}

/**
 * Search conversations and friends
 */
export async function searchConversationsApi(searchTerm, pageNumber = 1, pageSize = 10) {
    const response = await axios.get("/conversation/search", {
        params: { searchTerm, pageNumber, pageSize }
    });
    return response.data;
}

/**
 * Get paginated members of a conversation
 */
export async function getConversationMembersApi(conversationId, pageNumber = 1, pageSize = 20) {
    const response = await axios.get(`/conversation/${conversationId}/members`, {
        params: { pageNumber, pageSize }
    });
    return response.data;
}

/**
 * Toggle notifications (mute/unmute) for a conversation
 */
export async function toggleNotificationsApi(conversationId) {
    const response = await axios.patch(`/conversation/${conversationId}/notifications`);
    return response.data;
}

/**
 * Remove a member from a group conversation (admin only)
 */
export async function removeMemberApi(conversationId, userIdToRemove) {
    await axios.delete(`/conversation/${conversationId}/members/${userIdToRemove}`);
}

/**
 * Leave a group conversation
 */
export async function leaveConversationApi(conversationId) {
    await axios.delete(`/conversation/${conversationId}/leave`);
}

/**
 * Assign admin role to a member (owner only)
 */
export async function assignAdminApi(conversationId, targetUserId) {
    await axios.patch(`/conversation/${conversationId}/members/${targetUserId}/assign-admin`);
}

/**
 * Revoke admin role from a member (owner only)
 */
export async function revokeAdminApi(conversationId, targetUserId) {
    await axios.patch(`/conversation/${conversationId}/members/${targetUserId}/revoke-admin`);
}

/**
 * Kick a member from a group conversation (admin/owner only)
 */
export async function kickMemberApi(conversationId, userIdToKick) {
    await axios.delete(`/conversation/${conversationId}/kick/${userIdToKick}`);
}

/**
 * Add a member to a group conversation (admin/owner only)
 * Returns ConversationMemberDto on success
 */
export async function addMemberApi(conversationId, userIdToAdd) {
    const response = await axios.post(`/conversation/${conversationId}/members`, {
        userIdToAdd
    });
    return response.data;
}
