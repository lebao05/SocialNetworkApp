import { mockContacts, currentUser } from "../../../shared/data/mockData";
import Avatar from "../../../shared/components/Avatar";

function PostCard({ post }) {
  const author =
    post.userId === "me"
      ? currentUser
      : mockContacts.find((c) => c.id === post.userId) || { name: "Unknown", avatar: "" };

  return (
    <div className="bg-white rounded-xl shadow mb-4 overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <Avatar src={author.avatar} name={author.name} size="sm" />
          <div>
            <p className="font-semibold text-gray-800 text-sm">{author.name}</p>
            <p className="text-xs text-gray-500">{post.time} · 🌐</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 text-xl">⋯</button>
      </div>

      <p className="px-4 pb-3 text-gray-800 text-sm leading-relaxed">{post.content}</p>

      {post.image && <img src={post.image} alt="post" className="w-full max-h-96 object-cover" />}

      <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100">
        <span className="text-xs text-gray-500">👍❤️ {post.likes}</span>
        <div className="flex gap-3">
          <span className="text-xs text-gray-500 hover:underline cursor-pointer">{post.comments} bình luận</span>
          <span className="text-xs text-gray-500 hover:underline cursor-pointer">{post.shares} lượt chia sẻ</span>
        </div>
      </div>

      <div className="px-2 py-1 flex">
        {[
          { icon: "👍", label: "Thích" },
          { icon: "💬", label: "Bình luận" },
          { icon: "↗️", label: "Chia sẻ" },
        ].map((a) => (
          <button
            key={a.label}
            className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-600 font-medium"
          >
            <span>{a.icon}</span> {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PostCard;
