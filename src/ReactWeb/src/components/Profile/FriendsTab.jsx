import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserCheck, UserPlus, Clock, Check, X, UserMinus, Eye } from "lucide-react";
import { useProfileFriends } from "../../hooks/useProfileFriends";
import {
    sendFriendRequestApi,
    cancelFriendRequestApi,
    unfriendApi,
} from "../../apis/friendApi";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

export default function FriendsTab({ userId, currentUserId, theme }) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [openMenuId, setOpenMenuId] = useState(null);
    const [pendingId, setPendingId] = useState(null);
    const [actionError, setActionError] = useState(null);

    const menuRef = useRef(null);

    const { friends, loading, error, setFriends } = useProfileFriends(userId, searchQuery);

    // Close any open action menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getAvatar = (friend) => friend.avatarUrl || friend.avatar || DEFAULT_AVATAR;
    const getName = (friend) => friend.fullName || friend.name;
    const getMutual = (friend) => friend.mutualFriendsCount ?? friend.mutual ?? 0;

    const handleAvatarError = (e) => {
        if (e?.target && e.target.src !== DEFAULT_AVATAR) {
            e.target.src = DEFAULT_AVATAR;
        }
    };

    const isSelf = (targetId) => currentUserId && String(targetId) === String(currentUserId);

    const updateFriend = (targetId, patch) => {
        setFriends((prev) =>
            prev.map((f) => (f.id === targetId ? { ...f, ...patch } : f))
        );
    };

    const handleSendRequest = async (targetId) => {
        setPendingId(targetId);
        setActionError(null);
        try {
            await sendFriendRequestApi(targetId);
            updateFriend(targetId, { isFriend: false, isSendingFriendRequest: true });
        } catch (err) {
            setActionError(err?.response?.data?.message || err?.message || "Failed to send friend request");
        } finally {
            setPendingId(null);
            setOpenMenuId(null);
        }
    };

    const handleCancelRequest = async (targetId) => {
        setPendingId(targetId);
        setActionError(null);
        try {
            await cancelFriendRequestApi(targetId);
            updateFriend(targetId, { isFriend: false, isSendingFriendRequest: false });
        } catch (err) {
            setActionError(err?.response?.data?.message || err?.message || "Failed to cancel friend request");
        } finally {
            setPendingId(null);
            setOpenMenuId(null);
        }
    };

    const handleUnfriend = async (targetId) => {
        setPendingId(targetId);
        setActionError(null);
        try {
            await unfriendApi(targetId);
            updateFriend(targetId, { isFriend: false, isSendingFriendRequest: false });
        } catch (err) {
            setActionError(err?.response?.data?.message || err?.message || "Failed to unfriend");
        } finally {
            setPendingId(null);
            setOpenMenuId(null);
        }
    };

    const renderActionButton = (friend) => {
        const isPending = pendingId === friend.id;
        const baseBtn =
            "flex items-center justify-center gap-1.5 rounded-md py-2 px-3 text-[14px] font-semibold cursor-pointer transition disabled:opacity-60 disabled:cursor-not-allowed";

        // Always show a "View Profile" button — even for self
        const viewProfileBtn = (
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${friend.id}`);
                }}
                className={`${baseBtn} bg-[#E4E6EB] hover:bg-[#D8DADF] text-[#050505]`}
            >
                <Eye size={16} /> View Profile
            </button>
        );

        // If this row is the current user, hide all friend actions
        if (isSelf(friend.id)) {
            return viewProfileBtn;
        }

        if (friend.isFriend) {
            return (
                <div className="relative" ref={openMenuId === friend.id ? menuRef : null}>
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === friend.id ? null : friend.id);
                        }}
                        className={`${baseBtn} bg-[#E4E6EB] hover:bg-[#D8DADF] text-[#050505]`}
                    >
                        <Check size={16} strokeWidth={3} /> Friends
                    </button>

                    {openMenuId === friend.id && (
                        <div className="absolute right-0 mt-2 w-[200px] z-50 bg-white border border-[#ced0d4] rounded-xl shadow-xl py-1.5 animate-in fade-in zoom-in-95 duration-100 text-[#050505]">
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnfriend(friend.id);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left text-[14px] font-semibold cursor-pointer text-red-600 hover:bg-red-50 transition"
                            >
                                <UserMinus size={18} />
                                <span>{isPending ? "Unfriending..." : "Unfriend"}</span>
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        if (friend.isSendingFriendRequest) {
            return (
                <div className="relative" ref={openMenuId === friend.id ? menuRef : null}>
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === friend.id ? null : friend.id);
                        }}
                        className={`${baseBtn} bg-[#E4E6EB] hover:bg-[#D8DADF] text-[#050505]`}
                    >
                        <Clock size={16} /> Friend Request Sent
                    </button>

                    {openMenuId === friend.id && (
                        <div className="absolute right-0 mt-2 w-[220px] z-50 bg-white border border-[#ced0d4] rounded-xl shadow-xl py-1.5 animate-in fade-in zoom-in-95 duration-100 text-[#050505]">
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelRequest(friend.id);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left text-[14px] font-semibold cursor-pointer hover:bg-[#F2F2F2] transition"
                            >
                                <X size={18} className="text-[#65676B]" />
                                <span>{isPending ? "Canceling..." : "Cancel Friend Request"}</span>
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <button
                type="button"
                disabled={isPending}
                onClick={(e) => {
                    e.stopPropagation();
                    handleSendRequest(friend.id);
                }}
                className={`${baseBtn} bg-[#1877F2] hover:bg-[#166fe5] text-white`}
            >
                <UserPlus size={16} /> {isPending ? "Sending..." : "Add Friend"}
            </button>
        );
    };

    const renderViewProfileButton = (friend) => {
        const baseBtn =
            "flex items-center justify-center gap-1.5 rounded-md py-2 px-3 text-[14px] font-semibold cursor-pointer transition disabled:opacity-60 disabled:cursor-not-allowed";
        return (
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${friend.id}`);
                }}
                className={`${baseBtn} bg-[#E4E6EB] hover:bg-[#D8DADF] text-[#050505]`}
            >
                <Eye size={16} /> View Profile
            </button>
        );
    };

    return (
        <div className="w-full rounded-lg shadow-sm p-4 bg-white text-[#050505] relative border border-[#ced0d4] transition-colors duration-200">

            {/* Top Header */}
            <div className="flex items-start justify-between w-full mb-1">
                <div>
                    <h2 className="text-xl font-bold text-[#050505] tracking-tight">Friends</h2>
                </div>
            </div>

            {/* Search row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#ced0d4] mb-4 gap-3 w-full">
                <div className="pb-2 sm:pb-0">
                    <div className="flex items-center rounded-full px-3 py-1.5 gap-2 w-full sm:w-60 bg-[#F0F2F5]">
                        <Search size={16} className="text-[#65676B] flex-shrink-0" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search"
                            className="bg-transparent border-none outline-none text-[14px] w-full text-[#050505] placeholder:text-[#65676B]"
                        />
                    </div>
                </div>
            </div>

            {actionError && (
                <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    {actionError}
                </div>
            )}

            {/* Loading / Error / Empty states */}
            {loading && friends.length === 0 && (
                <div className="py-12 text-center text-sm text-[#65676B]">Loading friends...</div>
            )}

            {error && (
                <div className="py-12 text-center text-sm text-red-500">{error}</div>
            )}

            {!loading && !error && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                        {friends.map((friend) => (
                            <div
                                key={friend.id}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F2F2F2] transition-colors relative group"
                            >
                                {/* Left: avatar + name */}
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                    <div
                                        className="relative cursor-pointer flex-shrink-0"
                                        onClick={() => navigate(`/profile/${friend.id}`)}
                                    >
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#E4E6EB] border border-[#ced0d4] shadow-sm">
                                            <img
                                                src={getAvatar(friend)}
                                                alt={getName(friend)}
                                                onError={handleAvatarError}
                                                className="w-full h-full object-cover select-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="min-w-0">
                                        <h3
                                            onClick={() => navigate(`/profile/${friend.id}`)}
                                            className="font-semibold text-[17px] leading-tight hover:underline cursor-pointer text-[#050505] truncate"
                                        >
                                            {getName(friend)}
                                        </h3>
                                        <p className="text-[13px] text-[#65676B] mt-1 truncate">
                                            {getMutual(friend) > 0 ? `${getMutual(friend)} mutual friends` : "Friends"}
                                        </p>
                                    </div>
                                </div>

                                {/* Right: contextual action button */}
                                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                    {renderActionButton(friend)}
                                    {!isSelf(friend.id) && renderViewProfileButton(friend)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {friends.length === 0 && !loading && (
                        <div className="py-12 text-center text-sm text-[#65676B]">
                            {searchQuery ? "No matching friends found." : "No friends yet."}
                        </div>
                    )}
                </>
            )}

        </div>
    );
}
