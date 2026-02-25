import { useParams } from "react-router-dom";
import ConversationList from "../features/conversation/ConversationList";
import MessageArea from "../features/message/MessageArea";

function MessengerPage() {
  const { id } = useParams();

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <ConversationList />
      <main className="flex-1 flex flex-col overflow-hidden">
        {id ? (
          <MessageArea />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p className="text-5xl mb-4">💬</p>
              <p className="text-xl font-semibold text-gray-700">Tin nhắn của bạn</p>
              <p className="text-sm mt-2">Gửi ảnh, video và nhắn tin riêng tư</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default MessengerPage;
