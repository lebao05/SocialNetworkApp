import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import useChatStore from "../store/chatStore";
import { mockContacts, mockConversations } from "../data/mockData";
import Avatar from "./Avatar";

function MiniChatPopup() {
  const { currentChatId, isPopupOpen, closePopup } = useChatStore();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const conversation = mockConversations.find((c) => c.id === currentChatId);
  const contact = conversation ? mockContacts.find((u) => u.id === conversation.userId) : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChatId]);

  if (!isPopupOpen || !contact || !conversation) return null;

  const handleNavigateToFull = () => {
    navigate(`/messenger/${conversation.id}`);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setNewMessage("");
  };

  return (
    <div className="fixed bottom-0 right-4 z-50 w-80 shadow-xl rounded-t-xl overflow-hidden border border-gray-200 bg-white">
      {/* Header — click to open full page */}
      <div
        className="flex items-center justify-between bg-white px-3 py-2 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
        onClick={handleNavigateToFull}
      >
        <div className="flex items-center gap-2">
          <Avatar src={contact.avatar} name={contact.name} size="sm" showStatus status={contact.status} />
          <span className="font-semibold text-sm text-gray-800">{contact.name}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            closePopup();
          }}
          className="text-gray-400 hover:text-gray-700 text-lg leading-none"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-3 flex flex-col gap-2 bg-white">
        {conversation.messages.map((msg) => {
          const isMe = msg.senderId === "me";
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm ${
                  isMe ? "bg-blue-500 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex items-center gap-2 px-3 py-2 border-t border-gray-100">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Aa"
          className="flex-1 bg-gray-100 rounded-full px-4 py-1.5 text-sm outline-none"
        />
        <button type="submit" className="text-blue-500 font-semibold text-sm">
          Gửi
        </button>
      </form>
    </div>
  );
}

export default MiniChatPopup;
