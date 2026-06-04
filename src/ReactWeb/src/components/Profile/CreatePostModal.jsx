import React, { useState, useEffect } from "react";
import { X, ChevronDown, Smile, Search, ArrowLeft, Loader2, User } from "lucide-react";
import { useTag } from "../../hooks/useTag";
import { createPostApi } from "../../apis/postApi";

// Translated Mock Lists to English matching screenshots
const TAG_FRIENDS_SUGGESTIONS = [
  { id: "101", name: "Gia Nhu", status: "Friends", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
  { id: "102", name: "Xuan Hien", status: "Friends", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
  { id: "103", name: "Minh Anh", status: "Friends", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80" },
  { id: "104", name: "Phuong Nguyen", status: "Friends", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
  { id: "105", name: "Tran Hoang Bach", status: "Friends", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
  { id: "106", name: "Nguyen Tran Dang Khoa", status: "Friends", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80" },
  { id: "107", name: "Thy Duong", status: "Friends", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80" },
  { id: "108", name: "My Quynn", status: "Profile · 4.2K followers", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80" },
  { id: "109", name: "Dang Khoa", status: "Friends", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80" },
  { id: "110", name: "Nguyen Truc Dao", status: "Profile · 1K followers", avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80" }
];

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
  { emoji: "😔", label: "lonely" }
];

const LOCATIONS_LIST = [
  "Xom Cho",
  "Di An",
  "Tan Binh, Di An, Binh Duong",
  "Bien Hoa, Dong Nai",
  "Khu Pho Tan Phuoc, Tan Binh, Di An, Binh Duong",
  "Thu Dau Mot",
  "Di An City, Binh Duong Province",
  "Tan Phuoc, Tan Binh, Di An",
  "An Phu Roundabout, Thuan An",
  "Long Mach Mang Pool"
];

export default function CreatePostModal({ isOpen, onClose, displayUser = { name: "Le Bao", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" }, onSubmit, groupId = null, allowAnonymousPost = false }) {
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const [newPostFiles, setNewPostFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Visibility state: 0 = Public, 1 = Friends, 2 = Only me
  const [visibility, setVisibility] = useState(0);

  // Navigation & sub-views
  const [createPostModalView, setCreatePostModalView] = useState("main"); // 'main', 'tag_friends', 'feeling', 'location', 'more_options', 'audience'
  const [selectedFeeling, setSelectedFeeling] = useState(null); // { emoji, label }
  const [selectedLocation, setSelectedLocation] = useState(null); // string
  const [taggedFriends, setTaggedFriends] = useState([]); // Array of user objects
  const [isAnonymous, setIsAnonymous] = useState(false); // anonymous post toggle

  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [feelingSearchQuery, setFeelingSearchQuery] = useState("");
  const [locationSearchQuery, setLocationSearchQuery] = useState("");

  const { suggestions: tagSuggestions, loading: tagLoading, searchTags } = useTag({ groupId });

  // Load suggestions when tag view opens
  useEffect(() => {
    if (createPostModalView === "tag_friends") {
      searchTags("");
    }
  }, [createPostModalView]);

  // Debounced search as user types
  useEffect(() => {
    if (createPostModalView !== "tag_friends") return;
    const timer = setTimeout(() => searchTags(tagSearchQuery), 400);
    return () => clearTimeout(timer);
  }, [tagSearchQuery]);

  if (!isOpen) return null;

  const handleResetAndClose = () => {
    setNewPostContent("");
    setNewPostImage("");
    setNewPostFiles([]);
    setSelectedFeeling(null);
    setSelectedLocation(null);
    setTaggedFriends([]);
    setCreatePostModalView("main");
    setVisibility(0);
    setIsSubmitting(false);
    setIsAnonymous(false);
    onClose();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim() && !newPostImage && newPostFiles.length === 0 && !selectedFeeling && !selectedLocation && taggedFriends.length === 0) return;

    const payload = {
      groupId: groupId ?? null,
      content: newPostContent || null,
      visibility: visibility,
      sharePostId: null,
      locationTag: selectedLocation || null,
      feelingActivity: selectedFeeling ? `${selectedFeeling.emoji} ${selectedFeeling.label}` : null,
      taggedUserIds: taggedFriends.map(friend => friend.id) || [],
      attachments: newPostFiles,
      isAnonymous: groupId ? isAnonymous : false,
    };

    try {
      setIsSubmitting(true);
      const postId = await createPostApi(payload);
      if (onSubmit) await onSubmit({ ...payload, id: postId });
      handleResetAndClose();
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVisibilityInfo = () => {
    if (visibility === 0) return { label: "Public", icon: "🌐" };
    if (visibility === 1) return { label: "Friends", icon: "👥" };
    return { label: "Only me", icon: "🔒" };
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 transition-opacity">
      <div className="bg-white w-full max-w-[750px] rounded-xl shadow-xl overflow-hidden flex flex-col border border-gray-200 min-h-[550px] max-h-[90vh]">

        {/* VIEW 1: MAIN POST SCREEN */}
        {createPostModalView === "main" && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 relative">
              <h2 className="text-xl font-bold text-gray-900 text-center w-full">Create post</h2>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="absolute right-4 w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleFormSubmit} className="p-4 flex flex-col gap-4 overflow-y-auto flex-1">
              {/* User badge */}
              <div className="flex items-center gap-3">
                <img src={displayUser.avatar} alt={displayUser.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                <div>
                  <div className="flex flex-wrap items-center gap-x-1 leading-tight max-w-[380px]">
                    <span className="font-semibold text-[15px] text-gray-900">{displayUser.name}</span>
                    {selectedFeeling && (
                      <span className="text-[15px] text-gray-600 font-normal">
                        is feeling <span className="font-semibold text-gray-900">{selectedFeeling.emoji} {selectedFeeling.label}</span>
                      </span>
                    )}
                    {taggedFriends.length > 0 && (
                      <span className="text-[15px] text-gray-600 font-normal">
                        with <span className="font-semibold text-gray-900">
                          {taggedFriends[0].name}
                          {taggedFriends.length > 1 ? ` and ${taggedFriends.length - 1} others` : ""}
                        </span>
                      </span>
                    )}
                    {selectedLocation && (
                      <span className="text-[15px] text-gray-600 font-normal">
                        at <span className="font-semibold text-gray-900">{selectedLocation}</span>
                      </span>
                    )}
                  </div>
                  {groupId ? (
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <div className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1.5 rounded-md flex items-center gap-1.5 font-bold border border-blue-200">
                        Group post
                      </div>
                      {allowAnonymousPost && (
                        <button
                          type="button"
                          onClick={() => setIsAnonymous((v) => !v)}
                          className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md font-bold border transition-colors cursor-pointer ${
                            isAnonymous
                              ? "bg-green-600 text-white border-green-900"
                              : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                          }`}
                        >
                          <User size={13} />
                          Anonymous
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCreatePostModalView("audience")}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2.5 py-1.5 rounded-md flex items-center gap-1.5 font-bold mt-1.5 transition-colors cursor-pointer"
                    >
                      <span className="text-sm">{getVisibilityInfo().icon}</span> {getVisibilityInfo().label} <ChevronDown size={14} className="text-gray-500" />
                    </button>
                  )}
                </div>
              </div>

              {/* Text area block */}
              <div className="relative flex flex-col min-h-[120px] w-full mt-2">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder={`What's on your mind, ${displayUser.name}?`}
                  className="w-full bg-transparent resize-none text-[22px] placeholder-gray-500 text-gray-900 outline-none border-none p-0 focus:ring-0"
                  autoFocus
                />

                {/* Visual extra inside text content box (Aa gradient icon) */}
                <div className="flex items-center justify-between mt-auto pt-2">
                  <button
                    type="button"
                    onClick={() => setCreatePostModalView("feeling")}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500 enabled:hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <Smile size={26} className="text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Selected Meta Chips display block */}
              {(selectedFeeling || selectedLocation || taggedFriends.length > 0) && (
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
                  {taggedFriends.map(friend => (
                    <span key={friend.id} className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-200">
                      <span>👥 {friend.name}</span>
                      <button type="button" onClick={() => setTaggedFriends(prev => prev.filter(f => f.id !== friend.id))} className="hover:bg-blue-200 p-0.5 rounded-full cursor-pointer">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* URL image block handler */}
              {newPostContent.trim() && (
                <div className="flex flex-col gap-1 mt-2">
                  <label className="text-xs font-bold text-gray-500">Image Link (optional)</label>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-1">
                    <input
                      type="url"
                      value={newPostImage}
                      onChange={(e) => setNewPostImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="bg-transparent text-sm w-full outline-none px-2 py-1 text-gray-800"
                    />
                    {newPostImage && (
                      <button type="button" onClick={() => setNewPostImage("")} className="text-gray-400 hover:text-red-500 p-1 cursor-pointer">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Local File attachments handler */}
              <div className="flex flex-col gap-1 border-t border-gray-100 pt-3">
                <div className="flex gap-2 overflow-x-auto max-w-full scrollbar-none">
                  {newPostFiles.map((f, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200">
                      {f.type.startsWith("image/") ? (
                        <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-[10px] text-center font-bold text-gray-400">VIDEO</div>
                      )}
                      <button
                        type="button"
                        onClick={() => setNewPostFiles(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-gray-900/70 text-white rounded-full p-1 hover:bg-gray-900 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* URL preview rendering widget */}
              {newPostImage && (
                <div className="border border-gray-200 rounded-lg overflow-hidden max-h-[160px] bg-gray-50 flex items-center justify-center relative">
                  <img
                    src={newPostImage}
                    alt="Preview"
                    className="max-h-[160px] object-contain w-full"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=400&q=80"; }}
                  />
                  <button type="button" onClick={() => setNewPostImage("")} className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 shadow hover:bg-white text-gray-700 cursor-pointer">
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Actions controller shelf */}
              <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-between bg-white shadow-sm mt-auto">
                <span className="text-[15px] font-bold text-gray-900">Add to your post</span>
                <div className="flex items-center gap-1.5">
                  {/* Photo tool */}
                  <label className="w-9 h-9 hover:bg-gray-100 rounded-full cursor-pointer flex items-center justify-center transition-colors" title="Photo/Video">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setNewPostFiles(prev => [...prev, ...files]);
                      }}
                    />
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="6" width="14" height="13" rx="2" fill="#E7F3E8" stroke="#45BD62" strokeWidth="2" />
                      <rect x="7" y="4" width="14" height="13" rx="2" fill="#45BD62" />
                      <circle cx="11" cy="8" r="1.5" fill="white" />
                      <path d="M7 14L11.5 9.5L15 13L17 11L21 15V15.5C21 16.3284 20.3284 17 19.5 17H8.5C7.67157 17 7 16.3284 7 15.5V14Z" fill="white" />
                    </svg>
                  </label>
                  {/* Friends tool */}
                  <button
                    type="button"
                    onClick={() => setCreatePostModalView("tag_friends")}
                    className="w-9 h-9 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                    title="Tag Friends"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12C9.23858 12 7 14.2386 7 17C7 17.5523 7.44772 18 8 18H16C16.5523 18 17 17.5523 17 17C17 14.2386 14.7614 12 12 12Z" fill="#1877F2" />
                      <circle cx="12" cy="7.5" r="3" fill="#1877F2" />
                      <path d="M16 6.5L19.5 10L16.5 13L13 9.5L16 6.5ZM18 7.5C18.2761 7.5 18.5 7.27614 18.5 7C18.5 6.72386 18.2761 6.5 18 6.5C17.7239 6.5 17.5 6.72386 17.5 7C17.5 7.27614 17.7239 7.5 18 7.5Z" fill="#1877F2" />
                    </svg>
                  </button>
                  {/* Feeling tool */}
                  <button
                    type="button"
                    onClick={() => setCreatePostModalView("feeling")}
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
                  {/* Location tool */}
                  <button
                    type="button"
                    onClick={() => setCreatePostModalView("location")}
                    className="w-9 h-9 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                    title="Check in"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C7.58 2 4 5.58 4 10C4 15.25 12 22 12 22C12 22 20 15.25 20 10C20 5.58 16.42 2 12 2Z" fill="#F5533D" />
                      <circle cx="12" cy="10" r="3" fill="white" />
                    </svg>
                  </button>
                  {/* Options spacer list */}
                  <button
                    type="button"
                    onClick={() => setCreatePostModalView("more_options")}
                    className="w-9 h-9 hover:bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 tracking-tight text-lg cursor-pointer"
                    title="More options"
                  >
                    •••
                  </button>
                </div>
              </div>

              {/* Submit Post button */}
              <button
                type="submit"
                disabled={isSubmitting || (!newPostContent.trim() && !newPostImage && newPostFiles.length === 0 && !selectedFeeling && !selectedLocation && taggedFriends.length === 0)}
                className={`w-full py-2.5 font-bold rounded-md text-[15px] transition-all text-center mt-2 flex items-center justify-center gap-2
                  ${(isSubmitting || (!newPostContent.trim() && !newPostImage && newPostFiles.length === 0 && !selectedFeeling && !selectedLocation && taggedFriends.length === 0))
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#1877F2] text-white hover:bg-blue-600 shadow-sm cursor-pointer"}`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Posting...
                  </>
                ) : "Post"}
              </button>
            </form>
          </>
        )}

        {/* VIEW 2: TAG FRIENDS SCREEN */}
        {createPostModalView === "tag_friends" && (
          <>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <button
                type="button"
                onClick={() => { setCreatePostModalView("main"); setTagSearchQuery(""); }}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-700 cursor-pointer"
              >
                <ArrowLeft size={22} />
              </button>
              <h2 className="text-lg font-bold text-gray-900 text-center flex-1">Tag friends</h2>
              <button
                type="button"
                onClick={() => { setCreatePostModalView("main"); setTagSearchQuery(""); }}
                className="text-[#1877F2] font-bold text-[15px] hover:underline px-2 cursor-pointer"
              >
                Done
              </button>
            </div>

            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="px-3 py-2 bg-gray-100 rounded-full flex items-center gap-2 mx-4 my-3 border border-gray-200">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  value={tagSearchQuery}
                  onChange={(e) => setTagSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="bg-transparent text-[15px] w-full outline-none text-gray-900 focus:ring-0"
                  autoFocus
                />
              </div>

              <div className="px-4 py-2 text-xs font-bold text-gray-500 bg-gray-50">
                SUGGESTIONS
              </div>

              <div className="overflow-y-auto flex-1 max-h-[350px]">
                {tagLoading && (
                  <div className="px-4 py-3 text-sm text-gray-400">Loading...</div>
                )}
                {!tagLoading && tagSuggestions.filter(f =>
                  f.name.toLowerCase().includes(tagSearchQuery.toLowerCase())
                ).map((friend) => {
                  const isTagged = taggedFriends.some(f => f.id === friend.id);
                  return (
                    <div
                      key={friend.id}
                      onClick={() => {
                        if (isTagged) {
                          setTaggedFriends(prev => prev.filter(f => f.id !== friend.id));
                        } else {
                          setTaggedFriends(prev => [...prev, friend]);
                        }
                      }}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img src={friend.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.name)}&background=random`} alt={friend.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                        <div className="flex flex-col">
                          <span className="text-[15px] font-semibold text-gray-900">{friend.name}</span>
                          <span className="text-xs text-gray-500">{friend.status}</span>
                        </div>
                      </div>

                      {isTagged ? (
                        <div className="w-5 h-5 rounded-full bg-[#1877F2] flex items-center justify-center text-white cursor-pointer">
                          <span className="text-[11px] font-bold">✓</span>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 cursor-pointer"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* VIEW 3: FEELINGS SCREEN */}
        {createPostModalView === "feeling" && (
          <>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <button
                type="button"
                onClick={() => { setCreatePostModalView("main"); setFeelingSearchQuery(""); }}
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
                  value={feelingSearchQuery}
                  onChange={(e) => setFeelingSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="bg-transparent text-[15px] w-full outline-none text-gray-900 focus:ring-0"
                  autoFocus
                />
              </div>

              <div className="overflow-y-auto flex-1 p-4 bg-white">
                <div className="grid grid-cols-2 gap-2">
                  {FEELINGS_LIST.filter(f =>
                    f.label.toLowerCase().includes(feelingSearchQuery.toLowerCase())
                  ).map((feel, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSelectedFeeling(feel);
                        setCreatePostModalView("main");
                        setFeelingSearchQuery("");
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

        {/* VIEW 4: LOCATION CHECK-IN SCREEN */}
        {createPostModalView === "location" && (
          <>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <button
                type="button"
                onClick={() => { setCreatePostModalView("main"); setLocationSearchQuery(""); }}
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
                  value={locationSearchQuery}
                  onChange={(e) => setLocationSearchQuery(e.target.value)}
                  placeholder="Where are you?"
                  className="bg-transparent text-[15px] w-full outline-none text-gray-900 focus:ring-0"
                  autoFocus
                />
              </div>

              <div className="overflow-y-auto flex-1 p-2">
                {LOCATIONS_LIST.filter(loc =>
                  loc.toLowerCase().includes(locationSearchQuery.toLowerCase())
                ).map((loc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSelectedLocation(loc);
                      setCreatePostModalView("main");
                      setLocationSearchQuery("");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-all cursor-pointer text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-lg">
                      📍
                    </div>
                    <span className="text-[15px] font-semibold text-gray-800">{loc}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* VIEW 5: EXPANDED MORE OPTIONS SCREEN */}
        {createPostModalView === "more_options" && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <button
                type="button"
                onClick={() => setCreatePostModalView("main")}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-700 cursor-pointer"
              >
                <ArrowLeft size={22} />
              </button>
              <h2 className="text-lg font-bold text-gray-900 text-center flex-1">Add to your post</h2>
              <div className="w-9" />
            </div>

            <div className="p-4 overflow-y-auto flex-1 bg-white">
              <div className="grid grid-cols-2 gap-3">
                {/* 1. Photo/video */}
                <label className="flex items-center gap-3.5 p-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-left w-full cursor-pointer hover:border-blue-400 relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setNewPostFiles(prev => [...prev, ...files]);
                      setCreatePostModalView("main");
                    }}
                  />
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="6" width="14" height="13" rx="2" fill="#E7F3E8" stroke="#45BD62" strokeWidth="2" />
                    <rect x="7" y="4" width="14" height="13" rx="2" fill="#45BD62" />
                    <circle cx="11" cy="8" r="1.5" fill="white" />
                    <path d="M7 14L11.5 9.5L15 13L17 11L21 15V15.5C21 16.3284 20.3284 17 19.5 17H8.5C7.67157 17 7 16.3284 7 15.5V14Z" fill="white" />
                  </svg>
                  <span className="text-[15px] font-semibold text-gray-800">Photo/video</span>
                  {newPostFiles.length > 0 && (
                    <span className="absolute top-2 right-2 text-xs font-bold bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      {newPostFiles.length}
                    </span>
                  )}
                </label>

                {/* 2. Tag friends */}
                <button
                  type="button"
                  onClick={() => setCreatePostModalView("tag_friends")}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-left w-full cursor-pointer hover:border-blue-400 relative"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C9.23858 12 7 14.2386 7 17C7 17.5523 7.44772 18 8 18H16C16.5523 18 17 17.5523 17 17C17 14.2386 14.7614 12 12 12Z" fill="#1877F2" />
                    <circle cx="12" cy="7.5" r="3" fill="#1877F2" />
                    <path d="M16 6.5L19.5 10L16.5 13L13 9.5L16 6.5ZM18 7.5C18.2761 7.5 18.5 7.27614 18.5 7C18.5 6.72386 18.2761 6.5 18 6.5C17.7239 6.5 17.5 6.72386 17.5 7C17.5 7.27614 17.7239 7.5 18 7.5Z" fill="#1877F2" />
                  </svg>
                  <span className="text-[15px] font-semibold text-gray-800">Tag friends</span>
                  {taggedFriends.length > 0 && (
                    <span className="absolute top-2 right-2 text-xs font-bold bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      {taggedFriends.length}
                    </span>
                  )}
                </button>

                {/* 3. Feeling/activity */}
                <button
                  type="button"
                  onClick={() => setCreatePostModalView("feeling")}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-left w-full cursor-pointer hover:border-blue-400 relative"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#F7B928" strokeWidth="2.5" />
                    <circle cx="9" cy="10" r="1.25" fill="#F7B928" />
                    <circle cx="15" cy="10" r="1.25" fill="#F7B928" />
                    <path d="M8 14C8 16.2091 9.79086 18 12 18C14.2091 18 16 16.2091 16 14H8Z" fill="#F7B928" />
                  </svg>
                  <span className="text-[15px] font-semibold text-gray-800">Feeling/activity</span>
                  {selectedFeeling && (
                    <span className="absolute top-2 right-2 text-xs font-bold bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      ✓
                    </span>
                  )}
                </button>

                {/* 4. Check in */}
                <button
                  type="button"
                  onClick={() => setCreatePostModalView("location")}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-left w-full cursor-pointer hover:border-blue-400 relative"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C7.58 2 4 5.58 4 10C4 15.25 12 22 12 22C12 22 20 15.25 20 10C20 5.58 16.42 2 12 2Z" fill="#F5533D" />
                    <circle cx="12" cy="10" r="3" fill="white" />
                  </svg>
                  <span className="text-[15px] font-semibold text-gray-800">Check in</span>
                  {selectedLocation && (
                    <span className="absolute top-2 right-2 text-xs font-bold bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      ✓
                    </span>
                  )}
                </button>

                {/* 5. Live video */}
                <div
                  className="flex items-center gap-3.5 p-3.5 rounded-xl border border-gray-100 bg-gray-50 opacity-60 text-left w-full cursor-not-allowed"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="5" width="13" height="14" rx="3" fill="#F02849" />
                    <path d="M17 9L21 6V18L17 15V9Z" fill="#F02849" />
                    <circle cx="8.5" cy="12" r="2.5" fill="white" />
                    <circle cx="8.5" cy="12" r="1.5" fill="#F02849" />
                  </svg>
                  <span className="text-[15px] font-semibold text-gray-500">Live video</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* VIEW 6: POST AUDIENCE SCREEN */}
        {createPostModalView === "audience" && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <button
                type="button"
                onClick={() => setCreatePostModalView("main")}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-700 cursor-pointer"
              >
                <ArrowLeft size={22} />
              </button>
              <h2 className="text-lg font-bold text-gray-900 text-center flex-1">Post audience</h2>
              <div className="w-9" />
            </div>

            {/* Content body */}
            <div className="p-5 flex flex-col gap-4 overflow-y-auto flex-1 bg-white">
              <div>
                <h3 className="text-[17px] font-bold text-gray-900">Who can see your post?</h3>
                <p className="text-sm text-gray-500 mt-1 leading-normal">
                  Your post will show up in Feed, on your profile and in search results.
                </p>
              </div>

              {/* Options list: Public, Friends, Only me */}
              <div className="flex flex-col gap-2 mt-2">
                {/* 1. Public */}
                <button
                  type="button"
                  onClick={() => setVisibility(0)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer
                    ${visibility === 0
                      ? "border-blue-500 bg-blue-50/20"
                      : "border-gray-200 hover:bg-gray-50"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" strokeWidth="2" />
                        <path d="M2 12h20" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-[15px] text-gray-900">Public</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Anyone on or off Facebook</p>
                    </div>
                  </div>
                  {visibility === 0 ? (
                    <div className="w-5 h-5 rounded-full border-[6px] border-[#1877F2] bg-white cursor-pointer"></div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 cursor-pointer"></div>
                  )}
                </button>

                {/* 2. Friends */}
                <button
                  type="button"
                  onClick={() => setVisibility(1)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer
                    ${visibility === 1
                      ? "border-blue-500 bg-blue-50/20"
                      : "border-gray-200 hover:bg-gray-50"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M23 21v-2a4 4 0 00-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-[15px] text-gray-900">Friends</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Your friends on Facebook</p>
                    </div>
                  </div>
                  {visibility === 1 ? (
                    <div className="w-5 h-5 rounded-full border-[6px] border-[#1877F2] bg-white cursor-pointer"></div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 cursor-pointer"></div>
                  )}
                </button>

                {/* 3. Only me */}
                <button
                  type="button"
                  onClick={() => setVisibility(2)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer
                    ${visibility === 2
                      ? "border-blue-500 bg-blue-50/20"
                      : "border-gray-200 hover:bg-gray-50"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-[15px] text-gray-900">Only me</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Only you can see this post</p>
                    </div>
                  </div>
                  {visibility === 2 ? (
                    <div className="w-5 h-5 rounded-full border-[6px] border-[#1877F2] bg-white cursor-pointer"></div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 cursor-pointer"></div>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="p-4 border-t border-gray-200 flex flex-col gap-3 bg-white">
              <button
                type="button"
                onClick={() => setCreatePostModalView("main")}
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