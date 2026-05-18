import React from 'react';
import { Search, MoreHorizontal } from 'lucide-react';

export default function FriendsTab({ theme, displayUser, mockFriends }) {
  return (
    <div className={`${theme.card} rounded-xl shadow p-6 transition-colors duration-200`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`text-xl font-bold ${theme.text}`}>Bạn bè</h2>
          <p className={`text-sm ${theme.textSub}`}>{displayUser.friendsCount} người bạn</p>
        </div>
        {/* Search and Tabs inside Friends list */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className={`flex items-center rounded-full px-3 py-1.5 gap-2 w-full sm:w-64 ${theme.input}`}>
            <Search size={16} className="text-gray-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Tìm kiếm bạn bè"
              className="bg-transparent border-none outline-none text-sm w-full text-inherit"
            />
          </div>
        </div>
      </div>

      {/* Complete Friends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockFriends.map((friend) => (
          <div
            key={friend.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all hover:shadow-sm ${theme.border}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-[80px] h-[80px] rounded-lg overflow-hidden bg-gray-600 flex-shrink-0">
                {friend.avatar ? (
                  <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-500 flex items-center justify-center text-white text-2xl font-bold">
                    {friend.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className={`font-bold text-[15px] hover:underline cursor-pointer ${theme.text}`}>
                  {friend.name}
                </h3>
                {friend.mutual > 0 ? (
                  <p className={`text-xs ${theme.textSub}`}>{friend.mutual} bạn chung</p>
                ) : (
                  <p className={`text-xs ${theme.textSub}`}>Bạn bè cấp 3</p>
                )}
              </div>
            </div>

            {/* Action trigger button */}
            <button className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all ${theme.btnGray}`}>
              <MoreHorizontal size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
