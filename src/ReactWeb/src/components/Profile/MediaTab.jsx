import React, { useState } from 'react';
import { Play } from 'lucide-react';

export default function MediaTab({ theme, userPhotos = [], userVideos = [], photosLoading, videosLoading, photosError, videosError, loadMorePhotos, loadMoreVideos }) {
  const [activeType, setActiveType] = useState("image"); // "image" | "video"
  const isImage = activeType === "image";
  const media = isImage ? userPhotos : userVideos;
  const loading = isImage ? photosLoading : videosLoading;
  const error = isImage ? photosError : videosError;
  const loadMore = isImage ? loadMorePhotos : loadMoreVideos;

  return (
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
          {userPhotos.map((photo) => (
            <div
              key={photo.id}
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
          {userVideos.map((video) => (
            <div
              key={video.id}
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
  );
}
