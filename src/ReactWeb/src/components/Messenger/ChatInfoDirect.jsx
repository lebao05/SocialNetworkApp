import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChat } from "../../contexts/ChatContext";
import ViewPinnedMessagesModal from "./ViewPinnedMessagesModal";
import SharedMediaModal from "./SharedMediaModal";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

function SectionHeader({ title, open, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-3 px-1 hover:opacity-70 transition-opacity cursor-pointer"
    >
      <span className="font-bold text-base text-fb-text">{title}</span>
      <svg
        className={`w-5 h-5 text-fb-subtext transition-transform duration-200 ${open ? "" : "rotate-180"}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
      </svg>
    </button>
  );
}

function InfoRow({ icon, label, onClick, danger = false, sublabel }) {
  const content = (
    <div
      className={`w-full flex items-center gap-3 py-2.5 px-1 rounded-lg text-left transition-all duration-150 cursor-pointer
        ${onClick ? "hover:bg-[#F0F2F5] hover:scale-[1.01]" : ""}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${danger ? "bg-red-50" : "bg-[#F0F2F5]"}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-base font-medium ${danger ? "text-red-500" : "text-fb-text"}`}>{label}</p>
        {sublabel && <p className="text-sm text-fb-subtext">{sublabel}</p>}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }
  return content;
}

export default function ChatInfoDirect({ conv, isOnline }) {
  const navigate = useNavigate();
  const { toggleNotifications } = useChat();

  const [openSections, setOpenSections] = useState({
    info: false,
    custom: false,
    media: false,
    privacy: false,
  });
  const [showPinned, setShowPinned] = useState(false);
  const [showMedia, setShowMedia] = useState(false);

  const toggle = (key) => setOpenSections((s) => ({ ...s, [key]: !s[key] }));

  const handleMute = async () => {
    if (!conv?.id) return;
    await toggleNotifications(conv.id);
  };

  if (!conv) return null;

  const otherUserId = conv.otherUserId;
  const avatarUrl = conv.otherUserAvatarUrl || conv.imageUrl || DEFAULT_AVATAR;
  const userOnline = isOnline ? isOnline(otherUserId) : false;

  const handleAvatarClick = () => {
    if (otherUserId) navigate(`/profile/${otherUserId}`);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Avatar + name */}
      <div className="flex flex-col items-center pt-6 pb-4 px-4">
        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
          <img
            src={avatarUrl}
            className="w-20 h-20 rounded-full object-cover mb-3 transition-transform duration-200 group-hover:scale-105"
            alt={conv.name}
          />
          <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
        <p
          className="font-bold text-lg text-fb-text cursor-pointer hover:underline transition-opacity duration-150"
          onClick={handleAvatarClick}
        >
          {conv.name}
        </p>
        <p className={`text-base mt-0.5 transition-colors duration-150 ${userOnline ? "text-green-500" : "text-fb-subtext"}`}>
          {userOnline ? "Active now" : "Offline"}
        </p>

        {/* Quick actions */}
        <div className="flex items-center gap-3 mt-5">
          <button onClick={handleAvatarClick} className="flex flex-col items-center gap-1.5 cursor-pointer group">
            <div className="w-12 h-12 bg-[#F0F2F5] hover:bg-[#E4E6EB] hover:scale-105 rounded-full flex items-center justify-center transition-all duration-150">
              <svg className="w-5 h-5 text-fb-text" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <span className="text-xs text-fb-subtext text-center">View profile</span>
          </button>

          <button onClick={handleMute} className="flex flex-col items-center gap-1.5 cursor-pointer group">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-150
              ${conv.isNotificationOn === false
                ? "bg-[#FFF3CD] hover:bg-[#FFE69C] hover:scale-105"
                : "bg-[#F0F2F5] hover:bg-[#E4E6EB] hover:scale-105"}`}
            >
              {conv.isNotificationOn === false ? (
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-fb-text" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
              )}
            </div>
            <span className={`text-xs text-center transition-colors duration-150
              ${conv.isNotificationOn === false ? "text-amber-600 font-semibold" : "text-fb-subtext"}`}>
              {conv.isNotificationOn === false ? "Unmute" : "Mute"}
            </span>
          </button>

          <button className="flex flex-col items-center gap-1.5 cursor-pointer group">
            <div className="w-12 h-12 bg-[#F0F2F5] hover:bg-[#E4E6EB] hover:scale-105 rounded-full flex items-center justify-center transition-all duration-150">
              <svg className="w-5 h-5 text-fb-text" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </div>
            <span className="text-xs text-fb-subtext text-center">Search</span>
          </button>
        </div>
      </div>

      {/* Accordion sections */}
      <div className="px-4 pb-6 flex flex-col divide-y divide-[#E4E6EB]">
        {/* Shared media */}
        <div>
          <SectionHeader
            title="Shared media"
            open={openSections.media}
            onToggle={() => toggle("media")}
          />
          {openSections.media && (
            <div className="pb-2 flex flex-col">
              <InfoRow
                icon={<svg className="w-4 h-4 text-fb-text" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>}
                label="Photos and videos"
                onClick={() => setShowMedia(true)}
              />
              <InfoRow
                icon={<svg className="w-4 h-4 text-fb-text" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>}
                label="Files"
                onClick={() => setShowMedia(true)}
              />
            </div>
          )}
        </div>

        {/* Customize */}
        <div>
          <SectionHeader
            title="Customize"
            open={openSections.custom}
            onToggle={() => toggle("custom")}
          />
          {openSections.custom && (
            <div className="pb-2 flex flex-col">
              <InfoRow
                icon={<svg className="w-4 h-4 text-fb-text" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /></svg>}
                label="Change theme"
                onClick={() => {}}
              />
              <InfoRow
                icon={<svg className="w-4 h-4 text-fb-text" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" /></svg>}
                label="Change emoji"
                onClick={() => {}}
              />
            </div>
          )}
        </div>

        {/* Privacy */}
        <div>
          <SectionHeader
            title="Privacy and support"
            open={openSections.privacy}
            onToggle={() => toggle("privacy")}
          />
          {openSections.privacy && (
            <div className="pb-2 flex flex-col">
              <InfoRow
                icon={conv.isNotificationOn === false ? (
                  <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" /></svg>
                ) : (
                  <svg className="w-4 h-4 text-fb-text" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>
                )}
                label={conv.isNotificationOn === false ? "Turn on notifications" : "Turn off notifications"}
                onClick={handleMute}
              />
              <InfoRow
                icon={<svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9V8h2v9zm4 0h-2V8h2v9z" /></svg>}
                label="Block messages"
                danger={true}
                onClick={() => {}}
              />
            </div>
          )}
        </div>
      </div>

      {showPinned && (
        <ViewPinnedMessagesModal
          conv={conv}
          isOnline={isOnline}
          onlineUsers={null}
          onClose={() => setShowPinned(false)}
        />
      )}

      {showMedia && (
        <SharedMediaModal conv={conv} onClose={() => setShowMedia(false)} />
      )}
    </div>
  );
}
