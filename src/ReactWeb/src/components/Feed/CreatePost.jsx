import React from "react";
import { currentUser } from "../../data/mockData";

export default function CreatePost() {
  return (
    <div className="bg-white rounded-xl shadow p-3">
      <div className="flex items-center gap-3 pb-3 border-b border-fb-sidebar">
        <img src={currentUser.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
        <input
          className="flex-1 bg-fb-bg hover:bg-fb-hover rounded-full px-4 py-2 text-sm text-fb-subtext cursor-pointer outline-none"
          placeholder={`${currentUser.name} ơi, bạn đang nghĩ gì thế?`}
          readOnly
        />
      </div>
      <div className="flex items-center justify-around pt-2">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-fb-hover text-sm font-semibold text-fb-subtext">
          <span className="text-red-500">🎬</span> Video trực tiếp
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-fb-hover text-sm font-semibold text-fb-subtext">
          <span className="text-green-500">🖼️</span> Ảnh/video
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-fb-hover text-sm font-semibold text-fb-subtext">
          <span className="text-yellow-500">😊</span> Cảm xúc/hoạt động
        </button>
      </div>
    </div>
  );
}
