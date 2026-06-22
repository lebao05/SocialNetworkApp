"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import axios from "../apis/axios";
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
    addMemberApi,
    updateConversationApi,
    uploadConversationImageApi,
} from "../apis/conversationApi";
import {
    getMessagesAroundApi,
    getPinnedMessagesApi,
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
import { playNotificationSound } from "../utils/notificationSound";

const ChatContext = createContext(null);

// ──────────────────────────────────────────────────────────────────────────────
// Inner component that builds the ChatContext value (has access to connection)
// ──────────────────────────────────────────────────────────────────────────────
function ChatContextInner({ children }) {
    const { token, user } = useAuth();

    // ── SignalR state ──
    const [connection, setConnection] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    // ── Conversation state ──
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [conversationsLoading, setConversationsLoading] = useState(false);
    const [conversationFilter, setConversationFilter] = useState("all"); // "all" | "groups" | "unread"

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

    const selectedConversationRef = useRef(selectedConversation);
    useEffect(() => { selectedConversationRef.current = selectedConversation; }, [selectedConversation]);

    // ── Messages state ──
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [messagesLoadingDirection, setMessagesLoadingDirection] = useState(null); // "up" | "down" | null
    const [hasMoreUp, setHasMoreUp] = useState(true);
    const [hasMoreDown, setHasMoreDown] = useState(false); // false = at the bottom (newest loaded)
    const [pendingNewMessageCount, setPendingNewMessageCount] = useState(0);
    const [atBottom, setAtBottom] = useState(true); // tracked by MessengerFull scroll listener
    const [highlightedMessageId, setHighlightedMessageId] = useState(null);
    const isAtBottomRef = useRef(true); // sync ref for SignalR handler
    const PAGE_SIZE = 30;

    // Refs that mirror state for synchronous reads inside the SignalR handler
    const hasMoreDownRef = useRef(hasMoreDown);
    useEffect(() => { hasMoreDownRef.current = hasMoreDown; }, [hasMoreDown]);

    // ── Search state ──
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // ── Typing state ──
    const [typingUsers, setTypingUsers] = useState({});
    const typingTimerRef = useRef({});
    const typingDebounceRef = useRef({});

    // ── Online presence state ──
    const [onlineUsers, setOnlineUsers] = useState(new Set());

    // ── Friends state (for group creation) ──
    const [friends, setFriends] = useState([]);
    const [friendsLoading, setFriendsLoading] = useState(false);
    const [friendsSearchTerm, setFriendsSearchTerm] = useState("");

    // ── Refetch conversations when filter changes ──
    useEffect(() => {
        fetchConversations(1, 20);
    }, [conversationFilter]);

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
    useEffect(() => {
        if (selectedConversation?.id && !selectedConversation.isVirtual) {
            loadConversationMembers(true);
        }
    }, [selectedConversation?.id]);
    // ─────────────────────────────────────────────────────────────────────────
    // SIGNALR EVENT LISTENERS
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!connection) return;

        const receiveMessage = async (message) => {
            const convId = message.conversationId;
            const isCurrentUser = message.senderId === user?.id;
            const isSystemMessage = message.isSystemMessage === true;
            const conv = convsRef.current.find((c) => c.id === convId);
            const notificationOn = conv?.isNotificationOn !== false;

            if (!isCurrentUser && notificationOn && !isSystemMessage) {
                playNotificationSound();
            }
            console.log("message", message);

            // Only auto-append when viewing this conversation and the user is at the bottom
            // (i.e., hasMoreDown === false means the newest messages are already loaded).
            // Otherwise, increment a counter so the user can jump-to-latest.
            const isViewingThisConv = selectedConversationRef.current?.id === convId;
            if (isViewingThisConv) {
                if (hasMoreDownRef.current === false && isAtBottomRef.current) {
                    setMessages((prev) => {
                        if (prev.some((m) => m.id === message.id)) return prev;
                        return [...prev, message];
                    });
                } else {
                    setPendingNewMessageCount((c) => c + 1);
                }
            }

            setConversations((prev) => {
                const idx = prev.findIndex((c) => c.id === convId);

                if (idx === -1) {
                    getConversationDetailApi(convId)
                        .then((detail) => {
                            const newConv = {
                                ...detail,
                                lastMessage: message,
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
                const lastReadId = conv.lastReadMessageId ?? 0;
                const isUnread = !isCurrentUser && message.id > lastReadId;
                const updatedUnread = isUnread ? (conv.unreadCount ?? 0) + 1 : conv.unreadCount;

                const updatedConv = {
                    ...conv,
                    lastMessage: message,
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

        const onGetOnlineUsers = (userIds) => {
            setOnlineUsers((prev) => {
                const next = new Set(prev);
                userIds.forEach((id) => next.add(id));
                return next;
            });
        };

        const onMessagesSeen = ({ conversationId, userId: seenByUserId, lastReadMessageId }) => {
            if (seenByUserId === user?.id?.toString()) return;
            setConversationMembers(pre =>
                pre.map((m) => m.userId === seenByUserId ? {
                    ...m,
                    lastReadMessageId,
                } : m)
            )
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
        connection.on("GetOnlineUsers", onGetOnlineUsers);
        connection.on("MessagesSeen", onMessagesSeen);
        connection.on("MemberAdded", ({ conversationId, member }) => {
            if (selectedConversation?.id?.toString() === conversationId?.toString()) {
                setConversationMembers((prev) => {
                    if (prev.some((m) => m.userId === member.userId)) return prev;
                    return [...prev, member];
                });
            }
            // Refresh conversation list so member count is up to date
            getConversationsApi()
                .then((data) => setConversations(data ?? []))
                .catch(() => { });
        });
        connection.on("MemberRemoved", ({ conversationId, removedUserId }) => {
            if (selectedConversation?.id?.toString() === conversationId?.toString()) {
                setConversationMembers((prev) =>
                    prev.filter((m) => m.userId !== removedUserId)
                );
            }
            getConversationsApi()
                .then((data) => setConversations(data ?? []))
                .catch(() => { });
        });
        connection.on("ConversationUpdated", ({ conversationId, conversation }) => {
            // Update active conversation if it's the one that changed
            if (selectedConversation?.id?.toString() === conversationId?.toString()) {
                setSelectedConversation((prev) => ({
                    ...prev,
                    ...conversation,
                    id: parseInt(conversationId, 10),
                }));
            }
            // Refresh conversation list so name/theme/unread changes are reflected
            getConversationsApi()
                .then((data) => setConversations(data ?? []))
                .catch(() => { });
        });

        return () => {
            connection.off("ReceiveMessage", receiveMessage);
            connection.off("MessageUpdated", updateMessage);
            connection.off("MessageReactionUpdated", onMessageReactionUpdated);
            connection.off("UserTyping", onTyping);
            connection.off("UserUntyping");
            connection.off("UserOnline", onUserOnline);
            connection.off("UserOffline", onUserOffline);
            connection.off("GetOnlineUsers", onGetOnlineUsers);
            connection.off("MessagesSeen", onMessagesSeen);
            connection.off("MemberAdded");
            connection.off("MemberRemoved");
            connection.off("ConversationUpdated");
        };
    }, [connection, user, selectedConversation]);

    // Clear typing indicators for the previous conversation when leaving it
    useEffect(() => {
        const prevId = selectedConversation?.id;
        return () => {
            if (prevId) {
                setTypingUsers((prev) => {
                    const next = { ...prev };
                    delete next[prevId];
                    return next;
                });
            }
        };
    }, [selectedConversation?.id]);

    // ─────────────────────────────────────────────────────────────────────────
    // CONVERSATION METHODS
    // ─────────────────────────────────────────────────────────────────────────

    const fetchConversations = async (page = 1, pageSize = 20) => {
        setConversationsLoading(true);
        try {
            const groupsOnly = conversationFilter === "groups";
            const unreadOnly = conversationFilter === "unread";
            const data = await getConversationsApi(page, pageSize, groupsOnly, unreadOnly);
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
        setHasMoreUp(true);
        setHasMoreDown(false);
        setPendingNewMessageCount(0);
        setHighlightedMessageId(null);
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
                    const otherMember = membersData.results?.find(
                        (m) => m.userId !== user?.id
                    );
                    enriched = {
                        ...detail,
                        memberCount: membersData.totalCount ?? 0,
                        otherUserAvatarUrl: otherMember?.avatarUrl ?? null,
                    };
                } catch {
                    enriched = { ...detail, memberCount: 0 };
                }
            } else if (detail.isOneToOne && detail.otherUserId) {
                // For virtual conversations, fetch user profile to get avatar
                try {
                    const profileRes = await axios.get(`/auth/user/${detail.otherUserId}`);
                    enriched = { ...detail, otherUserAvatarUrl: profileRes.data?.avatarUrl ?? null };
                } catch {
                    enriched = { ...detail, otherUserAvatarUrl: null };
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
        setFriendsSearchTerm(searchTerm ?? "");
        setFriendsLoading(true);
        try {
            const data = await getFriendsApi(1, searchTerm);
            console.log("[fetchFriends] API response:", data);
            setFriends(data.items);
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

    const updateConversation = async (conversationId, { name, theme, defaultReaction }) => {
        try {
            const updated = await updateConversationApi(conversationId, { name, theme, defaultReaction });
            setConversations((prev) =>
                prev.map((c) => c.id === conversationId ? { ...c, ...updated } : c)
            );
            if (selectedConversation?.id === conversationId) {
                setSelectedConversation((prev) => ({ ...prev, ...updated }));
            }
            return updated;
        } catch (err) {
            console.error("Failed to update conversation:", err);
            throw err;
        }
    };

    const uploadConversationImage = async (conversationId, file) => {
        try {
            const { url } = await uploadConversationImageApi(conversationId, file);
            setConversations((prev) =>
                prev.map((c) => c.id === conversationId ? { ...c, imageUrl: url } : c)
            );
            if (selectedConversation?.id === conversationId) {
                setSelectedConversation((prev) => ({ ...prev, imageUrl: url }));
            }
            return url;
        } catch (err) {
            console.error("Failed to upload conversation image:", err);
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

    const addMember = async (conversationId, userIdToAdd) => {
        try {
            const member = await addMemberApi(conversationId, userIdToAdd);
            setConversationMembers((prev) => {
                if (prev.some((m) => m.userId === member.userId)) return prev;
                return [...prev, member];
            });
            setMembersTotalCount((prev) => prev + 1);
            return member;
        } catch (err) {
            console.error("Failed to add member:", err);
            throw err;
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // MESSAGE METHODS
    // ─────────────────────────────────────────────────────────────────────────

    // Initial load: fetch the latest N messages (direction "up" with no anchor returns the newest `size` messages)
    const loadMessages = async (reset = true) => {
        if (!selectedConversation || selectedConversation.isVirtual) return;
        if (reset) {
            setMessages([]);
            setHasMoreUp(true);
            setHasMoreDown(false);
            setPendingNewMessageCount(0);
        }
        setMessagesLoading(true);
        try {
            const data = await getMessagesAroundApi(selectedConversation.id, null, "up", PAGE_SIZE);
            const list = data?.messages ?? data ?? [];
            setMessages(list);
            setHasMoreUp(data?.hasMoreUp ?? list.length === PAGE_SIZE);
            setHasMoreDown(data?.hasMoreDown ?? false);
        } catch (err) {
            console.error("Failed to load messages:", err);
        } finally {
            setMessagesLoading(false);
        }
    };

    // Load older messages (scroll up) — prepend to current list
    const loadOlderMessages = async () => {
        if (!selectedConversation || messagesLoading || !hasMoreUp || messages.length === 0) return;
        setMessagesLoading(true);
        setMessagesLoadingDirection("up");
        try {
            const oldestId = messages[0]?.id;
            const data = await getMessagesAroundApi(selectedConversation.id, oldestId, "up", PAGE_SIZE);
            const list = data?.messages ?? data ?? [];
            if (!list.length) {
                setHasMoreUp(false);
            } else {
                setMessages((prev) => [...list, ...prev]);
                setHasMoreUp(data?.hasMoreUp ?? list.length === PAGE_SIZE);
            }
        } catch (err) {
            console.error("Failed to load older messages:", err);
        } finally {
            setMessagesLoading(false);
            setMessagesLoadingDirection(null);
        }
    };

    // Load newer messages (scroll down) — append to current list
    const loadNewerMessages = async () => {
        if (!selectedConversation || messagesLoading || !hasMoreDown || messages.length === 0) return;
        setMessagesLoading(true);
        setMessagesLoadingDirection("down");
        try {
            const newestId = messages[messages.length - 1]?.id;
            const data = await getMessagesAroundApi(selectedConversation.id, newestId, "down", PAGE_SIZE);
            const list = data?.messages ?? data ?? [];
            if (!list.length) {
                setHasMoreDown(false);
            } else {
                setMessages((prev) => [...prev, ...list]);
                setHasMoreDown(data?.hasMoreDown ?? list.length === PAGE_SIZE);
            }
        } catch (err) {
            console.error("Failed to load newer messages:", err);
        } finally {
            setMessagesLoading(false);
            setMessagesLoadingDirection(null);
        }
    };

    // Jump to a specific message: load messages around it (used by search & pinned)
    const jumpToMessage = async (messageId) => {
        if (!selectedConversation || selectedConversation.isVirtual) return;
        setMessagesLoading(true);
        try {
            const data = await getMessagesAroundApi(selectedConversation.id, messageId, "around", PAGE_SIZE);
            const list = data?.messages ?? data ?? [];
            setMessages(list);
            setHasMoreUp(data?.hasMoreUp ?? false);
            setHasMoreDown(data?.hasMoreDown ?? true);
            setPendingNewMessageCount(0);
            // Highlight the target message (yellow ring) for 2s and scroll it into view
            setHighlightedMessageId(messageId);
            setTimeout(() => {
                setHighlightedMessageId((current) => (current === messageId ? null : current));
            }, 2000);
            // Wait for the DOM to render the loaded messages before scrolling
            setTimeout(() => {
                const el = document.querySelector(`[data-msg-id="${messageId}"]`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 150);
        } catch (err) {
            console.error("Failed to jump to message:", err);
        } finally {
            setMessagesLoading(false);
        }
    };

    // Jump to the latest messages
    const jumpToLatest = async () => {
        if (!selectedConversation || selectedConversation.isVirtual) return;
        setMessagesLoading(true);
        try {
            const data = await getMessagesAroundApi(selectedConversation.id, null, "up", PAGE_SIZE);
            const list = data?.messages ?? data ?? [];
            setMessages(list);
            setHasMoreUp(data?.hasMoreUp ?? list.length === PAGE_SIZE);
            setHasMoreDown(false);
            setPendingNewMessageCount(0);
        } catch (err) {
            console.error("Failed to jump to latest:", err);
        } finally {
            setMessagesLoading(false);
        }
    };

    const setAtBottomState = (val) => {
        isAtBottomRef.current = val;
        setAtBottom(val);
        if (val) setPendingNewMessageCount(0);
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

    const sendMessage = async (content, files = [], replyToMessageId = null) => {
        const hasContent = content?.trim();
        const hasFiles = files.length > 0;
        if (!selectedConversation || (!hasContent && !hasFiles)) return null;

        let targetConv = selectedConversation;
        if (selectedConversation.isVirtual) {
            const newConv = await startConversation(selectedConversation.otherUserId);
            if (!newConv) return null;
            targetConv = newConv;
        }

        try {
            const newMessage = await sendMessageApi({
                conversationId: targetConv.id,
                content,
                files,
                replyToMessageId,
            });
            return;
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
            const data = await getPinnedMessagesApi(selectedConversation.id, 1, 100);
            setPinnedMessages(data ?? []);
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

    const startTyping = async (conversationId) => {
        if (!connection) return;
        const targetId = conversationId || selectedConversation?.id;
        if (!targetId || (selectedConversation?.isVirtual && !conversationId)) return;
        try {
            await connection.invoke("Typing", targetId.toString());
        } catch (_) { /* non-critical */ }
    };

    const endTyping = async (conversationId) => {
        if (!connection) return;
        const targetId = conversationId || selectedConversation?.id;
        if (!targetId || (selectedConversation?.isVirtual && !conversationId)) return;
        try {
            await connection.invoke("Untyping", targetId.toString());
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
        conversationFilter,
        setConversationFilter,
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
        addMember,
        updateConversation,
        uploadConversationImage,

        // Messages
        messages,
        messagesLoading,
        messagesLoadingDirection,
        hasMoreUp,
        hasMoreDown,
        atBottom,
        pendingNewMessageCount,
        highlightedMessageId,
        setAtBottomState,
        loadMessages,
        loadOlderMessages,
        loadNewerMessages,
        jumpToMessage,
        jumpToLatest,
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
        friendsSearchTerm,
        fetchFriends,
        createGroup,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}

// Named export for ChatProvider (same as the inner)
export { ChatContextInner as ChatProvider };

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
}
