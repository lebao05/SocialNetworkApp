import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import MessengerFull from "../components/Messenger/MessengerFull";
import { useChat } from "../contexts/ChatContext";

export default function MessengerPage() {
  const { userId } = useParams();
  const { selectConversation } = useChat();

  useEffect(() => {
    if (userId) {
      selectConversation(userId, true);
    }
  }, [userId]);

  return <MessengerFull />;
}
