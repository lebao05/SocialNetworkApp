import { useEffect, useState } from "react";
import { useSignalR } from "../contexts/signalRContext";

export const useChat = () => {
    const { connection, isConnected } = useSignalR();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!connection) return;

        // Listener for messages from backend
        const messageListener = (user, message) => {
            setMessages((prev) => [...prev, { user, message, timestamp: new Date() }]);
        };

        connection.on("ReceiveMessage", messageListener);

        // Cleanup listener when component unmounts
        return () => {
            connection.off("ReceiveMessage", messageListener);
        };
    }, [connection]);

    // Function to send a message
    const sendMessage = async (receiverId, message) => {
        if (!connection || !isConnected) {
            console.error("Cannot send message: Not connected.");
            return;
        }

        try {
            // Matches your C# Hub method: public async Task SendMessage(Guid receiverId, string message)
            await connection.invoke("SendMessage", receiverId, message);
        } catch (err) {
            console.error("Send Message failed:", err);
        }
    };

    return { messages, sendMessage, isConnected };
};