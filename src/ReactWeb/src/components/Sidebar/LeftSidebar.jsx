import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bookmark,
  Clapperboard,
  Clock3,
  Gift,
  MessageCircle,
  Pencil,
  Users,
} from "lucide-react";
import { MdGroups } from "react-icons/md";
import { groupShortcuts } from "../../data/mockData";
import { useYourGroups } from "../../hooks/useYourGroups";
import { useAuth } from "../../contexts/authContext";
const MenuItem = ({ imgUrl, icon: Icon, iconBg, label, to, isActive = false }) => {
  const content = (
    <>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center">
        {imgUrl ? (
          <img src={imgUrl} alt={label} className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <div className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm ${iconBg}`}>
            <Icon size={20} className="text-white" />
          </div>
        )}
      </div>
      <span className={`truncate text-[15px] ${isActive ? "font-semibold" : "font-medium"}`}>{label}</span>
    </>
  );
  const className = `flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors ${
    isActive ? "bg-[#E7F3FF] text-[#1877F2]" : "text-[#050505] hover:bg-[#F2F2F2]"
  }`;

  if (to) {
    return (
      <Link to={to} className={`${className} no-underline`}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
};

const ShortcutItem = ({ shortcut }) => {
  const { id, name, avatar, coverPhotoUrl, newPosts } = shortcut;
  const DEFAULT_GROUP_AVATAR = import.meta.env.VITE_DEFAULT_GROUP_AVATAR;
  const src = avatar || coverPhotoUrl || DEFAULT_GROUP_AVATAR;
  const showBadge = Number.isFinite(newPosts) && newPosts > 0;

  return (
    <Link
      to={`/groups/${id}`}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-inherit no-underline hover:bg-[#F2F2F2]"
    >
      <img
        src={src}
        alt={name}
        onError={(e) => {
          if (DEFAULT_GROUP_AVATAR && e.currentTarget.src !== DEFAULT_GROUP_AVATAR) {
            e.currentTarget.src = DEFAULT_GROUP_AVATAR;
          }
        }}
        className="h-9 w-9 shrink-0 rounded-lg object-cover"
      />
      <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-[#050505]">{name}</span>
      {showBadge && (
        <span className="shrink-0 rounded-full bg-[#e41e3f] px-2 py-0.5 text-[11px] font-semibold text-white">
          +{newPosts}
        </span>
      )}
    </Link>
  );
};

export default function LeftSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.email ||
    "User";
  const avatarSrc = user?.avatarUrl || import.meta.env.VITE_DEFAULT_AVATAR;

  const { groups: joinedGroups } = useYourGroups({
    page: 1,
    pageSize: 8,
    autoFetch: !!user,
  });

  const primaryMenu = [
    { id: "friends", label: "Friends", icon: Users, iconBg: "bg-gradient-to-r from-blue-400 to-blue-600", to: "/friends" },
    { id: "saved", label: "Saved", icon: Bookmark, iconBg: "bg-gradient-to-r from-purple-500 to-indigo-600", to: "/saved" },
    { id: "groups", label: "Groups", icon: MdGroups, iconBg: "bg-gradient-to-r from-teal-400 to-emerald-500", to: "/groups" },
    { id: "reels", label: "Reels", icon: Clapperboard, iconBg: "bg-gradient-to-r from-pink-500 to-rose-500", to: "/watch" },
  ];

  const extendedMenu = [
    { id: "messenger", label: "Messenger", icon: MessageCircle, iconBg: "bg-gradient-to-tr from-blue-500 via-pink-500 to-purple-500", to: "/messenger" },
    { id: "birthdays", label: "Birthdays", icon: Gift, iconBg: "bg-gradient-to-r from-pink-400 to-purple-500", to: "/birthdays" },
  ];

  // Prefer live joined groups; fall back to mock shortcuts so the section is
  // never empty while the API is loading or the user hasn't joined anything yet.
  const shortcuts =
    joinedGroups.length > 0
      ? joinedGroups.map((g) => ({
          id: g.id,
          name: g.name,
          coverPhotoUrl: g.coverPhotoUrl,
          avatar: g.avatar,
          newPosts: g.newPosts ?? 0,
        }))
      : [];

  return (
    <aside className="scrollbar-thin fixed left-0 top-14 z-10 hidden h-[calc(100vh-56px)] w-[280px] select-none flex-col overflow-y-auto border-r border-[#ced0d4] bg-white p-2 lg:flex">
      <Link to="/profile" className="mb-1 flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-inherit no-underline hover:bg-[#F2F2F2]">
        <img
          src={avatarSrc}
          alt="avatar"
          className="h-9 w-9 rounded-full border border-black/10 object-cover shadow-sm"
        />
        <span className="truncate text-[15px] font-semibold text-[#050505]">{fullName}</span>
      </Link>

      {primaryMenu.map((item) => (
        <MenuItem key={item.id} icon={item.icon} iconBg={item.iconBg} label={item.label} to={item.to} />
      ))}

      {extendedMenu.map((item) => (
        <MenuItem key={item.id} icon={item.icon} iconBg={item.iconBg} label={item.label} to={item.to} />
      ))}

      {shortcuts.length > 0 && (
        <>
          <hr className="my-2 border-[#ced0d4]" />

          <div className="flex items-center justify-between px-2 py-1">
            <h2 className="truncate text-[15px] font-semibold text-[#65676b]">Your shortcuts</h2>
          </div>

          <div className="space-y-0.5">
            {shortcuts.map((shortcut) => (
              <ShortcutItem key={shortcut.id} shortcut={shortcut} />
            ))}
          </div>
        </>
      )}
    </aside>
  );
}