import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MessageCircle, UserPlus, Tag, Users, Bell } from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import { useNotificationContext } from "../contexts/NotificationContext";

const NOTIFICATION_TYPE_LABELS = {
  1: "sent you a friend request",
  2: "liked your post",
  3: "commented on your post",
  4: "replied to your comment",
  5: "mentioned you",
  6: "tagged you",
  7: "invited you to a group",
};

const NOTIFICATION_TYPE_ICONS = {
  1: UserPlus,
  2: Heart,
  3: MessageCircle,
  4: MessageCircle,
  5: Tag,
  6: Tag,
  7: Users,
};

function formatTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function getNotificationLink(notification) {
  const { entityType, postId, actorUserId, friendRequestId, groupId } = notification;
  switch (entityType) {
    case 0: // Post
    case 6: // PostTagged
      return postId ? `/post/${postId}` : null;
    case 1: // Comment
      return postId ? `/post/${postId}` : null;
    case 2: // Profile
      return actorUserId ? `/profile/${actorUserId}` : null;
    case 3: // Group
      return groupId ? `/groups/${groupId}` : null;
    case 4: // FriendRequest
      return actorUserId ? `/profile/${actorUserId}` : null;
    default:
      return null;
  }
}

function NotificationItem({ notification, onMarkSeen }) {
  const { actorFirstName, actorLastName, notificationType, isSeen, actorAvatarUrl } = notification;
  const Icon = NOTIFICATION_TYPE_ICONS[notificationType] ?? Bell;
  const label = NOTIFICATION_TYPE_LABELS[notificationType] ?? "interacted with you";
  const actorName = [actorFirstName, actorLastName].filter(Boolean).join(" ") || "Someone";
  const link = getNotificationLink(notification);

  const content = (
    <div
      className={`flex items-start gap-3 px-4 py-3 transition-colors ${
        isSeen ? "" : "bg-blue-50 hover:bg-blue-100"
      }`}
    >
      {/* Avatar + Icon overlay */}
      <div className="relative flex-shrink-0">
        <img
          src={actorAvatarUrl || "https://i.pravatar.cc/100"}
          alt={actorName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <span
          className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white ${
            isSeen ? "bg-[#65676b]" : "bg-[#0866ff]"
          }`}
        >
          <Icon size={11} className="text-white" />
        </span>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[15px] text-[#050505] leading-snug">
          <span className="font-bold">{actorName}</span>{" "}
          <span className="font-normal">{label}</span>
        </p>
        <p className="text-[13px] text-[#65676b] mt-0.5">{formatTime(notification.createdAt)}</p>
      </div>

      {/* Unseen dot */}
      {!isSeen && <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#0866ff]" />}
    </div>
  );

  const handleClick = () => {
    if (!isSeen) onMarkSeen(notification.id);
  };

  if (link) {
    return (
      <Link to={link} onClick={handleClick} className="block hover:bg-[#f0f2f5] transition-colors">
        {content}
      </Link>
    );
  }

  return (
    <div onClick={handleClick} className="cursor-pointer hover:bg-[#f0f2f5] transition-colors">
      {content}
    </div>
  );
}

export default function NotificationsPage() {
  const { notifications, loading, fetchNotifications, markAsSeen, markAllAsSeen, unseenCount } =
    useNotificationContext();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all"); // "all" | "unseen"

  const filtered = filter === "unseen" ? notifications.filter((n) => !n.isSeen) : notifications;

  const handleMarkAll = async () => {
    await markAllAsSeen();
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#050505] font-sans antialiased">
      <Navbar />

      <div className="flex pt-14 h-[calc(100vh-56px)] overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex w-[360px] bg-white border-r border-[#ced0d4] flex-col flex-shrink-0 h-full shadow-md">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-[#050505]">Notifications</h1>
          </div>

          <div className="flex flex-col gap-1 px-2">
            {[
              { key: "all", label: "All" },
              { key: "unseen", label: "Unread" },
            ].map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-semibold transition-colors cursor-pointer ${
                  filter === f.key ? "bg-[#e7f3ff] text-[#0866ff]" : "text-[#050505] hover:bg-[#f2f2f2]"
                }`}
              >
                <Bell size={18} />
                {f.label}
                {f.key === "unseen" && unseenCount > 0 && (
                  <span className="ml-auto bg-[#0866ff] text-white text-[11px] font-bold rounded-full px-2 py-0.5">
                    {unseenCount}
                  </span>
                )}
              </button>
            ))}

            {unseenCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAll}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-semibold text-[#65676b] hover:bg-[#f2f2f2] transition-colors cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[680px] mx-auto py-4">
            <div className="bg-white rounded-lg border border-[#dddfe2] shadow-sm overflow-hidden">
              {/* Mobile filter tabs */}
              <div className="flex border-b border-[#dddfe2] md:hidden">
                {[
                  { key: "all", label: "All" },
                  { key: "unseen", label: "Unread" },
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={`flex-1 py-3 text-[14px] font-semibold border-b-2 transition-colors ${
                      filter === f.key
                        ? "border-[#0866ff] text-[#0866ff]"
                        : "border-transparent text-[#65676b]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* List */}
              {loading && filtered.length === 0 ? (
                <div className="py-20 text-center text-[#65676b]">Loading...</div>
              ) : filtered.length === 0 ? (
                <div className="py-20 text-center text-[#65676b]">
                  No notifications yet.
                </div>
              ) : (
                <div>
                  <div className="divide-y divide-[#f0f2f5]">
                    {filtered.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkSeen={markAsSeen}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
