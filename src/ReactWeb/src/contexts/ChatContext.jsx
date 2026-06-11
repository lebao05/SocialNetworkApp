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
    toggleNotificationsApi,
    leaveConversationApi,
    removeMemberApi,
    assignAdminApi,
    revokeAdminApi,
    kickMemberApi,
} from "../apis/conversationApi";
import {
    getMessagesAroundApi,
    searchMessagesApi,
    getFilesByConversationApi,
    sendMessageApi,
    updateMessageApi,
    revokeMessageApi,
    togglePinMessageApi,
    reactToMessageApi,
    markMessagesAsSeenApi,
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

    // ── Members state (for ChatInfo sidebar) ──
    const [conversationMembers, setConversationMembers] = useState([]);
    const [membersTotalCount, setMembersTotalCount] = useState(0);
    const [membersLoading, setMembersLoading] = useState(false);
    const [membersHasMore, setMembersHasMore] = useState(true);

    // ── Pinned messages state ──
    const [pinnedMessages, setPinnedMessages] = useState([]);
    const [pinnedLoading, setPinnedLoading] = useState(false);

    // ── Files/media state ──
    const [conversationFiles, setConversationFiles] = useState([]);
    const [filesLoading, setFilesLoading] = useState(false);
    const [filesHasMore, setFilesHasMore] = useState(true);
    const [filesPage, setFilesPage] = useState(1);
    const [filesMode, setFilesMode] = useState("media"); // "media" | "files"

    // ── Message search state ──
    const [messageSearchResults, setMessageSearchResults] = useState([]);
    const [messageSearchLoading, setMessageSearchLoading] = useState(false);

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

        const updateMessage = (updatedMessage) => {
            setMessages((prev) =>
                prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
            );
        };

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

        const onUserOnline = (userId) => {
            setOnlineUsers((prev) => {
                const next = new Set(prev);
                next.add(userId);
                return next;
            });
        };

        const onUserOffline = (userId) => {
            setOnlineUsers((prev) => {
                const next = new Set(prev);
                next.delete(userId);
                return next;
            });
        };

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

        const onMessageReactionUpdated = (updatedMessage) => {
            setMessages((prev) =>
                prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
            );
        };

        connection.on("ReceiveMessage", receiveMessage);
        connection.on("MessageUpdated", updateMessage);
        connection.on("MessageReactionUpdated", onMessageReactionUpdated);
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
            connection.off("MessageReactionUpdated", onMessageReactionUpdated);
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
        setConversationMembers([]);
        setMembersTotalCount(0);
        setPinnedMessages([]);
        setConversationFiles([]);
        setFilesPage(1);
        setFilesHasMore(true);
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

    // ── Conversation actions ──

    const toggleNotifications = async (conversationId) => {
        try {
            const newState = await toggleNotificationsApi(conversationId);
            setConversations((prev) =>
                prev.map((c) =>
                    c.id === conversationId ? { ...c, isNotificationOn: newState } : c
                )
            );
            if (selectedConversation?.id === conversationId) {
                setSelectedConversation((prev) => ({ ...prev, isNotificationOn: newState }));
            }
            return newState;
        } catch (err) {
            console.error("Failed to toggle notifications:", err);
            return null;
        }
    };

    const leaveConversation = async (conversationId) => {
        try {
            await leaveConversationApi(conversationId);
            setConversations((prev) => prev.filter((c) => c.id !== conversationId));
            if (selectedConversation?.id === conversationId) {
                setSelectedConversation(null);
            }
        } catch (err) {
            console.error("Failed to leave conversation:", err);
            throw err;
        }
    };

    const removeMember = async (conversationId, userIdToRemove) => {
        try {
            await removeMemberApi(conversationId, userIdToRemove);
            setConversationMembers((prev) => prev.filter((m) => m.userId !== userIdToRemove));
            setMembersTotalCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to remove member:", err);
            throw err;
        }
    };

    const assignAdmin = async (conversationId, targetUserId) => {
        try {
            await assignAdminApi(conversationId, targetUserId);
            setConversationMembers((prev) =>
                prev.map((m) =>
                    m.userId === targetUserId ? { ...m, role: "Admin" } : m
                )
            );
        } catch (err) {
            console.error("Failed to assign admin:", err);
            throw err;
        }
    };

    const revokeAdmin = async (conversationId, targetUserId) => {
        try {
            await revokeAdminApi(conversationId, targetUserId);
            setConversationMembers((prev) =>
                prev.map((m) =>
                    m.userId === targetUserId ? { ...m, role: "Member" } : m
                )
            );
        } catch (err) {
            console.error("Failed to revoke admin:", err);
            throw err;
        }
    };

    const kickMember = async (conversationId, userIdToKick) => {
        try {
            await kickMemberApi(conversationId, userIdToKick);
            setConversationMembers((prev) => prev.filter((m) => m.userId !== userIdToKick));
            setMembersTotalCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to kick member:", err);
            throw err;
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
            const data = await getMessagesAroundApi(selectedConversation.id, null, "up", PAGE_SIZE);
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
            const data = await getMessagesAroundApi(selectedConversation.id, null, "up", PAGE_SIZE);
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

    const searchMessagesInConversation = async (query, pageNumber = 1, pageSize = 20) => {
        if (!selectedConversation || !query?.trim()) return;
        setMessageSearchLoading(true);
        try {
            const data = await searchMessagesApi(selectedConversation.id, query, pageNumber, pageSize);
            return data;
        } catch (err) {
            console.error("Failed to search messages:", err);
            return [];
        } finally {
            setMessageSearchLoading(false);
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
            const updated = await reactToMessageApi(messageId, reactionType);
            setMessages((prev) =>
                prev.map((m) => m.id === messageId ? { ...m, reactions: updated.reactions } : m)
            );
        } catch (err) {
            console.error("Failed to react to message:", err);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // MEMBERS, PINNED MESSAGES, FILES (for ChatInfo sidebar)
    // ─────────────────────────────────────────────────────────────────────────

    const loadConversationMembers = async (reset = true) => {
        if (!selectedConversation || !selectedConversation.id || selectedConversation.isVirtual) return;
        if (reset) {
            setConversationMembers([]);
            setMembersTotalCount(0);
            setMembersHasMore(true);
        }
        const nextPage = reset ? 1 : Math.floor(conversationMembers.length / 20) + 1;
        setMembersLoading(true);
        try {
            const data = await getConversationMembersApi(selectedConversation.id, nextPage, 20);
            const results = data?.results ?? data ?? [];
            const total = data?.totalCount ?? 0;
            setConversationMembers((prev) => reset ? results : [...prev, ...results]);
            setMembersTotalCount(total);
            setMembersHasMore(results.length === 20);
        } catch (err) {
            console.error("Failed to load members:", err);
        } finally {
            setMembersLoading(false);
        }
    };

    const loadPinnedMessages = async () => {
        if (!selectedConversation || !selectedConversation.id || selectedConversation.isVirtual) return;
        setPinnedLoading(true);
        try {
            const data = await getMessagesAroundApi(selectedConversation.id, null, "around", 100);
            const pinned = (data ?? []).filter((m) => m.isPinned);
            setPinnedMessages(pinned);
        } catch (err) {
            console.error("Failed to load pinned messages:", err);
        } finally {
            setPinnedLoading(false);
        }
    };

    const loadConversationFiles = async (reset = true, mode = filesMode) => {
        if (!selectedConversation || !selectedConversation.id || selectedConversation.isVirtual) return;
        if (reset) {
            setConversationFiles([]);
            setFilesPage(1);
            setFilesHasMore(true);
            setFilesMode(mode);
        }
        setFilesLoading(true);
        try {
            const data = await getFilesByConversationApi(selectedConversation.id, mode === "media", filesPage, 20);
            const results = data ?? [];
            setConversationFiles((prev) => reset ? results : [...prev, ...results]);
            setFilesHasMore(results.length === 20);
        } catch (err) {
            console.error("Failed to load files:", err);
        } finally {
            setFilesLoading(false);
        }
    };

    const loadMoreFiles = async () => {
        if (filesLoading || !filesHasMore) return;
        setFilesPage((prev) => prev + 1);
        await loadConversationFiles(false, filesMode);
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

        // Conversation actions
        toggleNotifications,
        leaveConversation,
        removeMember,
        assignAdmin,
        revokeAdmin,
        kickMember,

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
        searchMessagesInConversation,
        messageSearchResults,
        messageSearchLoading,

        // Members (for ChatInfo)
        conversationMembers,
        membersTotalCount,
        membersLoading,
        membersHasMore,
        loadConversationMembers,

        // Pinned messages
        pinnedMessages,
        pinnedLoading,
        loadPinnedMessages,

        // Files/media
        conversationFiles,
        filesLoading,
        filesHasMore,
        loadConversationFiles,
        loadMoreFiles,

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
        createGroup,
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
