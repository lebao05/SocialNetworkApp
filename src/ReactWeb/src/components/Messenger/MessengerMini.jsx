import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { conversations } from "../../data/mockData";

// ── Dropdown khi click vào tên trong MiniChatBox ──────────────────────────────
function NameDropdown({ conv, onClose }) {
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const items = [
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 8h-1V6A5 5 0 007 6v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2zm-6 9a2 2 0 110-4 2 2 0 010 4zm3.1-9H8.9V6a3.1 3.1 0 016.2 0v2z" />
        </svg>
      ),
      label: "Được mã hóa đầu cuối",
      dividerAfter: false,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.836 1.396 5.372 3.584 7.04V22l3.26-1.79c.87.24 1.79.37 2.745.37C17.523 20.58 22 16.435 22 11.337 22 6.238 17.523 2 12 2zm1.2 12.23l-3.048-3.25-5.952 3.25 6.55-6.95 3.12 3.25 5.88-3.25-6.55 6.95z" />
        </svg>
      ),
      label: "Mở trong Messenger",
      action: () => {
        navigate(`/messenger/${conv.id}`);
        onClose();
      },
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" />
        </svg>
      ),
      label: "Xem trang cá nhân",
      dividerAfter: true,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" />
        </svg>
      ),
      label: "Đổi chủ đề",
      blue: true,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
        </svg>
      ),
      label: "Biểu tượng cảm xúc",
      blue: true,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
        </svg>
      ),
      label: "Biệt danh",
      dividerAfter: true,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      ),
      label: "Tạo nhóm",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>
      ),
      label: "Tắt thông báo",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" />
        </svg>
      ),
      label: "Chặn",
    },
  ];

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-1 w-[260px] bg-white rounded-2xl border border-gray-100 py-2 z-[999]"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
    >
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <button
            onClick={item.action || undefined}
            className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-fb-hover cursor-pointer transition-colors text-left
              ${item.blue ? "text-fb-blue" : "text-fb-text"}`}
          >
            <span className={`flex-shrink-0 ${item.blue ? "text-fb-blue" : "text-fb-subtext"}`}>{item.icon}</span>
            <span className="text-[15px] font-medium">{item.label}</span>
          </button>
          {item.dividerAfter && <hr className="my-1 border-fb-sidebar mx-2" />}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Mini Chat Box ─────────────────────────────────────────────────────────────
// ✅ Dùng key={contact.id} ở nơi render để tự reset — không cần useEffect sync state
export function MiniChatBox({ contact, onClose }) {
  const conv = conversations.find((c) => c.name.toLowerCase() === contact.name.toLowerCase()) || {
    id: contact.id,
    name: contact.name,
    avatar: contact.avatar,
    messages: [],
  };

  // ✅ Khởi tạo trực tiếp từ prop, không dùng useEffect để sync
  const [messages, setMessages] = useState(conv.messages || []);
  const [msg, setMsg] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const bottomRef = useRef(null);

  // Chỉ dùng useEffect để scroll xuống cuối
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), senderId: 1, text: msg, time: "Vừa xong" }]);
    setMsg("");
  };

  return (
    <div
      className="flex flex-col bg-white rounded-t-2xl shadow-2xl border border-gray-200 overflow-visible"
      style={{ width: 328, height: 450 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-fb-sidebar flex-shrink-0">
        {/* Tên — click → dropdown */}
        <div
          className="relative flex items-center gap-2 cursor-pointer flex-1 min-w-0"
          onClick={() => setShowDropdown((v) => !v)}
        >
          <img src={contact.avatar} className="w-8 h-8 rounded-full object-cover flex-shrink-0" alt={contact.name} />
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-sm font-semibold text-fb-text truncate">{contact.name}</span>
            <svg className="w-4 h-4 text-fb-subtext flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </div>
          {showDropdown && <NameDropdown conv={conv} onClose={() => setShowDropdown(false)} />}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button className="w-8 h-8 rounded-full hover:bg-fb-hover flex items-center justify-center text-fb-blue">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57-.11.35-.02.74-.25 1.01l-2.2 2.21z" />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-full hover:bg-fb-hover flex items-center justify-center text-fb-blue">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-full hover:bg-fb-hover flex items-center justify-center text-fb-subtext">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13H5v-2h14v2z" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-fb-hover flex items-center justify-center text-fb-subtext"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1">
        {messages.map((m, idx) => {
          const isMe = m.senderId === 1;
          const prevMsg = messages[idx - 1];
          const showAvatar = !isMe && prevMsg?.senderId !== m.senderId;

          return (
            <div key={m.id} className={`flex items-end gap-1.5 ${isMe ? "justify-end" : "justify-start"}`}>
              {!isMe && (
                <img
                  src={showAvatar ? contact.avatar : ""}
                  className={`w-6 h-6 rounded-full flex-shrink-0 object-cover self-end ${
                    showAvatar ? "opacity-100" : "opacity-0"
                  }`}
                  alt=""
                />
              )}
              <div
                className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed
                  ${isMe ? "bg-fb-blue text-white rounded-br-sm" : "bg-fb-bg text-fb-text rounded-bl-sm"}`}
              >
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-1.5 px-2 py-2 border-t border-fb-sidebar flex-shrink-0">
        <button className="w-8 h-8 rounded-full hover:bg-fb-hover flex items-center justify-center text-fb-blue flex-shrink-0">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1a11 11 0 100 22A11 11 0 0012 1zm1 18h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </button>
        <button className="w-8 h-8 rounded-full hover:bg-fb-hover flex items-center justify-center text-fb-blue flex-shrink-0">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
          </svg>
        </button>
        <button className="w-8 h-8 rounded-full hover:bg-fb-hover flex items-center justify-center text-fb-blue flex-shrink-0">
          <span className="text-[11px] font-bold leading-none">GIF</span>
        </button>

        <div className="flex-1 flex items-center bg-fb-bg rounded-full px-3 py-1.5 gap-1">
          <input
            className="flex-1 bg-transparent outline-none text-sm placeholder-fb-subtext"
            placeholder="Aa"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className="text-fb-subtext hover:text-fb-blue transition-colors flex-shrink-0">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </button>
        </div>

        <button
          onClick={send}
          className="w-8 h-8 rounded-full hover:bg-fb-hover flex items-center justify-center text-fb-blue flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 21L23 12 1 3v7l15 2-15 2v7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function MessengerMini() {
  return null;
}
