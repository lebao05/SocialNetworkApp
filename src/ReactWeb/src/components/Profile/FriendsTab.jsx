import React, { useState, useRef, useEffect } from "react";
import { Search, MoreHorizontal, User, MessageCircle, X, Star, UserCheck, EyeOff, UserX } from "lucide-react";

export default function FriendsTab({ displayUser, mockFriends }) {
  const [innerTab, setInnerTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [hoveredFriendId, setHoveredFriendId] = useState(null);
  
  const menuRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Close context action menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredFriends = (mockFriends || []).filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Hover delay utilities for profile popover preview
  const handleMouseEnter = (id) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredFriendId(id);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredFriendId(null);
    }, 300);
  };

  return (
    <div className="w-full rounded-lg shadow-sm p-4 bg-white text-[#050505] relative border border-[#ced0d4] transition-colors duration-200">
      
      {/* Top Header Utilities */}
      <div className="flex items-start justify-between w-full mb-1">
        <div>
          <h2 className="text-xl font-bold text-[#050505] tracking-tight">Bạn bè</h2>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <button type="button" className="p-2 rounded-md bg-[#E4E6EB] hover:bg-[#D8DADF] flex items-center justify-center border border-[#ced0d4] text-[#050505]">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Profile Filters Layout Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#ced0d4] mb-4 gap-3 w-full">

        <div className="pb-2 sm:pb-0">
          <div className="flex items-center rounded-full px-3 py-1.5 gap-2 w-full sm:w-60 bg-[#F0F2F5]">
            <Search size={16} className="text-[#65676B] flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm"
              className="bg-transparent border-none outline-none text-[14px] w-full text-[#050505] placeholder:text-[#65676B]"
            />
          </div>
        </div>
      </div>

      {/* 2-Column Grid Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
        {filteredFriends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F2F2F2] transition-colors relative group"
          >
            {/* Left Content Column */}
            <div className="flex items-center gap-4 min-w-0 flex-1 relative">
              
              {/* Profile Image Wrap (Hover Trigger Anchor) */}
              <div 
                className="relative cursor-pointer"
                onMouseEnter={() => handleMouseEnter(friend.id)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#E4E6EB] flex-shrink-0 border border-[#ced0d4] shadow-sm">
                  {friend.avatar ? (
                    <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover select-none" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#65676B] text-2xl font-bold">
                      {friend.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* ========================================== */}
                {/* LIGHT HOVER PROFILE CARD OVERLAY POPUP */}
                {/* ========================================== */}
                {hoveredFriendId === friend.id && (
                  <div 
                    className="absolute z-50 bottom-full left-0 mb-2 w-[340px] p-4 rounded-xl shadow-2xl border bg-white text-[#050505] border-[#ced0d4] transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
                    onMouseEnter={() => handleMouseEnter(friend.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-white shadow-md bg-[#E4E6EB]">
                        {friend.avatar ? <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#E4E6EB]" />}
                      </div>
                      <button onClick={() => setHoveredFriendId(null)} className="p-1 rounded-full hover:bg-[#E4E6EB] text-[#65676B]">
                        <X size={18} />
                      </button>
                    </div>

                    <h4 className="text-xl font-bold hover:underline cursor-pointer mb-2 text-[#050505]">{friend.name}</h4>
                    
                    <div className="space-y-1.5 text-[13px] text-[#65676B] mb-4">
                      <div className="flex items-start gap-2">
                        <User size={16} className="mt-0.5 flex-shrink-0 text-[#65676B]" />
                        <span>
                          <strong className="text-[#050505] font-semibold">{friend.mutual || 0} bạn chung</strong> bao gồm Trần Phụng Đình và Quốc Tấn
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#65676B] text-base leading-none flex-shrink-0">🎓</span>
                        <span>Từng học tại <strong className="text-[#050505] font-semibold">Information Technology - HCMUS</strong></span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-1.5 rounded-md bg-[#E4E6EB] hover:bg-[#D8DADF] py-2 text-[14px] font-semibold text-black transition">
                        <UserCheck size={16} /> Bạn bè
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1.5 rounded-md bg-[#1877F2] hover:bg-[#166fe5] py-2 text-[14px] font-semibold text-white transition">
                        <MessageCircle size={16} /> Nhắn tin
                      </button>
                      <button className="px-2.5 rounded-md bg-[#E4E6EB] hover:bg-[#D8DADF] font-bold text-black transition">
                        •••
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Identification Stack */}
              <div className="min-w-0">
                <h3 
                  onMouseEnter={() => handleMouseEnter(friend.id)}
                  onMouseLeave={handleMouseLeave}
                  className="font-semibold text-[17px] leading-tight hover:underline cursor-pointer text-[#050505] truncate"
                >
                  {friend.name}
                </h3>
                <p className="text-[13px] text-[#65676B] mt-1 truncate">
                  {friend.mutual > 0 ? `${friend.mutual} bạn chung` : "Bạn bè"}
                </p>
              </div>
            </div>

            {/* ========================================== */}
            {/* ENHANCED CONTRAST 3-DOT MENU BUTTON */}
            {/* ========================================== */}
            <div className="relative">
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuId(activeMenuId === friend.id ? null : friend.id);
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all bg-[#E4E6EB] hover:bg-[#D8DADF] border border-[#ced0d4] text-black font-bold shadow-sm focus:ring-2 focus:ring-[#1877F2]"
                aria-haspopup="true"
                aria-expanded={activeMenuId === friend.id}
              >
                <MoreHorizontal size={20} className="stroke-[2.5]" />
              </button>

              {/* ========================================== */}
              {/* LIGHT THEME CONTEXT DROPDOWN DRAWER */}
              {/* ========================================== */}
              {activeMenuId === friend.id && (
                <div 
                  ref={menuRef}
                  className="absolute right-0 mt-2 w-[250px] z-50 bg-white border border-[#ced0d4] rounded-xl shadow-xl py-1.5 animate-in fade-in zoom-in-95 duration-100 text-[#050505]"
                >
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-[14px] font-semibold hover:bg-[#F2F2F2] transition">
                    <Star size={18} className="text-[#65676B]" />
                    <span>Yêu thích</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-[14px] font-semibold hover:bg-[#F2F2F2] transition">
                    <UserCheck size={18} className="text-[#65676B]" />
                    <span>Chỉnh sửa danh sách bạn bè</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-[14px] font-semibold hover:bg-[#F2F2F2] transition">
                    <EyeOff size={18} className="text-[#65676B]" />
                    <span>Bỏ theo dõi</span>
                  </button>
                  
                  <div className="h-[1px] bg-[#ced0d4] my-1" />
                  
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-[14px] font-semibold text-red-600 hover:bg-red-50 transition">
                    <UserX size={18} />
                    <span>Hủy kết bạn</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Empty State Fallback */}
      {filteredFriends.length === 0 && (
        <div className="py-12 text-center text-sm text-[#65676B]">
          Không tìm thấy người bạn nào phù hợp.
        </div>
      )}

    </div>
  );
}