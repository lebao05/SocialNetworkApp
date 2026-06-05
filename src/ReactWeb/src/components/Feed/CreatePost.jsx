import React from "react";
import { Video, Image as ImageIcon, Smile } from "lucide-react";
import { useAuth } from "../../contexts/authContext";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

export default function CreatePost({
  displayUser: propDisplayUser,
  setIsCreateModalOpen,
  isOwnProfile = true,
  theme = {
    card: "bg-white text-[#050505]",
    textSub: "text-[#65676b]",
    tabHover: "hover:bg-[#f2f2f2]"
  },
  darkMode = false
}) {
  const { user: currentUser } = useAuth();

  // Fallback to current authenticated user if propDisplayUser is not passed
  const displayUser = propDisplayUser || {
    name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Bạn",
    avatar: currentUser?.avatarUrl || DEFAULT_AVATAR
  };

  return (
    <>
      {isOwnProfile && (
        <div className={`${theme.card} rounded-xl shadow p-4 transition-colors duration-200`}>
          <div className="flex items-center gap-3 pb-3 border-b border-gray-300">
            <img
              src={displayUser.avatar}
              alt={displayUser.name}
              className="w-10 h-10 rounded-full object-cover border"
            />
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className={`flex-1 text-left px-4 py-2.5 rounded-full text-[15px] transition-all cursor-pointer text-gray-500 ${darkMode ? 'bg-[#3a3b3c] hover:bg-[#4e4f50] text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'}`}
            >
              {displayUser.name} , What is on your mind?
            </button>
          </div>

          {/* Actions inside create card */}
          <div className="flex items-center justify-around pt-3">
            <button onClick={() => setIsCreateModalOpen(true)} className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-lg transition-all font-semibold text-sm ${theme.textSub} ${theme.tabHover}`}>
              <Video size={18} className="text-red-500" />
              <span>Live Video</span>
            </button>
            <button onClick={() => setIsCreateModalOpen(true)} className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-lg transition-all font-semibold text-sm ${theme.textSub} ${theme.tabHover}`}>
              <ImageIcon size={18} className="text-green-500" />
              <span>Photo/video</span>
            </button>
            <button onClick={() => setIsCreateModalOpen(true)} className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-lg transition-all font-semibold text-sm ${theme.textSub} ${theme.tabHover}`}>
              <Smile size={18} className="text-yellow-500" />
              <span>Feeling/activity</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
