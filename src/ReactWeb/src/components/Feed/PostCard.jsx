import React, { useState } from "react";

// ─── Feeling map (matches Domain.Enums.Feeling) ───
const FEELING_MAP = {
  1: { emoji: "😊", label: "happy" },
  2: { emoji: "🙏", label: "blessed" },
  3: { emoji: "🥰", label: "loved" },
  4: { emoji: "😢", label: "sad" },
  5: { emoji: "😍", label: "lovely" },
  6: { emoji: "🙏", label: "grateful" },
  7: { emoji: "🤩", label: "excited" },
  8: { emoji: "💕", label: "in love" },
  9: { emoji: "🤪", label: "crazy" },
  10: { emoji: "😌", label: "appreciative" },
  11: { emoji: "😄", label: "joyful" },
  12: { emoji: "🤯", label: "amazing" },
  13: { emoji: "🤡", label: "silly" },
  14: { emoji: "🎉", label: "festive" },
  15: { emoji: "✨", label: "wonderful" },
  16: { emoji: "😎", label: "cool" },
  17: { emoji: "😆", label: "amused" },
  18: { emoji: "😌", label: "relaxed" },
  19: { emoji: "💪", label: "positive" },
  20: { emoji: "😊", label: "comfortable" },
  21: { emoji: "🌈", label: "hopeful" },
  22: { emoji: "🥳", label: "joyous" },
  23: { emoji: "😩", label: "tired" },
  24: { emoji: "🔥", label: "motivated" },
  25: { emoji: "😤", label: "proud" },
  26: { emoji: "😔", label: "lonely" },
};

// ─── Privacy / Visibility ───
const VISIBILITY_ICON = {
  0: "🌐", // Public
  1: "👥", // Friends
  2: "🔒", // Only Me
};

// ─── Relative time helper ───
function timeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Vừa xong";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} giờ trước`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} ngày trước`;
  return d.toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });
}

// ─── Media Gallery (Facebook-style grid) ───
function MediaGallery({ media }) {
  const images = (media || []).filter(
    (m) => m.mediaType === "Image" || m.mediaType === "image"
  );
  const videos = (media || []).filter(
    (m) => m.mediaType === "Video" || m.mediaType === "video"
  );
  const count = images.length;

  const [lightboxIdx, setLightboxIdx] = useState(null);

  if (count === 0 && videos.length === 0) return null;

  // Lightbox overlay
  const lightbox = lightboxIdx !== null && (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
      onClick={() => setLightboxIdx(null)}
    >
      <button
        onClick={() => setLightboxIdx(null)}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white text-2xl flex items-center justify-center z-10 transition-colors"
      >
        ✕
      </button>

      {/* Prev */}
      {lightboxIdx > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx - 1); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white text-2xl flex items-center justify-center transition-colors"
        >
          ‹
        </button>
      )}

      {/* Next */}
      {lightboxIdx < images.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx + 1); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white text-2xl flex items-center justify-center transition-colors"
        >
          ›
        </button>
      )}

      <img
        src={images[lightboxIdx]?.mediaUrl}
        alt=""
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium bg-black/50 px-4 py-1.5 rounded-full">
        {lightboxIdx + 1} / {images.length}
      </div>
    </div>
  );

  // Video rendering
  const videoElements = videos.map((v) => (
    <div key={v.id} className="w-full">
      <video
        src={v.mediaUrl}
        controls
        className="w-full max-h-[500px] object-contain bg-black rounded"
      />
    </div>
  ));

  // Single image
  if (count === 1) {
    return (
      <>
        {lightbox}
        <div className="w-full">
          <img
            src={images[0].mediaUrl}
            alt=""
            className="w-full object-cover max-h-[500px] cursor-pointer hover:brightness-95 transition-all"
            onClick={() => setLightboxIdx(0)}
          />
        </div>
        {videoElements}
      </>
    );
  }

  // Two images
  if (count === 2) {
    return (
      <>
        {lightbox}
        <div className="grid grid-cols-2 gap-0.5">
          {images.map((img, i) => (
            <div key={img.id} className="aspect-square overflow-hidden">
              <img
                src={img.mediaUrl}
                alt=""
                className="w-full h-full object-cover cursor-pointer hover:brightness-95 transition-all"
                onClick={() => setLightboxIdx(i)}
              />
            </div>
          ))}
        </div>
        {videoElements}
      </>
    );
  }

  // Three images
  if (count === 3) {
    return (
      <>
        {lightbox}
        <div className="grid grid-cols-2 gap-0.5">
          <div className="row-span-2 overflow-hidden">
            <img
              src={images[0].mediaUrl}
              alt=""
              className="w-full h-full object-cover cursor-pointer hover:brightness-95 transition-all"
              onClick={() => setLightboxIdx(0)}
            />
          </div>
          {images.slice(1).map((img, i) => (
            <div key={img.id} className="aspect-square overflow-hidden">
              <img
                src={img.mediaUrl}
                alt=""
                className="w-full h-full object-cover cursor-pointer hover:brightness-95 transition-all"
                onClick={() => setLightboxIdx(i + 1)}
              />
            </div>
          ))}
        </div>
        {videoElements}
      </>
    );
  }

  // Four images
  if (count === 4) {
    return (
      <>
        {lightbox}
        <div className="grid grid-cols-2 gap-0.5">
          {images.map((img, i) => (
            <div key={img.id} className="aspect-square overflow-hidden">
              <img
                src={img.mediaUrl}
                alt=""
                className="w-full h-full object-cover cursor-pointer hover:brightness-95 transition-all"
                onClick={() => setLightboxIdx(i)}
              />
            </div>
          ))}
        </div>
        {videoElements}
      </>
    );
  }

  // 5+ images: show first 4 in grid, last slot has "+N" overlay
  const displayImages = images.slice(0, 4);
  const remaining = count - 4;

  return (
    <>
      {lightbox}
      <div className="grid grid-cols-2 gap-0.5">
        {displayImages.map((img, i) => (
          <div key={img.id} className="aspect-square overflow-hidden relative">
            <img
              src={img.mediaUrl}
              alt=""
              className="w-full h-full object-cover cursor-pointer hover:brightness-95 transition-all"
              onClick={() => setLightboxIdx(i)}
            />
            {i === 3 && remaining > 0 && (
              <div
                className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors"
                onClick={() => setLightboxIdx(3)}
              >
                <span className="text-white text-3xl font-bold">+{remaining}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      {videoElements}
    </>
  );
}

// ─── Reaction Button ───
const ReactionBtn = ({ icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-fb-hover text-sm font-semibold transition-colors ${active ? "text-fb-blue" : "text-fb-subtext"}`}
  >
    <span>{icon}</span> {label}
  </button>
);

// ─── Main PostCard ───
export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  // Resolve author info – works with both old mock shape and new API shape
  const authorName = post.authorName || post.user || "Người dùng";
  const authorAvatar = post.authorAvatarUrl || post.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";

  // Feeling
  const feeling = post.feelingActivity != null ? FEELING_MAP[post.feelingActivity] : null;

  // Time
  const displayTime = post.createdAt ? timeAgo(post.createdAt) : (post.time || "");

  // Visibility
  const visIcon = VISIBILITY_ICON[post.visibility] ?? VISIBILITY_ICON[0];

  return (
    <div className="bg-white rounded-xl shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <img src={authorAvatar} alt={authorName} className="w-10 h-10 rounded-full object-cover border" />
          <div>
            <p className="text-[15px] font-semibold text-fb-text leading-tight flex items-center flex-wrap gap-1">
              <span className="font-bold hover:underline cursor-pointer">{authorName}</span>
              {feeling && (
                <span className="text-fb-subtext font-normal text-[14px] flex items-center gap-0.5">
                  đang cảm thấy {feeling.emoji} <span className="font-semibold text-[#050505]">{feeling.label}</span>
                </span>
              )}
              {post.locationTag && (
                <span className="text-fb-subtext font-normal text-[14px] flex items-center gap-0.5">
                  ở <span className="font-semibold text-[#050505]">{post.locationTag}</span>
                </span>
              )}
            </p>
            <p className="text-xs text-fb-subtext mt-0.5">
              {displayTime} · {visIcon}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 rounded-full hover:bg-fb-hover flex items-center justify-center text-fb-subtext font-bold text-lg">
            ···
          </button>
          <button className="w-9 h-9 rounded-full hover:bg-fb-hover flex items-center justify-center text-fb-subtext">
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      {post.content && <p className="px-4 pb-2 text-[15px] text-fb-text">{post.content}</p>}

      {/* Media Gallery (replaces old single-image) */}
      <MediaGallery media={post.media} />

      {/* Legacy single image fallback */}
      {!post.media?.length && post.image && (
        <div className="w-full">
          <img src={post.image} alt="post" className="w-full object-cover max-h-[500px]" />
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between px-4 py-2 text-fb-subtext text-sm">
        <div className="flex items-center gap-1 cursor-pointer hover:underline">
          <span>👍❤️😂</span>
          <span>{likes.toLocaleString()}</span>
        </div>
        <div className="flex gap-3">
          <span className="cursor-pointer hover:underline">{post.comments || 0} bình luận</span>
          <span className="cursor-pointer hover:underline">{post.shares || 0} lượt chia sẻ</span>
        </div>
      </div>

      <hr className="mx-4 border-fb-sidebar" />

      {/* Actions */}
      <div className="flex items-center px-2 py-1">
        <ReactionBtn icon="👍" label="Thích" onClick={handleLike} active={liked} />
        <ReactionBtn icon="💬" label="Bình luận" />
        <ReactionBtn icon="↗️" label="Chia sẻ" />
      </div>
    </div>
  );
}
