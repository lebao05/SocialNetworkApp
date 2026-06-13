import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import Navbar from "../Navbar/Navbar";
import ChatInfoGroup from "./ChatInfoGroup";
import ChatInfoDirect from "./ChatInfoDirect";
import CreateGroupModal from "./CreateGroupModal";
import { useChat } from "../../contexts/ChatContext";
import { useAuth } from "../../contexts/authContext";
import { useCall } from "../../contexts/CallContext";
import { CHAT_THEMES, getChatTheme, getThemeAccentColor } from "../../data/chatThemes";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;
const DEFAULT_CHAT_GROUP_COVER = import.meta.env.VITE_DEFAULT_CHAT_GROUP_COVER;

// Backend message reactions (matches Domain.Enums.ReactionType: Like=0, Love=1, Haha=2, Wow=3, Sad=4, Angry=5)
export const MESSAGE_REACTION_TYPES = [
  { label: "Like", emoji: "\u2764\uFE0F", value: "Like", color: "#E91E63" },
  { label: "Love", emoji: "\uD83D\uDE0D", value: "Love", color: "#FF9800" },
  { label: "Haha", emoji: "\uD83D\uDE02", value: "Haha", color: "#FFEB3B" },
  { label: "Wow", emoji: "\uD83D\uDE2E", value: "Wow", color: "#FFC107" },
  { label: "Sad", emoji: "\uD83D\uDE22", value: "Sad", color: "#2196F3" },
  { label: "Angry", emoji: "\uD83D\uDE20", value: "Angry", color: "#F44336" },
];

// Extended emoji list for the chat emoji picker (insert emoji into message text)
export const CHAT_EMOJI_TYPES = [
  // First 6 — same as message reactions
  { emoji: "\u2764\uFE0F", value: "Like", label: "Like", category: "reactions" },
  { emoji: "\uD83D\uDE0D", value: "Love", label: "Love", category: "reactions" },
  { emoji: "\uD83D\uDE02", value: "Haha", label: "Haha", category: "reactions" },
  { emoji: "\uD83D\uDE2E", value: "Wow", label: "Wow", category: "reactions" },
  { emoji: "\uD83D\uDE22", value: "Sad", label: "Sad", category: "reactions" },
  { emoji: "\uD83D\uDE20", value: "Angry", label: "Angry", category: "reactions" },
  // Additional emoji
  { emoji: "\uD83D\uDE04", value: "Haha2", label: "Haha", category: "emoji" },
  { emoji: "\uD83D\uDE0A", value: "Yay", label: "Yay", category: "emoji" },
  { emoji: "\uD83D\uDE2D", value: "Crying", label: "Crying", category: "emoji" },
  { emoji: "\uD83D\uDD25", value: "Fire", label: "Fire", category: "emoji" },
  { emoji: "\uD83D\uDC40", value: "Eyes", label: "Eyes", category: "emoji" },
  { emoji: "\uD83E\uDD0D", value: "Heart", label: "Heart", category: "emoji" },
  { emoji: "\uD83D\uDCAF", value: "Hundred", label: "Hundred", category: "emoji" },
  { emoji: "\uD83D\uDC4F", value: "Clap", label: "Clap", category: "emoji" },
  { emoji: "\uD83C\uDF89", value: "Party", label: "Party", category: "emoji" },
  { emoji: "\uD83D\uDE0E", value: "Cool", label: "Cool", category: "emoji" },
  { emoji: "\uD83E\uDD7A", value: "Pleading", label: "Pleading", category: "emoji" },
  { emoji: "\uD83E\uDD2F", value: "MindBlown", label: "Mind blown", category: "emoji" },
  { emoji: "\uD83D\uDE14", value: "Pensive", label: "Pensive", category: "emoji" },
  { emoji: "\uD83E\uDD14", value: "Thinking", label: "Thinking", category: "emoji" },
  { emoji: "\uD83D\uDC46", value: "Salute", label: "Salute", category: "emoji" },
  { emoji: "\uD83D\uDCAA", value: "Muscle", label: "Muscle", category: "emoji" },
  { emoji: "\uD83D\uDE09", value: "Wink", label: "Wink", category: "emoji" },
  { emoji: "\uD83D\uDE17", value: "Kiss", label: "Kiss", category: "emoji" },
  { emoji: "\uD83D\uDE31", value: "Scream", label: "Scream", category: "emoji" },
  { emoji: "\uD83D\uDE26", value: "Anguished", label: "Anguished", category: "emoji" },
  { emoji: "\uD83E\uDD26", value: "Facepalm", label: "Facepalm", category: "emoji" },
  { emoji: "\uD83E\uDD21", value: "Clown", label: "Clown", category: "emoji" },
  { emoji: "\uD83E\uDD13", value: "Nerd", label: "Nerd", category: "emoji" },
  { emoji: "\u2B50", value: "Star", label: "Star", category: "emoji" },
  { emoji: "\u2705", value: "Check", label: "Check", category: "emoji" },
  { emoji: "\uD83D\uDC4D", value: "ThumbsUp", label: "Thumbs up", category: "emoji" },
  { emoji: "\uD83D\uDC4E", value: "ThumbsDown", label: "Thumbs down", category: "emoji" },
  { emoji: "\uD83D\uDE80", value: "Rocket", label: "Rocket", category: "emoji" },
  { emoji: "\uD83D\uDC4B", value: "Wave", label: "Wave", category: "emoji" },
  { emoji: "\uD83D\uDE4F", value: "Pray", label: "Pray", category: "emoji" },
  { emoji: "\uD83C\uDFC6", value: "Trophy", label: "Trophy", category: "emoji" },
  { emoji: "\uD83C\uDF39", value: "Rose", label: "Rose", category: "emoji" },
  { emoji: "\uD83D\uDC80", value: "Skull", label: "Skull", category: "emoji" },
  { emoji: "\uD83D\uDCA9", value: "Poop", label: "POOP", category: "emoji" },
  { emoji: "\uD83D\uDC7F", value: "Oni", label: "Oni", category: "emoji" },
  { emoji: "\u2728", value: "Sparkle", label: "Sparkle", category: "emoji" },
  { emoji: "\uD83E\uDD2A", value: "Zany", label: "Zany", category: "emoji" },
  { emoji: "\uD83D\uDE0C", value: "Relieved", label: "Relieved", category: "emoji" },
  { emoji: "\uD83E\uDD91", value: "Horned", label: "Face horns", category: "emoji" },
];

// Backward compat alias
export const REACTION_TYPES = MESSAGE_REACTION_TYPES;

// Handle both numeric (0-5 from backend) and string ("Like", "Love", etc.) reaction types
export function getReactionEmoji(reactionType) {
  const num = Number(reactionType);
  if (num === 0) return "\u2764\uFE0F";
  if (num === 1) return "\uD83D\uDE0D";
  if (num === 2) return "\uD83D\uDE02";
  if (num === 3) return "\uD83D\uDE2E";
  if (num === 4) return "\uD83D\uDE22";
  if (num === 5) return "\uD83D\uDE20";
  return MESSAGE_REACTION_TYPES.find((r) => r.value === reactionType)?.emoji ?? "\u2764\uFE0F";
}

export function getReactionColor(reactionType) {
  const num = Number(reactionType);
  if (num === 0) return "#E91E63";
  if (num === 1) return "#FF9800";
  if (num === 2) return "#FFEB3B";
  if (num === 3) return "#FFC107";
  if (num === 4) return "#2196F3";
  if (num === 5) return "#F44336";
  return MESSAGE_REACTION_TYPES.find((r) => r.value === reactionType)?.color ?? "#E91E63";
}

function isImageType(fileType) {
  if (!fileType) return false;
  const t = fileType.toLowerCase();
  return t === "image" || t === "image/jpeg" || t === "image/png" || t === "image/gif" || t === "image/webp";
}

function isVideoType(fileType) {
  if (!fileType) return false;
  const t = fileType.toLowerCase();
  return t === "video" || t === "video/mp4" || t === "video/webm" || t === "video/quicktime";
}

function isAudioType(fileType) {
  if (!fileType) return false;
  const t = fileType.toLowerCase();
  return t === "audio" || t === "audio/mpeg" || t === "audio/wav" || t === "audio/ogg" || t === "audio/mp3";
}

function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(url) {
  if (!url) return "file";
  const parts = url.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "FILE";
}

function MessageMediaAttachment({ attachment, isMe, theme }) {
  const [lightboxSrc, setLightboxSrc] = useState(null);

  if (isImageType(attachment?.fileType)) {
    return (
      <>
        <div
          className="rounded-xl overflow-hidden cursor-pointer mt-1"
          onClick={() => setLightboxSrc(attachment.fileUrl)}
        >
          <img
            src={attachment.fileUrl}
            alt="Attachment"
            className="max-w-full max-h-72 object-cover block"
            loading="lazy"
          />
        </div>
        {lightboxSrc && (
          <div
            className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center"
            onClick={() => setLightboxSrc(null)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer transition-colors"
              onClick={() => setLightboxSrc(null)}
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
            <img
              src={lightboxSrc}
              alt="Preview"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </>
    );
  }

  if (isVideoType(attachment?.fileType)) {
    return (
      <div className="mt-1 rounded-xl overflow-hidden">
        <video
          src={attachment.fileUrl}
          controls
          className="max-w-full max-h-72 object-cover block w-full"
        />
      </div>
    );
  }

  if (isAudioType(attachment?.fileType)) {
    return (
      <div className={`mt-2 rounded-xl px-3 py-3`}
        style={{ backgroundColor: isMe ? theme.bubbleSelf : theme.bubbleOther }}
      >
        <audio
          src={attachment.fileUrl}
          controls
          className="h-8 w-52"
        />
      </div>
    );
  }

  // File attachment
  return (
    <a
      href={attachment?.fileUrl}
      download
      target="_blank"
      rel="noreferrer"
      className={`mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline transition-colors`}
      style={{
        backgroundColor: isMe ? `${theme.bubbleSelf}33` : `${theme.bubbleOther}`,
        color: isMe ? theme.bubbleSelfText : theme.bubbleOtherText,
      }}
    >
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: isMe ? theme.bubbleSelf : `${theme.bubbleOther}` }}>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">
          {getFileExtension(attachment?.fileUrl)}
        </p>
        {attachment?.fileSize > 0 && (
          <p className="text-xs mt-0.5">
            {formatFileSize(attachment.fileSize)}
          </p>
        )}
      </div>
      <svg className="w-4 h-4 flex-shrink-0 ml-auto" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
      </svg>
    </a>
  );
}

function MessageContent({ message, isMe, theme }) {
  // messageType from backend: "Text" (0) or "Attachment" (1)
  // SignalR deserializes as number: 0 = Text, 1 = Attachment
  const isAttachment = message.messageType === 1 || message.messageType === "Attachment";

  if (isAttachment) {
    return <MessageMediaAttachment attachment={message.attachment} isMe={isMe} theme={theme} />;
  }

  return <>{message.content}</>;
}

// ══════════════════════════════════════════════════════════════════
// Panel 1 — Conversation List (Facebook Messenger style)
// ══════════════════════════════════════════════════════════════════
function ConvList({ selected, onSelect, onSelectUser, onCreateGroup }) {
  const { conversations, searchResults, isSearching, performSearch, fetchConversations, isOnline } = useChat();
  const [tab, setTab] = useState("all");
  const [searchVal, setSearchVal] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);

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
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-[1.5rem] font-bold text-fb-text leading-tight">Chats</h1>
          <div className="flex items-center gap-1">
            <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#F0F2F5] transition-colors text-fb-text">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
            <button
              onClick={() => setShowCreateGroup(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#F0F2F5] transition-colors text-fb-blue"
              title="New message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex items-center bg-[#F0F2F5] rounded-[20px] px-3 py-[7px]">
          <svg className="w-4 h-4 text-fb-subtext flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            className="bg-transparent outline-none text-sm flex-1 placeholder-fb-subtext ml-2"
            placeholder="Search Messenger"
            value={searchVal}
            onChange={handleSearchChange}
          />
          {isSearching && (
            <div className="w-4 h-4 border-2 border-fb-blue border-t-transparent rounded-full animate-spin ml-2" />
          )}
        </div>

        {/* Tabs */}
        {!searchVal.trim() && (
          <div className="flex gap-2 mt-3">
            {[
              { key: "all", label: "All" },
              { key: "unread", label: "Unread" },
              { key: "group", label: "Groups" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 rounded-[20px] text-sm font-semibold transition-colors
                  ${tab === t.key
                    ? "bg-fb-blue text-white"
                    : "bg-[#F0F2F5] text-fb-text hover:bg-[#E4E6EB]"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 pb-2">
          {displayList.length === 0 && (
            <div className="flex flex-col items-center py-12 gap-2">
              <div className="w-16 h-16 bg-[#F0F2F5] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-fb-subtext" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                </svg>
              </div>
              <p className="text-sm text-fb-subtext font-medium">No conversations yet</p>
            </div>
          )}
          {displayList.map((conv) => {
            const isSelected = selected?.id === conv.id;
            const themeAccent = getThemeAccentColor(conv.theme);
            return (
              <div
                key={conv.id}
                onClick={() => onSelect(conv)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors relative
                  ${isSelected ? `${themeAccent.bg} border-l-2` : "hover:bg-[#F0F2F5]"}`}
                style={isSelected && conv.theme && conv.theme !== "default" ? { borderLeftColor: themeAccent.color } : {}}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={
                      conv.imageUrl ||
                      (conv.isOneToOne
                        ? (conv.otherUserAvatarUrl || DEFAULT_AVATAR)
                        : DEFAULT_CHAT_GROUP_COVER)
                    }
                    className="w-14 h-14 rounded-full object-cover"
                    alt={conv.name}
                    onError={(e) => {
                      e.target.src = conv.isOneToOne ? DEFAULT_AVATAR : DEFAULT_CHAT_GROUP_COVER;
                    }}
                  />
                  {/* Group badge */}
                  {!conv.isOneToOne && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-fb-blue rounded-full border-2 border-white flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                      </svg>
                    </span>
                  )}
                  {/* Online indicator */}
                  {conv.isOneToOne && conv.otherUserId && isOnline(conv.otherUserId) && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-[15px] truncate ${conv.unreadCount > 0 ? "font-bold" : "font-semibold"} text-fb-text`}
                    >
                      {conv.name}
                    </p>
                    <span className={`text-xs flex-shrink-0 ml-2 ${conv.unreadCount > 0 ? "text-fb-blue font-bold" : "text-fb-subtext"}`}>
                      {conv.lastMessageSentAt
                        ? new Date(conv.lastMessageSentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className={`text-sm truncate ${conv.unreadCount > 0 ? "font-semibold text-fb-text" : "text-fb-subtext"}`}>
                      {!conv.isOneToOne && conv.memberCount ? `${conv.memberCount} members \u00B7 ` : ""}
                      {conv.lastMessageContent || (conv.isNotInAConversation ? "Start a conversation" : "")}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="ml-2 flex-shrink-0 min-w-[20px] h-5 rounded-full flex items-center justify-center text-white text-xs font-bold px-1.5"
                        style={{ backgroundColor: (conv.theme && conv.theme !== "default") ? getThemeAccentColor(conv.theme).color : undefined }}>
                        {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onCreated={(conv) => {
            setShowCreateGroup(false);
            onCreateGroup(conv);
          }}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// Panel 2 — Chat Window (Facebook Messenger style)
// ══════════════════════════════════════════════════════════════════
function ChatWindow({ conv, isOnline, onBack, onToggleInfo, showInfoButton }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { messages, messagesLoading, loadMessages, sendMessage, markAsSeen, reactToMessage, typingUsers, conversationMembers, togglePin, revokeMessage, updateMessage } = useChat();
  const { initiateCall } = useCall();

  const theme = getChatTheme(conv?.theme);
  const isMidnight = conv?.theme === "midnight";
  const bottomRef = useRef(null);
  const messagesRef = useRef(null);
  const [replyTo, setReplyTo] = useState(null); // message being replied to
  const [editingMsg, setEditingMsg] = useState(null); // message being edited
  const [hoveredMsgId, setHoveredMsgId] = useState(null);

  useEffect(() => {
    if (conv) loadMessages(true);
    setReplyTo(null);
    setEditingMsg(null);
  }, [conv?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    if (conv && !conv.isVirtual) {
      const timer = setTimeout(() => markAsSeen(), 1000);
      return () => clearTimeout(timer);
    }
  }, [conv?.id, messages.length]);

  if (!conv) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white">
        <div className="w-24 h-24 bg-[#F0F2F5] rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-fb-subtext" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
          </svg>
        </div>
        <p className="text-xl font-bold text-fb-text">Select a conversation</p>
        <p className="text-sm text-fb-subtext mt-1">Choose from your existing conversations or start a new one</p>
      </div>
    );
  }

  const isGroup = !conv.isOneToOne;

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: theme.bg, color: theme.text }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0" style={{ borderBottom: "1px solid #E4E6EB" }}>
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              style={{ color: theme.text, backgroundColor: "transparent" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.bubbleOther; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <img
            src={
              conv.isOneToOne
                ? (conv.otherUserAvatarUrl || DEFAULT_AVATAR)
                : (conv.imageUrl || DEFAULT_CHAT_GROUP_COVER)
            }
            className="w-10 h-10 rounded-full object-cover cursor-pointer"
            alt={conv.name}
            onClick={onToggleInfo}
            onError={(e) => { e.target.src = conv.isOneToOne ? DEFAULT_AVATAR : DEFAULT_CHAT_GROUP_COVER; }}
          />
          <div className="cursor-pointer" onClick={onToggleInfo}>
            <p className="font-semibold text-[15px] leading-tight" style={{ color: theme.text }}>{conv.name}</p>
            <p className={`text-xs ${conv.isOneToOne && isOnline(conv.otherUserId) ? "text-green-500" : ""}`}
              style={{ color: conv.isOneToOne && isOnline(conv.otherUserId) ? undefined : isMidnight ? "#9FA8DA" : "#65676B" }}>
              {conv.isOneToOne
                ? isOnline(conv.otherUserId) ? "Active now" : "Offline"
                : `${conv.memberCount ?? 0} members`}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => initiateCall(conv.otherUserId, conv.name, conv.otherUserAvatarUrl, false)}
            className="w-9 h-9 cursor-pointer rounded-full flex items-center justify-center hover:bg-green-50 transition-colors text-green-600"
            title="Audio call"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57-.11.35-.02.74-.25 1.01l-2.2 2.21z" />
            </svg>
          </button>
          <button
            onClick={() => initiateCall(conv.otherUserId, conv.name, conv.otherUserAvatarUrl, true)}
            className="w-9 h-9 cursor-pointer rounded-full flex items-center justify-center hover:bg-green-50 transition-colors text-green-600"
            title="Video call"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
            </svg>
          </button>
          <button
            onClick={onToggleInfo}
            className="w-9 h-9 cursor-pointer rounded-full flex items-center justify-center transition-colors"
            style={{ color: theme.text, backgroundColor: "transparent" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.bubbleOther; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col">
        {/* Chat header banner */}
        <div className="flex flex-col items-center py-6 mb-2">
          <img
            src={
              conv.isOneToOne
                ? (conv.otherUserAvatarUrl || DEFAULT_AVATAR)
                : (conv.imageUrl || DEFAULT_CHAT_GROUP_COVER)
            }
            className="w-16 h-16 rounded-full object-cover mb-2"
            alt={conv.name}
            onError={(e) => { e.target.src = conv.isOneToOne ? DEFAULT_AVATAR : DEFAULT_CHAT_GROUP_COVER; }}
          />
          <p className="font-bold text-base">{conv.name}</p>
          <p className="text-sm mt-0.5" style={{ color: isMidnight ? "#9FA8DA" : "#65676B" }}>
            {isGroup ? `${conv.memberCount ?? 0} members` : "Facebook Community"}
          </p>
        </div>

        {messagesLoading && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-fb-blue border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {messages.map((m, idx) => {
          const isMe = m.senderId === user?.id;
          const prevMsg = messages[idx - 1];
          const isFirst = !prevMsg || prevMsg.senderId !== m.senderId;

          const showTimeLabel =
            prevMsg &&
            new Date(m.createdAt) - new Date(prevMsg.createdAt) > 10 * 60 * 1000;

          const showAvatar = isGroup && !isMe;

          return (
            <React.Fragment key={m.id}>
              {showTimeLabel && (
                <div className="flex justify-center my-3">
                  <span className="px-3 py-1 text-xs rounded-full" style={{ backgroundColor: theme.timeBadge, color: theme.timeText }}>
                    {new Date(m.createdAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              )}

              <div
                data-msg-id={m.id}
                className={`group flex items-end gap-1.5 mb-0.5 ${isMe ? "justify-end" : "justify-start"} ${isFirst ? "mt-2" : "mt-0.5"}`}
                onMouseEnter={() => setHoveredMsgId(m.id)}
                onMouseLeave={() => setHoveredMsgId(null)}
              >
                {/* Avatar for group */}
                {isGroup && !isMe && (
                  <div className="w-7 flex-shrink-0">
                    {showAvatar ? (
                      <div className={`w-7 h-7 mb-1 rounded-full ${m.reactions?.length > 0 ? "mb-7" : ""} object-cover hover:scale-105 transition-all duration-150 cursor-pointer`} onClick={() => { navigate(`/profile/${m.senderId}`); }}>
                        <img src={m.senderAvatarUrl || DEFAULT_AVATAR} alt={m.senderName ?? ""}
                          title={m.senderName ?? ""}
                          className="w-7 h-7 rounded-full object-cover" onError={(e) => { e.target.src = DEFAULT_AVATAR; }} />
                      </div>
                    ) : (
                      <div className="w-7 h-7" />
                    )}
                  </div>
                )}

                <div className={`flex flex-col max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                  {/* Sender name */}
                  {!isMe && isGroup && isFirst && (
                    <span className="text-xs mb-0.5 ml-1 font-medium" style={{ color: isMidnight ? "#9FA8DA" : "#65676B" }}>{m.senderName}</span>
                  )}

                  {/* Bubble + actions wrapper (so toolbar positions relative to this) */}
                  <div className="relative flex items-end gap-1">
                    {/* Message bubble */}
                    <div
                      className={`px-3 py-2 text-sm rounded-2xl`}
                      style={{
                        backgroundColor: isMe ? theme.bubbleSelf : theme.bubbleOther,
                        color: isMe ? theme.bubbleSelfText : theme.bubbleOtherText,
                        overflowWrap: "break-word",
                        wordBreak: "break-all",
                      }}
                    >
                      <MessageContent message={m} isMe={isMe} theme={theme} />
                    </div>

                    {/* Message actions toolbar */}
                    <MessageActions
                      message={m}
                      isMe={isMe}
                      isGroup={isGroup}
                      isHovered={hoveredMsgId === m.id}
                      onReact={reactToMessage}
                      onReply={(msg, edit) => {
                        if (edit) { setEditingMsg(msg); setReplyTo(null); }
                        else { setReplyTo(msg); setEditingMsg(null); }
                      }}
                      onTogglePin={() => togglePin(m.id)}
                      onRevoke={() => revokeMessage(m.id)}
                      onEdit={() => { setEditingMsg(m); setReplyTo(null); }}
                      theme={theme}
                      isMidnight={isMidnight}
                    />
                  </div>

                  {/* Reactions */}
                  {m.reactions?.length > 0 && (
                    <MessageReactionSummary reactions={m.reactions} currentUserId={user?.id} isMe={isMe} theme={theme} />
                  )}

                  {/* Read receipts: show avatars of members whose LastReadMessageId === this message */}
                  {true && conversationMembers?.filter(c => c.lastReadMessageId === m.id && c.userId !== user?.id).map(c => (
                    <div className="flex items-center gap-0.5">
                      <img
                        key={c.userId}
                        src={c.avatarUrl || DEFAULT_AVATAR}
                        alt={c.fullName}
                        title={`${c.fullName} has read this message`}
                        className="w-4 h-4 rounded-full object-cover mt-0.5"
                        onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                      />
                      <span className="text-xs" style={{ color: isMidnight ? "#9FA8DA" : "#65676B" }}>{c.fullName}</span>
                    </div>
                  )) || null}
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={bottomRef} className="h-2" />
      </div>

      {/* Typing indicator */}
      {typingUsers.size > 0 && (
        <div className="px-4 py-1.5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-fb-subtext animate-bounce"
                  style={{ animationDelay: `${i * 160}ms` }}
                />
              ))}
            </div>
            <span className="text-xs" style={{ color: isMidnight ? "#9FA8DA" : "#65676B" }}>
              {Array.from(typingUsers).length === 1 ? "typing..." : "several people typing..."}
            </span>
          </div>
        </div>
      )}

      {/* Input bar */}
      <MessageInput
        theme={theme}
        isMidnight={isMidnight}
        conv={conv}
        replyTo={replyTo}
        editingMsg={editingMsg}
        onReplySent={() => setReplyTo(null)}
        onEditSent={() => setEditingMsg(null)}
        onCancelReply={() => setReplyTo(null)}
        onCancelEdit={() => setEditingMsg(null)}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// Message hover action toolbar (react + reply + more menu)
// ══════════════════════════════════════════════════════════════════
function MessageActions({ message, isMe, isGroup, isHovered, onReact, onReply, onTogglePin, onRevoke, onEdit, theme, isMidnight }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reactPickerOpen, setReactPickerOpen] = useState(false);
  const hideTimerRef = useRef(null);
  const menuRef = useRef(null);
  const pickerRef = useRef(null);
  const wasMenuOpenOnLeave = useRef(false);

  const isMenuOpen = menuOpen || reactPickerOpen;

  // Close menus on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setReactPickerOpen(false);
    };
    if (menuOpen || reactPickerOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen, reactPickerOpen]);

  // Delay toolbar hide: when isHovered becomes false while menu is open,
  // keep toolbar visible for 500ms then hide
  useEffect(() => {
    if (!isHovered && isMenuOpen) {
      wasMenuOpenOnLeave.current = true;
      hideTimerRef.current = setTimeout(() => { wasMenuOpenOnLeave.current = false; }, 500);
    }
    if (isHovered) {
      wasMenuOpenOnLeave.current = false;
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    }
  }, [isHovered, isMenuOpen]);

  const isToolbarVisible = isMenuOpen || isHovered || wasMenuOpenOnLeave.current;

  const isImageType = (t) => !t || ["image", "image/jpeg", "image/png", "image/gif", "image/webp"].includes(t?.toLowerCase());
  const isVideoType = (t) => !t || ["video", "video/mp4", "video/webm", "video/quicktime"].includes(t?.toLowerCase());
  const isAudioType = (t) => !t || ["audio", "audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3"].includes(t?.toLowerCase());

  const menuBg = isMidnight ? "#1E2235" : "#FFFFFF";
  const menuText = isMidnight ? "#E4E6EB" : "#050505";
  const menuSubtext = isMidnight ? "#9FA8DA" : "#65676B";
  const menuBorder = isMidnight ? "#2D3250" : "#E4E6EB";
  const menuHover = isMidnight ? "#2D3250" : "#F0F2F5";

  const menuItem = (icon, label, onClick, danger = false) => (
    <button
      onClick={() => { onClick(); setMenuOpen(false); }}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer"
      style={{ color: danger ? "#F44336" : menuText }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = menuHover; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  // Toolbar appears on the opposite side of the bubble:
  // My messages (right) → toolbar on LEFT (-left-11)
  // Other messages (left) → toolbar on RIGHT (+right-11)
  const toolbarSide = isMe ? "-left-27" : "-right-27";

  return (
    <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-0.5 transition-opacity duration-150 ${isToolbarVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"} ${toolbarSide}`}
    >
      {/* React button */}
      <div ref={pickerRef} className="relative">
        <button
          onClick={(e) => { e.stopPropagation(); setReactPickerOpen((v) => !v); }}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors cursor-pointer"
          title="React"
        >
          <svg className="w-4.5 h-4.5" style={{ color: menuSubtext }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        {reactPickerOpen && (
          <div
            className="absolute bottom-9 flex bg-white rounded-[22px] shadow-[0_1px_8px_rgba(0,0,0,0.12)] border border-[#E4E6EB] px-1.5 py-1.5 gap-0.5 z-50"
            style={{ [isMe ? "right" : "left"]: 0 }}
          >
            {REACTION_TYPES.map((r) => (
              <button
                key={r.value}
                onClick={(e) => { e.stopPropagation(); onReact(message.id, r.value); setReactPickerOpen(false); }}
                className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full hover:bg-[#F0F2F5] transition-colors text-lg leading-none"
                title={r.label}
              >
                {r.emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reply button */}
      <button
        onClick={(e) => { e.stopPropagation(); onReply(message); }}
        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors cursor-pointer"
        title="Reply"
      >
        <svg className="w-4.5 h-4.5" style={{ color: menuSubtext }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      </button>

      {/* More menu */}
      <div ref={menuRef} className="relative">
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors cursor-pointer"
          title="More"
        >
          <svg className="w-4.5 h-4.5" style={{ color: menuSubtext }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
        {menuOpen && (
          <div
            className="absolute bottom-9 z-50 rounded-xl overflow-hidden shadow-[0_1px_8px_rgba(0,0,0,0.12)] border py-1 w-48"
            style={{ backgroundColor: menuBg, borderColor: menuBorder, [isMe ? "right" : "left"]: 0 }}
          >
            {menuItem(
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>,
              "Edit",
              onEdit,
            )}
            {menuItem(
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>,
              "Reply",
              () => onReply(message),
            )}
            {menuItem(
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>,
              "Chuyển tiếp",
              () => { },
            )}
            {menuItem(
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>,
              message.isPinned ? "Unpin" : "Pin",
              onTogglePin,
            )}
            {isMe && menuItem(
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>,
              "Thu hồi",
              onRevoke,
              true,
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MessageReactionSummary({ reactions, currentUserId, isMe, theme }) {
  if (!reactions || reactions.length === 0) return null;
  const grouped = reactions.reduce((acc, r) => {
    if (!acc[r.reactionType]) acc[r.reactionType] = [];
    acc[r.reactionType].push(r);
    return acc;
  }, {});

  return (
    <div className={`flex flex-wrap gap-1 mt-0.5 ${isMe ? "mr-1" : "ml-1"}`}>
      {Object.entries(grouped).map(([type, users]) => {
        const emoji = REACTION_TYPES.find((r) => r.value === type)?.emoji ?? "\u2764\uFE0F";
        const isActive = users.some((u) => u.userId === currentUserId);
        return (
          <div
            key={type}
            className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs border transition-colors`}
            style={{
              backgroundColor: isActive ? `${theme.bubbleSelf}20` : "white",
              borderColor: isActive ? theme.bubbleSelf : "#E4E6EB",
            }}
          >
            <span className="text-sm leading-none">{emoji}</span>
            <span className="font-medium" style={{ color: isActive ? theme.bubbleSelf : theme.text }}>{users.length}</span>
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// Input bar
// ══════════════════════════════════════════════════════════════════
const ACCEPT_IMAGE = "image/png,image/jpeg,image/gif,image/webp";
const ACCEPT_VIDEO = "video/mp4,video/webm,video/quicktime";
const ACCEPT_FILE = "*/*";

function FilePreview({ file, onRemove }) {
  const isImage = file.type?.startsWith("image/");
  const isVideo = file.type?.startsWith("video/");
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (isImage) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    if (isVideo) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    return () => { };
  }, [file, isImage, isVideo]);

  return (
    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#F0F2F5] border border-[#E4E6EB]">
      {isImage && previewUrl && (
        <img src={previewUrl} alt={file.name} className="w-full h-full object-cover" />
      )}
      {isVideo && previewUrl && (
        <video src={previewUrl} className="w-full h-full object-cover" />
      )}
      {!isImage && !isVideo && (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 px-1">
          <svg className="w-6 h-6 text-fb-subtext flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
          </svg>
          <span className="text-[9px] text-fb-subtext text-center leading-tight line-clamp-2">{file.name}</span>
        </div>
      )}
      <button
        onClick={onRemove}
        className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors cursor-pointer"
      >
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
    </div>
  );
}

function MessageInput({ theme, isMidnight, conv, replyTo, editingMsg, onReplySent, onEditSent, onCancelReply, onCancelEdit }) {
  const { sendMessage, startTyping, endTyping, updateMessage } = useChat();
  const [msg, setMsg] = useState("");
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimerRef = useRef(null);
  const dropZoneRef = useRef(null);
  const photoInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const defaultReaction = conv?.defaultReaction || "Like";
  const defaultEmoji = getReactionEmoji(defaultReaction);
  const canSend = (msg.trim() || files.length > 0) && !isSending;

  // Sync editing message content to input
  useEffect(() => {
    if (editingMsg) setMsg(editingMsg.content || "");
  }, [editingMsg]);

  // Clear input when reply/edit is cancelled from outside
  useEffect(() => {
    if (!replyTo && !editingMsg && !msg) return;
    if (!replyTo && !editingMsg) {
      setMsg("");
    }
  }, [replyTo, editingMsg]);

  useEffect(() => {
    const handler = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handler);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [showEmojiPicker]);

  const handleChange = (e) => {
    setMsg(e.target.value);
    startTyping();
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => endTyping(), 2000);
  };

  const addFiles = (newFiles) => {
    const arr = Array.from(newFiles).filter((f) => f instanceof File);
    setFiles((prev) => [...prev, ...arr]);
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSend = async (prepend = "") => {
    const content = prepend || msg;
    const hasContent = content.trim();
    const hasFiles = files.length > 0;
    if (!hasContent && !hasFiles) return;
    if (isSending) return;

    clearTimeout(typingTimerRef.current);
    endTyping();
    setIsSending(true);
    try {
      if (editingMsg) {
        await updateMessage(editingMsg.id, content);
        setMsg("");
        setFiles([]);
        onEditSent?.();
      } else {
        await sendMessage(prepend || msg, files, replyTo?.id ?? null);
        setMsg("");
        setFiles([]);
        onReplySent?.();
      }
    } finally {
      setIsSending(false);
    }
  };

  // Drag-and-drop on the entire input area
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };
  const handleDragLeave = (e) => {
    if (!dropZoneRef.current?.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const dropped = e.dataTransfer?.files;
    if (dropped?.length) addFiles(dropped);
  };

  const onEmojiClick = (emojiData) => {
    setMsg((prev) => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  return (
    <div
      ref={dropZoneRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex flex-col flex-shrink-0 transition-colors duration-150 ${isDragOver ? "bg-blue-50" : ""}`}
      style={{ borderTop: "1px solid #E4E6EB" }}
    >
      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-blue-50/90 rounded-t-lg pointer-events-none">
          <svg className="w-10 h-10 text-fb-blue mb-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
          </svg>
          <span className="text-base font-semibold text-fb-blue">Drop files here</span>
        </div>
      )}

      {/* Reply / Edit preview bar */}
      {(replyTo || editingMsg) && (
        <div className="flex items-center gap-2 px-4 pt-2 pb-1" style={{ borderBottom: "1px solid #E4E6EB" }}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-fb-blue flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              <span className="text-xs font-semibold text-fb-blue truncate">
                {editingMsg ? "Editing message" : `Reply to ${replyTo?.senderName || "message"}`}
              </span>
            </div>
            <p className="text-xs text-fb-subtext mt-0.5 truncate ml-5">
              {replyTo?.content || replyTo?.attachment ? "📎 Attachment" : replyTo?.content || editingMsg?.content || ""}
            </p>
          </div>
          <button
            onClick={() => {
              if (editingMsg) onCancelEdit?.();
              else onCancelReply?.();
            }}
            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#F0F2F5] transition-colors cursor-pointer flex-shrink-0"
          >
            <svg className="w-4 h-4 text-fb-subtext" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
      )}

      {/* File preview strip */}
      {files.length > 0 && (
        <div className="flex items-center gap-2 px-3 pt-2 overflow-x-auto">
          {files.map((f, idx) => (
            <FilePreview key={`${f.name}-${idx}`} file={f} onRemove={() => removeFile(idx)} />
          ))}
          <button
            onClick={() => setFiles([])}
            className="flex-shrink-0 text-xs text-red-500 hover:underline cursor-pointer ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main input row */}
      <div className="flex items-center gap-1 px-3 py-2">
        {/* Hidden file inputs */}
        <input
          ref={photoInputRef}
          type="file"
          accept={ACCEPT_IMAGE}
          multiple
          className="hidden"
          onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept={`${ACCEPT_IMAGE},${ACCEPT_VIDEO},${ACCEPT_FILE}`}
          multiple
          className="hidden"
          onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
        />

        {/* Photo / Image button */}
        <button
          onClick={() => photoInputRef.current?.click()}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-70 transition-colors flex-shrink-0 cursor-pointer"
          title="Send photo"
          style={{ color: theme.text }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
          </svg>
        </button>

        {/* Attach file button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-70 transition-colors flex-shrink-0 cursor-pointer"
          title="Attach file"
          style={{ color: theme.text }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
          </svg>
        </button>

        {/* Emoji picker button */}
        <div className="relative" ref={emojiPickerRef}>
          <button
            onClick={() => setShowEmojiPicker((v) => !v)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-70 transition-colors flex-shrink-0 cursor-pointer"
            title="Emoji"
            style={{ color: theme.text }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-12 right-0 z-50">
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                autoFocusSearch={false}
                height={320}
                width={320}
                skinTonesDisabled
                previewConfig={{ showPreview: false }}
              />
            </div>
          )}
        </div>

        {/* Input field */}
        <div className="flex-1 flex items-center rounded-[20px] px-3 py-1.5 gap-2 mx-1" style={{ backgroundColor: theme.bubbleOther }}>
          <input
            ref={inputRef}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: theme.bubbleOtherText }}
            placeholder={editingMsg ? "Edit message..." : "Aa"}
            value={msg}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          />
        </div>

        {/* Send / Like — default emoji */}
        <button
          onClick={() => {
            if (!canSend) {
              handleSend(defaultEmoji);
            }
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-all flex-shrink-0 cursor-pointer"
          title={canSend ? "Send message" : `Send ${defaultReaction}`}
        >
          {isSending ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
            </svg>
          ) : canSend ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ color: theme.bubbleSelf }}>
              <path d="M1 21L23 12 1 3v7l15 2-15 2v7z" />
            </svg>
          ) : (
            <span className="text-lg leading-none" style={{ transform: "scale(1.15)" }}>
              {defaultEmoji}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// SearchMessages — right-panel message search
// ══════════════════════════════════════════════════════════════════
function SearchMessages({ conv, onClose }) {
  const { messages } = useChat();
  const [query, setQuery] = useState("");
  const messagesEndRef = useRef(null);

  const results = messages.filter((m) =>
    (m.content || "").toLowerCase().includes(query.toLowerCase())
  );

  // Scroll to a message in the chat window
  const scrollToMessage = (msg) => {
    const el = document.querySelector(`[data-msg-id="${msg.id}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-fb-blue");
      setTimeout(() => el.classList.remove("ring-2", "ring-fb-blue"), 1500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid #E4E6EB" }}>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F0F2F5] transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5 text-fb-text" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-bold text-[15px] text-fb-text">Search messages</span>
      </div>

      {/* Search input */}
      <div className="px-4 py-3" style={{ borderBottom: "1px solid #E4E6EB" }}>
        <div className="flex items-center gap-2 bg-[#F0F2F5] rounded-[20px] px-3 py-2">
          <svg className="w-4 h-4 text-fb-subtext flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            autoFocus
            className="flex-1 bg-transparent outline-none text-sm placeholder-fb-subtext"
            placeholder="Search in this conversation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-[#D8DADF] transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-fb-subtext" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {!query.trim() ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
            <div className="w-14 h-14 bg-[#F0F2F5] rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-fb-subtext" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-fb-text">Search messages</p>
              <p className="text-xs text-fb-subtext mt-1">Find messages in this conversation</p>
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
            <div className="w-14 h-14 bg-[#F0F2F5] rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-fb-subtext" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-fb-text">No results</p>
              <p className="text-xs text-fb-subtext mt-1">Try a different keyword</p>
            </div>
          </div>
        ) : (
          <div className="py-2">
            <div className="px-4 py-1.5 text-xs font-semibold text-fb-subtext">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </div>
            {results.map((m) => {
              const isMe = m.senderId === m.senderId; // just for color
              return (
                <button
                  key={m.id}
                  onClick={() => scrollToMessage(m)}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#F0F2F5] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                      {m.senderAvatarUrl ? (
                        <img src={m.senderAvatarUrl} alt={m.senderName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#D8DADF] flex items-center justify-center">
                          <span className="text-xs font-bold text-fb-subtext">
                            {m.senderName ? m.senderName[0].toUpperCase() : "?"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-fb-text truncate">{m.senderName || "Unknown"}</span>
                        <span className="text-xs text-fb-subtext flex-shrink-0 ml-2">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-xs text-fb-subtext truncate">{m.content}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ChatInfo — wrapper that picks group vs direct
// ══════════════════════════════════════════════════════════════════
function ChatInfo({ conv, isOnline, onBack, onOpenSearch }) {
  if (!conv) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white">
        <div className="w-16 h-16 bg-[#F0F2F5] rounded-full flex items-center justify-center mb-3">
          <svg className="w-8 h-8 text-fb-subtext" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-fb-subtext">Select a conversation to view details</p>
      </div>
    );
  }
  return !conv.isOneToOne ? <ChatInfoGroup conv={conv} onOpenSearch={onOpenSearch} /> : <ChatInfoDirect conv={conv} isOnline={isOnline} />;
}

// ══════════════════════════════════════════════════════════════════
// Main Export — Layout orchestration
// ══════════════════════════════════════════════════════════════════
export default function MessengerFull() {
  const { convId } = useParams();
  const navigate = useNavigate();
  const { selectedConversation, selectConversation, isOnline } = useChat();

  // Mobile view state: "list" | "chat" | "info"
  const [mobileView, setMobileView] = useState("list");
  const [showInfo, setShowInfo] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileView("list");
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Select conversation from URL
  useEffect(() => {
    if (convId) selectConversation(convId, false);
  }, [convId]);

  // When conversation selected on mobile, go to chat view
  useEffect(() => {
    if (selectedConversation && isMobile) {
      setMobileView("chat");
    }
  }, [selectedConversation?.id, isMobile]);

  // Reset info panel visibility when conversation changes
  useEffect(() => {
    if (selectedConversation) setShowInfo(true);
  }, [selectedConversation?.id]);

  const handleSelect = (conv) => {
    const idToUse = conv.isNotInAConversation ? conv.otherUserId : conv.id;
    navigate(`/messenger/${idToUse}`, { replace: true });
    if (isMobile) setMobileView("chat");
  };

  const handleBackFromChat = () => {
    setMobileView("list");
    navigate("/messenger", { replace: true });
  };

  const handleToggleInfo = () => {
    if (isMobile) {
      setMobileView((v) => v === "info" ? "chat" : "info");
    } else {
      setShowInfo((v) => !v);
    }
  };

  const handleBackFromInfo = () => {
    setMobileView("chat");
  };

  // ─── Desktop Layout ───────────────────────────────────────────────
  if (!isMobile) {
    return (
      <div className="flex flex-col h-screen bg-[#F0F2F5]">
        <Navbar />
        <div className="flex flex-1 overflow-hidden pt-14.5">
          {/* Left panel — always visible */}
          <div className="w-[350px] flex-shrink-0 h-full" style={{ borderRight: "1px solid #E4E6EB" }}>
            <ConvList
              selected={selectedConversation}
              onSelect={handleSelect}
              onSelectUser={(id) => navigate(`/profile/${id}`)}
              onCreateGroup={(conv) => navigate(`/messenger/${conv.id}`, { replace: true })}
            />
          </div>

          {/* Center — chat window */}
          <div className="flex-1 min-w-0 flex justify-center">
            {selectedConversation ? (
              <div className="w-full max-w-[11000px] bg-white">
                <ChatWindow
                  key={selectedConversation.id || selectedConversation.otherUserId}
                  conv={selectedConversation}
                  isOnline={isOnline}
                  onToggleInfo={handleToggleInfo}
                  showInfoButton={true}
                />
              </div>
            ) : (
              <div className="flex-1 bg-white">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-24 h-24 bg-[#F0F2F5] rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-fb-subtext" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                    </svg>
                  </div>
                  <p className="text-xl font-bold text-fb-text">Select a conversation</p>
                  <p className="text-sm text-fb-subtext mt-1">Choose from your existing conversations</p>
                </div>
              </div>
            )}
          </div>

          {/* Right panel — info / search (togglable) */}
          {selectedConversation && showInfo && (
            <div className="w-[320px] flex-shrink-0 h-full" style={{ borderLeft: "1px solid #E4E6EB" }}>
              {showSearch ? (
                <SearchMessages
                  conv={selectedConversation}
                  onClose={() => setShowSearch(false)}
                />
              ) : (
                <ChatInfo
                  conv={selectedConversation}
                  isOnline={isOnline}
                  onOpenSearch={() => setShowSearch(true)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Mobile Layout ───────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5]">
      <Navbar />

      {/* Conversation List */}
      {mobileView === "list" && (
        <div className="flex-1 pt-14">
          <ConvList
            selected={selectedConversation}
            onSelect={handleSelect}
            onSelectUser={(id) => navigate(`/profile/${id}`)}
            onCreateGroup={(conv) => navigate(`/messenger/${conv.id}`, { replace: true })}
          />
        </div>
      )}

      {/* Chat Window */}
      {mobileView === "chat" && selectedConversation && (
        <div className="flex-1 pt-14 flex flex-col">
          <ChatWindow
            key={selectedConversation.id || selectedConversation.otherUserId}
            conv={selectedConversation}
            isOnline={isOnline}
            onBack={handleBackFromChat}
            onToggleInfo={handleToggleInfo}
            showInfoButton={true}
          />
        </div>
      )}

      {/* Chat Info */}
      {mobileView === "info" && (
        <div className="flex-1 pt-14 flex flex-col">
          {/* Mobile info header */}
          <div className="bg-white px-4 py-2.5 flex items-center" style={{ borderBottom: "1px solid #E4E6EB" }}>
            <button
              onClick={handleBackFromInfo}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#F0F2F5] transition-colors text-fb-text"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="ml-3 font-semibold text-[15px] text-fb-text">Conversation Info</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ChatInfo conv={selectedConversation} isOnline={isOnline} />
          </div>
        </div>
      )}
    </div>
  );
}
