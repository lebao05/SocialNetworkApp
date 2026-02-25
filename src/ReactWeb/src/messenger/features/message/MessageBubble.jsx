import Avatar from "../../../shared/components/Avatar";

function MessageBubble({ message, contact, showAvatar }) {
  const isMe = message.senderId === "me";

  return (
    <div className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
      {!isMe &&
        (showAvatar ? (
          <Avatar src={contact?.avatar} name={contact?.name} size="sm" />
        ) : (
          <div className="w-9 shrink-0" />
        ))}
      <div
        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl text-sm ${
          isMe ? "bg-blue-500 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}

export default MessageBubble;
