import React from "react";
import { contacts, ads, birthdays } from "../../data/mockData";

export default function RightSidebar({ onContactClick }) {
  return (
    <aside className="fixed top-14 right-0 w-[280px] h-[calc(100vh-56px)] overflow-y-auto p-4 bg-white z-10">
      {/* Birthday */}
      {birthdays.length > 0 && (
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-fb-hover cursor-pointer mb-3">
          <span className="text-2xl">🎂</span>
          <p className="text-sm text-fb-text">
            <span className="font-semibold">{birthdays[0].name}</span> có sinh nhật hôm nay.
          </p>
        </div>
      )}

      {/* Sponsored */}
      <p className="text-fb-subtext font-semibold text-sm mb-2">Được tài trợ</p>
      {ads.map((ad) => (
        <div key={ad.id} className="flex gap-3 cursor-pointer hover:bg-fb-hover p-2 rounded-lg mb-2">
          <img src={ad.image} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" alt={ad.brand} />
          <div>
            <p className="text-sm text-fb-text leading-snug">{ad.description}</p>
            <p className="text-xs text-fb-subtext mt-1">{ad.url}</p>
          </div>
        </div>
      ))}

      <hr className="border-fb-sidebar my-3" />

      {/* Contacts */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-fb-subtext font-semibold text-sm">Người liên hệ</p>
        <div className="flex gap-1">
          <button className="w-8 h-8 rounded-full hover:bg-fb-hover flex items-center justify-center text-fb-subtext">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-full hover:bg-fb-hover flex items-center justify-center text-fb-subtext font-bold text-lg leading-none">
            ···
          </button>
        </div>
      </div>

      {/* Meta AI */}
      <div className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-fb-hover mb-1">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">M</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[15px] font-medium text-fb-text">Meta AI</span>
          <svg className="w-4 h-4 text-fb-blue" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>
      </div>

      {/* Contact list — click → mở mini chat */}
      {contacts.map((c) => (
        <div
          key={c.id}
          onClick={() => onContactClick && onContactClick(c)}
          className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-fb-hover"
        >
          <div className="relative flex-shrink-0">
            <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full object-cover" />
            {c.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <span className="text-[15px] font-medium text-fb-text">{c.name}</span>
        </div>
      ))}
    </aside>
  );
}
