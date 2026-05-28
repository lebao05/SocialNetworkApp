import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { currentUser } from "../../data/mockData";

// Individual row handler component with light theme values
const MenuItem = ({ imgUrl, iconBg, iconLabel, label, active = false }) => (
  <div
    className={`flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer select-none transition-colors ${
      active ? "bg-[#E7F3FF] text-[#1877F2]" : "hover:bg-[#F2F2F2] text-[#050505]"
    }`}
  >
    <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
      {imgUrl ? (
        <img src={imgUrl} alt={label} className="w-9 h-9 object-cover rounded-full" />
      ) : (
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xl shadow-sm ${iconBg || "bg-gray-100"}`}>
          {iconLabel}
        </div>
      )}
    </div>
    <span className={`text-[15px] ${active ? "font-semibold" : "font-medium"}`}>{label}</span>
  </div>
);

export default function LeftSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Main menu primary structural data
  const primaryMenu = [
    { id: "friends", label: "Friends", iconLabel: "👥", iconBg: "bg-gradient-to-r from-blue-400 to-blue-600 text-white", active: true },
    { id: "memories", label: "Memories", iconLabel: "🕐", iconBg: "bg-gradient-to-r from-cyan-400 to-blue-500 text-white" },
    { id: "saved", label: "Saved", iconLabel: "🔖", iconBg: "bg-gradient-to-r from-purple-500 to-indigo-600 text-white" },
    { id: "groups", label: "Groups", iconLabel: "👥", iconBg: "bg-gradient-to-r from-teal-400 to-emerald-500 text-white" },
    { id: "reels", label: "Reels", iconLabel: "🎬", iconBg: "bg-gradient-to-r from-pink-500 to-rose-500 text-white" },
    { id: "marketplace", label: "Marketplace", iconLabel: "🛒", iconBg: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white" },
    { id: "feeds", label: "Feed", iconLabel: "📋", iconBg: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" },
  ];

  // Secondary sub-level lists data
  const extendedMenu = [
    { id: "meta-ai", label: "Meta AI", iconLabel: "🔮", iconBg: "bg-gradient-to-tr from-purple-600 via-pink-500 to-blue-500 text-white" },
    { id: "chat-ai", label: "Chat with AI", iconLabel: "✨", iconBg: "bg-gradient-to-r from-sky-400 to-blue-500 text-white" },
    { id: "gaming", label: "Gaming", iconLabel: "🎮", iconBg: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" },
    { id: "orders", label: "Orders & Payments", iconLabel: "💳", iconBg: "bg-gradient-to-r from-slate-600 to-slate-800 text-white" },
    { id: "dating", label: "Dating", iconLabel: "❤️", iconBg: "bg-gradient-to-r from-pink-500 to-red-500 text-white" },
    { id: "messenger", label: "Messenger", iconLabel: "💬", iconBg: "bg-gradient-to-tr from-blue-500 via-pink-500 to-purple-500 text-white" },
    { id: "birthdays", label: "Birthdays", iconLabel: "🎁", iconBg: "bg-gradient-to-r from-pink-400 to-purple-500 text-white" },
    { id: "events", label: "Events", iconLabel: "📅", iconBg: "bg-gradient-to-r from-red-500 to-orange-500 text-white" },
  ];

  // Realistic Shortcut Group Data array constructed from image_7b5ac.png
  const userShortcuts = [
    { id: "group-1", name: "Diễn Đàn Kết Nối Đam Mê Phân Khối Lớn Trên Cung Đàn S.", short: "🏍️" },
    { id: "group-2", name: "Cung Đường Phượt Bụi ( Biker Việt Nam )", short: "⛰️" },
    { id: "group-3", name: "EC-23HTTT", short: "💻" },
    { id: "group-4", name: "Cờ vua", short: "♟️" },
    { id: "group-5", name: "Thiết kế phần mềm 23KTPM1", short: "🛠️" },
    { id: "group-6", name: "Tuyển dụng NodeJS/ReactJS VietNam", short: "💼" },
    { id: "group-7", name: "Tài liệu - HCMUS", short: "📚" },
    { id: "group-8", name: "TRƯỜNG ĐẠI HỌC KHOA HỌC TỰ NHIÊN - ĐHQG TP. HCM", short: "🏫" },
    { id: "group-9", name: "Chợ PKL Việt Nam", short: "🏁" },
    { id: "group-10", name: "Đi phượt bằng xe máy", short: "🛵" },
    { id: "group-11", name: "The Forum IELTS Community", short: "📝" },
    { id: "group-12", name: "8 Ball Pool", short: "🎱" },
  ];

  return (
    <aside className="hidden lg:flex fixed top-14 left-0 w-[280px] h-[calc(100vh-56px)] overflow-y-auto p-2 bg-white flex-col border-r border-[#ced0d4] select-none z-10 scrollbar-thin">
      
      {/* Profile Header Block link */}
      <Link 
        to="/profile" 
        className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-[#F2F2F2] mb-1 text-inherit no-underline"
      >
        <img 
          src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} 
          alt="avatar" 
          className="w-9 h-9 rounded-full object-cover border border-black/10 shadow-sm" 
        />
        <span className="text-[15px] font-semibold text-[#050505] truncate">{currentUser?.name || "Lê Bảo"}</span>
      </Link>

      {/* Main Structural Navigation Links */}
      {primaryMenu.map((item) => (
        <MenuItem key={item.id} iconLabel={item.iconLabel} iconBg={item.iconBg} label={item.label} active={item.active} />
      ))}

      {/* Expand Drawer Container Block */}
      {isExpanded && extendedMenu.map((item) => (
        <MenuItem key={item.id} iconLabel={item.iconLabel} iconBg={item.iconBg} label={item.label} />
      ))}

      {/* Trigger Button component control */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-[#F2F2F2] text-[#050505] transition-colors"
      >
        <div className="w-9 h-9 bg-[#E4E6EB] rounded-full flex items-center justify-center text-black border border-gray-300/40 shadow-sm">
          {isExpanded ? <ChevronUp size={20} className="stroke-[2.5]" /> : <ChevronDown size={20} className="stroke-[2.5]" />}
        </div>
        <span className="text-[15px] font-medium">{isExpanded ? "See less" : "See more"}</span>
      </div>

      <hr className="my-2 border-[#ced0d4]" />

      {/* ========================================== */}
      {/* SHORTCUTS ROW LIST (image_72b5ac.png) */}
      {/* ========================================== */}
      <div className="flex items-center justify-between px-2 mb-1.5">
        <p className="text-[#65676B] font-semibold text-[15px]">Your Shortcuts</p>
        <button type="button" className="text-[#1877F2] hover:bg-[#F2F2F2] px-2 py-0.5 rounded-md text-[14px] transition">
          Edit
        </button>
      </div>

      <div className="space-y-0.5 flex-1">
        {userShortcuts.map((shortcut) => (
          <div 
            key={shortcut.id}
            className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-[#F2F2F2] text-[#050505] transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center text-lg flex-shrink-0 shadow-sm border border-black/5">
              {shortcut.short}
            </div>
            <span className="text-[14.5px] font-medium truncate leading-tight">{shortcut.name}</span>
          </div>
        ))}
      </div>

      {/* Bottom toggle close button item helper */}
      <div 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-[#F2F2F2] text-[#050505] mt-1"
      >
        <div className="w-9 h-9 bg-[#E4E6EB] rounded-full flex items-center justify-center text-black shadow-sm">
          <ChevronUp size={18} />
        </div>
        <span className="text-[14.5px] font-medium">Ẩn bớt</span>
      </div>

      {/* ========================================== */}
      {/* LEGAL FOOTER PARAGRAPH (image_72b5ac.png) */}
      {/* ========================================== */}
      <div className="px-2 py-4 text-[12px] text-[#65676B] leading-normal tracking-wide border-t border-[#ced0d4]/60 mt-2">
        <p className="hover:underline cursor-pointer inline">Privacy</p> {" · "}
        <p className="hover:underline cursor-pointer inline">Terms</p> {" · "}
        <p className="hover:underline cursor-pointer inline">Ads</p> {" · "}
        <p className="hover:underline cursor-pointer inline">Ad Choices</p> {" · "}
        <p className="hover:underline cursor-pointer inline">Cookies</p> {" · "}
        <p className="hover:underline cursor-pointer inline">See more</p>
        <p className="mt-1 text-gray-400 select-none">Meta © 2026</p>
      </div>

    </aside>
  );
}