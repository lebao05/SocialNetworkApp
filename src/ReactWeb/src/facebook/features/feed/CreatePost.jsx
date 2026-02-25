import { currentUser } from "../../../shared/data/mockData";
import Avatar from "../../../shared/components/Avatar";

function CreatePost() {
  return (
    <div className="bg-white rounded-xl shadow p-3 mb-4">
      <div className="flex items-center gap-3 mb-3">
        <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-500 text-left rounded-full px-4 py-2 text-sm transition-colors">
          {currentUser.name.split(" ")[0]} ơi, bạn đang nghĩ gì thế?
        </button>
      </div>
      <div className="border-t border-gray-100 pt-2 flex items-center justify-around">
        {[
          { icon: "📹", label: "Video trực tiếp" },
          { icon: "🖼️", label: "Ảnh/video" },
          { icon: "😊", label: "Cảm xúc" },
        ].map((btn) => (
          <button
            key={btn.label}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-600 font-medium"
          >
            <span>{btn.icon}</span> {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CreatePost;
