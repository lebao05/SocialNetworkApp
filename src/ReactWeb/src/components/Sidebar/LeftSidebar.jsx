import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bookmark,
  Clapperboard,
  Clock3,
  FileText,
  Gift,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";
import { MdGroups } from "react-icons/md";
import { currentUser } from "../../data/mockData";

const MenuItem = ({ imgUrl, icon: Icon, iconBg, label, to, isActive = false }) => {
  const content = (
    <>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center">
        {imgUrl ? (
          <img src={imgUrl} alt={label} className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <div className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm ${iconBg}`}>
            <Icon size={20} className="text-white" />
          </div>
        )}
      </div>
      <span className={`truncate text-[15px] ${isActive ? "font-semibold" : "font-medium"}`}>{label}</span>
    </>
  );
  const className = `flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors ${
    isActive ? "bg-[#E7F3FF] text-[#1877F2]" : "text-[#050505] hover:bg-[#F2F2F2]"
  }`;

  if (to) {
    return (
      <Link to={to} className={`${className} no-underline`}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
};


export default function LeftSidebar() {
  const location = useLocation();

  const primaryMenu = [
    { id: "friends", label: "Friends", icon: Users, iconBg: "bg-gradient-to-r from-blue-400 to-blue-600", to: "/friends" },
    { id: "memories", label: "Memories", icon: Clock3, iconBg: "bg-gradient-to-r from-cyan-400 to-blue-500", to: "/memories" },
    { id: "saved", label: "Saved", icon: Bookmark, iconBg: "bg-gradient-to-r from-purple-500 to-indigo-600", to: "/saved" },
    { id: "groups", label: "Groups", icon: MdGroups, iconBg: "bg-gradient-to-r from-teal-400 to-emerald-500", to: "/groups" },
    { id: "reels", label: "Reels", icon: Clapperboard, iconBg: "bg-gradient-to-r from-pink-500 to-rose-500", to: "/watch" },
    { id: "feeds", label: "Feed", icon: FileText, iconBg: "bg-gradient-to-r from-blue-600 to-indigo-600", to: "/feeds" },
  ];

  const extendedMenu = [
    { id: "chat-ai", label: "Chat with AI", icon: Sparkles, iconBg: "bg-gradient-to-r from-sky-400 to-blue-500", to: "/chat-ai" },
    { id: "messenger", label: "Messenger", icon: MessageCircle, iconBg: "bg-gradient-to-tr from-blue-500 via-pink-500 to-purple-500", to: "/messenger" },
    { id: "birthdays", label: "Birthdays", icon: Gift, iconBg: "bg-gradient-to-r from-pink-400 to-purple-500", to: "/birthdays" },
  ];

  const userShortcuts = [];

  return (
    <aside className="scrollbar-thin fixed left-0 top-14 z-10 hidden h-[calc(100vh-56px)] w-[280px] select-none flex-col overflow-y-auto border-r border-[#ced0d4] bg-white p-2 lg:flex">
      <Link to="/profile" className="mb-1 flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-inherit no-underline hover:bg-[#F2F2F2]">
        <img
          src={currentUser?.avatar || import.meta.env.VITE_DEFAULT_AVATAR}
          alt="avatar"
          className="h-9 w-9 rounded-full border border-black/10 object-cover shadow-sm"
        />
        <span className="truncate text-[15px] font-semibold text-[#050505]">{currentUser?.name || "User"}</span>
      </Link>

      {primaryMenu.map((item) => (
        <MenuItem key={item.id} icon={item.icon} iconBg={item.iconBg} label={item.label} to={item.to} />
      ))}

      {extendedMenu.map((item) => (
        <MenuItem key={item.id} icon={item.icon} iconBg={item.iconBg} label={item.label} to={item.to} />
      ))}

      <hr className="my-2 border-[#ced0d4]" />
    </aside>
  );
}
