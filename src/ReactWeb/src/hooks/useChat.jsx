import { useEffect, useState, useCallback } from "react";
import { useSignalR } from "../contexts/signalRContext";
import {
    getMessagesApi,
    sendMessageApi,
    updateMessageApi
} from "../apis/messageApi";

export const useChat = (conversationId) => {
    const { connection, isConnected } = useSignalR();
    const [messages, setMessages] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 20;
    const [hasMore, setHasMore] = useState(true);

    /* ===========================
       LOAD INITIAL MESSAGES
       =========================== */
    const loadMessages = useCallback(async () => {
        if (!conversationId) return;

        try {
            const data = await getMessagesApi(conversationId, pageNumber, pageSize);

            if (data.length < pageSize) {
                setHasMore(false);
            }

            // prepend older messages
            setMessages((prev) => [...data, ...prev]);
        } catch (err) {
            console.error("Load messages failed:", err);
        }
    }, [conversationId, pageNumber]);

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    /* ===========================
       SIGNALR LISTENERS
       =========================== */
    useEffect(() => {
        if (!connection || !conversationId) return;

        // ✅ Receive new message
        const receiveMessage = (message) => {
            if (message.conversationId !== conversationId) return;

            setMessages((prev) => [...prev, message]);
        };

        // ✅ Receive updated message
        const updateMessage = (updatedMessage) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === updatedMessage.id ? updatedMessage : msg
                )
            );
        };

        connection.on("ReceiveMessage", receiveMessage);
        connection.on("MessageUpdated", updateMessage);

        return () => {
            connection.off("ReceiveMessage", receiveMessage);
            connection.off("MessageUpdated", updateMessage);
        };
    }, [connection, conversationId]);

    /* ===========================
       SEND MESSAGE (API, not hub)
       =========================== */
    const sendMessage = async (content) => {
        try {
            const newMessage = await sendMessageApi({
                conversationId,
                content
            });

            // optional optimistic update (SignalR will also push it)
            setMessages((prev) => [...prev, newMessage]);

            return newMessage;
        } catch (err) {
            console.error("Send message failed:", err);
        }
    };

    /* ===========================
       UPDATE MESSAGE
       =========================== */
    const updateMessageContent = async (messageId, content) => {
        try {
            const updated = await updateMessageApi(messageId, content);

            // optimistic update
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === messageId ? updated : msg
                )
            );

            return updated;
        } catch (err) {
            console.error("Update message failed:", err);
        }
    };

    /* ===========================
       LOAD MORE (pagination)
       =========================== */
    const loadMore = () => {
        if (!hasMore) return;
        setPageNumber((prev) => prev + 1);
    };

    return {
        messages,
        sendMessage,
        updateMessage: updateMessageContent,
        loadMore,
        hasMore,
        isConnected
    };
};