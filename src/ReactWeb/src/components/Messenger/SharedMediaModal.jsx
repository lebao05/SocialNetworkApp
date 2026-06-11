import React, { useState, useEffect, useRef, useCallback } from "react";
import { useChat } from "../../contexts/ChatContext";

function isImageType(fileType) {
  if (!fileType) return false;
  const t = fileType.toLowerCase();
  return t === "image" || t === "image/jpeg" || t === "image/png" || t === "image/gif" || t === "image/webp";
}

function isVideoType(fileType) {
  if (!fileType) return false;
  const t = fileType.toLowerCase();
  return t === "video" || t === "video/mp4" || t === "video/webm" || t === "video/quicktime";
}

function MediaThumbnail({ item, onClick }) {
  const att = item.attachment;
  const isImage = isImageType(att?.fileType);
  const isVideo = isVideoType(att?.fileType);
  const url = att?.fileUrl;
  const isMedia = isImage || isVideo;

  return (
    <div
      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group bg-[#F0F2F5] hover:opacity-90 transition-opacity"
      onClick={() => onClick(item)}
    >
      {isImage && url && (
        <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
      )}
      {isVideo && url && (
        <>
          <video src={url} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
            <div className="w-10 h-10 bg-black/60 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </>
      )}
      {!isMedia && url && (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
          <svg className="w-8 h-8 text-fb-subtext flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
          </svg>
          <span className="text-xs text-fb-subtext text-center leading-tight line-clamp-2">{att?.fileType || "File"}</span>
        </div>
      )}
    </div>
  );
}

function Lightbox({ item, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const att = item?.attachment;
  const isImage = isImageType(att?.fileType);
  const isVideo = isVideoType(att?.fileType);
  const url = att?.fileUrl;

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors cursor-pointer z-10"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      >
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>

      {/* Prev */}
      {hasPrev && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors cursor-pointer z-10"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
          </svg>
        </button>
      )}

      {/* Content */}
      <div className="max-w-5xl max-h-[85vh] w-full mx-4 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {isImage && url && (
          <img src={url} alt="" className="max-w-full max-h-[85vh] object-contain rounded-lg" />
        )}
        {isVideo && url && (
          <video src={url} controls autoPlay className="max-w-full max-h-[85vh] rounded-lg" />
        )}
        {!isImage && !isVideo && url && (
          <div className="bg-[#1c1c1c] rounded-xl p-8 flex flex-col items-center gap-4 max-w-sm w-full">
            <svg className="w-16 h-16 text-white/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
            </svg>
            <a href={url} download className="px-4 py-2 bg-fb-blue text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
              Download file
            </a>
          </div>
        )}
      </div>

      {/* Next */}
      {hasNext && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors cursor-pointer z-10"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
          </svg>
        </button>
      )}

      {/* Counter */}
      {att && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
          {att.fileType} &middot; {att.fileSize ? `${(att.fileSize / 1024).toFixed(0)} KB` : ""}
        </div>
      )}
    </div>
  );
}

export default function SharedMediaModal({ conv, onClose }) {
  const { conversationFiles, filesLoading, filesHasMore, loadConversationFiles, loadMoreFiles } = useChat();
  const [activeTab, setActiveTab] = useState("media"); // "media" | "files"
  const [lightboxItem, setLightboxItem] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const loaderRef = useRef(null);

  // Load when tab changes
  useEffect(() => {
    loadConversationFiles(true, activeTab);
  }, [activeTab, conv?.id]);

  // Infinite scroll
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && filesHasMore && !filesLoading) {
      loadMoreFiles();
    }
  }, [filesHasMore, filesLoading, loadMoreFiles]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  const handleThumbnailClick = (item, index) => {
    setLightboxItem(item);
    setLightboxIndex(index);
  };

  const lightboxItems = conversationFiles;
  const currentItem = lightboxItem;
  const currentIndex = lightboxIndex;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < lightboxItems.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      setLightboxIndex((i) => i - 1);
      setLightboxItem(lightboxItems[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setLightboxIndex((i) => i + 1);
      setLightboxItem(lightboxItems[currentIndex + 1]);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-white flex flex-col max-w-2xl mx-auto h-full max-h-[90vh] mx-auto my-[5vh] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E4E6EB] flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-fb-text">Shared media</h2>
            {/* Tab switcher */}
            <div className="flex bg-[#F0F2F5] rounded-full p-0.5">
              <button
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "media"
                    ? "bg-white text-fb-text shadow-sm"
                    : "text-fb-subtext hover:text-fb-text"
                }`}
                onClick={() => setActiveTab("media")}
              >
                Photos &amp; Videos
              </button>
              <button
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "files"
                    ? "bg-white text-fb-text shadow-sm"
                    : "text-fb-subtext hover:text-fb-text"
                }`}
                onClick={() => setActiveTab("files")}
              >
                Files
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 text-fb-text" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {filesLoading && conversationFiles.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-2 border-fb-blue border-t-transparent rounded-full animate-spin" />
            </div>
          ) : conversationFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-fb-subtext">
              <svg className="w-12 h-12 mb-3 opacity-40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
              <p className="text-sm font-medium">No shared {activeTab === "media" ? "photos or videos" : "files"} yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1.5">
              {conversationFiles.map((item, idx) => (
                <MediaThumbnail
                  key={item.id}
                  item={item}
                  onClick={() => handleThumbnailClick(item, idx)}
                />
              ))}
            </div>
          )}

          {/* Infinite scroll trigger */}
          {filesHasMore && (
            <div ref={loaderRef} className="flex justify-center py-4">
              {filesLoading && (
                <div className="w-6 h-6 border-2 border-fb-blue border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox overlay */}
      {lightboxItem && (
        <Lightbox
          item={lightboxItem}
          onClose={() => setLightboxItem(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      )}
    </>
  );
}
