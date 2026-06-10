import axios from "./axios";

/**
 * Send a message (text + optional files)
 */
export async function sendMessageApi({ conversationId, content, files = [] }) {
    const form = new FormData();
    form.append("conversationId", String(conversationId));
    if (content != null) form.append("content", content);
    files.forEach((file) => {
        if (file instanceof File) {
            form.append("files", file);
        }
    });

    const response = await axios.post("/messages", form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
}

/**
 * Get messages with pagination
 */
export async function getMessagesApi(conversationId, pageNumber = 1, pageSize = 20) {
    const response = await axios.get("/messages", {
        params: { conversationId, pageNumber, pageSize },
    });
    return response.data;
}

/**
 * Update (edit) a message
 */
export async function updateMessageApi(messageId, content) {
    const response = await axios.put(`/messages/${messageId}`, { content });
    return response.data;
}

/**
 * Revoke (delete) a message
 */
export async function revokeMessageApi(messageId) {
    await axios.delete(`/messages/${messageId}/revoke`);
}

/**
 * Toggle message pin
 */
export async function togglePinMessageApi(messageId) {
    const response = await axios.patch(`/messages/${messageId}/pin`);
    return response.data;
}

/**
 * React to a message
 */
export async function reactToMessageApi(messageId, reactionType) {
    const response = await axios.post(`/messages/${messageId}/react`, { reactionType });
    return response.data;
}

/**
 * Mark messages as seen
 */
export async function markMessagesAsSeenApi(conversationId, lastReadMessageId) {
    await axios.post(`/messages/${conversationId}/mark-seen`, { lastReadMessageId });
}
