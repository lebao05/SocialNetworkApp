import React, { useState, useEffect, useRef } from "react";
import { X, Search, Loader2 } from "lucide-react";
import { useChat } from "../../contexts/ChatContext";
import { useAuth } from "../../contexts/authContext";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

export default function AddMemberModal({ conv, onClose }) {
  const { friends, friendsLoading, friendsSearchTerm, fetchFriends, addMember, conversationMembers } = useChat();
  const { user } = useAuth();

  const [selectedId, setSelectedId] = useState(null);
  const [searchVal, setSearchVal] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const searchTimerRef = useRef(null);

  useEffect(() => {
    fetchFriends(null);
  }, []);

  useEffect(() => {
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      fetchFriends(searchVal || null);
    }, 300);
    return () => clearTimeout(searchTimerRef.current);
  }, [searchVal]);

  const friendsList = Array.isArray(friends) ? friends : (friends?.results ?? []);

  // Filter out existing members and the current user
  const existingMemberIds = new Set([
    ...(conversationMembers ?? []).map((m) => m.userId),
    user?.id,
  ]);

  const availableFriends = friendsList.filter(
    (f) => !existingMemberIds.has(f.id)
  );

  const handleAdd = async () => {
    if (!selectedId) return;
    setError("");
    setAdding(true);
    try {
      await addMember(conv.id, selectedId);
      onClose();
    } catch {
      setError("Failed to add member. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="relative bg-white rounded-2xl w-[440px] max-h-[80vh] flex flex-col overflow-hidden pointer-events-auto" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4E6EB]">
            <h2 className="text-lg font-bold text-fb-text">Add people</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F0F2F5] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-fb-subtext" />
            </button>
          </div>

          {/* Hint */}
          <div className="px-5 pt-3 pb-1">
            <p className="text-xs text-fb-subtext">
              Select a friend to add to <span className="font-semibold text-fb-text">{conv?.name}</span>
            </p>
          </div>

          {/* Search */}
          <div className="px-5 py-2">
            <div className="flex items-center bg-[#F0F2F5] rounded-full px-3 py-2 gap-2">
              <Search className="w-4 h-4 text-fb-subtext flex-shrink-0" />
              <input
                className="bg-transparent outline-none text-sm flex-1 text-fb-text placeholder-fb-subtext"
                placeholder="Search friends..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
            </div>
          </div>

          {/* Friend list */}
          <div className="flex-1 overflow-y-auto px-3 py-1">
            {friendsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-fb-blue animate-spin" />
              </div>
            ) : availableFriends.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <p className="text-sm text-fb-subtext">
                  {searchVal
                    ? `No friends matching "${searchVal}"`
                    : "No friends available to add"}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {availableFriends.map((friend) => {
                  const selected = selectedId === friend.id;
                  return (
                    <div
                      key={friend.id}
                      onClick={() => setSelectedId(selected ? null : friend.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                        selected ? "bg-blue-50" : "hover:bg-[#F0F2F5]"
                      }`}
                    >
                      <img
                        src={friend.avatar || DEFAULT_AVATAR}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        alt={friend.fullName}
                        onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${selected ? "font-semibold text-fb-blue" : "font-medium text-fb-text"}`}>
                          {friend.fullName}
                        </p>
                      </div>
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                        ${selected ? "bg-fb-blue border-fb-blue" : "border-[#DADADA]"}`}>
                        {selected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-[#E4E6EB]">
            {error && (
              <p className="text-sm text-red-500 mb-3 text-center">{error}</p>
            )}
            <button
              onClick={handleAdd}
              disabled={!selectedId || adding}
              className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors
                ${!selectedId || adding
                  ? "bg-[#E4E6EB] text-fb-subtext cursor-not-allowed"
                  : "bg-fb-blue text-white hover:bg-blue-600 cursor-pointer"}`}
            >
              {adding ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </span>
              ) : (
                "Add to group"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
