import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useChat } from "../../contexts/ChatContext";
import { useAuth } from "../../contexts/authContext";
import ViewPinnedMessagesModal from "./ViewPinnedMessagesModal";
import SharedMediaModal from "./SharedMediaModal";
import AddMemberModal from "./AddMemberModal";
import ChangeThemeModal from "./ChangeThemeModal";
import ChangeEmojiModal from "./ChangeEmojiModal";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;
const DEFAULT_CHAT_GROUP_COVER = import.meta.env.VITE_DEFAULT_CHAT_GROUP_COVER;

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

function MemberRow({ member, isOwner, currentUserId, isOnline, onAssignAdmin, onRevokeAdmin, onKick, onRemoveMember, onNavigate, onBlock, onReport }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isMemberOwner = member.role === "Owner";
  const isMemberAdmin = member.role === "Admin";
  const isCurrentUser = member.userId === currentUserId;
  const canManage = isOwner && !isCurrentUser;
  const canKick = (isOwner || isMemberAdmin) && !isMemberOwner && !isCurrentUser;
  const showMenu = !isCurrentUser;

  return (
    <div
      className={`flex items-center gap-3 py-2 px-1 rounded-lg transition-all duration-150 cursor-pointer group
        ${!isCurrentUser ? "hover:bg-[#F0F2F5]" : ""}`}
    >
      <div className="relative flex-shrink-0">
        <img
          src={member.avatarUrl || DEFAULT_AVATAR}
          className="w-12 h-12 rounded-full object-cover transition-transform duration-200 group-hover:scale-105"
          alt={member.fullName}
        />
        {isOnline(member.userId) && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold text-fb-text truncate">{member.fullName}</p>
          {isMemberOwner && (
            <span className="text-[10px] font-bold text-fb-blue bg-blue-50 px-1.5 py-0.5 rounded-full flex-shrink-0">Admin</span>
          )}
          {isMemberAdmin && !isMemberOwner && (
            <span className="text-[10px] font-bold text-fb-blue bg-blue-50 px-1.5 py-0.5 rounded-full flex-shrink-0">Moderator</span>
          )}
        </div>
        <p className="text-sm text-fb-subtext">
          {member.role === "Owner" ? "Group creator" : member.role === "Admin" ? "Admin" : "Member"}
        </p>
      </div>

      {showMenu && (
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer
              ${menuOpen ? "bg-[#DADADA] scale-110" : "hover:bg-[#E4E6EB] hover:scale-110"} text-fb-subtext`}
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.14)] border border-[#E4E6EB] z-10 overflow-hidden">
              {(canManage || canKick) && (
                <>
                  {canManage && !isMemberOwner && !isMemberAdmin && (
                    <button className="w-full text-left px-4 py-3 text-base font-medium text-fb-text hover:bg-[#F0F2F5] transition-colors duration-150 cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); onAssignAdmin(member.userId); setMenuOpen(false); }}>
                      Make admin
                    </button>
                  )}
                  {canManage && isMemberAdmin && (
                    <button className="w-full text-left px-4 py-3 text-base font-medium text-fb-text hover:bg-[#F0F2F5] transition-colors duration-150 cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); onRevokeAdmin(member.userId); setMenuOpen(false); }}>
                      Remove as admin
                    </button>
                  )}
                  {canKick && (
                    <button className="w-full text-left px-4 py-3 text-base font-medium text-red-500 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); onKick(member.userId); setMenuOpen(false); }}>
                      Remove from group
                    </button>
                  )}
                  {!canKick && canManage && !isMemberOwner && (
                    <button className="w-full text-left px-4 py-3 text-base font-medium text-red-500 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); onRemoveMember(member.userId); setMenuOpen(false); }}>
                      Remove member
                    </button>
                  )}
                </>
              )}

              <>
                <button className="w-full text-left px-4 py-3 text-base font-medium text-fb-text hover:bg-[#F0F2F5] transition-colors duration-150 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }}>
                  Block messages
                </button>
                <button className="w-full text-left px-4 py-3 text-base font-medium text-fb-text hover:bg-[#F0F2F5] transition-colors duration-150 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }}>
                  Message
                </button>
                <button className="w-full text-left px-4 py-3 text-base font-medium text-fb-text hover:bg-[#F0F2F5] transition-colors duration-150 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }}>
                  View Profile
                </button>
              </>

            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ChatInfoGroup({ conv }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    toggleNotifications,
    leaveConversation,
    removeMember,
    assignAdmin,
    revokeAdmin,
    kickMember,
    conversationMembers,
    membersTotalCount,
    membersLoading,
    membersHasMore,
    loadConversationMembers,
    isOnline,
  } = useChat();

  const [openSections, setOpenSections] = useState({
    info: false,
    custom: false,
    members: false,
    media: false,
    privacy: false,
  });
  const [showPinned, setShowPinned] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const toggle = (key) => setOpenSections((s) => ({ ...s, [key]: !s[key] }));

  useEffect(() => {
    if (openSections.members && conv?.id && !conv.isVirtual) {
      loadConversationMembers(true);
    }
  }, [openSections.members, conv?.id]);

  const handleMute = async () => {
    if (!conv?.id) return;
    await toggleNotifications(conv.id);
  };

  const handleLeave = async () => {
    if (!conv?.id) return;
    if (!window.confirm("Leave this group?")) return;
    try {
      await leaveConversation(conv.id);
      navigate("/messenger");
    } catch { /* handled in context */ }
  };

  const handleRemoveMember = async (userIdToRemove) => {
    if (!conv?.id) return;
    if (!window.confirm("Remove this member?")) return;
    try {
      await removeMember(conv.id, userIdToRemove);
    } catch { /* handled in context */ }
  };

  const handleAssignAdmin = async (targetUserId) => {
    if (!conv?.id) return;
    try {
      await assignAdmin(conv.id, targetUserId);
    } catch { /* handled in context */ }
  };

  const handleRevokeAdmin = async (targetUserId) => {
    if (!conv?.id) return;
    try {
      await revokeAdmin(conv.id, targetUserId);
    } catch { /* handled in context */ }
  };

  const handleKick = async (userIdToKick) => {
    if (!conv?.id) return;
    if (!window.confirm("Kick this member?")) return;
    try {
      await kickMember(conv.id, userIdToKick);
    } catch { /* handled in context */ }
  };

  if (!conv) return null;

  const isOwner = conv.ownerId === user?.id;
  const members = conversationMembers;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Avatar + name */}
      <div className="flex flex-col items-center pt-6 pb-4 px-4">
        <div className="relative group cursor-pointer">
          <img
            src={conv.imageUrl || DEFAULT_CHAT_GROUP_COVER}
            className="w-20 h-20 rounded-full object-cover mb-3 transition-transform duration-200 group-hover:scale-105"
            alt={conv.name}
          />
          <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </div>
        </div>
        <p className="font-bold text-lg text-fb-text text-center">{conv.name}</p>
        <p className="text-base text-fb-subtext mt-0.5">{conv.memberCount ?? 0} members</p>

        {/* Quick actions */}
        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={handleMute}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer
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
            <span className={`text-xs text-center transition-colors duration-150 cursor-pointer
              ${conv.isNotificationOn === false ? "text-amber-600 font-semibold" : "text-fb-subtext"}`}>
              {conv.isNotificationOn === false ? "Unmute" : "Mute"}
            </span>
          </button>

          <button className="flex flex-col items-center gap-1.5 cursor-pointer group">
            <div className="w-12 h-12 bg-[#F0F2F5] hover:bg-[#E4E6EB] hover:scale-105 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer">
              <svg className="w-5 h-5 text-fb-text" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </div>
            <span className="text-xs text-fb-subtext text-center cursor-pointer">Search</span>
          </button>

          <button className="flex flex-col items-center gap-1.5 cursor-pointer group">
            <div className="w-12 h-12 bg-[#F0F2F5] hover:bg-[#E4E6EB] hover:scale-105 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer">
              <svg className="w-5 h-5 text-fb-text" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
              </svg>
            </div>
            <span className="text-xs text-fb-subtext text-center cursor-pointer">Notifications</span>
          </button>
        </div>
      </div>

      {/* Accordion sections */}
      <div className="px-4 pb-6 flex flex-col divide-y divide-[#E4E6EB]">
        {/* About */}
        <div>
          <SectionHeader title="About" open={openSections.info} onToggle={() => toggle("info")} />
          {openSections.info && (
            <div className="pb-2">
              <InfoRow
                icon={<svg className="w-4 h-4 text-fb-text" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>}
                label="Pinned messages"
                onClick={() => setShowPinned(true)}
              />
              <InfoRow
                icon={<svg className="w-4 h-4 text-fb-text" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>}
                label="Description"
                sublabel={conv.description || "No description"}
              />
            </div>
          )}
        </div>

        {/* Customize */}
        <div>
          <SectionHeader title="Customize" open={openSections.custom} onToggle={() => toggle("custom")} />
          {openSections.custom && (
            <div className="pb-2 flex flex-col">
              <InfoRow
                icon={<svg className="w-4 h-4 text-fb-text" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>}
                label="Change emoji"
                onClick={() => setShowEmoji(true)}
              />
              <InfoRow
                icon={<svg className="w-4 h-4 text-fb-text" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>}
                label="Change theme"
                onClick={() => setShowTheme(true)}
              />
            </div>
          )}
        </div>

        {/* Members */}
        <div>
          <SectionHeader
            title={`Members${membersTotalCount ? ` \u00B7 ${membersTotalCount}` : ""}`}
            open={openSections.members}
            onToggle={() => toggle("members")}
          />
          {openSections.members && (
            <div className="pb-2">
              {membersLoading && members.length === 0 && (
                <p className="text-sm text-fb-subtext text-center py-3">Loading...</p>
              )}
              {members.map((member) => (
                <MemberRow
                  key={member.userId}
                  member={member}
                  isOwner={isOwner}
                  currentUserId={user?.id}
                  isOnline={isOnline}
                  onAssignAdmin={handleAssignAdmin}
                  onRevokeAdmin={handleRevokeAdmin}
                  onKick={handleKick}
                  onRemoveMember={handleRemoveMember}
                  onNavigate={(id) => navigate(`/profile/${id}`)}
                  onBlock={(id) => window.alert(`Block user ${id} — to be implemented`)}
                  onReport={(id) => window.alert(`Report user ${id} — to be implemented`)}
                />
              ))}

              {membersHasMore && !membersLoading && (
                <button className="w-full text-center py-2 text-base font-medium text-fb-blue hover:underline transition-colors duration-150 cursor-pointer" onClick={() => loadConversationMembers(false)}>
                  See more
                </button>
              )}

              <button className="w-full flex items-center gap-3 py-2.5 px-1 rounded-lg hover:bg-[#F0F2F5] transition-all duration-150 cursor-pointer group" onClick={() => setShowAddMember(true)}>
                <div className="w-12 h-12 bg-[#F0F2F5] group-hover:bg-[#E4E6EB] rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-150">
                  <svg className="w-5 h-5 text-fb-text" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <span className="text-base font-semibold text-fb-text">Add people</span>
              </button>
            </div>
          )}
        </div>

        {/* Shared Media */}
        <div>
          <SectionHeader title="Shared Media" open={openSections.media} onToggle={() => toggle("media")} />
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

        {/* Privacy */}
        <div>
          <SectionHeader title="Privacy and support" open={openSections.privacy} onToggle={() => toggle("privacy")} />
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
                icon={<svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" /></svg>}
                label="Leave group"
                danger={true}
                onClick={handleLeave}
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

      {showAddMember && (
        <AddMemberModal conv={conv} onClose={() => setShowAddMember(false)} />
      )}

      {showTheme && (
        <ChangeThemeModal
          conversationId={conv.id}
          currentTheme={conv.theme}
          onClose={() => setShowTheme(false)}
        />
      )}

      {showEmoji && (
        <ChangeEmojiModal
          conversationId={conv.id}
          currentEmoji={conv.defaultReaction}
          onClose={() => setShowEmoji(false)}
        />
      )}
    </div>
  );
}
