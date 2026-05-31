import React, { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import LeftSidebar from "../components/Sidebar/LeftSidebar";
import StoryBar from "../components/Feed/StoryBar";
import CreatePost from "../components/Feed/CreatePost";
import PostCard from "../components/Feed/PostCard";
import RightSidebar from "../components/RightSidebar/RightSidebar";
import { MiniChatBox } from "../components/Messenger/MessengerMini";
import { useAuth } from "../contexts/authContext";
import { useFeed } from "../hooks/useFeed";
import CreatePostModal from "../components/Profile/CreatePostModal";

export default function HomePage() {
  const { user: currentUser } = useAuth();
  const [openChats, setOpenChats] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const markedFeedIdsRef = useRef(new Set());

  const {
    posts,
    isLoading,
    createPost,
    markLatestAsSeen
  } = useFeed();

  const markUnseenFeedItems = useCallback(() => {
    const unseenFeedIds = posts
      .filter((feedItem) => !feedItem.isSeen)
      .map((feedItem) => feedItem.feedId)
      .filter((feedId) => feedId && !markedFeedIdsRef.current.has(feedId));

    if (unseenFeedIds.length === 0) return Promise.resolve();

    unseenFeedIds.forEach((feedId) => markedFeedIdsRef.current.add(feedId));

    return markLatestAsSeen(unseenFeedIds).catch(() => {
      unseenFeedIds.forEach((feedId) => markedFeedIdsRef.current.delete(feedId));
    });
  }, [posts, markLatestAsSeen]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;
      const isAtPageEnd = scrollPosition >= pageHeight - 24;

      if (isAtPageEnd) {
        markUnseenFeedItems();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [markUnseenFeedItems]);

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

  const displayUser = {
    name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Bạn",
    avatar: currentUser?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
  };

  const handleCreatePost = async (payload) => {
    try {
      await createPost(payload);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error("Create post failed:", err);
    }
  };

  // Define generic default themes to pass to CreatePost
  const theme = {
    card: "bg-white text-[#050505]",
    textSub: "text-[#65676b]",
    tabHover: "hover:bg-[#f2f2f2]"
  };

  return (
    <div className="bg-fb-bg min-h-screen">
      <Navbar />

      <div className="pt-14">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-[280px] xl:px-[280px]">
          <main className="mx-auto w-full max-w-[680px] py-4 flex flex-col gap-4">
            <StoryBar />
            
            <CreatePost
              displayUser={displayUser}
              setIsCreateModalOpen={setIsCreateModalOpen}
              isOwnProfile={true}
              theme={theme}
              darkMode={false}
            />

            {posts.length > 0 ? (
              posts.map((feedItem) => (
                <PostCard key={feedItem.feedId || feedItem.id || feedItem.post?.id} post={feedItem.post} />
              ))
            ) : isLoading ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-xl shadow p-4 animate-pulse flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="w-24 h-4 bg-gray-200 rounded" />
                        <div className="w-16 h-3 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <div className="w-full h-24 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                Chưa có bài viết nào trên bảng tin của bạn. Hãy kết bạn hoặc tạo bài viết mới nhé!
              </div>
            )}
          </main>
        </div>

        <LeftSidebar />
        <RightSidebar onContactClick={handleContactClick} />
      </div>

      {openChats.length > 0 && (
        <div className="fixed bottom-0 right-4 flex items-end gap-3 z-50 sm:right-2 sm:gap-2">
          {openChats.map((contact) => (
            <MiniChatBox key={contact.id} contact={contact} onClose={() => handleCloseChat(contact.id)} />
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        displayUser={displayUser}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}
