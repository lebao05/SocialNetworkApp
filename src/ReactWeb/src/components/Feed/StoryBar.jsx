import React from "react";
import { stories, currentUser } from "../../data/mockData";

const StoryCard = ({ story }) => (
  <div className="relative flex-shrink-0 w-28 h-48 rounded-xl overflow-hidden cursor-pointer group">
    <img
      src={story.bg}
      alt={story.user}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
    <div className="absolute top-2 left-2 w-9 h-9 rounded-full border-4 border-fb-blue overflow-hidden">
      <img src={story.avatar} alt={story.user} className="w-full h-full object-cover" />
    </div>
    <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-semibold leading-tight">{story.user}</p>
  </div>
);

export default function StoryBar() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {/* Create story card */}
      <div className="relative flex-shrink-0 w-28 h-48 rounded-xl overflow-hidden cursor-pointer group bg-white border border-fb-sidebar">
        <div className="h-32 overflow-hidden">
          <img src={currentUser.avatar} alt="me" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-9 h-9 bg-fb-blue rounded-full flex items-center justify-center border-4 border-white text-white font-bold text-lg">
          +
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center pb-2">
          <span className="text-xs font-semibold text-fb-text text-center">Tạo tin</span>
        </div>
      </div>
      {stories.map((s) => (
        <StoryCard key={s.id} story={s} />
      ))}
    </div>
  );
}
