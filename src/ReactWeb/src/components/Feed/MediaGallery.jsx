import React, { useState, useRef, useCallback } from "react";
import { Play, X } from "lucide-react";

const isImage = (m) => m.mediaType === "Image" || m.mediaType === "image";
const isVideo = (m) => m.mediaType === "Video" || m.mediaType === "video";

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function MediaItem({ media, index, onClick, compact, disableInteraction }) {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(null);
  const isVid = isVideo(media);

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const cursor = disableInteraction ? "" : "cursor-pointer";

  const containerClass = compact
    ? "max-h-[180px]"
    : "max-h-[500px]";

  if (isVid) {
    return (
      <div
        className={`relative w-full h-full overflow-hidden ${containerClass} ${cursor}`}
        onClick={disableInteraction ? undefined : onClick}
      >
        <video
          ref={videoRef}
          src={media.mediaUrl}
          className="w-full h-full object-cover pointer-events-none"
          muted
          playsInline
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
        />
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
          {duration != null && <span>{formatDuration(duration)}</span>}
          <Play size={10} fill="white" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <Play size={18} fill="white" className="text-white translate-x-0.5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={media.mediaUrl}
      alt=""
      className={`w-full h-full object-cover ${containerClass} ${cursor} hover:brightness-95 transition-all`}
      onClick={disableInteraction ? undefined : onClick}
    />
  );
}

export default function MediaGallery({ media, compact = false, disableInteraction = false }) {
  const allMedia = (media || []).filter((m) => isImage(m) || isVideo(m));
  const count = allMedia.length;

  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [lightboxPlaying, setLightboxPlaying] = useState(false);

  if (count === 0) return null;

  const openLightbox = (idx) => {
    if (disableInteraction) return;
    setLightboxIdx(idx);
    setLightboxPlaying(isVideo(allMedia[idx]));
  };

  const closeLightbox = () => {
    if (disableInteraction) return;
    setLightboxIdx(null);
    setLightboxPlaying(false);
  };

  const prevMedia = useCallback(() => {
    if (lightboxIdx > 0) {
      const newIdx = lightboxIdx - 1;
      setLightboxIdx(newIdx);
      setLightboxPlaying(isVideo(allMedia[newIdx]));
    }
  }, [lightboxIdx, allMedia]);

  const nextMedia = useCallback(() => {
    if (lightboxIdx < count - 1) {
      const newIdx = lightboxIdx + 1;
      setLightboxIdx(newIdx);
      setLightboxPlaying(isVideo(allMedia[newIdx]));
    }
  }, [lightboxIdx, allMedia, count]);

  const current = lightboxIdx !== null ? allMedia[lightboxIdx] : null;
  const isCurrentVideo = current ? isVideo(current) : false;

  // --- Lightbox ---
  const lightbox = lightboxIdx !== null && (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
      onClick={closeLightbox}
    >
      <button
        onClick={closeLightbox}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center z-10 transition-colors cursor-pointer"
      >
        <X size={20} />
      </button>

      {lightboxIdx > 0 && !disableInteraction && (
        <button
          onClick={(e) => { e.stopPropagation(); prevMedia(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          ‹
        </button>
      )}

      {lightboxIdx < count - 1 && !disableInteraction && (
        <button
          onClick={(e) => { e.stopPropagation(); nextMedia(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          ›
        </button>
      )}

      <div
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {isCurrentVideo ? (
          <video
            key={current.mediaUrl}
            src={current.mediaUrl}
            controls
            autoPlay
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl bg-black"
          />
        ) : (
          <img
            key={current.mediaUrl}
            src={current.mediaUrl}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        )}
      </div>

      {!disableInteraction && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium bg-black/50 px-4 py-1.5 rounded-full">
          {lightboxIdx + 1} / {count}
        </div>
      )}
    </div>
  );

  const gridClass = compact ? "max-h-[180px]" : "";

  // 1 media — full width
  if (count === 1) {
    return (
      <>
        {lightbox}
        <div className="w-full overflow-hidden rounded-lg">
          <MediaItem
            media={allMedia[0]}
            index={0}
            onClick={() => openLightbox(0)}
            compact={compact}
            disableInteraction={disableInteraction}
          />
        </div>
      </>
    );
  }

  // 2 media — 2 columns equal
  if (count === 2) {
    return (
      <>
        {lightbox}
        <div className={`grid grid-cols-2 gap-0.5 ${gridClass}`}>
          {allMedia.map((m, i) => (
            <div key={m.id} className="overflow-hidden rounded-lg">
              <MediaItem
                media={m}
                index={i}
                onClick={() => openLightbox(i)}
                compact={compact}
                disableInteraction={disableInteraction}
              />
            </div>
          ))}
        </div>
      </>
    );
  }

  // 3 media — 1 tall left + 2 stacked right
  if (count === 3) {
    return (
      <>
        {lightbox}
        <div className={`grid grid-cols-2 gap-0.5 ${gridClass}`}>
          <div className="row-span-2 overflow-hidden rounded-lg">
            <MediaItem
              media={allMedia[0]}
              index={0}
              onClick={() => openLightbox(0)}
              compact={compact}
              disableInteraction={disableInteraction}
            />
          </div>
          <div className="overflow-hidden rounded-lg">
            <MediaItem
              media={allMedia[1]}
              index={1}
              onClick={() => openLightbox(1)}
              compact={compact}
              disableInteraction={disableInteraction}
            />
          </div>
          <div className="overflow-hidden rounded-lg">
            <MediaItem
              media={allMedia[2]}
              index={2}
              onClick={() => openLightbox(2)}
              compact={compact}
              disableInteraction={disableInteraction}
            />
          </div>
        </div>
      </>
    );
  }

  // 4+ media — 2x2 grid with +N overlay
  const displayMedia = allMedia.slice(0, 4);
  const remaining = count - 4;

  return (
    <>
      {lightbox}
      <div className={`grid grid-cols-2 gap-0.5 ${gridClass}`}>
        {displayMedia.map((m, i) => (
          <div
            key={m.id}
            className={`relative overflow-hidden rounded-lg ${i === 3 && remaining > 0 ? "cursor-pointer" : ""}`}
            onClick={i === 3 && remaining > 0 ? () => openLightbox(3) : undefined}
          >
            <MediaItem
              media={m}
              index={i}
              onClick={() => openLightbox(i)}
              compact={compact}
              disableInteraction={disableInteraction}
            />
            {i === 3 && remaining > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center hover:bg-black/60 transition-colors">
                <span className="text-white text-3xl font-bold">+{remaining}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
