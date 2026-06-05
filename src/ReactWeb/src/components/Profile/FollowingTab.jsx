import React, { useState } from "react";
import { Search, MoreHorizontal, UserPlus } from "lucide-react";
import { useFollowees } from "../../hooks/useFollowees";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

export default function FollowingTab({ theme }) {
    const { followees, loading, error } = useFollowees();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredItems = followees.filter((item) =>
        (item.fullName || item.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full rounded-lg shadow-sm p-4 bg-white text-[#050505] relative border border-[#ced0d4] transition-colors duration-200">

            {/* Top Navigation Utilities */}
            <div className="flex items-start justify-between w-full mb-1">
                <div>
                    <h2 className="text-xl font-bold text-[#050505] tracking-tight">Following</h2>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium">
                    <button type="button" className="p-2 rounded-md bg-[#E4E6EB] hover:bg-[#D8DADF] flex items-center justify-center border border-[#ced0d4] text-[#050505]">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            </div>

            {/* Tabs Filter Header Line */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#ced0d4] mb-4 gap-3 w-full">

                {/* Searching input container */}
                <div className="pb-2 sm:pb-0">
                    <div className="flex items-center rounded-full px-3 py-1.5 gap-2 w-full sm:w-60 bg-[#F0F2F5]">
                        <Search size={16} className="text-[#65676B] flex-shrink-0" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search"
                            className="bg-transparent border-none outline-none text-[14px] w-full text-[#050505] placeholder:text-[#65676B]"
                        />
                    </div>
                </div>
            </div>

            {loading && (
                <div className="py-12 text-center text-sm text-[#65676B]">Loading...</div>
            )}

            {error && (
                <div className="py-12 text-center text-sm text-red-500">{error}</div>
            )}

            {!loading && !error && (
                <>
                    {/* Dynamic Following 2-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F2F2F2] transition-colors group"
                            >
                                {/* Left Main Entity Display */}
                                <div className="flex items-center gap-4 min-w-0 flex-1">

                                    {/* Micro-rounded square avatar style */}
                                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#E4E6EB] flex-shrink-0 border border-[#ced0d4] shadow-sm flex items-center justify-center">
                                        <img src={(item.avatarUrl || item.avatar || DEFAULT_AVATAR)} alt={item.fullName || item.name} className="w-full h-full object-cover select-none" />
                                    </div>

                                    {/* Title & Badge Details */}
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5 max-w-full">
                                            <h3 className="font-semibold text-[16px] leading-snug hover:underline cursor-pointer text-[#050505] truncate">
                                                {item.fullName || item.name}
                                            </h3>
                                        </div>

                                        {item.mutualFriendsCount > 0 && (
                                            <p className="text-[12px] text-[#65676B] mt-0.5">
                                                {item.mutualFriendsCount} mutual friend{item.mutualFriendsCount !== 1 ? "s" : ""}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Right Action Trigger Context Area */}
                                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                    {/* Show "Add Friend" if not currently friends */}
                                    {!item.isFriend && (
                                        <button
                                            type="button"
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E4E6EB] hover:bg-[#D8DADF] text-[#050505] font-semibold text-[14px] rounded-md transition"
                                        >
                                            <UserPlus size={16} />
                                            <span>Add Friend</span>
                                        </button>
                                    )}

                                    {/* Standard option menu dot layout */}
                                    <button
                                        type="button"
                                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all bg-[#E4E6EB] hover:bg-[#D8DADF] border border-[#ced0d4] text-black font-bold shadow-sm"
                                    >
                                        <MoreHorizontal size={20} className="stroke-[2.5]" />
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>

                    {/* Fallback Area handler */}
                    {filteredItems.length === 0 && (
                        <div className="py-12 text-center text-sm text-[#65676B]">
                            No followees found.
                        </div>
                    )}
                </>
            )}

        </div>
    );
}
