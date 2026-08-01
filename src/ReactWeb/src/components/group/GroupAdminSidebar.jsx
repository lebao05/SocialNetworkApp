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

// Views that only admins may see. Moderators get these items filtered out of
// the admin sidebar because they govern promotion/demotion and overall group
// configuration, which are admin responsibilities.
const ADMIN_ONLY_VIEWS = new Set(["community-roles", "group-settings"]);

const isModerator = (role) => String(role || "").trim().toLowerCase() === "moderator";

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

const DEFAULT_GROUP_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

const formatPrivacy = (groupDetail) => {
  if (!groupDetail) return groupInfo.adminPrivacy;
  const privacyRaw = groupDetail.privacyType ?? groupDetail.PrivacyType;
  const numeric = typeof privacyRaw === "number" ? privacyRaw : Number(privacyRaw);
  if (numeric === 1 || String(privacyRaw).toLowerCase() === "private") {
    return "Private group";
  }
  return "Public group";
};

const formatMemberCount = (groupDetail) => {
  if (!groupDetail) return groupInfo.adminMembers;
  const count = groupDetail.memberCount ?? groupDetail.MemberCount ?? 0;
  return `${count} ${count === 1 ? "member" : "members"}`;
};

const resolveGroupName = (groupDetail) =>
  groupDetail?.name ?? groupDetail?.Name ?? groupInfo.shortName;

const resolveGroupAvatar = (groupDetail) =>
  groupDetail?.coverPhotoUrl ?? groupDetail?.CoverPhotoUrl ?? groupInfo.avatar ?? DEFAULT_GROUP_AVATAR;

export default function GroupAdminSidebar({ activeView, onViewChange, groupDetail = null, userRole = null }) {
  const displayName = resolveGroupName(groupDetail);
  const avatarUrl = resolveGroupAvatar(groupDetail);
  const privacyLabel = formatPrivacy(groupDetail);
  const memberLabel = formatMemberCount(groupDetail);

  // Hide admin-only entries (Community Roles, Group Settings) from moderators.
  const visibleSections = isModerator(userRole)
    ? adminSidebarSections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => !ADMIN_ONLY_VIEWS.has(item.view)),
        }))
        .filter((section) => section.items.length > 0)
    : adminSidebarSections;

  return (
    <aside className="fixed left-0 top-14 z-30 hidden h-[calc(100vh-56px)] w-[292px] overflow-y-auto border-r border-[#d8dadf] bg-white lg:block">
      <div className="flex gap-3 border-b border-[#dddfe2] p-3">
        <img src={avatarUrl} alt="" className="h-10 w-10 rounded-lg bg-[#e4e6eb] object-cover" />
        <div className="min-w-0">
          <div className="truncate text-[15px] font-bold">{displayName}</div>
          <div className="text-[12px] text-[#65676b]">{privacyLabel} · {memberLabel}</div>
        </div>
      </div>

      <div className="p-2">
        {visibleSections.map((section) => (
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
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-left ${
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
