import React, { useState, useRef, useEffect } from "react";
import {
    FaUserFriends,
    FaCheck,
    FaTimes,
    FaUserPlus,
    FaUserMinus,
    FaUserClock,
} from "react-icons/fa";
import { MessageCircle, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFriendContext } from "../../contexts/friendContext";
import { FaUserCheck } from "react-icons/fa6";

const THEME = {
    light: {
        blueBtn: "bg-[#1877f2] hover:bg-[#166fe5] text-white",
        grayBtn: "bg-[#e4e6eb] hover:bg-[#d8dadf] text-[#050505]",
        redBtn: "bg-[#e4e6eb] hover:bg-[#ff4d4d] text-[#050505] hover:text-white",
        greenBtn: "bg-[#42b72a] hover:bg-[#36a420] text-white",
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
        greenBtn: "bg-[#36a420] hover:bg-[#2f8f1c] text-white",
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

function ActionButton({ children, onClick, loading, disabled, className, icon, themeKey, variant = "primary" }) {
    const t = THEME[themeKey];
    const sizeClasses =
        variant === "primary"
            ? "px-5 py-2.5 text-sm"
            : variant === "secondary"
            ? "px-4 py-2 text-sm"
            : "px-3 py-2 text-sm";
    const widthClasses = variant === "primary" ? "flex-1 md:flex-initial" : "flex-1 md:flex-initial";
    let colorClasses = t.blueBtn;
    if (variant === "secondary") {
        colorClasses = t.grayBtn;
    } else if (variant === "danger") {
        colorClasses = t.redBtn;
    } else if (variant === "success") {
        colorClasses = t.greenBtn;
    }
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                ${widthClasses} ${sizeClasses} font-semibold rounded-lg
                flex items-center justify-center gap-2 transition-all cursor-pointer
                ${colorClasses}
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
    onReport,
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
        if (userId) {
            navigate(`/messenger/t/${userId}`);
        } else {
            navigate("/messenger");
        }
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
        <div className="flex flex-col w-full">
            {/* ===== Row 1: Friend actions + Message ===== */}
            <div className="flex flex-wrap items-center gap-2">
                {/* Friend primary action */}
                {isFriend && !hasIncomingRequest && !hasOutgoingRequest && (
                    <div className="relative">
                        <ActionButton
                            onClick={() => setOpenMenu(openMenu === "friends" ? null : "friends")}
                            loading={isLoading("unfriend")}
                            icon={<FaUserFriends size={14} />}
                            themeKey={themeKey}
                            variant="primary"
                        >
                            Friends
                        </ActionButton>
                        <DropdownMenu isOpen={openMenu === "friends"} onClose={closeMenu}>
                            <DropdownItem
                                icon={<FaUserFriends size={15} />}
                                onClick={() => {
                                    closeMenu();
                                    navigate(`/profile/${userId}`);
                                }}
                            >
                                View Profile
                            </DropdownItem>
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
                )}

                {!isFriend && hasIncomingRequest && !hasOutgoingRequest && (
                    <>
                        <ActionButton
                            onClick={handleAcceptRequest}
                            loading={isLoading("accept")}
                            icon={<FaCheck size={14} />}
                            themeKey={themeKey}
                            variant="primary"
                        >
                            Confirm Request
                        </ActionButton>
                        <ActionButton
                            onClick={handleRejectRequest}
                            loading={isLoading("reject")}
                            icon={<FaTimes size={14} />}
                            themeKey={themeKey}
                            variant="secondary"
                        >
                            Delete
                        </ActionButton>
                    </>
                )}

                {!isFriend && !hasIncomingRequest && hasOutgoingRequest && (
                    <div className="relative">
                        <ActionButton
                            onClick={() => setOpenMenu(openMenu === "sent" ? null : "sent")}
                            loading={isLoading("cancel")}
                            icon={<FaUserClock size={14} />}
                            themeKey={themeKey}
                            variant="success"
                        >
                            Friend Request Sent
                        </ActionButton>
                        <DropdownMenu isOpen={openMenu === "sent"} onClose={closeMenu}>
                            <DropdownItem
                                icon={<FaUserFriends size={15} />}
                                onClick={() => {
                                    closeMenu();
                                    navigate(`/profile/${userId}`);
                                }}
                            >
                                View Profile
                            </DropdownItem>
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
                )}

                {!isFriend && !hasIncomingRequest && !hasOutgoingRequest && (
                    <ActionButton
                        onClick={handleSendRequest}
                        loading={isLoading("send")}
                        icon={<FaUserPlus size={14} />}
                        themeKey={themeKey}
                        variant="primary"
                    >
                        Add Friend
                    </ActionButton>
                )}

                {/* Message — always secondary */}
                <ActionButton
                    onClick={handleMessage}
                    icon={<MessageCircle size={14} />}
                    themeKey={themeKey}
                    variant="secondary"
                >
                    Message
                </ActionButton>

                {/* Report — sits in the same row as Message, only on other users' profiles */}
                {!isOwnProfile && onReport && (
                    <button
                        type="button"
                        onClick={onReport}
                        className={`flex-1 md:flex-initial px-4 py-2 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer
                            ${isDarkMode
                                ? "bg-[#3a3b3c] hover:bg-[#b91c1c] text-red-400 hover:text-white"
                                : "bg-[#e4e6eb] hover:bg-[#ff4d4d] text-[#050505] hover:text-white"
                            }`}
                    >
                        <Flag size={14} />
                        Report
                    </button>
                )}
            </div>

            {/* ===== Divider between social-action groups ===== */}
            <div className="my-2 border-t border-[#dddfe2] dark:border-[#3e4042]" />

            {/* ===== Row 2: Follow / Following ===== */}
            <div className="flex flex-wrap items-center gap-2">
                {isFollowing ? (
                    <div className="relative">
                        <ActionButton
                            onClick={() => setOpenMenu(openMenu === "following" ? null : "following")}
                            loading={isLoading("unfollow")}
                            icon={<FaUserCheck size={14} />}
                            themeKey={themeKey}
                            variant="success"
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
                ) : (
                    <ActionButton
                        onClick={handleFollow}
                        loading={isLoading("follow")}
                        icon={<FaUserPlus size={14} />}
                        themeKey={themeKey}
                        variant="secondary"
                    >
                        Follow
                    </ActionButton>
                )}
            </div>
        </div>
    );
}
