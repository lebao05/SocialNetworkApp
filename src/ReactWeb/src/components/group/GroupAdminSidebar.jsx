import {
  Badge,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronDown,
  CircleHelp,
  Clock,
  Flag,
  Grid2X2Plus,
  Home,
  Layers,
  MessageSquareWarning,
  Newspaper,
  Settings,
  Shield,
  ShieldCheck,
  ThumbsUp,
  TriangleAlert,
  UserPlus,
  Users,
} from "lucide-react";
import { adminSidebarSections, groupInfo } from "../../data/groupMockData";

const iconMap = {
  Badge,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  CircleHelp,
  Clock,
  Flag,
  Grid2X2Plus,
  Home,
  Layers,
  MessageSquareWarning,
  Newspaper,
  Settings,
  Shield,
  ShieldCheck,
  ThumbsUp,
  TriangleAlert,
  UserPlus,
  Users,
};

export default function GroupAdminSidebar({ activeView, onViewChange }) {
  return (
    <aside className="fixed left-0 top-14 z-30 hidden h-[calc(100vh-56px)] w-[292px] overflow-y-auto border-r border-[#d8dadf] bg-white lg:block">
      <div className="flex gap-3 border-b border-[#dddfe2] p-3">
        <img src={groupInfo.avatar} alt="" className="h-10 w-10 rounded-lg bg-[#e4e6eb]" />
        <div className="min-w-0">
          <div className="truncate text-[15px] font-bold">{groupInfo.shortName}</div>
          <div className="text-[12px] text-[#65676b]">{groupInfo.adminPrivacy} · {groupInfo.adminMembers}</div>
        </div>
      </div>

      <div className="p-2">
        {adminSidebarSections.map((section) => (
          <div key={section.title} className="border-b border-[#dddfe2] py-2 last:border-b-0">
            <div className="mb-1 flex items-center justify-between px-1 text-[13px] font-semibold text-[#65676b]">
              <span>{section.title}</span>
              <ChevronDown size={15} />
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = iconMap[item.icon] || CircleHelp;
                const active = item.view === activeView;

                return (
                  <button
                    key={item.view}
                    type="button"
                    onClick={() => onViewChange(item.view)}
                    className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-left ${
                      active ? "bg-[#dff0df] text-[#0866ff]" : "text-[#050505] hover:bg-[#f2f2f2]"
                    }`}
                  >
                    <Icon size={18} className={active ? "shrink-0 text-[#16a34a]" : "shrink-0 text-[#1c1e21]"} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold">{item.label}</span>
                      {item.sub && <span className="block truncate text-[11px] font-normal text-[#65676b]">{item.sub}</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
