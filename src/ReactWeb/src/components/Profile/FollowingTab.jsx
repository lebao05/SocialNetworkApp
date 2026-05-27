import React, { useState } from "react";
import { Search, MoreHorizontal, CheckCircle2, UserPlus } from "lucide-react";

export default function FollowingTab({ mockFollowing }) {
    const [innerTab, setInnerTab] = useState("following");
    const [searchQuery, setSearchQuery] = useState("");

    // Sample data fallback structure based on image_724585.png
    const dataList = mockFollowing || [
        { id: "fol-1", name: "Vietnam Discovery", avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150", isVerified: false, isFriend: true },
        { id: "fol-2", name: "Tropical Trip Phú Yên", avatar: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150", isVerified: false, isFriend: true },
        { id: "fol-3", name: "FICI HOME - Homestay Dốc Lết", avatar: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150", isVerified: false, isFriend: true },
        { id: "fol-4", name: "Làng Ngon - Vietnamese Cuisine & Seafood Restaurant", avatar: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150", isVerified: false, isFriend: true },
        { id: "fol-5", name: "IELTS Master - Bình Dương", avatar: "", isVerified: false, isFriend: true },
        { id: "fol-6", name: "Honda Bikers - Bắt Sóng Đam Mê", avatar: "", isVerified: false, isFriend: true },
        { id: "fol-7", name: "Timotovlog", avatar: "", isVerified: false, isFriend: true },
        { id: "fol-8", name: "TS. Hoàng Trung Dũng", subtitle: "Founder tại Rosa Bonita", avatar: "", isVerified: false, isFriend: true },
        { id: "fol-9", name: "DOL English", avatar: "", isVerified: true, isFriend: true },
        { id: "fol-10", name: "Trekking Club - Leo núi trong ngày", subtitle: "Thành phố Hồ Chí Minh", avatar: "", isVerified: false, isFriend: true },
        { id: "fol-11", name: "cọng long néch của anh huy", avatar: "", isVerified: false, isFriend: true },
        { id: "fol-12", name: "Nguyễn Hoàng Huy", avatar: "", isVerified: true, isFriend: false }, // Shows "Thêm bạn bè"
    ];

    const filteredItems = dataList.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                            placeholder="Tìm kiếm"
                            className="bg-transparent border-none outline-none text-[14px] w-full text-[#050505] placeholder:text-[#65676B]"
                        />
                    </div>
                </div>
            </div>

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
                                {item.avatar ? (
                                    <img src={item.avatar} alt={item.name} className="w-full h-full object-cover select-none" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-[#65676B] text-xl font-bold uppercase select-none">
                                        {item.name.substring(0, 2)}
                                    </div>
                                )}
                            </div>

                            {/* Title & Badge Details */}
                            <div className="min-w-0">
                                <div className="flex items-center gap-1.5 max-w-full">
                                    <h3 className="font-semibold text-[16px] leading-snug hover:underline cursor-pointer text-[#050505] truncate">
                                        {item.name}
                                    </h3>
                                    {item.isVerified && (
                                        <CheckCircle2 size={15} className="text-[#1877F2] fill-[#1877F2] stroke-white flex-shrink-0 mt-0.5" />
                                    )}
                                </div>

                                {item.subtitle && (
                                    <p className="text-[12px] text-[#65676B] mt-0.5 truncate">
                                        {item.subtitle}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Right Action Trigger Context Area */}
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            {/* Show "Thêm bạn bè" if not currently friends */}
                            {!item.isFriend && (
                                <button
                                    type="button"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E4E6EB] hover:bg-[#D8DADF] text-[#050505] font-semibold text-[14px] rounded-md transition"
                                >
                                    <UserPlus size={16} />
                                    <span>Thêm bạn bè</span>
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
                    Không tìm thấy trang hoặc người dùng nào phù hợp.
                </div>
            )}

        </div>
    );
}