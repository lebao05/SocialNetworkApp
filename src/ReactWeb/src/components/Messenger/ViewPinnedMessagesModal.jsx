import React, { useEffect } from "react";
import { X, Pin } from "lucide-react";
import { useChat } from "../../contexts/ChatContext";
import { useAuth } from "../../contexts/authContext";
import { togglePinMessageApi } from "../../apis/messageApi";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

function formatTime(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" }) +
    " · " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function PinnedMessageItem({ message, onUnpin, isOnline, onlineUsers }) {
  const { user } = useAuth();
  const isMe = message.senderId === user?.id;
  const senderOnline = !isMe && message.senderId && isOnline ? isOnline(message.senderId) : false;

  return (
    <div className="flex items-start gap-3 px-4 py-3 hover:bg-[#F0F2F5] transition-colors rounded-xl group">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={message.senderAvatarUrl || DEFAULT_AVATAR}
          className="w-10 h-10 rounded-full object-cover"
          alt={message.senderName ?? ""}
          onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
        />
        {!isMe && senderOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[14px] font-semibold text-fb-text truncate">
            {message.senderName ?? "Unknown"}
          </span>
          <span className="text-xs text-fb-subtext flex-shrink-0">
            {formatTime(message.createdAt)}
          </span>
        </div>
        <p className="text-sm text-fb-text leading-relaxed break-words">{message.content}</p>

        {/* Reactions */}
        {message.reactions?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {message.reactions.reduce((acc, r) => {
              const existing = acc.find((a) => a.type === r.reactionType);
              if (existing) { existing.users.push(r); }
              else { acc.push({ type: r.reactionType, users: [r] }); }
              return acc;
            }, []).map(({ type, users }) => (
              <span key={type} className="flex items-center gap-0.5 bg-[#E4E6EB] px-1.5 py-0.5 rounded-full text-xs">
                <EmojiForType type={type} />
                <span className="font-medium">{users.length}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Unpin button */}
      <button
        onClick={() => onUnpin(message.id)}
        className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 opacity-0 group-hover:opacity-100 hover:bg-[#D8DADF] transition-all"
        title="Unpin message"
      >
        <Pin className="w-4 h-4 text-fb-subtext fill-current" />
      </button>
    </div>
  );
}

const REACTION_EMOJI = {
  Like:   "\u2764\uFE0F",
  Love:   "\uD83D\uDE0D",
  Haha:   "\uD83D\uDE02",
  Wow:    "\uD83D\uDE2E",
  Sad:    "\uD83D\uDE22",
  Angry:  "\uD83D\uDE20",
};

function EmojiForType({ type }) {
  return <span className="text-sm leading-none">{REACTION_EMOJI[type] ?? "\u2764\uFE0F"}</span>;
}

export default function ViewPinnedMessagesModal({ conv, isOnline, onlineUsers, onClose }) {
  const { pinnedMessages, pinnedLoading, loadPinnedMessages } = useChat();

  useEffect(() => {
    if (conv?.id) loadPinnedMessages();
  }, [conv?.id]);

  const handleUnpin = async (messageId) => {
    try {
      await togglePinMessageApi(messageId);
      loadPinnedMessages();
    } catch (err) {
      console.error("Failed to unpin message:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative bg-white rounded-2xl w-[520px] max-h-[75vh] flex flex-col overflow-hidden"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4E6EB]">
          <div className="flex items-center gap-2">
            <Pin className="w-5 h-5 text-fb-blue" />
            <h2 className="text-lg font-bold text-fb-text">Pinned Messages</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F0F2F5] transition-colors"
          >
            <X className="w-5 h-5 text-fb-subtext" />
          </button>
        </div>

        {/* Conversation label */}
        {conv && (
          <div className="px-5 py-2.5 border-b border-[#E4E6EB] bg-[#F0F2F5]">
            <p className="text-xs text-fb-subtext">
              {conv.isOneToOne ? "Pinned messages with " : "Pinned messages in "}
              <span className="font-semibold text-fb-text">{conv.name}</span>
            </p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {pinnedLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 border-2 border-fb-blue border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-fb-subtext">Loading pinned messages...</p>
            </div>
          ) : pinnedMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-14 h-14 bg-[#F0F2F5] rounded-full flex items-center justify-center">
                <Pin className="w-7 h-7 text-fb-subtext" />
              </div>
              <p className="text-sm font-semibold text-fb-text">No pinned messages</p>
              <p className="text-xs text-fb-subtext text-center max-w-[260px]">
                Messages you pin will show up here for easy access.
              </p>
            </div>
          ) : (
            <div className="py-2">
              {pinnedMessages.map((msg) => (
                <PinnedMessageItem
                  key={msg.id}
                  message={msg}
                  onUnpin={handleUnpin}
                  isOnline={isOnline}
                  onlineUsers={onlineUsers}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
