import Navbar from "../components/Navbar";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import StoryBar from "../features/story/StoryBar";
import CreatePost from "../features/feed/CreatePost";
import PostFeed from "../features/feed/PostFeed";
import MiniChatPopup from "../../shared/components/MiniChatPopup";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="pt-14 flex">
        <LeftSidebar />

        {/* Center Feed */}
        <main className="flex-1 lg:ml-72 lg:mr-72 max-w-2xl mx-auto px-4 py-4">
          <StoryBar />
          <div className="mt-4">
            <CreatePost />
            <PostFeed />
          </div>
        </main>

        <RightSidebar />
      </div>

      <MiniChatPopup />
    </div>
  );
}

export default Home;
