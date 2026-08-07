import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, Check, UserMinus, Eye } from "lucide-react";
import { useFollowees } from "../../hooks/useFollowees";
import { followUserApi, unfollowUserApi } from "../../apis/friendApi";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

export default function FollowingTab({ theme, userId = null, currentUserId }) {
    const navigate = useNavigate();
    const { followees, loading, error, setFollowees } = useFollowees(userId);
    const [searchQuery, setSearchQuery] = useState("");
    const [openMenuId, setOpenMenuId] = useState(null);
    const [pendingId, setPendingId] = useState(null);
    const [actionError, setActionError] = useState(null);

    const menuRef = useRef(null);

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

    const filteredItems = followees.filter((item) =>
        (item.fullName || item.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleNavigateProfile = (followeeId) => {
        navigate(`/profile/${followeeId}`);
    };

    const handleAvatarError = (e) => {
        if (e?.target && e.target.src !== DEFAULT_AVATAR) {
            e.target.src = DEFAULT_AVATAR;
        }
    };

    const isSelf = (targetId) => currentUserId && String(targetId) === String(currentUserId);

    const updateFollowee = (targetId, patch) => {
        setFollowees((prev) =>
            prev.map((u) => (u.id === targetId ? { ...u, ...patch } : u))
        );
    };

    const handleFollow = async (targetId) => {
        setPendingId(targetId);
        setActionError(null);
        try {
            await followUserApi(targetId);
            updateFollowee(targetId, { isFollowing: true });
        } catch (err) {
            setActionError(err?.response?.data?.message || err?.message || "Failed to follow user");
        } finally {
            setPendingId(null);
        }
    };

    const handleUnfollow = async (targetId) => {
        setPendingId(targetId);
        setActionError(null);
        try {
            await unfollowUserApi(targetId);
            updateFollowee(targetId, { isFollowing: false });
        } catch (err) {
            setActionError(err?.response?.data?.message || err?.message || "Failed to unfollow user");
        } finally {
            setPendingId(null);
            setOpenMenuId(null);
        }
    };

    const renderFollowButton = (item) => {
        const isPending = pendingId === item.id;
        const baseBtn =
            "flex items-center justify-center gap-1.5 rounded-md py-2 px-3 text-[14px] font-semibold cursor-pointer transition disabled:opacity-60 disabled:cursor-not-allowed";

        if (isSelf(item.id)) {
            return null;
        }

        if (item.isFollowing) {
            return (
                <div className="relative" ref={openMenuId === item.id ? menuRef : null}>
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === item.id ? null : item.id);
                        }}
                        className={`${baseBtn} bg-[#E4E6EB] hover:bg-[#D8DADF] text-[#050505]`}
                    >
                        <Check size={16} strokeWidth={3} /> Following
                    </button>

                    {openMenuId === item.id && (
                        <div className="absolute right-0 mt-2 w-[180px] z-50 bg-white border border-[#ced0d4] rounded-xl shadow-xl py-1.5 animate-in fade-in zoom-in-95 duration-100 text-[#050505]">
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnfollow(item.id);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left text-[14px] font-semibold cursor-pointer text-red-600 hover:bg-red-50 transition"
                            >
                                <UserMinus size={18} />
                                <span>{isPending ? "Unfollowing..." : "Unfollow"}</span>
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
                    handleFollow(item.id);
                }}
                className={`${baseBtn} bg-[#1877F2] hover:bg-[#166fe5] text-white`}
            >
                <UserPlus size={16} /> {isPending ? "Following..." : "Follow"}
            </button>
        );
    };

    const renderViewProfileButton = (item) => {
        const baseBtn =
            "flex items-center justify-center gap-1.5 rounded-md py-2 px-3 text-[14px] font-semibold cursor-pointer transition disabled:opacity-60 disabled:cursor-not-allowed";
        return (
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${item.id}`);
                }}
                className={`${baseBtn} bg-[#E4E6EB] hover:bg-[#D8DADF] text-[#050505]`}
            >
                <Eye size={16} /> View Profile
            </button>
        );
    };

    return (
        <div className="w-full rounded-lg shadow-sm p-4 bg-white text-[#050505] relative border border-[#ced0d4] transition-colors duration-200">

            {/* Header */}
            <div className="flex items-start justify-between w-full mb-1">
                <div>
                    <h2 className="text-xl font-bold text-[#050505] tracking-tight">Following</h2>
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

            {loading && (
                <div className="py-12 text-center text-sm text-[#65676B]">Loading...</div>
            )}

            {error && (
                <div className="py-12 text-center text-sm text-red-500">{error}</div>
            )}

            {!loading && !error && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F2F2F2] transition-colors group"
                            >
                                {/* Left: avatar + name */}
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                    <div
                                        className="w-20 h-20 rounded-lg overflow-hidden bg-[#E4E6EB] flex-shrink-0 border border-[#ced0d4] shadow-sm flex items-center justify-center cursor-pointer"
                                        onClick={() => handleNavigateProfile(item.id)}
                                    >
                                        <img
                                            src={item.avatarUrl || item.avatar || DEFAULT_AVATAR}
                                            alt={item.fullName || item.name}
                                            onError={handleAvatarError}
                                            className="w-full h-full object-cover select-none"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <h3
                                            className="font-semibold text-[16px] leading-snug hover:underline cursor-pointer text-[#050505] truncate"
                                            onClick={() => handleNavigateProfile(item.id)}
                                        >
                                            {item.fullName || item.name}
                                        </h3>

                                        {item.mutualFriendsCount > 0 && (
                                            <p className="text-[12px] text-[#65676B] mt-0.5">
                                                {item.mutualFriendsCount} mutual friend{item.mutualFriendsCount !== 1 ? "s" : ""}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Right: contextual Follow / Following button */}
                                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                    {renderFollowButton(item)}
                                    {renderViewProfileButton(item)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="py-12 text-center text-sm text-[#65676B]">
                            No followees found.
                        </div>
                    )}
                </>
            )}

        </div>
    );
}
