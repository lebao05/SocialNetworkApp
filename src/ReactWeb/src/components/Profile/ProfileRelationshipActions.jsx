import React, { useState, useRef, useEffect } from "react";
import {
    FaUserFriends,
    FaCheck,
    FaTimes,
    FaUserPlus,
    FaUserMinus,
    FaUserClock,
} from "react-icons/fa";
import { MessageCircle, ChevronDown, Plus, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFriendContext } from "../../contexts/friendContext";
import { FaUserCheck } from "react-icons/fa6";

const THEME = {
    light: {
        blueBtn: "bg-[#1877f2] hover:bg-[#166fe5] text-white",
        grayBtn: "bg-[#e4e6eb] hover:bg-[#d8dadf] text-[#050505]",
        redBtn: "bg-[#e4e6eb] hover:bg-[#ff4d4d] text-[#050505] hover:text-white",
        greenBtn: "bg-[#42b72a] hover:bg-[#36a420] text-black",
        dangerBtn: "bg-[#e4e6eb] hover:bg-[#d8dadf] text-[#050505]",
        dropBg: "bg-white",
        dropBorder: "border-[#dddfe2]",
        dropItem: "hover:bg-[#f0f2f5]",
        dropText: "text-[#050505]",
        dropSubtext: "text-[#65676b]",
        divider: "border-[#dddfe2]",
        loading: "bg-[#f0f2f5]",
        overlay: "bg-black/5",
    },
    dark: {
        blueBtn: "bg-[#4599ff] hover:bg-[#3d8be6] text-white",
        grayBtn: "bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e4e6eb]",
        redBtn: "bg-[#3a3b3c] hover:bg-[#b91c1c] text-[#e4e6eb]",
        greenBtn: "bg-[#42b72a] hover:bg-[#36a420] text-black",
        dangerBtn: "bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e4e6eb]",
        dropBg: "bg-[#242526]",
        dropBorder: "border-[#3e4042]",
        dropItem: "hover:bg-[#3a3b3c]",
        dropText: "text-[#e4e6eb]",
        dropSubtext: "text-[#b0b3b8]",
        divider: "border-[#3e4042]",
        loading: "bg-[#3a3b3c]",
        overlay: "bg-black/30",
    },
};

function DropdownMenu({ children, isOpen, onClose }) {
    const menuRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={menuRef}
            className="absolute right-0 top-full mt-1 w-52 rounded-lg shadow-xl border z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            style={{ borderColor: "var(--dropdown-border)" }}
        >
            {children}
        </div>
    );
}

function DropdownItem({ children, icon, subtext, onClick, disabled, danger }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors cursor-pointer
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                ${danger ? "text-red-500" : ""}
            `}
            style={disabled ? {} : { backgroundColor: "transparent" }}
            onMouseEnter={(e) => {
                if (!disabled) e.currentTarget.style.backgroundColor = "var(--dropdown-hover)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
            }}
        >
            {icon && (
                <span className="text-base flex-shrink-0">
                    {icon}
                </span>
            )}
            <span className="flex flex-col">
                <span className="font-semibold">{children}</span>
                {subtext && (
                    <span className="text-xs opacity-60">{subtext}</span>
                )}
            </span>
        </button>
    );
}

function ActionButton({ children, onClick, loading, disabled, className, icon, themeKey }) {
    const t = THEME[themeKey];
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                flex-1 md:flex-initial font-semibold px-4 py-2 rounded-lg text-sm
                flex items-center justify-center gap-2 transition-all cursor-pointer
                ${t.blueBtn}
                ${(disabled || loading) ? "opacity-60 cursor-not-allowed" : ""}
                ${className || ""}
            `}
        >
            {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin flex-shrink-0" />
            ) : icon ? (
                <span className="flex-shrink-0">{icon}</span>
            ) : null}
            {children}
        </button>
    );
}

export default function ProfileRelationshipActions({
    profile,
    isOwnProfile,
    isDarkMode = false,
    onUpdate,
}) {
    const themeKey = isDarkMode ? "dark" : "light";
    const t = THEME[themeKey];

    const {
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        cancelFriendRequest,
        unfriend,
        followUser,
        unfollowUser,
    } = useFriendContext();

    const navigate = useNavigate();

    const [openMenu, setOpenMenu] = useState(null);
    const [loadingAction, setLoadingAction] = useState(null);
    const [optimistic, setOptimistic] = useState({
        isFriend: profile?.isFriend,
        isFollowing: profile?.isFollowing,
        hasIncomingRequest: profile?.hasIncomingRequest,
        hasOutgoingRequest: profile?.hasOutgoingRequest,
    });

    const userId = profile?.id;

    const sync = () => {
        if (!profile) return;
        setOptimistic({
            isFriend: profile.isFriend,
            isFollowing: profile.isFollowing,
            hasIncomingRequest: profile.hasIncomingRequest,
            hasOutgoingRequest: profile.hasOutgoingRequest,
        });
    };

    useEffect(() => {
        sync();
    }, [profile?.isFriend, profile?.isFollowing, profile?.hasIncomingRequest, profile?.hasOutgoingRequest]);

    const closeMenu = () => setOpenMenu(null);

    const wrap = async (actionKey, fn, ...args) => {
        setLoadingAction(actionKey);
        closeMenu();
        try {
            await fn(...args);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleSendRequest = async () => {
        if (!userId) return;
        setOptimistic((p) => ({ ...p, hasOutgoingRequest: true }));
        await wrap("send", sendFriendRequest, userId);
        onUpdate?.({ hasOutgoingRequest: true });
    };

    const handleAcceptRequest = async () => {
        if (!profile?.incomingRequestId) return;
        setOptimistic((p) => ({ ...p, isFriend: true, hasIncomingRequest: false }));
        await wrap("accept", acceptFriendRequest, profile.incomingRequestId);
        onUpdate?.({ isFriend: true, hasIncomingRequest: false });
    };

    const handleRejectRequest = async () => {
        if (!profile?.incomingRequestId) return;
        setOptimistic((p) => ({ ...p, hasIncomingRequest: false }));
        await wrap("reject", rejectFriendRequest, profile.incomingRequestId);
        onUpdate?.({ hasIncomingRequest: false });
    };

    const handleCancelRequest = async () => {
        if (!userId) return;
        setOptimistic((p) => ({ ...p, hasOutgoingRequest: false }));
        await wrap("cancel", cancelFriendRequest, userId);
        onUpdate?.({ hasOutgoingRequest: false });
    };

    const handleUnfriend = async () => {
        if (!userId) return;
        setOptimistic((p) => ({ ...p, isFriend: false }));
        await wrap("unfriend", unfriend, userId);
        onUpdate?.({ isFriend: false });
    };

    const handleFollow = async () => {
        if (!userId) return;
        setOptimistic((p) => ({ ...p, isFollowing: true }));
        await wrap("follow", followUser, userId);
        onUpdate?.({ isFollowing: true });
    };

    const handleUnfollow = async () => {
        if (!userId) return;
        setOptimistic((p) => ({ ...p, isFollowing: false }));
        await wrap("unfollow", unfollowUser, userId);
        onUpdate?.({ isFollowing: false });
    };

    const handleMessage = () => {
        closeMenu();
        navigate("/messenger");
    };

    const { isFriend, isFollowing, hasIncomingRequest, hasOutgoingRequest } = optimistic;

    const isLoading = (action) => loadingAction === action;

    const renderDropdownBorder = () => {
        const borderColor = isDarkMode ? "#3e4042" : "#dddfe2";
        const hoverColor = isDarkMode ? "#3a3b3c" : "#f0f2f5";
        document.documentElement.style.setProperty("--dropdown-border", borderColor);
        document.documentElement.style.setProperty("--dropdown-hover", hoverColor);
    };

    renderDropdownBorder();

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* ===== CASE 1: Already Friends ===== */}
            {isFriend && !hasIncomingRequest && !hasOutgoingRequest && (
                <>
                    {/* Friends button with dropdown */}
                    <div className="relative">
                        <ActionButton
                            onClick={() => setOpenMenu(openMenu === "friends" ? null : "friends")}
                            loading={isLoading("unfriend")}
                            icon={<FaUserFriends size={14} />}
                            themeKey={themeKey}
                            className={t.blueBtn}
                        >
                            Friends
                        </ActionButton>
                        <DropdownMenu isOpen={openMenu === "friends"} onClose={closeMenu}>
                            <DropdownItem
                                icon={
                                    isFollowing ? (
                                        <FaUserCheck size={15} className="text-green-500" />
                                    ) : (
                                        <FaUserPlus size={15} className="text-gray-400" />
                                    )
                                }
                                onClick={() => wrap(isFollowing ? "unfollow" : "follow", isFollowing ? handleUnfollow : handleFollow)}
                                disabled={isLoading("follow") || isLoading("unfollow")}
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </DropdownItem>
                            <div className="border-t my-1" style={{ borderColor: t.divider }} />
                            <DropdownItem
                                icon={<FaUserMinus size={15} className="text-red-500" />}
                                onClick={() => wrap("unfriend", handleUnfriend)}
                                disabled={isLoading("unfriend")}
                                danger
                            >
                                Unfriend
                            </DropdownItem>
                        </DropdownMenu>
                    </div>

                    {/* Message */}
                    <ActionButton
                        onClick={handleMessage}
                        icon={<MessageCircle size={14} />}
                        themeKey={themeKey}
                        className={t.blueBtn}
                    >
                        Message
                    </ActionButton>
                </>
            )}

            {/* ===== CASE 2: Incoming Friend Request ===== */}
            {!isFriend && hasIncomingRequest && !hasOutgoingRequest && (
                <>
                    {/* Confirm */}
                    <ActionButton
                        onClick={handleAcceptRequest}
                        loading={isLoading("accept")}
                        icon={<FaCheck size={14} />}
                        themeKey={themeKey}
                        className={t.blueBtn}
                    >
                        Confirm
                    </ActionButton>

                    {/* Delete Request */}
                    <ActionButton
                        onClick={handleRejectRequest}
                        loading={isLoading("reject")}
                        icon={<FaTimes size={14} />}
                        themeKey={themeKey}
                        className={t.redBtn}
                    >
                        Delete Request
                    </ActionButton>

                    {/* Message */}
                    <ActionButton
                        onClick={handleMessage}
                        icon={<MessageCircle size={14} />}
                        themeKey={themeKey}
                        className={t.blueBtn}
                    >
                        Message
                    </ActionButton>
                </>
            )}

            {/* ===== CASE 3: Outgoing Friend Request ===== */}
            {!isFriend && !hasIncomingRequest && hasOutgoingRequest && (
                <>
                    {/* Request Sent with dropdown */}
                    <div className="relative">
                        <ActionButton
                            onClick={() => setOpenMenu(openMenu === "sent" ? null : "sent")}
                            loading={isLoading("cancel")}
                            icon={<FaUserClock size={14} />}
                            themeKey={themeKey}
                            className={t.grayBtn}
                        >
                            Friend Request Sent
                        </ActionButton>
                        <DropdownMenu isOpen={openMenu === "sent"} onClose={closeMenu}>
                            <DropdownItem
                                icon={<FaTimes size={15} className="text-red-500" />}
                                onClick={() => wrap("cancel", handleCancelRequest)}
                                disabled={isLoading("cancel")}
                                danger
                            >
                                Cancel Request
                            </DropdownItem>
                        </DropdownMenu>
                    </div>

                    {/* Message */}
                    <ActionButton
                        onClick={handleMessage}
                        icon={<MessageCircle size={14} />}
                        themeKey={themeKey}
                        className={t.blueBtn}
                    >
                        Message
                    </ActionButton>
                </>
            )}

            {/* ===== CASE 4: Not Friends, No Requests ===== */}
            {!isFriend && !hasIncomingRequest && !hasOutgoingRequest && (
                <>
                    {/* Add Friend */}
                    <ActionButton
                        onClick={handleSendRequest}
                        loading={isLoading("send")}
                        icon={<FaUserPlus size={14} />}
                        themeKey={themeKey}
                        className={t.blueBtn}
                    >
                        Add Friend
                    </ActionButton>

                    {/* Follow (only if not following) */}
                    {!isFollowing && (
                        <ActionButton
                            onClick={handleFollow}
                            loading={isLoading("follow")}
                            icon={<Plus size={14} />}
                            themeKey={themeKey}
                            className={t.grayBtn}
                        >
                            Follow
                        </ActionButton>
                    )}

                    {/* Following */}
                    {isFollowing && (
                        <div className="relative">
                            <ActionButton
                                onClick={() => setOpenMenu(openMenu === "following" ? null : "following")}
                                loading={isLoading("unfollow")}
                                icon={<UserCheck size={14} />}
                                themeKey={themeKey}
                                className={t.grayBtn}
                            >
                                Following
                            </ActionButton>
                            <DropdownMenu isOpen={openMenu === "following"} onClose={closeMenu}>
                                <DropdownItem
                                    icon={<FaUserMinus size={15} className="text-red-500" />}
                                    onClick={() => wrap("unfollow", handleUnfollow)}
                                    disabled={isLoading("unfollow")}
                                    danger
                                >
                                    Unfollow
                                </DropdownItem>
                            </DropdownMenu>
                        </div>
                    )}

                    {/* Message */}
                    <ActionButton
                        onClick={handleMessage}
                        icon={<MessageCircle size={14} />}
                        themeKey={themeKey}
                        className={t.blueBtn}
                    >
                        Message
                    </ActionButton>
                </>
            )}

            {/* ===== More Options (ChevronDown) - always visible for non-own profiles ===== */}
            {!isOwnProfile && (
                <button
                    type="button"
                    onClick={() => setOpenMenu(openMenu === "more" ? null : "more")}
                    className={`
                        w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer
                        ${t.grayBtn}
                        ${openMenu === "more" ? "ring-2 ring-[#1877f2]" : ""}
                    `}
                >
                    <ChevronDown size={18} />
                    <DropdownMenu isOpen={openMenu === "more"} onClose={closeMenu}>
                        {isFriend ? (
                            <DropdownItem
                                icon={<FaUserPlus size={15} className="text-gray-400" />}
                                onClick={() => {
                                    if (!isFollowing) {
                                        wrap("follow", handleFollow);
                                    }
                                    closeMenu();
                                }}
                                disabled={isLoading("follow")}
                            >
                                {isFollowing ? "Following" : "Follow"}
                            </DropdownItem>
                        ) : (
                            <DropdownItem
                                icon={<FaUserPlus size={15} className="text-gray-400" />}
                                onClick={() => {
                                    if (!isFollowing) {
                                        wrap("follow", handleFollow);
                                    }
                                    closeMenu();
                                }}
                                disabled={isLoading("follow")}
                            >
                                {isFollowing ? "Following" : "Follow"} in common
                            </DropdownItem>
                        )}
                    </DropdownMenu>
                </button>
            )}
        </div>
    );
}
