import { Link, useParams } from "react-router-dom";
import useChatStore from "../../../shared/store/chatStore";
import { mockConversations, mockContacts } from "../../../shared/data/mockData";
import Avatar from "../../../shared/components/Avatar";

function ConversationList() {
  const { id } = useParams();
  const setCurrentChatId = useChatStore((s) => s.setCurrentChatId);

  return (
    <aside className="w-80 h-full border-r border-gray-200 flex flex-col bg-white shrink-0">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Đoạn chat</h1>
        <input
          type="text"
          placeholder="Tìm kiếm trên Messenger"
          className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div className="flex gap-2 px-4 pb-2">
        {["Tất cả", "Chưa đọc", "Nhóm"].map((tab) => (
          <button
            key={tab}
            className="px-3 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {mockConversations.map((conv) => {
          const contact = mockContacts.find((u) => u.id === conv.userId);
          const lastMsg = conv.messages[conv.messages.length - 1];
          const isActive = id === conv.id;
          const isMe = lastMsg.senderId === "me";

          return (
            <Link
              key={conv.id}
              to={`/messenger/${conv.id}`}
              onClick={() => setCurrentChatId(conv.id)}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors ${isActive ? "bg-blue-50" : ""}`}
            >
              <Avatar src={contact?.avatar} name={contact?.name} size="md" showStatus status={contact?.status} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">{contact?.name}</p>
                <p className="text-xs text-gray-500 truncate">
                  {isMe ? "Bạn: " : ""}
                  {lastMsg.text}
                </p>
              </div>
              <span className="text-xs text-gray-400 shrink-0">{lastMsg.time}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

export default ConversationList;
