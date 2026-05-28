import React from 'react';

export default function PhotosTab({ theme, mockPhotos }) {
  return (
    <div className={`${theme.card} rounded-xl shadow p-6 transition-colors duration-200`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-xl font-bold ${theme.text}`}>Photos</h2>
          <p className={`text-sm ${theme.textSub}`}>Uploaded photos</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-[#1877f2] font-semibold text-sm rounded-lg">
            Photos of you
          </button>
          <button className={`px-4 py-2 font-semibold text-sm rounded-lg ${theme.btnGray}`}>
            Your albums
          </button>
        </div>
      </div>

      {/* Large high resolution Photo Gallery */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {mockPhotos.map((url, index) => (
          <div
            key={index}
            className="aspect-square bg-gray-700 hover:opacity-90 cursor-pointer rounded-lg overflow-hidden group relative"
          >
            <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
        {/* Append extra generic photo placeholders */}
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="aspect-square bg-gray-700 hover:opacity-90 cursor-pointer rounded-lg overflow-hidden group relative"
          >
            <img src={`https://picsum.photos/seed/gallery-${index}/400/400`} alt="Placeholder" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
}
