import useChatStore from "../../../shared/store/chatStore";
import { mockContacts, mockConversations } from "../../../shared/data/mockData";
import Avatar from "../../../shared/components/Avatar";

function ContactList() {
  const openChat = useChatStore((s) => s.openChat);

  const handleClick = (contact) => {
    const conv = mockConversations.find((c) => c.userId === contact.id);
    if (conv) openChat(conv.id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-2">
        <h3 className="text-gray-500 font-semibold text-sm">Người liên hệ</h3>
        <div className="flex gap-2 text-gray-500">
          <button className="hover:text-gray-700 text-sm">🔍</button>
          <button className="hover:text-gray-700 text-sm">⋯</button>
        </div>
      </div>
      {mockContacts.map((contact) => (
        <button
          key={contact.id}
          onClick={() => handleClick(contact)}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Avatar src={contact.avatar} name={contact.name} size="sm" showStatus status={contact.status} />
          <span className="text-gray-800 text-sm font-medium">{contact.name}</span>
        </button>
      ))}
    </div>
  );
}

export default ContactList;
