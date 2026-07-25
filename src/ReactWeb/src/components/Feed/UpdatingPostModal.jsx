import React, { useState } from "react";
import { X, ChevronDown, Smile, Search, ArrowLeft } from "lucide-react";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

const FEELINGS_LIST = [
  { emoji: "😃", label: "happy" },
  { emoji: "😇", label: "blessed" },
  { emoji: "🥰", label: "loved" },
  { emoji: "😢", label: "sad" },
  { emoji: "😊", label: "lovely" },
  { emoji: "😀", label: "grateful" },
  { emoji: "😄", label: "excited" },
  { emoji: "😍", label: "in love" },
  { emoji: "🤪", label: "crazy" },
  { emoji: "😲", label: "appreciative" },
  { emoji: "😆", label: "joyful" },
  { emoji: "🤩", label: "amazing" },
  { emoji: "😜", label: "silly" },
  { emoji: "🥳", label: "festive" },
  { emoji: "🙂", label: "wonderful" },
  { emoji: "😎", label: "cool" },
  { emoji: "😏", label: "amused" },
  { emoji: "😌", label: "relaxed" },
  { emoji: "😔", label: "positive" },
  { emoji: "😴", label: "comfortable" },
  { emoji: "🌷", label: "hopeful" },
  { emoji: "🤩", label: "joyous" },
  { emoji: "😴", label: "tired" },
  { emoji: "🙂", label: "motivated" },
  { emoji: "😊", label: "proud" },
  { emoji: "😔", label: "lonely" },
];

const VISIBILITY_OPTIONS = [
  { value: 0, label: "Public", icon: "🌐", desc: "Anyone on or off Facebook" },
  { value: 1, label: "Friends", icon: "👥", desc: "Your friends on Facebook" },
  { value: 2, label: "Only me", icon: "🔒", desc: "Only you can see this post" },
];

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function UpdatingPostModal({
  isOpen,
  onClose,
  post,
  displayUser = { name: "User", avatar: DEFAULT_AVATAR },
  onSubmit,
}) {
  // Derive initial values from post prop
  const initialContent = post?.content ?? "";
  const initialVisibility = post?.visibility ?? 0;
  const isGroupPost = post?.visibility === 3 || post?.visibility === "Group";

  const [view, setView] = useState("main");
  const [content, setContent] = useState(initialContent);
  const [visibility, setVisibility] = useState(initialVisibility);
  const [selectedFeeling, setSelectedFeeling] = useState(
    post?.feelingActivity != null ? { emoji: "", label: "" } : null
  );
  const [selectedLocation, setSelectedLocation] = useState(post?.locationTag ?? null);
  const [newFiles, setNewFiles] = useState([]);
  const [removedMediaIds, setRemovedMediaIds] = useState([]);

  const [feelingSearch, setFeelingSearch] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setView("main");
    onClose();
  };

  const existingMedia = (post?.media ?? []).filter(
    (m) => !removedMediaIds.includes(m.id ?? m.Id)
  );

  const getVisibilityLabel = (v) => {
    const opt = VISIBILITY_OPTIONS.find((o) => o.value === v);
    return opt ? { label: opt.label, icon: opt.icon } : { label: "Public", icon: "🌐" };
  };

  const handleRemoveExistingMedia = (mediaId) => {
    setRemovedMediaIds((prev) => [...prev, mediaId]);
  };

  const handleRemoveNewFile = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const hasChanges =
    content !== initialContent ||
    visibility !== initialVisibility ||
    selectedFeeling !== null ||
    selectedLocation !== (post?.locationTag ?? null) ||
    newFiles.length > 0 ||
    removedMediaIds.length > 0;

  const canSubmit =
    hasChanges &&
    (content.trim() || existingMedia.length > 0 || newFiles.length > 0);

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (onSubmit) {
      onSubmit({
        content: content.trim() || null,
        visibility,
        locationTag: selectedLocation,
        feelingActivity: selectedFeeling,
        retainMediaIds: (post?.media ?? [])
          .map((m) => m.id ?? m.Id)
          .filter((id) => !removedMediaIds.includes(id)),
        newFiles,
      });
    }
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-[750px] rounded-xl shadow-xl overflow-hidden flex flex-col border border-gray-200 min-h-[550px] max-h-[90vh]">

        {/* ─── MAIN VIEW ─── */}
        {view === "main" && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 relative">
              <h2 className="text-xl font-bold text-gray-900 text-center w-full">Edit post</h2>
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-4 w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1">
              {/* Author badge */}
              <div className="flex items-center gap-3">
                <img
                  src={displayUser.avatar}
                  alt={displayUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-x-1 leading-tight max-w-[380px]">
                    <span className="font-semibold text-[15px] text-gray-900">{displayUser.name}</span>
                    {selectedFeeling && (
                      <span className="text-[15px] text-gray-600 font-normal">
                        is feeling <span className="font-semibold text-gray-900">{selectedFeeling.emoji} {selectedFeeling.label}</span>
                      </span>
                    )}
                    {selectedLocation && (
                      <span className="text-[15px] text-gray-600 font-normal">
                        at <span className="font-semibold text-gray-900">{selectedLocation}</span>
                      </span>
                    )}
                  </div>

                  {isGroupPost ? (
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1.5 rounded-md flex items-center gap-1.5 font-bold border border-blue-200">
                        Group post
                      </div>
                      <span className="text-xs text-gray-500">
                        {timeAgo(post?.createdAt ?? post?.CreatedAt)}
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setView("visibility")}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2.5 py-1.5 rounded-md flex items-center gap-1.5 font-bold mt-1.5 transition-colors cursor-pointer"
                    >
                      <span className="text-sm">{getVisibilityLabel(visibility).icon}</span>
                      {getVisibilityLabel(visibility).label}
                      <ChevronDown size={14} className="text-gray-500" />
                    </button>
                  )}
                </div>
              </div>

              {/* Content textarea */}
              <div className="relative flex flex-col min-h-[120px] w-full mt-2">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`What's on your mind, ${displayUser.name}?`}
                  className="w-full bg-transparent resize-none text-[22px] placeholder-gray-500 text-gray-900 outline-none border-none p-0 focus:ring-0"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setView("feeling")}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors cursor-pointer w-fit mt-1"
                >
                  <Smile size={26} className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              {/* Selected meta chips */}
              {(selectedFeeling || selectedLocation) && (
                <div className="flex flex-wrap gap-1.5 border-t border-gray-100 pt-3">
                  {selectedFeeling && (
                    <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full border border-yellow-200">
                      <span>{selectedFeeling.emoji} {selectedFeeling.label}</span>
                      <button type="button" onClick={() => setSelectedFeeling(null)} className="hover:bg-yellow-200 p-0.5 rounded-full cursor-pointer">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {selectedLocation && (
                    <span className="inline-flex items-center gap-1 bg-red-50 text-red-800 text-xs font-medium px-2.5 py-1 rounded-full border border-red-200">
                      <span>📍 {selectedLocation}</span>
                      <button type="button" onClick={() => setSelectedLocation(null)} className="hover:bg-red-200 p-0.5 rounded-full cursor-pointer">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Existing media thumbnails */}
              {existingMedia.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Current photos & videos</p>
                  <div className="flex gap-2 overflow-x-auto max-w-full scrollbar-none">
                    {existingMedia.map((media, i) => (
                      <div key={media.id ?? media.Id ?? i} className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0 border border-gray-200">
                        {media.mediaType === "Image" || media.mediaType === "Video" ? (
                          <>
                            <img
                              src={media.mediaUrl ?? media.mediaUrl ?? ""}
                              alt={`media-${i}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingMedia(media.id ?? media.Id)}
                              className="absolute top-1 right-1 bg-gray-900/70 text-white rounded-full p-1 hover:bg-gray-900 cursor-pointer"
                            >
                              <X size={12} />
                            </button>
                            {media.mediaType === "Video" && (
                              <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1 rounded">
                                VIDEO
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-[10px] text-center font-bold text-gray-400">FILE</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New file previews */}
              {newFiles.length > 0 && (
                <div className="flex gap-2 overflow-x-auto max-w-full scrollbar-none">
                  {newFiles.map((f, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200">
                      {f.type.startsWith("image/") ? (
                        <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-[10px] text-center font-bold text-gray-400">VIDEO</div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveNewFile(i)}
                        className="absolute top-1 right-1 bg-gray-900/70 text-white rounded-full p-1 hover:bg-gray-900 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add-to-post action bar */}
              <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-between bg-white shadow-sm">
                <span className="text-[15px] font-bold text-gray-900">Add to your post</span>
                <div className="flex items-center gap-1.5">
                  <label className="w-9 h-9 hover:bg-gray-100 rounded-full cursor-pointer flex items-center justify-center transition-colors" title="Photo/Video">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setNewFiles((prev) => [...prev, ...files]);
                      }}
                    />
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="6" width="14" height="13" rx="2" fill="#E7F3E8" stroke="#45BD62" strokeWidth="2" />
                      <rect x="7" y="4" width="14" height="13" rx="2" fill="#45BD62" />
                      <circle cx="11" cy="8" r="1.5" fill="white" />
                      <path d="M7 14L11.5 9.5L15 13L17 11L21 15V15.5C21 16.3284 20.3284 17 19.5 17H8.5C7.67157 17 7 16.3284 7 15.5V14Z" fill="white" />
                    </svg>
                  </label>
                  <button
                    type="button"
                    onClick={() => setView("feeling")}
                    className="w-9 h-9 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                    title="Feeling/Activity"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="#F7B928" strokeWidth="2.5" />
                      <circle cx="9" cy="10" r="1.25" fill="#F7B928" />
                      <circle cx="15" cy="10" r="1.25" fill="#F7B928" />
                      <path d="M8 14C8 16.2091 9.79086 18 12 18C14.2091 18 16 16.2091 16 14H8Z" fill="#F7B928" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("location")}
                    className="w-9 h-9 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                    title="Check in"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C7.58 2 4 5.58 4 10C4 15.25 12 22 12 22C12 22 20 15.25 20 10C20 5.58 16.42 2 12 2Z" fill="#F5533D" />
                      <circle cx="12" cy="10" r="3" fill="white" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Update button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`w-full py-2.5 font-bold rounded-md text-[15px] transition-all text-center mt-2
                  ${!canSubmit
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#1877F2] text-white hover:bg-blue-600 shadow-sm cursor-pointer"}`}
              >
                Save
              </button>
            </div>
          </>
        )}

        {/* ─── FEELING VIEW ─── */}
        {view === "feeling" && (
          <>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <button
                type="button"
                onClick={() => { setView("main"); setFeelingSearch(""); }}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-700 cursor-pointer"
              >
                <ArrowLeft size={22} />
              </button>
              <h2 className="text-lg font-bold text-gray-900 text-center flex-1">How are you feeling?</h2>
              <div className="w-9" />
            </div>

            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="px-3 py-2 bg-gray-100 rounded-full flex items-center gap-2 mx-4 my-3 border border-gray-200">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  value={feelingSearch}
                  onChange={(e) => setFeelingSearch(e.target.value)}
                  placeholder="Search"
                  className="bg-transparent text-[15px] w-full outline-none text-gray-900 focus:ring-0"
                  autoFocus
                />
              </div>

              <div className="overflow-y-auto flex-1 p-4 bg-white">
                <div className="grid grid-cols-2 gap-2">
                  {FEELINGS_LIST.filter((f) =>
                    f.label.toLowerCase().includes(feelingSearch.toLowerCase())
                  ).map((feel, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSelectedFeeling(feel);
                        setView("main");
                        setFeelingSearch("");
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-left w-full cursor-pointer hover:border-blue-400"
                    >
                      <span className="text-2xl">{feel.emoji}</span>
                      <span className="text-[15px] font-semibold text-gray-800 capitalize">{feel.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ─── LOCATION VIEW ─── */}
        {view === "location" && (
          <>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <button
                type="button"
                onClick={() => setView("main")}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-700 cursor-pointer"
              >
                <ArrowLeft size={22} />
              </button>
              <h2 className="text-lg font-bold text-gray-900 text-center flex-1">Search for location</h2>
              <div className="w-9" />
            </div>

            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="px-3 py-2 bg-gray-100 rounded-full flex items-center gap-2 mx-4 my-3 border border-gray-200">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  value={selectedLocation ?? ""}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  placeholder="Where are you?"
                  className="bg-transparent text-[15px] w-full outline-none text-gray-900 focus:ring-0"
                  autoFocus
                />
              </div>

              {selectedLocation && (
                <div className="px-4">
                  <button
                    type="button"
                    onClick={() => setView("main")}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-all cursor-pointer text-left border border-blue-300 bg-blue-50"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-lg">📍</div>
                    <span className="text-[15px] font-semibold text-gray-800">{selectedLocation}</span>
                    <span className="ml-auto text-xs text-blue-600 font-bold">Use this</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ─── VISIBILITY VIEW ─── */}
        {view === "visibility" && (
          <>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <button
                type="button"
                onClick={() => setView("main")}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-700 cursor-pointer"
              >
                <ArrowLeft size={22} />
              </button>
              <h2 className="text-lg font-bold text-gray-900 text-center flex-1">Post audience</h2>
              <div className="w-9" />
            </div>

            <div className="p-5 flex flex-col gap-4 overflow-y-auto flex-1 bg-white">
              <div>
                <h3 className="text-[17px] font-bold text-gray-900">Who can see your post?</h3>
                <p className="text-sm text-gray-500 mt-1 leading-normal">
                  Your post will show up in Feed, on your profile and in search results.
                </p>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                {VISIBILITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setVisibility(opt.value)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer
                      ${visibility === opt.value ? "border-blue-500 bg-blue-50/20" : "border-gray-200 hover:bg-gray-50"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 text-xl">
                        {opt.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-[15px] text-gray-900">{opt.label}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                      </div>
                    </div>
                    {visibility === opt.value ? (
                      <div className="w-5 h-5 rounded-full border-[6px] border-[#1877F2] bg-white cursor-pointer"></div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 cursor-pointer"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <button
                type="button"
                onClick={() => setView("main")}
                className="w-full py-2.5 font-bold rounded-md bg-[#1877F2] text-white hover:bg-blue-600 shadow-sm transition-colors text-center text-[15px] cursor-pointer"
              >
                Done
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
