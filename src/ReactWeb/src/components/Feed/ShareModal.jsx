import React, { useState, useRef, useEffect } from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { FaGlobeAmericas, FaCaretDown, FaUsers, FaLock } from "react-icons/fa";
import { createPostApi } from "../../apis/postApi";
import { FaUserGroup } from "react-icons/fa6";

// Maps directly to Domain.Enums.PostVisibility (Domain/Enums/PostVisibility.cs)
const PostVisibility = {
  Public: 0,
  Friends: 1,
  Private: 2,
  Group: 3,
};

const VISIBILITY_OPTIONS = [
  { value: PostVisibility.Public, label: "Public", description: "Anyone on or off platform", icon: FaGlobeAmericas },
  { value: PostVisibility.Friends, label: "Friends", description: "Your friends on platform", icon: FaUsers },
  { value: PostVisibility.Private, label: "Private", description: "Only me", icon: FaLock },
  { value: PostVisibility.Group, label: "Group", description: "Members of shared groups", icon: FaUserGroup },
];

export default function ShareModal({ isOpen, onClose, post, authorName, authorAvatar, currentUserAvatar }) {
  const [caption, setCaption] = useState("");
  const [visibility, setVisibility] = useState(PostVisibility.Public);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const dropdownRef = useRef(null);

  // Close visibility dropdown if clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handlePost = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await createPostApi({
        content: caption || null,
        visibility: visibility,
        sharePostId: post?.id ?? null,
      });
      onClose();
    } catch (err) {
      console.error("Share failed:", err);
      setSubmitError(err?.response?.data?.message || "Failed to share post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const postImage = post?.media?.[0]?.url || post?.image;
  
  const activeVisibility = VISIBILITY_OPTIONS.find(v => v.value === visibility) || VISIBILITY_OPTIONS[0];
  const ActiveIcon = activeVisibility.icon;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Facebook Centered Share Modal Box */}
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#E4E6EB]">
          <div className="w-9" />
          <h2 className="text-xl font-bold text-[#050505]">Share</h2>
          <button 
            onClick={onClose} 
            className="w-9 h-9 rounded-full flex items-center justify-center bg-[#E4E6EB] hover:bg-[#D8DADF] transition-colors text-[#050505]"
          >
            <HiMiniXMark size={22} />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[75vh] custom-scrollbar">
          
          {/* User Meta Identity Row */}
          <div className="flex items-center gap-3">
            <img
              src={currentUserAvatar || "/default-avatar.png"}
              alt="Your avatar"
              className="w-11 h-11 rounded-full object-cover border border-black/10"
            />
            <div className="relative" ref={dropdownRef}>
              <h3 className="font-semibold text-[15px] text-[#050505] leading-tight">Your Name</h3>
              
              {/* Interactive Visibility Button Selector */}
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="mt-1 flex items-center gap-1.5 px-2.5 py-1 bg-[#E4E6EB] hover:bg-[#D8DADF] rounded-md text-xs font-semibold text-[#050505] transition-colors focus:outline-none"
              >
                <ActiveIcon size={12} className="text-[#65676B]" />
                <span>{activeVisibility.label}</span>
                <FaCaretDown size={10} className="text-[#65676B]" />
              </button>

              {/* Facebook Popover Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute left-0 mt-1 w-72 bg-white rounded-lg shadow-xl border border-[#CED0D4] py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1 text-[13px] font-bold text-[#65676B] border-b border-[#E4E6EB] pb-1.5 mb-1">
                    Who can see your post?
                  </div>
                  {VISIBILITY_OPTIONS.map((option) => {
                    const OptionIcon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setVisibility(option.value);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-start gap-3 transition-colors ${
                          visibility === option.value 
                            ? "bg-[#E7F3FF] hover:bg-[#E7F3FF]" 
                            : "hover:bg-[#F2F2F2]"
                        }`}
                      >
                        <div className={`mt-0.5 p-2 rounded-full ${visibility === option.value ? "bg-white text-[#1877F2]" : "bg-[#E4E6EB] text-[#050505]"}`}>
                          <OptionIcon size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-[14px] font-semibold ${visibility === option.value ? "text-[#1877F2]" : "text-[#050505]"}`}>
                            {option.label}
                          </span>
                          <span className="text-[11px] text-[#65676B] leading-tight">
                            {option.description}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* User Thoughts/Caption Input Area */}
          <div className="w-full">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Say something about this..."
              className="w-full min-h-[100px] text-[17px] text-[#050505] placeholder-[#65676B] bg-transparent resize-none focus:outline-none py-1"
            />
          </div>

          {/* The Embedded Shared Post Wrapper Card */}
          <div className="w-full bg-white rounded-xl border border-[#CED0D4] overflow-hidden text-left">
            {/* Original Post Author Header */}
            <div className="p-3 flex items-center gap-2 bg-white">
              <img 
                src={authorAvatar || "/default-avatar.png"} 
                alt={authorName} 
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-[#050505] hover:underline cursor-pointer">
                  {authorName || "User"}
                </span>
                <span className="text-[12px] text-[#65676B]">Original Post</span>
              </div>
            </div>

            {/* Embedded Post Image Content */}
            {postImage && (
              <div className="bg-[#F0F2F5] overflow-hidden border-t border-b border-[#E4E6EB]">
                <img src={postImage} alt="Shared attachment" className="w-full h-auto max-h-[400px] object-cover mx-auto" />
              </div>
            )}

            {/* Embedded Post Text Content */}
            {post?.content && (
              <div className="p-3.5 bg-white">
                <p className="text-[15px] text-[#050505] leading-normal font-normal whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Modal Action Footer Buttons */}
        <div className="p-4 border-t border-[#E4E6EB] bg-white flex flex-col gap-2">
          {submitError && (
            <p className="text-[13px] text-red-600 font-medium">{submitError}</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#050505] font-semibold text-[15px] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePost}
              disabled={isSubmitting}
              className="px-8 py-2 rounded-lg bg-[#1877F2] text-white font-semibold text-[15px] hover:bg-[#166FE5] transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? "Sharing..." : "Share Now"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}