import React, { useState } from "react";

const ReactionBtn = ({ icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-fb-hover text-sm font-semibold transition-colors ${active ? "text-fb-blue" : "text-fb-subtext"}`}
  >
    <span>{icon}</span> {label}
  </button>
);

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <div className="bg-white rounded-xl shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full" />
          <div>
            <p className="text-[15px] font-semibold text-fb-text leading-tight">{post.user}</p>
            <p className="text-xs text-fb-subtext">
              {post.time} · {post.privacy === "public" ? "🌐" : "👥"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 rounded-full hover:bg-fb-hover flex items-center justify-center text-fb-subtext font-bold text-lg">
            ···
          </button>
          <button className="w-9 h-9 rounded-full hover:bg-fb-hover flex items-center justify-center text-fb-subtext">
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      {post.content && <p className="px-4 pb-2 text-[15px] text-fb-text">{post.content}</p>}

      {/* Image */}
      {post.image && (
        <div className="w-full">
          <img src={post.image} alt="post" className="w-full object-cover max-h-[500px]" />
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between px-4 py-2 text-fb-subtext text-sm">
        <div className="flex items-center gap-1 cursor-pointer hover:underline">
          <span>👍❤️😂</span>
          <span>{likes.toLocaleString()}</span>
        </div>
        <div className="flex gap-3">
          <span className="cursor-pointer hover:underline">{post.comments} bình luận</span>
          <span className="cursor-pointer hover:underline">{post.shares} lượt chia sẻ</span>
        </div>
      </div>

      <hr className="mx-4 border-fb-sidebar" />

      {/* Actions */}
      <div className="flex items-center px-2 py-1">
        <ReactionBtn icon="👍" label="Thích" onClick={handleLike} active={liked} />
        <ReactionBtn icon="💬" label="Bình luận" />
        <ReactionBtn icon="↗️" label="Chia sẻ" />
      </div>
    </div>
  );
}
