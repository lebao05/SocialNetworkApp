import { Link } from "react-router-dom";
import { currentUser } from "../../shared/data/mockData";
import Avatar from "../../shared/components/Avatar";

const navItems = [
  { icon: "👥", label: "Bạn bè" },
  { icon: "🕐", label: "Kỷ niệm" },
  { icon: "🔖", label: "Đã lưu" },
  { icon: "👥", label: "Nhóm" },
  { icon: "▶️", label: "Thước phim" },
  { icon: "🛒", label: "Marketplace" },
];

function LeftSidebar() {
  return (
    <aside className="w-72 fixed top-14 left-0 h-[calc(100vh-56px)] overflow-y-auto p-2 hidden lg:block">
      <Link to="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors mb-1">
        <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
        <span className="font-semibold text-gray-800 text-sm">{currentUser.name}</span>
      </Link>

      {navItems.map((item) => (
        <button
          key={item.label}
          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="text-xl w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">{item.icon}</span>
          <span className="text-gray-700 text-sm font-medium">{item.label}</span>
        </button>
      ))}

      <div className="border-t border-gray-200 mt-3 pt-3">
        <p className="text-gray-500 text-xs font-semibold px-2 mb-2">Lối tắt của bạn</p>
        {["Nhóm Frontend Việt Nam", "CLB Lập Trình HCMUS"].map((g) => (
          <button key={g} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">
            <div className="w-9 h-9 bg-blue-100 rounded-lg shrink-0" />
            <span className="text-sm text-gray-700 text-left">{g}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

export default LeftSidebar;
