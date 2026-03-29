import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import LeftSidebar from "../components/Sidebar/LeftSidebar";
import StoryBar from "../components/Feed/StoryBar";
import CreatePost from "../components/Feed/CreatePost";
import PostCard from "../components/Feed/PostCard";
import RightSidebar from "../components/RightSidebar/RightSidebar";
import { MiniChatBox } from "../components/Messenger/MessengerMini";
import { posts } from "../data/mockData";

export default function HomePage() {
  const [openChats, setOpenChats] = useState([]);

  const handleContactClick = (contact) => {
    if (openChats.find((c) => c.id === contact.id)) return;
    setOpenChats((prev) => {
      const next = [...prev, contact];
      return next.length > 3 ? next.slice(next.length - 3) : next;
    });
  };

  const handleCloseChat = (contactId) => {
    setOpenChats((prev) => prev.filter((c) => c.id !== contactId));
  };

  return (
    <div className="bg-fb-bg min-h-screen">
      <Navbar />

      <div className="flex pt-14">
        <LeftSidebar />
        <main
          className="flex-1 flex flex-col gap-4 py-4"
          style={{
            marginLeft: 280,
            marginRight: 280,
            maxWidth: 680,
            margin: "56px auto 0",
            padding: "16px",
          }}
        >
          <StoryBar />
          <CreatePost />
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </main>
        <RightSidebar onContactClick={handleContactClick} />
      </div>

      {openChats.length > 0 && (
        <div className="fixed bottom-0 right-4 flex items-end gap-3 z-50">
          {openChats.map((contact) => (
            <MiniChatBox key={contact.id} contact={contact} onClose={() => handleCloseChat(contact.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
