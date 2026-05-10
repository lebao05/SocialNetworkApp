import axios from "./axios";

/**
 * Send a message
 */
export async function sendMessageApi({ conversationId, content }) {
    const response = await axios.post("/messages", {
        conversationId,
        content
    });

    return response.data;
}

/**
 * Get messages with pagination
 */
export async function getMessagesApi(
    conversationId,
    pageNumber = 1,
    pageSize = 20
) {
    const response = await axios.get("/messages", {
        params: {
            conversationId,
            pageNumber,
            pageSize
        }
    });

    return response.data;
}

/**
 * Update (edit) a message
 */
export async function updateMessageApi(messageId, content) {
    const response = await axios.put(`/messages/${messageId}`, {
        content
    });

    return response.data;
}