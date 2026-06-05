import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';

export default function MediaTab({ theme, userPhotos = [], userVideos = [], photosLoading, videosLoading, photosError, videosError, loadMorePhotos, loadMoreVideos }) {
  const [activeType, setActiveType] = useState("image"); // "image" | "video"
  const [viewerIndex, setViewerIndex] = useState(null);
  const isImage = activeType === "image";
  const media = isImage ? userPhotos : userVideos;
  const loading = isImage ? photosLoading : videosLoading;
  const error = isImage ? photosError : videosError;
  const loadMore = isImage ? loadMorePhotos : loadMoreVideos;

  useEffect(() => {
    setViewerIndex(null);
  }, [activeType]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (viewerIndex === null) return;

      if (event.key === "Escape") {
        setViewerIndex(null);
      }

      if (isImage && event.key === "ArrowLeft") {
        setViewerIndex((current) => (current > 0 ? current - 1 : current));
      }

      if (isImage && event.key === "ArrowRight") {
        setViewerIndex((current) => (current < userPhotos.length - 1 ? current + 1 : current));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewerIndex, isImage, userPhotos.length]);

  const activeItem = viewerIndex !== null ? media[viewerIndex] : null;

  return (
    <>
      {activeItem && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setViewerIndex(null)}
        >
          <button
            type="button"
            onClick={() => setViewerIndex(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-2xl text-white transition-colors hover:bg-white/40"
          >
            ✕
          </button>

          {isImage && viewerIndex > 0 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setViewerIndex((current) => current - 1);
              }}
              className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-2xl text-white transition-colors hover:bg-white/40"
            >
              ‹
            </button>
          )}

          {isImage && viewerIndex < userPhotos.length - 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setViewerIndex((current) => current + 1);
              }}
              className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-2xl text-white transition-colors hover:bg-white/40"
            >
              ›
            </button>
          )}

          {isImage ? (
            <img
              src={activeItem.mediaUrl}
              alt=""
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            />
          ) : (
            <video
              src={activeItem.mediaUrl}
              controls
              autoPlay
              className="max-h-[90vh] max-w-[90vw] rounded-lg bg-black object-contain shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            />
          )}

          {isImage && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-sm font-medium text-white/80">
              {viewerIndex + 1} / {userPhotos.length}
            </div>
          )}
        </div>
      )}

      <div className={`${theme.card} rounded-xl shadow p-6 transition-colors duration-200`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-xl font-bold ${theme.text}`}>Media</h2>
            <p className={`text-sm ${theme.textSub}`}>Photos and videos</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveType("image")}
              className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors ${
                isImage
                  ? "bg-blue-100 dark:bg-blue-900/30 text-[#1877f2]"
                  : `${theme.btnGray}`
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveType("video")}
              className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors ${
                !isImage
                  ? "bg-blue-100 dark:bg-blue-900/30 text-[#1877f2]"
                  : `${theme.btnGray}`
              }`}
            >
              Videos
            </button>
          </div>
        </div>

        {loading && media.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-sm text-[#65676b]">
            Loading {isImage ? "photos" : "videos"}...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 text-sm text-red-500">{error}</div>
        ) : media.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-sm text-[#65676b]">
            No {isImage ? "photos" : "videos"} yet.
          </div>
        ) : isImage ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {userPhotos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => setViewerIndex(index)}
                className="aspect-square bg-gray-700 hover:opacity-90 cursor-pointer rounded-lg overflow-hidden group relative"
              >
                <img
                  src={photo.mediaUrl}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {userVideos.map((video, index) => (
              <div
                key={video.id}
                onClick={() => setViewerIndex(index)}
                className="relative aspect-video rounded-lg overflow-hidden bg-black cursor-pointer group"
              >
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={video.mediaUrl}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
                    <Play size={20} className="text-gray-800 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
