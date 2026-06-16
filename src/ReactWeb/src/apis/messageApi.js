import axios from "./axios";

/**
 * Send a message (text + optional files)
 */
export async function sendMessageApi({ conversationId, content, files = [], replyToMessageId = null }) {
    const form = new FormData();
    form.append("conversationId", String(conversationId));
    if (content != null) form.append("content", content);
    if (replyToMessageId != null) form.append("replyToMessageId", String(replyToMessageId));
    files.forEach((file) => {
        if (file instanceof File || file instanceof Blob) {
            const fileName = file.name || "voice_message.webm";
            form.append("files", file, fileName);
        }
    });

    const response = await axios.post("/messages", form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
}

/**
 * Search messages within a conversation.
 */
export async function searchMessagesApi(conversationId, query, pageNumber = 1, pageSize = 20) {
    const response = await axios.get("/messages/search", {
        params: { conversationId, query, pageNumber, pageSize },
    });
    return response.data;
}

/**
 * Get messages around an anchor message.
 * @param {long} conversationId
 * @param {long|null} anchorMessageId - anchor message id (null for initial load)
 * @param {"up"|"down"|"around"} [direction="down"] - "up" = older, "down" = newer, "around" = both sides
 * @param {number} [size=20] - number of messages per side (around = this many each side)
 * @returns {Promise<{messages: Array, hasMoreUp: boolean, hasMoreDown: boolean}>}
 */
export async function getMessagesAroundApi(conversationId, anchorMessageId = null, direction = "down", size = 20) {
    const response = await axios.get("/messages/around", {
        params: {
            conversationId,
            anchorMessageId: anchorMessageId ?? undefined,
            direction,
            size,
        },
    });
    return response.data;
}

/**
 * Get files (media or all) from a conversation.
 * @param {long} conversationId
 * @param {boolean} [isMedia=true] - true = media files only, false = all files
 */
export async function getFilesByConversationApi(conversationId, isMedia = true, pageNumber = 1, pageSize = 20) {
    const response = await axios.get(`/messages/${conversationId}/files`, {
        params: { isMedia, pageNumber, pageSize },
    });
    return response.data;
}

/**
 * Get pinned messages in a conversation.
 * @param {long} conversationId
 * @param {number} [pageNumber=1]
 * @param {number} [pageSize=20]
 * @returns {Promise<Array>} array of pinned message DTOs
 */
export async function getPinnedMessagesApi(conversationId, pageNumber = 1, pageSize = 100) {
    const response = await axios.get(`/messages/${conversationId}/pinned`, {
        params: { pageNumber, pageSize },
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
