import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  BriefcaseBusiness,
  ChevronDown,
  ChevronUp,
  Clapperboard,
  Clock3,
  FileText,
  Gift,
  MessageCircle,
  Mountain,
  Sparkles,
  Users,
} from "lucide-react";
import { FaChessPawn, FaMotorcycle } from "react-icons/fa";
import { GiEightBall, GiFinishLine, GiSchoolBag } from "react-icons/gi";
import { IoPeople } from "react-icons/io5";
import { MdGroups, MdOutlineComputer, MdOutlineDesignServices } from "react-icons/md";
import { currentUser } from "../../data/mockData";

const MenuItem = ({ imgUrl, icon: Icon, iconBg, label, active = false, to }) => {
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
      <span className={`truncate text-[15px] ${active ? "font-semibold" : "font-medium"}`}>{label}</span>
    </>
  );
  const className = `flex items-center gap-3 rounded-lg px-2 py-2 transition-colors ${
    active ? "bg-[#E7F3FF] text-[#1877F2]" : "text-[#050505] hover:bg-[#F2F2F2]"
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

const ShortcutItem = ({ icon: Icon, name }) => (
  <div className="flex items-center gap-3 rounded-lg px-2 py-2 text-[#050505] transition-colors hover:bg-[#F2F2F2]">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/5 bg-gradient-to-tr from-gray-200 to-gray-300 shadow-sm">
      <Icon size={19} className="text-[#374151]" />
    </div>
    <span className="truncate text-[14.5px] font-medium leading-tight">{name}</span>
  </div>
);

export default function LeftSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const primaryMenu = [
    { id: "friends", label: "Friends", icon: Users, iconBg: "bg-gradient-to-r from-blue-400 to-blue-600", active: true },
    { id: "memories", label: "Memories", icon: Clock3, iconBg: "bg-gradient-to-r from-cyan-400 to-blue-500" },
    { id: "saved", label: "Saved", icon: Bookmark, iconBg: "bg-gradient-to-r from-purple-500 to-indigo-600" },
    { id: "groups", label: "Groups", icon: MdGroups, iconBg: "bg-gradient-to-r from-teal-400 to-emerald-500" },
    { id: "reels", label: "Reels", icon: Clapperboard, iconBg: "bg-gradient-to-r from-pink-500 to-rose-500", to: "/watch" },
    { id: "feeds", label: "Feed", icon: FileText, iconBg: "bg-gradient-to-r from-blue-600 to-indigo-600" },
  ];

  const extendedMenu = [
    { id: "chat-ai", label: "Chat with AI", icon: Sparkles, iconBg: "bg-gradient-to-r from-sky-400 to-blue-500" },
    { id: "messenger", label: "Messenger", icon: MessageCircle, iconBg: "bg-gradient-to-tr from-blue-500 via-pink-500 to-purple-500" },
    { id: "birthdays", label: "Birthdays", icon: Gift, iconBg: "bg-gradient-to-r from-pink-400 to-purple-500" },
  ];

  const userShortcuts = [
    { id: "group-1", name: "Diễn Đàn Kết Nối Đam Mê Phân Khối Lớn Trên Cung Đàn S.", icon: FaMotorcycle },
    { id: "group-2", name: "Cung Đường Phượt Bụi ( Biker Việt Nam )", icon: Mountain },
    { id: "group-3", name: "EC-23HTTT", icon: MdOutlineComputer },
    { id: "group-4", name: "Cờ vua", icon: FaChessPawn },
    { id: "group-5", name: "Thiết kế phần mềm 23KTPM1", icon: MdOutlineDesignServices },
    { id: "group-6", name: "Tuyển dụng NodeJS/ReactJS VietNam", icon: BriefcaseBusiness },
    { id: "group-7", name: "Tài liệu - HCMUS", icon: GiSchoolBag },
    { id: "group-8", name: "TRƯỜNG ĐẠI HỌC KHOA HỌC TỰ NHIÊN - ĐHQG TP. HCM", icon: IoPeople },
    { id: "group-9", name: "Chợ PKL Việt Nam", icon: GiFinishLine },
    { id: "group-10", name: "Đi phượt bằng xe máy", icon: FaMotorcycle },
    { id: "group-11", name: "The Forum IELTS Community", icon: FileText },
    { id: "group-12", name: "8 Ball Pool", icon: GiEightBall },
  ];

  return (
    <aside className="scrollbar-thin fixed left-0 top-14 z-10 hidden h-[calc(100vh-56px)] w-[280px] select-none flex-col overflow-y-auto border-r border-[#ced0d4] bg-white p-2 lg:flex">
      <Link to="/profile" className="mb-1 flex items-center gap-3 rounded-lg px-2 py-2 text-inherit no-underline hover:bg-[#F2F2F2]">
        <img
          src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
          alt="avatar"
          className="h-9 w-9 rounded-full border border-black/10 object-cover shadow-sm"
        />
        <span className="truncate text-[15px] font-semibold text-[#050505]">{currentUser?.name || "Lê Bảo"}</span>
      </Link>

      {primaryMenu.map((item) => (
        <MenuItem key={item.id} icon={item.icon} iconBg={item.iconBg} label={item.label} active={item.active} to={item.to} />
      ))}

      {isExpanded &&
        extendedMenu.map((item) => (
          <MenuItem key={item.id} icon={item.icon} iconBg={item.iconBg} label={item.label} />
        ))}

      <button
        type="button"
        onClick={() => setIsExpanded((value) => !value)}
        className="flex items-center gap-3 rounded-lg px-2 py-2 text-[#050505] transition-colors hover:bg-[#F2F2F2]"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300/40 bg-[#E4E6EB] text-black shadow-sm">
          {isExpanded ? <ChevronUp size={20} strokeWidth={2.5} /> : <ChevronDown size={20} strokeWidth={2.5} />}
        </div>
        <span className="text-[15px] font-medium">{isExpanded ? "See less" : "See more"}</span>
      </button>

      <hr className="my-2 border-[#ced0d4]" />

      <div className="mb-1.5 flex items-center justify-between px-2">
        <p className="text-[15px] font-semibold text-[#65676B]">Your Shortcuts</p>
        <button type="button" className="rounded-md px-2 py-0.5 text-[14px] text-[#1877F2] transition hover:bg-[#F2F2F2]">
          Edit
        </button>
      </div>

      <div className="flex-1 space-y-0.5">
        {userShortcuts.map((shortcut) => (
          <ShortcutItem key={shortcut.id} icon={shortcut.icon} name={shortcut.name} />
        ))}
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="mt-1 flex items-center gap-3 rounded-lg px-2 py-2 text-[#050505] hover:bg-[#F2F2F2]"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E4E6EB] text-black shadow-sm">
          <ChevronUp size={18} />
        </div>
        <span className="text-[14.5px] font-medium">Ẩn bớt</span>
      </button>

      <div className="mt-2 border-t border-[#ced0d4]/60 px-2 py-4 text-[12px] leading-normal tracking-wide text-[#65676B]">
        <p className="inline cursor-pointer hover:underline">Privacy</p> {" · "}
        <p className="inline cursor-pointer hover:underline">Terms</p> {" · "}
        <p className="inline cursor-pointer hover:underline">Ads</p> {" · "}
        <p className="inline cursor-pointer hover:underline">Ad Choices</p> {" · "}
        <p className="inline cursor-pointer hover:underline">Cookies</p> {" · "}
        <p className="inline cursor-pointer hover:underline">See more</p>
        <p className="mt-1 select-none text-gray-400">Meta © 2026</p>
      </div>
    </aside>
  );
}
