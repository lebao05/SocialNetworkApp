import React, { useState } from "react";

function SectionHeader({ title, open, onToggle }) {
  return (
    <button onClick={onToggle} className="w-full flex items-center justify-between py-3 transition-colors">
      <span className="font-semibold text-[15px] text-fb-text">{title}</span>
      <svg
        className={`w-5 h-5 text-fb-subtext transition-transform flex-shrink-0 ${open ? "" : "rotate-180"}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
      </svg>
    </button>
  );
}

function InfoRow({ iconPath, label, sublabel, danger = false }) {
  return (
    <button className="w-full flex items-center gap-3 py-2.5 rounded-xl hover:bg-[#F0F2F5] text-left transition-colors px-1">
      <div className="w-8 h-8 bg-[#E4E6EB] rounded-full flex items-center justify-center flex-shrink-0">
        <svg className={`w-4 h-4 ${danger ? "text-red-500" : "text-fb-text"}`} fill="currentColor" viewBox="0 0 24 24">
          {iconPath}
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[14px] ${danger ? "text-red-500" : "text-fb-text"}`}>{label}</p>
        {sublabel && <p className="text-xs text-fb-subtext">{sublabel}</p>}
      </div>
    </button>
  );
}

export default function ChatInfoDirect({ conv }) {
  const [sections, setSections] = useState({
    info: false,
    custom: false,
    media: false,
    privacy: false,
  });

  const toggle = (key) => setSections((s) => ({ ...s, [key]: !s[key] }));

  if (!conv) return <div className="w-[340px] bg-white flex-shrink-0" />;

  return (
    // overflow-y-auto + h-full để có thanh cuộn khi nội dung tràn
    <div className="w-[340px] bg-white flex flex-col h-full overflow-y-auto flex-shrink-0">
      {/* Avatar + tên */}
      <div className="flex flex-col items-center pt-6 pb-4 px-4 flex-shrink-0">
        <div className="relative mb-3">
          <img src={conv.avatar} className="w-[72px] h-[72px] rounded-full object-cover" alt={conv.name} />
          {conv.online && (
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <p className="text-lg font-bold text-fb-text">{conv.name}</p>
        <p className={`text-sm mt-0.5 ${conv.online ? "text-green-500" : "text-fb-subtext"}`}>
          {conv.online ? "Đang hoạt động" : "Không hoạt động"}
        </p>

        {/* E2E badge */}
        <div className="mt-2 flex items-center gap-1.5 bg-[#F0F2F5] px-3 py-1 rounded-full">
          <svg className="w-3.5 h-3.5 text-fb-subtext" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 8h-1V6A5 5 0 007 6v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2zm-6 9a2 2 0 110-4 2 2 0 010 4zm3.1-9H8.9V6a3.1 3.1 0 016.2 0v2z" />
          </svg>
          <span className="text-xs text-fb-subtext font-medium">Được mã hóa đầu cuối</span>
        </div>

        {/* Quick actions */}
        <div className="flex gap-6 mt-4">
          {[
            {
              icon: (
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
              ),
              label: "Trang cá\nnhân",
            },
            {
              icon: (
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              ),
              label: "Tắt thông\nbáo",
            },
            {
              icon: (
                <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              ),
              label: "Tìm kiếm",
            },
          ].map(({ icon, label }, i) => (
            <button key={i} className="flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 bg-[#E4E6EB] hover:bg-[#D8DADF] rounded-full flex items-center justify-center transition-colors">
                <svg className="w-[18px] h-[18px] text-fb-text" fill="currentColor" viewBox="0 0 24 24">
                  {icon}
                </svg>
              </div>
              <span className="text-[11px] text-fb-subtext text-center leading-tight whitespace-pre-line">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accordion */}
      <div className="px-4 pb-6 flex flex-col divide-y divide-[#E4E6EB]">
        {/* 1. Thông tin về đoạn chat */}
        <div>
          <SectionHeader title="Thông tin về đoạn chat" open={sections.info} onToggle={() => toggle("info")} />
          {sections.info && (
            <div className="pb-2">
              <InfoRow
                iconPath={<path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />}
                label="Xem tin nhắn đã ghim"
              />
            </div>
          )}
        </div>

        {/* 2. Tùy chỉnh đoạn chat */}
        <div>
          <SectionHeader title="Tùy chỉnh đoạn chat" open={sections.custom} onToggle={() => toggle("custom")} />
          {sections.custom && (
            <div className="pb-2 flex flex-col">
              <InfoRow
                iconPath={
                  <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                }
                label="Đổi chủ đề"
              />
              <InfoRow
                iconPath={
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                }
                label="Thay đổi biểu tượng cảm xúc"
              />
              <InfoRow
                iconPath={
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                }
                label="Chỉnh sửa biệt danh"
              />
            </div>
          )}
        </div>

        {/* 3. File phương tiện */}
        <div>
          <SectionHeader
            title="File phương tiện, file và liên kết"
            open={sections.media}
            onToggle={() => toggle("media")}
          />
          {sections.media && (
            <div className="pb-2 flex flex-col">
              <InfoRow
                iconPath={
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                }
                label="File phương tiện"
              />
              <InfoRow
                iconPath={
                  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                }
                label="File"
              />
              <InfoRow
                iconPath={
                  <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                }
                label="Liên kết"
              />
            </div>
          )}
        </div>

        {/* 4. Quyền riêng tư — nhiều mục hơn group */}
        <div>
          <SectionHeader title="Quyền riêng tư và hỗ trợ" open={sections.privacy} onToggle={() => toggle("privacy")} />
          {sections.privacy && (
            <div className="pb-2 flex flex-col">
              {/* Tắt thông báo */}
              <InfoRow
                iconPath={
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                }
                label="Tắt thông báo"
              />
              {/* Quyền nhắn tin */}
              <InfoRow
                iconPath={
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
                }
                label="Quyền nhắn tin"
              />
              {/* Tin nhắn tự hủy */}
              <InfoRow
                iconPath={<path d="M6 2v6l2 2-2 2v6l7-5-3-2 3-2-7-7zm10 0l-3 3 3 3V2zm0 10l-3 3 3 3v-6z" />}
                label="Tin nhắn tự hủy"
              />
              {/* Thông báo đã đọc */}
              <InfoRow
                iconPath={
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                }
                label="Thông báo đã đọc"
                sublabel="Tắt"
              />
              {/* Xác minh mã hóa đầu cuối */}
              <InfoRow
                iconPath={
                  <path d="M18 8h-1V6A5 5 0 007 6v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2zm-6 9a2 2 0 110-4 2 2 0 010 4zm3.1-9H8.9V6a3.1 3.1 0 016.2 0v2z" />
                }
                label="Xác minh mã hóa đầu cuối"
              />
              {/* Hạn chế */}
              <InfoRow
                iconPath={
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.68L5.68 16.9A7.902 7.902 0 014 12zm8 8c-1.85 0-3.55-.63-4.9-1.68L18.32 7.1A7.902 7.902 0 0120 12c0 4.42-3.58 8-8 8z" />
                }
                label="Hạn chế"
              />
              {/* Chặn */}
              <InfoRow
                iconPath={
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9V8h2v9zm4 0h-2V8h2v9z" />
                }
                label="Chặn"
                danger={true}
              />
              {/* Báo cáo */}
              <InfoRow
                iconPath={
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                }
                label="Báo cáo"
                sublabel="Đóng góp ý kiến và báo cáo cuộc trò chuyện"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
