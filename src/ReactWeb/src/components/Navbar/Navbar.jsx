import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  MessageCircle,
  Bell,
  Grid3X3,
  ChevronDown,
  Home,
  Users,
  Tv2,
  Store,
  Gamepad2,
  Edit,
  Maximize2,
  MoreHorizontal,
} from "lucide-react";
import { currentUser, conversations } from "../../data/mockData";

// ── Messenger Dropdown Panel ───────────────────────────────────────────────────
function MessengerDropdown({ onClose }) {
  const navigate = useNavigate();

  const handleOpenAll = () => {
    navigate("/messenger");
    onClose();
  };

  const handleOpenConv = (conv) => {
    navigate(`/messenger/${conv.id}`);
    onClose();
  };

  return (
    <div
      className="absolute top-full right-0 mt-2 w-[360px] bg-white rounded-2xl overflow-hidden z-50"
      style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.18)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 className="text-[22px] font-bold text-fb-text">Đoạn chat</h2>
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 bg-fb-bg hover:bg-fb-hover rounded-full flex items-center justify-center text-fb-text transition-colors">
            <MoreHorizontal size={18} />
          </button>
          <button
            onClick={handleOpenAll}
            className="w-9 h-9 bg-fb-bg hover:bg-fb-hover rounded-full flex items-center justify-center text-fb-text transition-colors"
            title="Mở Messenger"
          >
            <Maximize2 size={16} />
          </button>
          <button className="w-9 h-9 bg-fb-bg hover:bg-fb-hover rounded-full flex items-center justify-center text-fb-text transition-colors">
            <Edit size={16} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="flex items-center bg-fb-bg rounded-full px-3 py-2 gap-2">
          <Search size={14} className="text-fb-subtext flex-shrink-0" />
          <input
            className="bg-transparent outline-none text-sm flex-1 placeholder-fb-subtext"
            placeholder="Tìm kiếm trên Messenger"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 pb-2">
        {["Tất cả", "Chưa đọc", "Nhóm"].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
              ${i === 0 ? "bg-blue-100 text-fb-blue" : "bg-fb-bg text-fb-text hover:bg-fb-hover"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Conversation list */}
      <div className="overflow-y-auto max-h-[400px]">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => handleOpenConv(conv)}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-fb-hover cursor-pointer transition-colors"
          >
            <div className="relative flex-shrink-0">
              <img src={conv.avatar} className="w-14 h-14 rounded-full object-cover" alt={conv.name} />
              {conv.online && !conv.isGroup && (
                <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p
                  className={`text-[15px] truncate
                  ${conv.unread ? "font-bold text-fb-text" : "font-medium text-fb-text"}`}
                >
                  {conv.name}
                </p>
                <span
                  className={`text-xs flex-shrink-0 ml-2
                  ${conv.unread ? "text-fb-blue font-semibold" : "text-fb-subtext"}`}
                >
                  {conv.time}
                </span>
              </div>
              <p
                className={`text-sm truncate
                ${conv.unread ? "font-semibold text-fb-text" : "text-fb-subtext"}`}
              >
                {conv.lastMessage}
              </p>
            </div>
            {conv.unread > 0 && (
              <span className="w-5 h-5 bg-fb-blue rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                {conv.unread}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ boxShadow: "0 -1px 0 #E4E6EB" }}>
        <button
          onClick={handleOpenAll}
          className="w-full py-3 text-center text-sm font-semibold text-fb-blue hover:bg-fb-hover transition-colors"
        >
          Xem tất cả trong Messenger
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
  const [showMessenger, setShowMessenger] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const messengerRef = useRef(null);

  const isMessengerPage = location.pathname.startsWith("/messenger");
  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread || 0), 0);

  useEffect(() => {
    const handler = (e) => {
      if (messengerRef.current && !messengerRef.current.contains(e.target)) {
        setShowMessenger(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navTabs = [
    { icon: Home, path: "/" },
    { icon: Users, path: "/friends" },
    { icon: Tv2, path: "/watch" },
    { icon: Store, path: "/marketplace" },
    { icon: Gamepad2, path: "/gaming" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-white h-14 flex items-center px-4 justify-between"
      style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
    >
      {/* ── Left ── */}
      <div className="flex items-center gap-2 min-w-[240px]">
        <Link to="/" className="flex-shrink-0">
          <svg className="w-10 h-10" viewBox="0 0 36 36" fill="#1877F2">
            <path d="M36 18C36 8.059 27.941 0 18 0S0 8.059 0 18c0 8.988 6.584 16.436 15.188 17.79V23.25h-4.57V18h4.57v-3.956c0-4.513 2.686-7.006 6.797-7.006 1.97 0 4.03.352 4.03.352v4.43h-2.27c-2.236 0-2.932 1.387-2.932 2.81V18h4.992l-.798 5.25h-4.194V35.79C29.416 34.437 36 26.988 36 18z" />
          </svg>
        </Link>
        <div
          className={`flex items-center bg-[#F0F2F5] rounded-full px-3 py-2 gap-2 transition-all
            ${searchFocused ? "ring-2 ring-fb-blue" : ""}`}
        >
          <Search size={15} className="text-fb-subtext flex-shrink-0" />
          <input
            className="bg-transparent outline-none text-sm w-44 placeholder-fb-subtext"
            placeholder="Tìm kiếm trên Facebook"
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
        <ActionBtn>
          <Grid3X3 size={18} />
        </ActionBtn>

        {/* Messenger — ẩn khi đang ở trang /messenger */}
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

        <ActionBtn badge={5}>
          <Bell size={18} />
        </ActionBtn>

        <div className="flex items-center gap-0.5 cursor-pointer group">
          <img
            src={currentUser.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-fb-blue transition-all"
          />
          <ChevronDown size={14} className="text-fb-subtext group-hover:text-fb-text transition-colors" />
        </div>
      </div>
    </nav>
  );
}
