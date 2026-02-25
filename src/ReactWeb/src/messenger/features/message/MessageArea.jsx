import { useParams } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { mockConversations, mockContacts } from "../../../shared/data/mockData";
import MessageBubble from "./MessageBubble";
import Avatar from "../../../shared/components/Avatar";

function MessageArea() {
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const conversation = mockConversations.find((c) => c.id === id);
  const contact = conversation ? mockContacts.find((u) => u.id === conversation.userId) : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [id]);

  if (!conversation || !contact) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-5xl mb-4">💬</p>
          <p className="text-lg font-semibold text-gray-600">Chọn một đoạn chat</p>
          <p className="text-sm mt-1">Chọn từ danh sách các cuộc trò chuyện</p>
        </div>
      </div>
    );
  }

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setNewMessage("");
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Sticky Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white shrink-0">
        <Avatar src={contact.avatar} name={contact.name} size="md" showStatus status={contact.status} />
        <div>
          <p className="font-semibold text-gray-800">{contact.name}</p>
          <p className="text-xs text-gray-500">{contact.status === "online" ? "Đang hoạt động" : "Không hoạt động"}</p>
        </div>
        <div className="ml-auto flex gap-2">
          {["📞", "📹", "ℹ️"].map((icon) => (
            <button
              key={icon}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
        {conversation.messages.map((msg, index) => {
          const prevMsg = conversation.messages[index - 1];
          const showAvatar = !prevMsg || prevMsg.senderId !== msg.senderId;
          return <MessageBubble key={msg.id} message={msg} contact={contact} showAvatar={showAvatar} />;
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 bg-white shrink-0"
      >
        {["➕", "🖼️", "🎁"].map((icon) => (
          <button key={icon} type="button" className="text-blue-500 text-xl">
            {icon}
          </button>
        ))}
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Aa"
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button type="button" className="text-blue-500 text-xl">
          😊
        </button>
        {newMessage.trim() ? (
          <button type="submit" className="text-blue-500 font-bold text-sm">
            Gửi
          </button>
        ) : (
          <button type="button" className="text-blue-500 text-xl">
            👍
          </button>
        )}
      </form>
    </div>
  );
}

export default MessageArea;
