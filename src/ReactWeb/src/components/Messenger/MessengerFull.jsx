import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { conversations } from "../../data/mockData";
import Navbar from "../Navbar/Navbar";

// ══════════════════════════════════════════════════════════════════
// Panel 1 — Conversation List
// ══════════════════════════════════════════════════════════════════
function ConvList({ selected, onSelect }) {
  const [tab, setTab] = useState("all");

  const filtered = conversations.filter((c) => {
    if (tab === "unread") return c.unread > 0;
    if (tab === "group") return c.isGroup;
    return true;
  });

  return (
    <div className="w-[360px] flex flex-col h-full bg-white flex-shrink-0">
      {/* Header */}
      <div className="px-4 pt-5 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-fb-text">Đoạn chat</h1>
          <div className="flex gap-1">
            <button className="w-9 h-9 bg-[#E4E6EB] hover:bg-[#D8DADF] rounded-full flex items-center justify-center text-fb-text transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
            <button className="w-9 h-9 bg-[#E4E6EB] hover:bg-[#D8DADF] rounded-full flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-fb-text" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center bg-[#F0F2F5] rounded-full px-3 py-2 gap-2 mb-3">
          <svg className="w-4 h-4 text-fb-subtext flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          <input
            className="bg-transparent outline-none text-sm flex-1 placeholder-fb-subtext"
            placeholder="Tìm kiếm trên Messenger"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { key: "all", label: "Tất cả" },
            { key: "unread", label: "Chưa đọc" },
            { key: "group", label: "Nhóm" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                ${tab === t.key ? "bg-blue-100 text-fb-blue" : "bg-[#F0F2F5] text-fb-text hover:bg-[#E4E6EB]"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-1">
        {filtered.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv)}
            className={`flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl cursor-pointer transition-colors
              ${selected?.id === conv.id ? "bg-blue-50" : "hover:bg-[#F0F2F5]"}`}
          >
            <div className="relative flex-shrink-0">
              <img src={conv.avatar} className="w-14 h-14 rounded-full object-cover" alt={conv.name} />
              {conv.online && !conv.isGroup && (
                <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
              )}
              {conv.isGroup && (
                <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-fb-blue rounded-full border-2 border-white flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={`text-[15px] truncate ${conv.unread ? "font-bold" : "font-medium"} text-fb-text`}>
                  {conv.name}
                </p>
                <span
                  className={`text-xs flex-shrink-0 ml-2 ${conv.unread ? "text-fb-blue font-semibold" : "text-fb-subtext"}`}
                >
                  {conv.time}
                </span>
              </div>
              <p className={`text-sm truncate ${conv.unread ? "font-semibold text-fb-text" : "text-fb-subtext"}`}>
                {conv.lastMessage}
              </p>
            </div>

            {conv.unread > 0 && (
              <span className="ml-1 flex-shrink-0 w-5 h-5 bg-fb-blue rounded-full flex items-center justify-center text-white text-xs font-bold">
                {conv.unread}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// Panel 2 — Chat Window
// ══════════════════════════════════════════════════════════════════
function ChatWindow({ conv }) {
  const [messages, setMessages] = useState(conv?.messages || []);
  const [msg, setMsg] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), senderId: 1, text: msg, time: "Vừa xong" }]);
    setMsg("");
  };

  if (!conv) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white gap-4">
        <div className="w-20 h-20 bg-[#F0F2F5] rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-fb-subtext" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.836 1.396 5.372 3.584 7.04V22l3.26-1.79c.87.24 1.79.37 2.745.37C17.523 20.58 22 16.435 22 11.337 22 6.238 17.523 2 12 2z" />
          </svg>
        </div>
        <p className="text-lg font-bold text-fb-text">Chọn một đoạn chat</p>
        <p className="text-sm text-fb-subtext">Chọn từ danh sách bên trái để bắt đầu nhắn tin</p>
        <button className="px-5 py-2 bg-fb-blue text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors">
          Tin nhắn mới
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
        style={{ boxShadow: "0 1px 0 #E4E6EB" }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={conv.avatar} className="w-10 h-10 rounded-full object-cover" alt={conv.name} />
            {conv.online && !conv.isGroup && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div>
            <p className="font-semibold text-[15px] text-fb-text leading-tight">{conv.name}</p>
            <p className={`text-xs ${conv.online && !conv.isGroup ? "text-green-500" : "text-fb-subtext"}`}>
              {conv.isGroup
                ? `${conv.members?.length || 4} thành viên`
                : conv.online
                  ? "Đang hoạt động"
                  : "Không hoạt động"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          <button className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center transition-colors text-[#7B3FE4]">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57-.11.35-.02.74-.25 1.01l-2.2 2.21z" />
            </svg>
          </button>
          <button className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center transition-colors text-[#7B3FE4]">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
            </svg>
          </button>
          <button className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center transition-colors text-[#7B3FE4]">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-0.5">
        {/* Profile header */}
        <div className="flex flex-col items-center py-8 mb-4 gap-2">
          <img src={conv.avatar} className="w-20 h-20 rounded-full object-cover" alt={conv.name} />
          <p className="font-bold text-lg text-fb-text">{conv.name}</p>
          <p className="text-sm text-fb-subtext">{conv.isGroup ? "Nhóm · Facebook" : "Bạn bè trên Facebook"}</p>
          <button className="mt-1 px-4 py-1.5 bg-[#F0F2F5] hover:bg-[#E4E6EB] rounded-full text-sm font-semibold text-fb-text transition-colors">
            {conv.isGroup ? "Xem nhóm" : "Xem trang cá nhân"}
          </button>
        </div>

        {messages.map((m, idx) => {
          const isMe = m.senderId === 1;
          const prevMsg = messages[idx - 1];
          const nextMsg = messages[idx + 1];
          const isFirst = !prevMsg || prevMsg.senderId !== m.senderId;
          const isLast = !nextMsg || nextMsg.senderId !== m.senderId;
          const showAvatar = !isMe && isLast;

          return (
            <div
              key={m.id}
              className={`flex items-end gap-2
                ${isMe ? "justify-end" : "justify-start"}
                ${isFirst ? "mt-3" : "mt-0.5"}`}
            >
              {!isMe && (
                <div className="w-7 flex-shrink-0 self-end mb-0.5">
                  {showAvatar ? (
                    <img src={conv.avatar} className="w-7 h-7 rounded-full object-cover" alt="" />
                  ) : (
                    <div className="w-7" />
                  )}
                </div>
              )}

              <div
                className={`max-w-[65%] px-3 py-2 text-sm leading-relaxed
                  ${
                    isMe
                      ? `bg-fb-blue text-white
                       ${isFirst && isLast ? "rounded-2xl" : ""}
                       ${isFirst && !isLast ? "rounded-t-2xl rounded-bl-2xl rounded-br-[6px]" : ""}
                       ${!isFirst && isLast ? "rounded-b-2xl rounded-tl-2xl rounded-tr-[6px]" : ""}
                       ${!isFirst && !isLast ? "rounded-l-2xl rounded-r-[6px]" : ""}`
                      : `bg-[#F0F2F5] text-fb-text
                       ${isFirst && isLast ? "rounded-2xl" : ""}
                       ${isFirst && !isLast ? "rounded-t-2xl rounded-br-2xl rounded-bl-[6px]" : ""}
                       ${!isFirst && isLast ? "rounded-b-2xl rounded-tr-2xl rounded-tl-[6px]" : ""}
                       ${!isFirst && !isLast ? "rounded-r-2xl rounded-l-[6px]" : ""}`
                  }`}
              >
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-1.5 px-3 py-2.5 flex-shrink-0" style={{ boxShadow: "0 -1px 0 #E4E6EB" }}>
        <button className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-fb-blue transition-colors flex-shrink-0">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1a11 11 0 100 22A11 11 0 0012 1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2a7.2 7.2 0 01-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 01-6 3.22z" />
          </svg>
        </button>
        <button className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-fb-blue transition-colors flex-shrink-0">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
          </svg>
        </button>
        <button className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-fb-blue transition-colors flex-shrink-0">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
          </svg>
        </button>
        <button className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-fb-blue transition-colors flex-shrink-0">
          <span className="text-[11px] font-bold leading-none">GIF</span>
        </button>

        <div className="flex-1 flex items-center bg-[#F0F2F5] rounded-full px-4 py-2 gap-2">
          <input
            className="flex-1 bg-transparent outline-none text-sm placeholder-fb-subtext"
            placeholder="Aa"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className="text-fb-subtext hover:text-fb-blue transition-colors flex-shrink-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </button>
        </div>

        {msg.trim() ? (
          <button
            onClick={send}
            className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-fb-blue flex-shrink-0 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 21L23 12 1 3v7l15 2-15 2v7z" />
            </svg>
          </button>
        ) : (
          <button className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-fb-blue flex-shrink-0 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// Panel 3 — Chat Info
// ══════════════════════════════════════════════════════════════════
function SectionHeader({ title, open, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-[#F0F2F5] transition-colors"
    >
      <span className="font-semibold text-[15px] text-fb-text">{title}</span>
      <svg
        className={`w-5 h-5 text-fb-subtext transition-transform ${open ? "" : "rotate-180"}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
      </svg>
    </button>
  );
}

function ChatInfo({ conv }) {
  const [sections, setSections] = useState({
    info: true,
    custom: true,
    media: false,
    privacy: false,
  });

  const toggle = (key) => setSections((s) => ({ ...s, [key]: !s[key] }));

  if (!conv) return <div className="w-[340px] bg-white flex-shrink-0" />;

  return (
    <div className="w-[340px] bg-white flex flex-col overflow-y-auto flex-shrink-0">
      {/* Avatar + name */}
      <div className="flex flex-col items-center pt-6 pb-4 px-4">
        <div className="relative mb-3">
          <img src={conv.avatar} className="w-[72px] h-[72px] rounded-full object-cover" alt={conv.name} />
          {conv.online && !conv.isGroup && (
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <p className="text-lg font-bold text-fb-text">{conv.name}</p>
        <p className={`text-sm mt-0.5 ${conv.online && !conv.isGroup ? "text-green-500" : "text-fb-subtext"}`}>
          {conv.isGroup
            ? `${conv.members?.length || 4} thành viên`
            : conv.online
              ? "Đang hoạt động"
              : "Không hoạt động"}
        </p>

        {/* E2E badge */}
        <div className="mt-2 flex items-center gap-1.5 bg-[#F0F2F5] px-3 py-1 rounded-full">
          <svg className="w-3.5 h-3.5 text-fb-subtext" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 8h-1V6A5 5 0 007 6v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2zm-6 9a2 2 0 110-4 2 2 0 010 4zm3.1-9H8.9V6a3.1 3.1 0 016.2 0v2z" />
          </svg>
          <span className="text-xs text-fb-subtext font-medium">Được mã hóa đầu cuối</span>
        </div>

        {/* Quick actions */}
        <div className="flex gap-6 mt-4">
          {[
            {
              icon: (
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
              ),
              label: "Trang cá\nnhân",
            },
            {
              icon: (
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              ),
              label: "Tắt thông\nbáo",
            },
            {
              icon: (
                <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              ),
              label: "Tìm kiếm",
            },
          ].map(({ icon, label }, i) => (
            <button key={i} className="flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 bg-[#E4E6EB] hover:bg-[#D8DADF] rounded-full flex items-center justify-center transition-colors">
                <svg className="w-[18px] h-[18px] text-fb-text" fill="currentColor" viewBox="0 0 24 24">
                  {icon}
                </svg>
              </div>
              <span className="text-[11px] text-fb-subtext text-center leading-tight whitespace-pre-line">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accordion sections */}
      <div className="px-3 pb-6 flex flex-col gap-0.5">
        {/* Thông tin */}
        <div>
          <SectionHeader title="Thông tin về đoạn chat" open={sections.info} onToggle={() => toggle("info")} />
          {sections.info && (
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F0F2F5] text-left transition-colors">
              <div className="w-8 h-8 bg-[#E4E6EB] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-fb-text" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                </svg>
              </div>
              <span className="text-[14px] text-fb-text">Xem tin nhắn đã ghim</span>
            </button>
          )}
        </div>

        {/* Tùy chỉnh */}
        <div>
          <SectionHeader title="Tùy chỉnh đoạn chat" open={sections.custom} onToggle={() => toggle("custom")} />
          {sections.custom && (
            <div className="flex flex-col gap-0.5">
              {[
                {
                  bg: "bg-fb-blue",
                  icon: (
                    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                  ),
                  label: "Đổi chủ đề",
                },
                {
                  bg: "bg-blue-400",
                  icon: (
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  ),
                  label: "Thay đổi biểu tượng cảm xúc",
                },
                {
                  bg: "bg-blue-600",
                  icon: (
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  ),
                  label: "Chỉnh sửa biệt danh",
                },
              ].map(({ bg, icon, label }, i) => (
                <button
                  key={i}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F0F2F5] text-left transition-colors"
                >
                  <div className={`w-8 h-8 ${bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      {icon}
                    </svg>
                  </div>
                  <span className="text-[14px] text-fb-text">{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Media */}
        <div>
          <SectionHeader title="File phương tiện & file" open={sections.media} onToggle={() => toggle("media")} />
          {sections.media && (
            <div className="grid grid-cols-3 gap-1 px-1 pb-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <img
                    src={`https://picsum.photos/seed/media${i}${conv.id}/100/100`}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Privacy */}
        <div>
          <SectionHeader title="Quyền riêng tư & hỗ trợ" open={sections.privacy} onToggle={() => toggle("privacy")} />
          {sections.privacy && (
            <div className="flex flex-col gap-0.5">
              {[
                { label: "Chặn", red: false },
                { label: "Báo cáo", red: false },
                { label: "Xóa đoạn chat", red: true },
              ].map(({ label, red }) => (
                <button
                  key={label}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F0F2F5] text-left transition-colors"
                >
                  <span className={`text-[14px] ${red ? "text-red-500" : "text-fb-text"}`}>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// Main Export
// ══════════════════════════════════════════════════════════════════
export default function MessengerFull() {
  const { convId } = useParams();
  const navigate = useNavigate();

  const selectedConv = convId
    ? (conversations.find((c) => c.id === parseInt(convId)) ?? conversations[0])
    : conversations[0];

  const handleSelect = (conv) => {
    navigate(`/messenger/${conv.id}`, { replace: true });
  };

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5]">
      {/* Navbar fixed — tự nổi lên trên */}
      <Navbar />

      {/* 3-panel layout — pt-14 nhường chỗ navbar, p-2 gap-2 tạo khoảng cách */}
      <div className="flex flex-1 overflow-hidden pt-14 p-2 gap-2">
        {/* Panel 1 — ConvList */}
        <div
          className="flex-shrink-0 rounded-xl overflow-hidden bg-white"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}
        >
          <ConvList selected={selectedConv} onSelect={handleSelect} />
        </div>

        {/* Panel 2 — ChatWindow */}
        <div
          className="flex-1 min-w-0 rounded-xl overflow-hidden bg-white"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}
        >
          <ChatWindow key={selectedConv?.id} conv={selectedConv} />
        </div>

        {/* Panel 3 — ChatInfo */}
        <div
          className="flex-shrink-0 rounded-xl overflow-hidden bg-white"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}
        >
          <ChatInfo conv={selectedConv} />
        </div>
      </div>
    </div>
  );
}
