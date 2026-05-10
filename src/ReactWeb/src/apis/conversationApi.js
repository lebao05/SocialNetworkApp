import axios from "./axios";

/**
 * Create a new conversation
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
        params: {
            pageNumber,
            pageSize
        }
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
 * Toggle notifications for a conversation
 */
export async function toggleNotificationsApi(conversationId) {
    const response = await axios.patch(
        `/conversation/${conversationId}/notifications`
    );

    return response.data; // boolean
}

/**
 * Search conversations and potential friends
 */
export async function searchConversationsApi(searchTerm, pageNumber = 1, pageSize = 10) {
    const response = await axios.get("/conversation/search", {
        params: {
            searchTerm,
            pageNumber,
            pageSize
        }
    });
    return response.data;
}

/**
 * Get conversation detail by target user id (handles placeholder if no chat exists)
 */
export async function getConversationByUserIdApi(targetUserId) {
    const response = await axios.get(`/conversation/user/${targetUserId}`);
    return response.data;
}