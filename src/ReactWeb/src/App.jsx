import React from "react";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import MessengerPage from "./pages/MessengerPage";
import SignupPage from "./pages/SignUpPage";
import SigninPage from "./pages/SigninPage";
import ProfilePage from "./pages/ProfilePage";
import FriendsPage from "./pages/FriendsPage";
import GroupPage from "./pages/GroupPage";
import GroupsPage from "./pages/GroupsPage";
import GroupsCreatePage from "./pages/GroupsCreatePage";
import SearchPage from "./pages/SearchPage";
import ReelsPage from "./pages/ReelsPage";
import SavedPage from "./pages/SavedPage";
import BirthdaysPage from "./pages/BirthdaysPage";
import CreateStoryPage from "./pages/CreateStoryPage";
import StoryPage from "./pages/StoryPage";
import PostDetailPage from "./pages/PostDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const location = useLocation();
  const isPostRoute = location.pathname.startsWith("/post/");
  const state = location.state;
  const backgroundLocation =
    state?.backgroundLocation ??
    (isPostRoute
      ? {
        ...location,
        pathname: "/",
      }
      : location);
  return (
    <>
      {/* Background routes */}
      <Routes location={backgroundLocation || location}>
        <Route path="/sign-in" element={<SigninPage />} />
        <Route path="/sign-up" element={<SignupPage />} />

        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/friends" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
        <Route path="/saved" element={<ProtectedRoute><SavedPage /></ProtectedRoute>} />
        <Route path="/birthdays" element={<ProtectedRoute><BirthdaysPage /></ProtectedRoute>} />
        <Route path="/watch" element={<ProtectedRoute><ReelsPage /></ProtectedRoute>} />
        <Route path="/watch/:reelId" element={<ProtectedRoute><ReelsPage /></ProtectedRoute>} />
        <Route path="/reels" element={<ProtectedRoute><ReelsPage /></ProtectedRoute>} />
        <Route path="/stories/create" element={<ProtectedRoute><CreateStoryPage /></ProtectedRoute>} />
        <Route path="/profile/:userId/stories" element={<ProtectedRoute><StoryPage /></ProtectedRoute>} />
        <Route path="/messenger" element={<ProtectedRoute><MessengerPage /></ProtectedRoute>} />
        <Route path="/messenger/t/:userId" element={<ProtectedRoute><MessengerPage /></ProtectedRoute>} />
        <Route path="/messenger/:convId" element={<ProtectedRoute><MessengerPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
        <Route path="/groups" element={<ProtectedRoute><GroupsPage /></ProtectedRoute>} />
        <Route path="/groups/create" element={<ProtectedRoute><GroupsCreatePage /></ProtectedRoute>} />
        <Route path="/groups/:groupId" element={<ProtectedRoute><GroupPage /></ProtectedRoute>} />
      </Routes>

      {/* Modal */}
      {backgroundLocation && (
        <Routes>
          <Route
            path="/post/:postId"
            element={
              <ProtectedRoute>
                <PostDetailPage backgroundLocation={backgroundLocation} />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
}