"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useAuth } from "./authContext";
import {
    getConversationsApi,
    getConversationDetailApi,
    getConversationByUserIdApi,
    getConversationMembersApi,
    searchConversationsApi,
    createConversationApi,
    toggleNotificationsApi
} from "../apis/conversationApi";
import {
    getMessagesApi,
    sendMessageApi,
    updateMessageApi,
    revokeMessageApi,
    togglePinMessageApi,
    reactToMessageApi,
    markMessagesAsSeenApi
} from "../apis/messageApi";
import { getFriendsApi } from "../apis/friendApi";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
    const { token, user } = useAuth();

    // ── SignalR state ──
    const [connection, setConnection] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    // ── Conversation state ──
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [conversationsLoading, setConversationsLoading] = useState(false);

    const convsRef = useRef(conversations);
    useEffect(() => { convsRef.current = conversations; }, [conversations]);

    // ── Messages state ──
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const PAGE_SIZE = 20;

    // ── Search state ──
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // ── Typing state ──
    const [typingUsers, setTypingUsers] = useState({});
    const typingTimerRef = useRef({});

    // ── Online presence state ──
    const [onlineUsers, setOnlineUsers] = useState(new Set());

    // ── Friends state (for group creation) ──
    const [friends, setFriends] = useState([]);
    const [friendsLoading, setFriendsLoading] = useState(false);

    // ─────────────────────────────────────────────────────────────────────────
    // SIGNALR SETUP
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!token) {
            if (connection) {
                connection.stop();
                setConnection(null);
                setIsConnected(false);
            }
            return;
        }

        const HUB_URL = import.meta.env.VITE_API_HUB_BASE_URL;
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${HUB_URL}/hubs/chat`, {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        const startConnection = async () => {
            try {
                await newConnection.start();
                setIsConnected(true);
                setConnection(newConnection);

                // Conversations loaded via HTTP (groups auto-joined on hub OnConnected)
                try {
                    const data = await getConversationsApi();
                    setConversations(data ?? []);
                } catch (err) {
                    console.error("Failed to load conversations:", err);
                }
            } catch (err) {
                console.error("SignalR Connection Error:", err);
                setTimeout(startConnection, 5000);
            }
        };

        startConnection();

        return () => {
            newConnection.stop();
        };
    }, [token]);

    // ─────────────────────────────────────────────────────────────────────────
    // SIGNALR EVENT LISTENERS
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!connection) return;

        // Receive a new message
        const receiveMessage = async (message) => {
            const convId = message.conversationId;

            setMessages((prev) => {
                if (prev.some((m) => m.id === message.id)) return prev;
                return [...prev, message];
            });

            setConversations((prev) => {
                const idx = prev.findIndex((c) => c.id === convId);

                if (idx === -1) {
                    getConversationDetailApi(convId)
                        .then((detail) => {
                            const newConv = {
                                ...detail,
                                lastMessageContent: message.content,
                                lastMessageAt: message.createdAt,
                                unreadCount: 0,
                            };
                            setConversations((curr) => {
                                if (curr.some((c) => c.id === convId)) return curr;
                                return [newConv, ...curr];
                            });
                        })
                        .catch(() => { });
                    return prev;
                }

                const conv = prev[idx];
                const isCurrentUser = message.senderId === user?.id;
                const lastReadId = conv.lastReadMessageId ?? 0;
                const isUnread = !isCurrentUser && message.id > lastReadId;
                const updatedUnread = isUnread ? (conv.unreadCount ?? 0) + 1 : conv.unreadCount;

                const updatedConv = {
                    ...conv,
                    lastMessageContent: message.content,
                    lastMessageAt: message.createdAt,
                    unreadCount: updatedUnread,
                };

                if (idx === 0) return prev.map((c) => c.id === convId ? updatedConv : c);

                const result = [...prev];
                result.splice(idx, 1);
                return [updatedConv, ...result];
            });
        };

        // Message was edited
        const updateMessage = (updatedMessage) => {
            setMessages((prev) =>
                prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
            );
        };

        // User started typing — payload is { userId, conversationId }
        const onTyping = ({ userId, conversationId }) => {
            if (userId === user?.id?.toString()) return;
            const convId = selectedConversation?.id?.toString();
            if (!convId || convId !== conversationId?.toString()) return;

            setTypingUsers((prev) => {
                const conv = prev[convId] ?? new Set();
                const next = new Set(conv);
                next.add(userId);
                return { ...prev, [convId]: next };
            });

            clearTimeout(typingTimerRef.current[convId]);
            typingTimerRef.current[convId] = setTimeout(() => {
                setTypingUsers((prev) => {
                    const conv = prev[convId];
                    if (!conv) return prev;
                    const next = new Set(conv);
                    next.delete(userId);
                    return { ...prev, [convId]: next };
                });
            }, 4000);
        };

        // User online
        const onUserOnline = (userId) => {
            setOnlineUsers((prev) => {
                const next = new Set(prev);
                next.add(userId);
                return next;
            });
        };

        // User offline
        const onUserOffline = (userId) => {
            setOnlineUsers((prev) => {
                const next = new Set(prev);
                next.delete(userId);
                return next;
            });
        };

        // Other user's messages were marked as seen
        const onMessagesSeen = ({ conversationId, userId: seenByUserId, lastReadMessageId }) => {
            if (seenByUserId === user?.id?.toString()) return;
            setConversations((prev) =>
                prev.map((c) =>
                    c.id === conversationId
                        ? { ...c, unreadCount: 0, lastReadMessageId }
                        : c
                )
            );
        };

        connection.on("ReceiveMessage", receiveMessage);
        connection.on("MessageUpdated", updateMessage);
        connection.on("UserTyping", onTyping);
        connection.on("UserUntyping", ({ userId, conversationId }) => {
            if (userId === user?.id?.toString()) return;
            const convId = selectedConversation?.id?.toString();
            if (!convId || convId !== conversationId?.toString()) return;
            clearTimeout(typingTimerRef.current[convId]);
            setTypingUsers((prev) => {
                const conv = prev[convId];
                if (!conv) return prev;
                const next = new Set(conv);
                next.delete(userId);
                return { ...prev, [convId]: next };
            });
        });
        connection.on("UserOnline", onUserOnline);
        connection.on("UserOffline", onUserOffline);
        connection.on("MessagesSeen", onMessagesSeen);

        return () => {
            connection.off("ReceiveMessage", receiveMessage);
            connection.off("MessageUpdated", updateMessage);
            connection.off("UserTyping", onTyping);
            connection.off("UserUntyping");
            connection.off("UserOnline", onUserOnline);
            connection.off("UserOffline", onUserOffline);
            connection.off("MessagesSeen", onMessagesSeen);
        };
    }, [connection, user, selectedConversation]);

    // ─────────────────────────────────────────────────────────────────────────
    // CONVERSATION METHODS
    // ─────────────────────────────────────────────────────────────────────────

    const fetchConversations = async (page = 1, pageSize = 20) => {
        setConversationsLoading(true);
        try {
            const data = await getConversationsApi(page, pageSize);
            setConversations(data);
        } catch (err) {
            console.error("Failed to fetch conversations:", err);
        } finally {
            setConversationsLoading(false);
        }
    };

    const selectConversation = async (idOrUserId, byUserId = false) => {
        setConversationsLoading(true);
        setMessages([]);
        setPageNumber(1);
        setHasMoreMessages(true);
        try {
            const detail = byUserId
                ? await getConversationByUserIdApi(idOrUserId)
                : await getConversationDetailApi(idOrUserId);

            let enriched = detail;
            if (detail.id && !detail.isVirtual) {
                try {
                    const membersData = await getConversationMembersApi(detail.id, 1, 1);
                    enriched = {
                        ...detail,
                        memberCount: membersData.totalCount ?? 0
                    };
                } catch {
                    enriched = { ...detail, memberCount: 0 };
                }
            }

            setSelectedConversation(enriched);
        } catch (err) {
            console.error("Failed to select conversation:", err);
        } finally {
            setConversationsLoading(false);
        }
    };

    const startConversation = async (participantId) => {
        setConversationsLoading(true);
        try {
            const conv = await createConversationApi({
                participantIds: [participantId],
                name: null
            });
            await fetchConversations();
            const enriched = { ...conv, memberCount: 2 };
            setSelectedConversation(enriched);
            return enriched;
        } catch (err) {
            console.error("Failed to start conversation:", err);
            return null;
        } finally {
            setConversationsLoading(false);
        }
    };

    const performSearch = async (term) => {
        if (!term?.trim()) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const data = await searchConversationsApi(term);
            setSearchResults(data.results ?? data ?? []);
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setIsSearching(false);
        }
    };

    const fetchFriends = async (searchTerm = null) => {
        setFriendsLoading(true);
        try {
            const data = await getFriendsApi(1, searchTerm);
            setFriends(data.results ?? data ?? []);
        } catch (err) {
            console.error("Failed to fetch friends:", err);
        } finally {
            setFriendsLoading(false);
        }
    };

    const createGroup = async (participantIds, groupName) => {
        setConversationsLoading(true);
        try {
            const conv = await createConversationApi({
                participantIds,
                name: groupName
            });
            await fetchConversations();
            setSelectedConversation({ ...conv, isVirtual: false, memberCount: participantIds.length });
            return conv;
        } catch (err) {
            console.error("Failed to create group:", err);
            return null;
        } finally {
            setConversationsLoading(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // MESSAGE METHODS
    // ─────────────────────────────────────────────────────────────────────────

    const loadMessages = async (reset = true) => {
        if (!selectedConversation || selectedConversation.isVirtual) return;
        if (reset) {
            setMessages([]);
            setPageNumber(1);
            setHasMoreMessages(true);
        }
        setMessagesLoading(true);
        try {
            const data = await getMessagesApi(selectedConversation.id, 1, PAGE_SIZE);
            setMessages(data ?? []);
            setHasMoreMessages((data ?? []).length === PAGE_SIZE);
        } catch (err) {
            console.error("Failed to load messages:", err);
        } finally {
            setMessagesLoading(false);
        }
    };

    const loadMoreMessages = async () => {
        if (!selectedConversation || messagesLoading || !hasMoreMessages) return;
        const nextPage = pageNumber + 1;
        setMessagesLoading(true);
        try {
            const data = await getMessagesApi(selectedConversation.id, nextPage, PAGE_SIZE);
            if (!data?.length) {
                setHasMoreMessages(false);
            } else {
                setMessages((prev) => [...data, ...prev]);
                setPageNumber(nextPage);
                if (data.length < PAGE_SIZE) setHasMoreMessages(false);
            }
        } catch (err) {
            console.error("Failed to load more messages:", err);
        } finally {
            setMessagesLoading(false);
        }
    };

    const sendMessage = async (content) => {
        if (!selectedConversation || !content?.trim()) return null;

        let targetConv = selectedConversation;
        if (selectedConversation.isVirtual) {
            const newConv = await startConversation(selectedConversation.otherUserId);
            if (!newConv) return null;
            targetConv = newConv;
        }

        try {
            const newMessage = await sendMessageApi({
                conversationId: targetConv.id,
                content
            });
            setMessages((prev) => [...prev, newMessage]);
            return newMessage;
        } catch (err) {
            console.error("Failed to send message:", err);
            return null;
        }
    };

    const updateMessage = async (messageId, content) => {
        try {
            const updated = await updateMessageApi(messageId, content);
            setMessages((prev) =>
                prev.map((msg) => (msg.id === messageId ? updated : msg))
            );
            return updated;
        } catch (err) {
            console.error("Failed to update message:", err);
            return null;
        }
    };

    const revokeMessage = async (messageId) => {
        try {
            await revokeMessageApi(messageId);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === messageId ? { ...msg, content: "This message was revoked." } : msg
                )
            );
        } catch (err) {
            console.error("Failed to revoke message:", err);
        }
    };

    const togglePin = async (messageId) => {
        try {
            const newState = await togglePinMessageApi(messageId);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === messageId ? { ...msg, isPinned: newState } : msg
                )
            );
            return newState;
        } catch (err) {
            console.error("Failed to toggle pin:", err);
            return null;
        }
    };

    const reactToMessage = async (messageId, reactionType) => {
        try {
            await reactToMessageApi(messageId, reactionType);
        } catch (err) {
            console.error("Failed to react to message:", err);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // TYPING INDICATORS (via hub)
    // ─────────────────────────────────────────────────────────────────────────

    const startTyping = async () => {
        if (!connection || !selectedConversation || selectedConversation.isVirtual) return;
        try {
            await connection.invoke("Typing", selectedConversation.id.toString());
        } catch (_) { /* non-critical */ }
    };

    const endTyping = async () => {
        if (!connection || !selectedConversation || selectedConversation.isVirtual) return;
        try {
            await connection.invoke("Untyping", selectedConversation.id.toString());
        } catch (_) { /* non-critical */ }
    };

    const markAsSeen = async () => {
        if (!selectedConversation || selectedConversation.isVirtual) return;
        const lastMsg = messages[messages.length - 1];
        if (!lastMsg) return;
        try {
            await markMessagesAsSeenApi(selectedConversation.id, lastMsg.id);
            setConversations((prev) =>
                prev.map((c) =>
                    c.id === selectedConversation.id
                        ? { ...c, unreadCount: 0, lastReadMessageId: lastMsg.id }
                        : c
                )
            );
        } catch (err) {
            console.error("Failed to mark messages as seen:", err);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // VALUE
    // ─────────────────────────────────────────────────────────────────────────

    const value = {
        // SignalR
        connection,
        isConnected,

        // Conversations
        conversations,
        selectedConversation,
        conversationsLoading,
        fetchConversations,
        selectConversation,
        startConversation,
        setSelectedConversation,

        // Messages
        messages,
        messagesLoading,
        hasMoreMessages,
        loadMessages,
        loadMoreMessages,
        sendMessage,
        updateMessage,
        revokeMessage,
        togglePin,
        reactToMessage,
        markAsSeen,

        // Typing
        typingUsers: (typingUsers[selectedConversation?.id] ?? new Set()),
        startTyping,
        endTyping,

        // Presence
        onlineUsers,
        isOnline: (userId) => onlineUsers.has(userId),

        // Search
        searchResults,
        isSearching,
        performSearch,

        // Friends (for group creation)
        friends,
        friendsLoading,
        fetchFriends,
        createGroup
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
}
