import React from "react";
import { currentUser } from "../../data/mockData";

const MenuItem = ({ icon, label, active = false }) => (
  <div
    className={`flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition-colors ${active ? "bg-blue-100 text-fb-blue" : "hover:bg-fb-hover text-fb-text"}`}
  >
    <span className="text-xl w-9 h-9 flex items-center justify-center">{icon}</span>
    <span className="text-[15px] font-medium">{label}</span>
  </div>
);

export default function LeftSidebar() {
  return (
    <aside className="fixed top-14 left-0 w-[280px] h-[calc(100vh-56px)] overflow-y-auto p-2 bg-white">
      {/* User profile */}
      <div className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-fb-hover mb-1">
        <img src={currentUser.avatar} alt="avatar" className="w-9 h-9 rounded-full" />
        <span className="text-[15px] font-semibold">{currentUser.name}</span>
      </div>

      <MenuItem icon="👥" label="Bạn bè" />
      <MenuItem icon="🕐" label="Kỷ niệm" />
      <MenuItem icon="🔖" label="Đã lưu" />
      <MenuItem icon="👥" label="Nhóm" />
      <MenuItem icon="🎬" label="Thước phim" />
      <MenuItem icon="🛒" label="Marketplace" />

      <div className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-fb-hover text-fb-text">
        <span className="w-9 h-9 bg-fb-bg rounded-full flex items-center justify-center text-xl">▾</span>
        <span className="text-[15px] font-medium">Xem thêm</span>
      </div>

      <hr className="my-3 border-fb-sidebar" />

      <p className="px-2 text-fb-subtext font-semibold text-sm mb-2">Lối tắt của bạn</p>
      <div className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-fb-hover">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
          S
        </div>
        <span className="text-[15px] font-medium">Làng "Súp Lơ"</span>
      </div>
      <div className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-fb-hover">
        <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center text-white text-sm font-bold">
          O
        </div>
        <span className="text-[15px] font-medium">OpenClaw VN</span>
      </div>
    </aside>
  );
}
