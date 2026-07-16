import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MessageCircle, UserPlus, Tag, Users, Bell, CheckCheck } from "lucide-react";
import { useNotificationContext } from "../../contexts/NotificationContext";

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
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function getNotificationLink(notification) {
  const { entityType, postId, actorUserId, groupId } = notification;
  switch (entityType) {
    case 0:
    case 6:
      return postId ? `/post/${postId}` : null;
    case 1:
      return postId ? `/post/${postId}` : null;
    case 2:
      return actorUserId ? `/profile/${actorUserId}` : null;
    case 3:
      return groupId ? `/groups/${groupId}` : null;
    case 4:
      return actorUserId ? `/profile/${actorUserId}` : null;
    default:
      return null;
  }
}

export default function NotificationDropdown({ onClose }) {
  const navigate = useNavigate();
  const { notifications, unseenCount, markAsSeen, markAllAsSeen } = useNotificationContext();

  const handleOpenAll = () => {
    navigate("/notifications");
    onClose();
  };

  const handleNotificationClick = (notification) => {
    const link = getNotificationLink(notification);
    if (link) {
      if (!notification.isSeen) markAsSeen(notification.id);
      navigate(link);
      onClose();
    } else {
      if (!notification.isSeen) markAsSeen(notification.id);
      onClose();
    }
  };

  return (
    <div
      className="absolute top-full right-0 mt-2 w-[400px] bg-white rounded-2xl overflow-hidden z-50"
      style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.18)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 className="text-[22px] font-bold text-fb-text">Notifications</h2>
        <div className="flex items-center gap-1">
          {unseenCount > 0 && (
            <button
              onClick={markAllAsSeen}
              className="w-9 h-9 cursor-pointer bg-fb-bg hover:bg-fb-hover rounded-full flex items-center justify-center text-fb-text transition-colors"
              title="Mark all as read"
            >
              <CheckCheck size={16} />
            </button>
          )}
          <button
            onClick={handleOpenAll}
            className="w-9 h-9 cursor-pointer bg-fb-bg hover:bg-fb-hover rounded-full flex items-center justify-center text-fb-text transition-colors"
            title="See all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 pb-2">
        {[
          { key: "all", label: "All" },
          { key: "unread", label: "Unread", badge: unseenCount },
        ].map((t) => (
          <button
            key={t.key}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors bg-fb-bg text-fb-text hover:bg-fb-hover"
          >
            {t.label}
            {t.badge > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="overflow-y-auto max-h-[420px]">
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Bell size={32} className="text-fb-subtext" />
            <p className="text-sm text-fb-subtext">No notifications yet</p>
          </div>
        )}
        {notifications.slice(0, 15).map((notification) => {
          const { id, actorFirstName, actorLastName, notificationType, isSeen, actorAvatarUrl, createdAt } =
            notification;
          const Icon = NOTIFICATION_TYPE_ICONS[notificationType] ?? Bell;
          const label = NOTIFICATION_TYPE_LABELS[notificationType] ?? "interacted with you";
          const actorName = [actorFirstName, actorLastName].filter(Boolean).join(" ") || "Someone";
          const link = getNotificationLink(notification);

          const item = (
            <div
              className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                isSeen ? "hover:bg-fb-hover" : "bg-blue-50 hover:bg-blue-100"
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              {/* Avatar + icon overlay */}
              <div className="relative flex-shrink-0">
                <img
                  src={actorAvatarUrl || "https://i.pravatar.cc/100"}
                  alt={actorName}
                  className="w-11 h-11 rounded-full object-cover"
                />
                <span
                  className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white ${
                    isSeen ? "bg-[#65676b]" : "bg-[#0866ff]"
                  }`}
                >
                  <Icon size={9} className="text-white" />
                </span>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-fb-text leading-snug">
                  <span className="font-bold">{actorName}</span>{" "}
                  <span className="font-normal">{label}</span>
                </p>
                <p className="text-[11px] text-fb-subtext mt-0.5">{formatTime(createdAt)}</p>
              </div>

              {/* Unseen indicator */}
              {!isSeen && (
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#0866ff]" />
              )}
            </div>
          );

          if (link) {
            return (
              <div key={id}>{item}</div>
            );
          }
          return <div key={id}>{item}</div>;
        })}
      </div>

      {/* Footer */}
      <div style={{ boxShadow: "0 -1px 0 #E4E6EB" }}>
        <button
          onClick={handleOpenAll}
          className="w-full cursor-pointer py-3 text-center text-sm font-semibold text-fb-blue hover:bg-fb-hover transition-colors"
        >
          See all notifications
        </button>
      </div>
    </div>
  );
}
