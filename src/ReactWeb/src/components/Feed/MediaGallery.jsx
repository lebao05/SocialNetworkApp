import React, { useState } from "react";

export default function MediaGallery({ media }) {
  const images = (media || []).filter(
    (m) => m.mediaType === "Image" || m.mediaType === "image"
  );
  const videos = (media || []).filter(
    (m) => m.mediaType === "Video" || m.mediaType === "video"
  );
  const count = images.length;

  const [lightboxIdx, setLightboxIdx] = useState(null);

  if (count === 0 && videos.length === 0) return null;

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

      {lightboxIdx > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx - 1); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white text-2xl flex items-center justify-center transition-colors"
        >
          ‹
        </button>
      )}

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

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium bg-black/50 px-4 py-1.5 rounded-full">
        {lightboxIdx + 1} / {images.length}
      </div>
    </div>
  );

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
        {videos.map((v) => (
          <div key={v.id} className="w-full mt-3">
            <video
              src={v.mediaUrl}
              controls
              className="w-full max-h-[500px] object-contain bg-black rounded"
            />
          </div>
        ))}
      </>
    );
  }

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
        {videos.map((v) => (
          <div key={v.id} className="w-full mt-3">
            <video
              src={v.mediaUrl}
              controls
              className="w-full max-h-[500px] object-contain bg-black rounded"
            />
          </div>
        ))}
      </>
    );
  }

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
        {videos.map((v) => (
          <div key={v.id} className="w-full mt-3">
            <video
              src={v.mediaUrl}
              controls
              className="w-full max-h-[500px] object-contain bg-black rounded"
            />
          </div>
        ))}
      </>
    );
  }

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
        {videos.map((v) => (
          <div key={v.id} className="w-full mt-3">
            <video
              src={v.mediaUrl}
              controls
              className="w-full max-h-[500px] object-contain bg-black rounded"
            />
          </div>
        ))}
      </>
    );
  }

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
      {videos.map((v) => (
        <div key={v.id} className="w-full mt-3">
          <video
            src={v.mediaUrl}
            controls
            className="w-full max-h-[500px] object-contain bg-black rounded"
          />
        </div>
      ))}
    </>
  );
}
