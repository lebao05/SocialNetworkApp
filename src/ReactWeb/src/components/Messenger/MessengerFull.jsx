import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import ChatInfoGroup from "./ChatInfoGroup";
import ChatInfoDirect from "./ChatInfoDirect";
import { useChat } from "../../contexts/ChatContext";
import { useAuth } from "../../contexts/authContext";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

// ══════════════════════════════════════════════════════════════════
// Panel 1 — Conversation List
// ══════════════════════════════════════════════════════════════════
function ConvList({ selected, onSelect, onSelectUser }) {
  const { conversations, searchResults, isSearching, performSearch, fetchConversations, isOnline } = useChat();
  const [tab, setTab] = useState("all");
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => { fetchConversations(); }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchVal(val);
    performSearch(val);
  };

  const filtered = conversations.filter((c) => {
    if (tab === "unread") return c.unreadCount > 0;
    if (tab === "group") return !c.isOneToOne;
    return true;
  });

  const displayList = searchVal.trim() ? searchResults : filtered;

  return (
    <div className="w-[360px] flex flex-col h-full bg-white flex-shrink-0">
      <div className="px-4 pt-5 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-fb-text">Chats</h1>
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

        <div className="flex items-center bg-[#F0F2F5] rounded-full px-3 py-2 gap-2 mb-3">
          <svg className="w-4 h-4 text-fb-subtext flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            className="bg-transparent outline-none text-sm flex-1 placeholder-fb-subtext"
            placeholder="Search Messenger"
            value={searchVal}
            onChange={handleSearchChange}
          />
          {isSearching && (
            <div className="w-3 h-3 border-2 border-fb-blue border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        {!searchVal.trim() && (
          <div className="flex gap-2">
            {[
              { key: "all", label: "All" },
              { key: "unread", label: "Unread" },
              { key: "group", label: "Groups" },
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
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {displayList.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv)}
            className={`flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl cursor-pointer transition-colors
              ${selected?.id === conv.id ? "bg-blue-50" : "hover:bg-[#F0F2F5]"}`}
          >
            <div className="relative flex-shrink-0">
              {conv.isOneToOne && conv.otherUserId ? (
                <img
                  src={conv.imageUrl || DEFAULT_AVATAR}
                  className="w-14 h-14 rounded-full object-cover cursor-pointer"
                  alt={conv.name}
                  onClick={(e) => { e.stopPropagation(); onSelectUser(conv.otherUserId); }}
                />
              ) : (
                <img src={conv.imageUrl || DEFAULT_AVATAR} className="w-14 h-14 rounded-full object-cover" alt={conv.name} />
              )}
              {!conv.isOneToOne && (
                <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-fb-blue rounded-full border-2 border-white flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                </span>
              )}
              {conv.isOneToOne && conv.otherUserId && isOnline(conv.otherUserId) && (
                <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                {conv.isOneToOne && conv.otherUserId ? (
                  <p
                    className={`text-[15px] truncate cursor-pointer hover:underline ${conv.unreadCount > 0 ? "font-bold" : "font-medium"} text-fb-text`}
                    onClick={(e) => { e.stopPropagation(); onSelectUser(conv.otherUserId); }}
                  >
                    {conv.name}
                  </p>
                ) : (
                  <p className={`text-[15px] truncate ${conv.unreadCount > 0 ? "font-bold" : "font-medium"} text-fb-text`}>
                    {conv.name}
                  </p>
                )}
                <span className={`text-xs flex-shrink-0 ml-2 ${conv.unreadCount > 0 ? "text-fb-blue font-semibold" : "text-fb-subtext"}`}>
                  {conv.lastMessageSentAt
                    ? new Date(conv.lastMessageSentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : ""}
                </span>
              </div>
              <p className={`text-sm truncate ${conv.unreadCount > 0 ? "font-semibold text-fb-text" : "text-fb-subtext"}`}>
                {!conv.isOneToOne && conv.memberCount ? `${conv.memberCount} members · ` : ""}
                {conv.lastMessageContent || (conv.isNotInAConversation ? "Start a conversation" : "")}
              </p>
            </div>

            {conv.unreadCount > 0 && (
              <span className="ml-1 flex-shrink-0 w-5 h-5 bg-fb-blue rounded-full flex items-center justify-center text-white text-xs font-bold">
                {conv.unreadCount}
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
function ChatWindow({ conv, isOnline }) {
  const { user } = useAuth();
  const { messages, messagesLoading, loadMessages, sendMessage, markAsSeen } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (conv) loadMessages(true);
  }, [conv?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (conv && !conv.isVirtual) {
      const timer = setTimeout(() => markAsSeen(), 1000);
      return () => clearTimeout(timer);
    }
  }, [conv?.id, messages.length]);

  if (!conv) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white gap-4">
        <div className="w-20 h-20 bg-[#F0F2F5] rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-fb-subtext" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.836 1.396 5.372 3.584 7.04V22l3.26-1.79c.87.24 1.79.37 2.745.37C17.523 20.58 22 16.435 22 11.337 22 6.238 17.523 2 12 2z" />
          </svg>
        </div>
        <p className="text-lg font-bold text-fb-text">Select a chat</p>
        <p className="text-sm text-fb-subtext">Choose from your existing conversations</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0" style={{ boxShadow: "0 1px 0 #E4E6EB" }}>
        <div className="flex items-center gap-3">
          <img src={conv.imageUrl || DEFAULT_AVATAR} className="w-10 h-10 rounded-full object-cover" alt={conv.name} />
          <div>
            <p className="font-semibold text-[15px] text-fb-text leading-tight">{conv.name}</p>
            <p className={`text-xs ${conv.isOneToOne && isOnline(conv.otherUserId) ? "text-green-500" : "text-fb-subtext"}`}>
              {conv.isOneToOne
                ? isOnline(conv.otherUserId) ? "Active now" : "Offline"
                : `${conv.memberCount ?? 0} members`}
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

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-0.5">
        <div className="flex flex-col items-center py-8 mb-4 gap-2">
          <img src={conv.imageUrl || DEFAULT_AVATAR} className="w-20 h-20 rounded-full object-cover" alt={conv.name} />
          <p className="font-bold text-lg text-fb-text">{conv.name}</p>
          <p className="text-sm text-fb-subtext">{!conv.isOneToOne ? "Group" : "Friend on Community"}</p>
          <button className="mt-1 px-4 py-1.5 bg-[#F0F2F5] hover:bg-[#E4E6EB] rounded-full text-sm font-semibold text-fb-text transition-colors">
            {!conv.isOneToOne ? "View group" : "View profile"}
          </button>
        </div>

        {messagesLoading && <div className="text-center py-4 text-fb-subtext">Loading messages...</div>}

        {messages.map((m, idx) => {
          const isMe = m.senderId === user?.id;
          const prevMsg = messages[idx - 1];
          const nextMsg = messages[idx + 1];
          const isFirst = !prevMsg || prevMsg.senderId !== m.senderId;
          const isLast = !nextMsg || nextMsg.senderId !== m.senderId;
          const showAvatar = !isMe && isLast;

          return (
            <div key={m.id} className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"} ${isFirst ? "mt-3" : "mt-0.5"}`}>
              {!isMe && (
                <div className="w-7 flex-shrink-0 self-end mb-0.5">
                  {showAvatar ? (
                    <img src={conv.imageUrl || DEFAULT_AVATAR} className="w-7 h-7 rounded-full object-cover" alt="" />
                  ) : (
                    <div className="w-7" />
                  )}
                </div>
              )}
              <div className={`max-w-[65%] px-3 py-2 text-sm leading-relaxed ${isMe ? "bg-fb-blue text-white rounded-2xl" : "bg-[#F0F2F5] text-fb-text rounded-2xl"}`}>
                {m.content}
                {m.reaction && <span className="ml-1 text-xs">{m.reaction}</span>}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <MessageInput />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// Input bar
// ══════════════════════════════════════════════════════════════════
function MessageInput() {
  const { sendMessage, startTyping, endTyping } = useChat();
  const [msg, setMsg] = useState("");
  const typingTimerRef = useRef(null);

  const handleChange = (e) => {
    setMsg(e.target.value);
    startTyping();
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => endTyping(), 2000);
  };

  const handleSend = async () => {
    if (!msg.trim()) return;
    clearTimeout(typingTimerRef.current);
    endTyping();
    await sendMessage(msg);
    setMsg("");
  };

  return (
    <div className="flex items-center gap-1.5 px-3 py-2.5 flex-shrink-0" style={{ boxShadow: "0 -1px 0 #E4E6EB" }}>
      <button className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-fb-blue transition-colors flex-shrink-0">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1a11 11 0 100 22A11 11 0 0012 1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2a7.2 7.2 0 01-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 01-6 3.22z" /></svg>
      </button>
      <button className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-fb-blue transition-colors flex-shrink-0">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>
      </button>
      <button className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-fb-blue transition-colors flex-shrink-0">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" /></svg>
      </button>
      <button className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-fb-blue transition-colors flex-shrink-0">
        <span className="text-[11px] font-bold leading-none">GIF</span>
      </button>

      <div className="flex-1 flex items-center bg-[#F0F2F5] rounded-full px-4 py-2 gap-2">
        <input
          className="flex-1 bg-transparent outline-none text-sm placeholder-fb-subtext"
          placeholder="Aa"
          value={msg}
          onChange={handleChange}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
      </div>

      {msg.trim() ? (
        <button onClick={handleSend} className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-fb-blue flex-shrink-0 transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M1 21L23 12 1 3v7l15 2-15 2v7z" /></svg>
        </button>
      ) : (
        <button className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-fb-blue flex-shrink-0 transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" /></svg>
        </button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ChatInfo
// ══════════════════════════════════════════════════════════════════
function ChatInfo({ conv, isOnline }) {
  if (!conv) return <div className="w-[340px] bg-white flex-shrink-0 rounded-xl" />;
  return !conv.isOneToOne ? <ChatInfoGroup conv={conv} /> : <ChatInfoDirect conv={conv} isOnline={isOnline} />;
}

// ══════════════════════════════════════════════════════════════════
// Main Export
// ══════════════════════════════════════════════════════════════════
export default function MessengerFull() {
  const { convId } = useParams();
  const navigate = useNavigate();
  const { selectedConversation, selectConversation, isOnline } = useChat();

  useEffect(() => {
    if (convId) selectConversation(convId, false);
  }, [convId]);

  const handleSelect = (conv) => {
    const idToUse = conv.isNotInAConversation ? conv.otherUserId : conv.id;
    const target = `/messenger/${idToUse}`;
    navigate(target, { replace: true });
  };

  const handleSelectUser = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5]">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-14 p-2 gap-2">
        <div className="flex-shrink-0 rounded-xl overflow-hidden bg-white" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
          <ConvList selected={selectedConversation} onSelect={handleSelect} onSelectUser={handleSelectUser} />
        </div>
        <div className="flex-1 min-w-0 rounded-xl overflow-hidden bg-white" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
          <ChatWindow key={selectedConversation?.id || selectedConversation?.otherUserId} conv={selectedConversation} isOnline={isOnline} />
        </div>
        <div className="flex-shrink-0 rounded-xl overflow-hidden bg-white" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
          <ChatInfo conv={selectedConversation} isOnline={isOnline} />
        </div>
      </div>
    </div>
  );
}
