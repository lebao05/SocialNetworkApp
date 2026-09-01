import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Bell,
  Grid3X3,
  ChevronDown,
  Home,
  Tv2,
  UsersRound,
  Users,
  Gamepad2,
  Edit,
  Maximize2,
  MoreHorizontal,
  User,
  LogOut,
} from "lucide-react";
import { GrGroup } from "react-icons/gr";
import { useAuth } from "../../contexts/authContext";
import { useChat } from "../../contexts/ChatContext";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { useSearchEngineContext } from "../../contexts/SearchEngineContext";
import NotificationDropdown from "./NotificationDropdown";
import Logo from "../Logo";
import { getSystemMessagePreview } from "../../utils/systemMessage";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;
const DEFAULT_CHAT_GROUP_COVER = import.meta.env.VITE_DEFAULT_CHAT_GROUP_COVER;

// ── Messenger Dropdown Panel ───────────────────────────────────────────────────
function MessengerDropdown({ onClose }) {
  const navigate = useNavigate();
  const { conversations, isOnline, conversationFilter, setConversationFilter } = useChat();
  const handleOpenAll = () => {
    navigate("/messenger");
    onClose();
  };

  const handleOpenConv = (conv) => {
    const idToUse = conv.isNotInAConversation ? conv.otherUserId : conv.id;
    navigate(`/messenger/${idToUse}`);
    onClose();
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div
      className="absolute top-full right-0 mt-2 w-[360px] bg-white rounded-2xl overflow-hidden z-50"
      style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.18)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 className="text-[22px] font-bold text-fb-text">Chats</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={handleOpenAll}
            className="w-9 h-9 cursor-pointer bg-fb-bg hover:bg-fb-hover rounded-full flex items-center justify-center text-fb-text transition-colors"
            title="Open Messenger"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>


      {/* Tabs */}
      <div className="flex gap-2 px-4 pb-2">
        {[
          { key: "all", label: "All" },
          { key: "unread", label: "Unread" },
          { key: "groups", label: "Groups" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setConversationFilter(t.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
              ${conversationFilter === t.key ? "bg-blue-100 text-fb-blue" : "bg-fb-bg text-fb-text hover:bg-fb-hover"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Conversation list */}
      <div className="overflow-y-auto max-h-[400px]">
        {conversations.length === 0 && (
          <p className="text-sm text-fb-subtext text-center py-8">No conversations yet</p>
        )}
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => handleOpenConv(conv)}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-fb-hover cursor-pointer transition-colors"
          >
            <div className="relative flex-shrink-0">
              <img
                src={conv.imageUrl || conv.otherUserAvatarUrl || (conv.isOneToOne ? DEFAULT_AVATAR : DEFAULT_CHAT_GROUP_COVER)}
                className="w-14 h-14 rounded-full object-cover"
                alt={conv.name}
              />
              {conv.isOneToOne && conv.otherUserId && isOnline(conv.otherUserId) && (
                <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p
                  className={`text-[15px] truncate
                  ${(conv.unreadCount ?? 0) > 0 ? "font-bold text-fb-text" : "font-medium text-fb-text"}`}
                >
                  {conv.name}
                </p>
                <span
                  className={`text-xs flex-shrink-0 ml-2
                  ${(conv.unreadCount ?? 0) > 0 ? "text-fb-blue font-semibold" : "text-fb-subtext"}`}
                >
                  {formatTime(conv.lastMessage?.createdAt)}
                </span>
              </div>
              <p className="text-sm text-fb-subtext truncate mt-0.5">
                {conv.lastMessage?.isSystemMessage
                  ? getSystemMessagePreview(conv.lastMessage)
                  : (conv.lastMessage?.content || "Sent an attachment")}
              </p>
            </div>
            {(conv.unreadCount ?? 0) > 0 && (
              <span className="w-5 h-5 bg-fb-blue rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                {conv.unreadCount}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ boxShadow: "0 -1px 0 #E4E6EB" }}>
        <button
          onClick={handleOpenAll}
          className="w-full cursor-pointer py-3 text-center text-sm font-semibold text-fb-blue hover:bg-fb-hover transition-colors"
        >
          See all in Messenger
        </button>
      </div>
    </div>
  );
}

// ── Nav Tab ────────────────────────────────────────────────────────────────────
function NavTab({ icon: Icon, active, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center w-[116px] h-14 cursor-pointer transition-colors
        ${active ? "text-fb-blue border-b-[3px] border-fb-blue" : "text-[#65676B] hover:bg-fb-hover rounded-xl"}`}
    >
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      {badge > 0 && (
        <span className="absolute top-2 right-3 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {badge}
        </span>
      )}
    </button>
  );
}

// ── Action Button ─────────────────────────────────────────────────────────────
function ActionBtn({ children, badge, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0
        ${active ? "bg-blue-100 text-fb-blue" : "bg-[#E4E6EB] hover:bg-[#D8DADF] text-fb-text"}`}
    >
      {children}
      {badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {badge}
        </span>
      )}
    </button>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const { conversations } = useChat();
  const { unseenCount } = useNotificationContext();
  const { query, search } = useSearchEngineContext();
  const [showMessenger, setShowMessenger] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");
  const messengerRef = useRef(null);
  const notificationRef = useRef(null);
  const profileMenuRef = useRef(null);

  const isMessengerPage = location.pathname.startsWith("/messenger");
  const isNotificationsPage = location.pathname.startsWith("/notifications");
  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0);

  useEffect(() => {
    const handler = (e) => {
      if (messengerRef.current && !messengerRef.current.contains(e.target)) {
        setShowMessenger(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleViewProfile = () => {
    setShowProfileMenu(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
    navigate("/signin");
  };

  const navTabs = [
    { icon: Home, path: "/" },
    { icon: Users, path: "/friends" },
    { icon: Tv2, path: "/watch" },
    { icon: GrGroup, path: "/groups" },
  ];

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      search(searchInputValue.trim());
      setSearchFocused(false);
      if (location.pathname !== "/search") {
        navigate("/search");
      }
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-white h-14 flex items-center px-4 justify-between"
      style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
    >
      {/* ── Left ── */}
      <div className="flex items-center gap-2 min-w-[240px]">
        <Link to="/" className="flex-shrink-0 flex items-center" aria-label="SocialNet home">
          <Logo iconSize={40} />
        </Link>
        <div
          className={`flex items-center bg-[#F0F2F5] rounded-full px-3 py-2 gap-2 transition-all
            ${searchFocused ? "ring-2 ring-fb-blue" : ""}`}
        >
          <Search size={15} className="text-fb-subtext flex-shrink-0" />
          <input
            className="bg-transparent outline-none text-sm w-44 placeholder-fb-subtext"
            placeholder="Search on SocialNet"
            value={searchInputValue}
            onChange={(event) => setSearchInputValue(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div>

      {/* ── Center Tabs ── */}
      <div className="flex items-stretch h-14">
        {navTabs.map(({ icon, path }) => (
          <NavTab key={path} icon={icon} active={location.pathname === path} onClick={() => navigate(path)} />
        ))}
      </div>

      {/* ── Right Actions ── */}
      <div className="flex items-center gap-2 min-w-[240px] justify-end">
      

        {/* Messenger — hidden when on /messenger page */}
        {!isMessengerPage && (
          <div className="relative" ref={messengerRef}>
            <ActionBtn badge={totalUnread} active={showMessenger} onClick={() => setShowMessenger((v) => !v)}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.836 1.396 5.372 3.584 7.04V22l3.26-1.79c.87.24 1.79.37 2.745.37C17.523 20.58 22 16.435 22 11.337 22 6.238 17.523 2 12 2zm1.2 12.23l-3.048-3.25-5.952 3.25 6.55-6.95 3.12 3.25 5.88-3.25-6.55 6.95z" />
              </svg>
            </ActionBtn>
            {showMessenger && <MessengerDropdown onClose={() => setShowMessenger(false)} />}
          </div>
        )}

        {!isNotificationsPage && (
          <div className="relative" ref={notificationRef}>
            <ActionBtn badge={unseenCount} active={showNotifications} onClick={() => setShowNotifications((v) => !v)}>
              <Bell size={18} />
            </ActionBtn>
            {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
          </div>
        )}

        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu((v) => !v)}
            className="flex items-center gap-0.5 cursor-pointer group"
            aria-haspopup="menu"
            aria-expanded={showProfileMenu}
          >
            <img
              src={authUser?.avatarUrl || DEFAULT_AVATAR}
              alt={authUser ? `${authUser.firstName} ${authUser.lastName}` : "avatar"}
              className={`w-10 h-10 rounded-full object-cover transition-all
                ${showProfileMenu ? "ring-2 ring-fb-blue" : "hover:ring-2 hover:ring-fb-blue"}`}
            />
            <ChevronDown
              size={14}
              className={`text-fb-subtext group-hover:text-fb-text transition-all
                ${showProfileMenu ? "rotate-180 text-fb-text" : ""}`}
            />
          </button>

          {showProfileMenu && (
            <div
              className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl overflow-hidden z-50"
              style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.18)" }}
              role="menu"
            >
              {/* User header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-fb-hover">
                <img
                  src={authUser?.avatarUrl || DEFAULT_AVATAR}
                  alt={authUser ? `${authUser.firstName} ${authUser.lastName}` : "avatar"}
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-fb-text truncate">
                    {authUser ? `${authUser.firstName} ${authUser.lastName}` : "User"}
                  </p>
                  <p className="text-xs text-fb-subtext truncate">
                    {authUser?.email || ""}
                  </p>
                </div>
              </div>

              {/* Items */}
              <button
                type="button"
                onClick={handleViewProfile}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-fb-hover transition-colors text-fb-text cursor-pointer"
                role="menuitem"
              >
                <User size={16} className="text-fb-subtext" />
                <span className="text-sm font-medium">View my profile</span>
              </button>

              <div className="border-t border-fb-hover" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-fb-hover transition-colors text-fb-text cursor-pointer"
                role="menuitem"
              >
                <LogOut size={16} className="text-fb-subtext" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
