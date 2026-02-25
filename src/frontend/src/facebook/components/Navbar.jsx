import { Link } from "react-router-dom";
import { currentUser } from "../../shared/data/mockData";
import Avatar from "../../shared/components/Avatar";

const navItems = [
  { icon: "🏠", to: "/" },
  { icon: "👥", to: "#" },
  { icon: "▶️", to: "#" },
  { icon: "🛒", to: "#" },
  { icon: "🎮", to: "#" },
];

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm h-14 flex items-center px-4 justify-between">
      <div className="flex items-center gap-2 w-72">
        <Link to="/" className="text-blue-600 text-3xl font-black leading-none">
          f
        </Link>
        <div className="bg-gray-100 rounded-full flex items-center px-3 py-1.5 gap-2 flex-1">
          <span className="text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm trên Facebook"
            className="bg-transparent text-sm outline-none w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        {navItems.map((item, i) => (
          <Link
            key={i}
            to={item.to}
            className="px-8 py-3 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <span className="text-xl">{item.icon}</span>
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2 w-72 justify-end">
        <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 text-sm">
          ⊞
        </button>
        <Link
          to="/messenger"
          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
        >
          💬
        </Link>
        <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
          🔔
        </button>
        <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
      </div>
    </nav>
  );
}

export default Navbar;
