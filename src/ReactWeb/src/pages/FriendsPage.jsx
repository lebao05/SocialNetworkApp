import React, { useMemo, useState } from "react";
import { Search, Users, UserPlus, ChevronRight } from "lucide-react";
import { useFriendContext } from "../contexts/friendContext";
import Navbar from "../components/Navbar/Navbar";

const tabs = [
  { id: "requests", label: "Friend Requests", icon: UserPlus },
  { id: "friends", label: "Friends", icon: Users },
];

function getDisplayName(item) {
  const senderName = `${item.senderFirstName || ""} ${item.senderLastName || ""}`.trim();
  return item.fullName || item.userName || senderName || "User";
}

function getSubtitle(item, tab) {
  return tab === "friends" ? "Friend" : "Incoming request";
}

export default function FriendsPage() {
  const {
    friends,
    incomingRequests,
    loading,
    error,
    fetchFriends,
    fetchIncomingFriendRequests,
    acceptFriendRequest,
    loadMoreFriends,
    loadMoreIncomingFriendRequests,
    hasMoreFriends,
    hasMoreIncomingRequests,
  } = useFriendContext();

  const [activeTab, setActiveTab] = useState("requests");
  const [searchTerm, setSearchTerm] = useState("");

  const items = useMemo(() => {
    const source = activeTab === "friends" ? friends : incomingRequests;

    if (!searchTerm.trim()) return source;
    const lowerTerm = searchTerm.toLowerCase();
    return source.filter((item) => getDisplayName(item).toLowerCase().includes(lowerTerm));
  }, [activeTab, friends, incomingRequests, searchTerm]);

  const handlePrimaryAction = async (item) => {
    if (activeTab === "requests") {
      await acceptFriendRequest(item.id);
      await fetchIncomingFriendRequests(1, false);
      await fetchFriends(1, false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#050505] font-sans antialiased">
      <Navbar />
      
      <div className="flex pt-14 h-[calc(100vh-56px)] overflow-hidden">
        
        {/* SIDEBAR - WHITE THEME */}
        <aside className="w-[360px] bg-white border-r border-[#ced0d4] flex flex-col flex-shrink-0 h-full hidden md:flex shadow-md">
          <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold text-[#050505]">Friends</h1>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#65676B]" size={18} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search friends"
                className="w-full rounded-full bg-[#F0F2F5] py-2 pl-10 pr-4 text-[15px] text-[#050505] placeholder-[#65676B] outline-none border-none focus:ring-1 focus:ring-[#1877F2]"
              />
            </div>
          </div>

          <div className="flex-1 px-2 py-1 overflow-y-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-2 py-2.5 transition mb-1 ${
                    isActive ? "bg-[#F2F2F2]" : "hover:bg-[#F2F2F2]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      isActive ? "bg-[#1877F2] text-white" : "bg-[#E4E6EB] text-[#050505]"
                    }`}>
                      <Icon size={20} />
                    </span>
                    <span className="font-semibold text-[15px]">{tab.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-[#65676B]" />
                </button>
              );
            })}
          </div>
        </aside>

        {/* MAIN PANEL - WHITE THEME */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1200px] mx-auto">
            
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#050505]">
                  {activeTab === "requests" ? "Friend Requests" : "Friends"}
                </h2>
                <p className="text-sm text-[#65676B] mt-1">
                  {activeTab === "requests"
                    ? "Review incoming friend requests."
                    : "Browse your friends list."}
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  if (activeTab === "friends") await fetchFriends(1, false);
                  else await fetchIncomingFriendRequests(1, false);
                }}
                className="inline-flex items-center justify-center rounded-full border border-[#ced0d4] bg-white px-4 py-2 text-[15px] font-medium text-[#1877F2] transition hover:bg-[#F2F2F2]"
              >
                Refresh
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-100 border border-red-200 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* CARD GRID */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {items.map((item) => {
                const avatar = item.senderAvatarUrl || item.avatarUrl || item.avatar;
                return (
                  <div
                    key={item.id ?? getDisplayName(item)}
                    className="bg-white rounded-xl overflow-hidden border border-[#ced0d4] shadow-sm transition hover:shadow-md flex flex-col"
                  >
                    <div className="relative aspect-square w-full bg-[#E4E6EB]">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={getDisplayName(item)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-[#65676B]">
                          {getDisplayName(item).charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex flex-col gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[17px] font-bold text-[#050505]">
                          {getDisplayName(item)}
                        </p>
                        <p className="text-[13px] text-[#65676B] truncate mt-1">
                          {getSubtitle(item, activeTab)}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        {activeTab === "friends" ? (
                          <button className="w-full rounded-md bg-[#E4E6EB] py-2 text-[15px] font-semibold text-[#050505] transition hover:bg-[#D8DADf]">
                            Message
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handlePrimaryAction(item)}
                              className="w-full rounded-md bg-[#1877F2] py-2 text-[15px] font-semibold text-white transition hover:bg-[#166fe5]"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              className="w-full rounded-md bg-[#E4E6EB] py-2 text-[15px] font-semibold text-[#050505] transition hover:bg-[#D8DADf]"
                            >
                              Dismiss
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {!loading && items.length === 0 && (
              <div className="py-20 text-center text-[#65676B]">
                {activeTab === "friends"
                  ? "No friends found."
                  : "No incoming friend requests."}
              </div>
            )}

            {loading && (
              <div className="py-10 text-center text-[#65676B]">Loading...</div>
            )}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {activeTab === "friends" && hasMoreFriends && (
                <button
                  type="button"
                  onClick={loadMoreFriends}
                  className="w-full sm:w-auto rounded-full bg-[#1877F2] px-5 py-2 text-white transition hover:bg-[#166fe5]"
                >
                  Load more friends
                </button>
              )}

              {activeTab === "requests" && hasMoreIncomingRequests && (
                <button
                  type="button"
                  onClick={loadMoreIncomingFriendRequests}
                  className="w-full sm:w-auto rounded-full bg-[#1877F2] px-5 py-2 text-white transition hover:bg-[#166fe5]"
                >
                  Load more requests
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}