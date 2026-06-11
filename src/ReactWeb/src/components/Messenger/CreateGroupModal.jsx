import React, { useState, useEffect } from "react";
import { X, Search, Loader2 } from "lucide-react";
import { useChat } from "../../contexts/ChatContext";
import { useAuth } from "../../contexts/authContext";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

export default function CreateGroupModal({ onClose, onCreated }) {
  const { user } = useAuth();
  const { friends, friendsLoading, fetchFriends, createGroup } = useChat();

  const [groupName, setGroupName] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [searchVal, setSearchVal] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFriends(null);
  }, []);

  const friendsList = Array.isArray(friends) ? friends : (friends?.results ?? []);

  const filteredFriends = friendsList.filter((f) =>
    f.name?.toLowerCase().includes(searchVal.toLowerCase())
  );

  const toggleFriend = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCreate = async () => {
    setError("");
    const trimmedName = groupName.trim();
    if (!trimmedName) {
      setError("Please enter a group name.");
      return;
    }
    if (selectedIds.size < 2) {
      setError("Select at least 2 friends to create a group.");
      return;
    }
    setCreating(true);
    try {
      const conv = await createGroup(Array.from(selectedIds), trimmedName);
      if (conv) {
        onCreated(conv);
        onClose();
      } else {
        setError("Failed to create group. Please try again.");
      }
    } catch {
      setError("Failed to create group. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-[480px] max-h-[85vh] flex flex-col overflow-hidden" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4E6EB]">
          <h2 className="text-lg font-bold text-fb-text">Create Group</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F0F2F5] transition-colors"
          >
            <X className="w-5 h-5 text-fb-subtext" />
          </button>
        </div>

        {/* Group name */}
        <div className="px-5 pt-4 pb-2">
          <label className="block text-sm font-medium text-fb-text mb-1.5">
            Group name
          </label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name..."
            className="w-full px-3 py-2 border border-[#DADADA] rounded-lg text-sm text-fb-text placeholder-fb-subtext bg-[#F0F2F5] focus:outline-none focus:ring-2 focus:ring-fb-blue focus:border-transparent"
            maxLength={50}
          />
        </div>

        {/* Selected count */}
        <div className="px-5 pt-1 pb-2">
          <span className="text-xs text-fb-subtext">
            {selectedIds.size === 0
              ? "Select friends to add"
              : `${selectedIds.size} friend${selectedIds.size > 1 ? "s" : ""} selected`}
          </span>
        </div>

        {/* Friend search */}
        <div className="px-5 pb-3">
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
        <div className="flex-1 overflow-y-auto px-3 pb-2">
          {friendsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-fb-blue animate-spin" />
            </div>
          ) : filteredFriends.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <p className="text-sm text-fb-subtext">No friends found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredFriends.map((friend) => {
                const selected = selectedIds.has(friend.id);
                return (
                  <div
                    key={friend.id}
                    onClick={() => toggleFriend(friend.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                      selected ? "bg-blue-50" : "hover:bg-[#F0F2F5]"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={friend.avatar || DEFAULT_AVATAR}
                        className="w-10 h-10 rounded-full object-cover"
                        alt={friend.name}
                        onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                      />
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${selected ? "font-semibold text-fb-blue" : "font-medium text-fb-text"}`}>
                        {friend.name}
                      </p>
                      {friend.status && (
                        <p className="text-xs text-fb-subtext truncate">{friend.status}</p>
                      )}
                    </div>

                    {/* Checkbox */}
                    <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
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
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg bg-[#F0F2F5] text-fb-text font-semibold text-sm hover:bg-[#E4E6EB] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={creating || selectedIds.size < 2 || !groupName.trim()}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors
                ${creating || selectedIds.size < 2 || !groupName.trim()
                  ? "bg-[#E4E6EB] text-fb-subtext cursor-not-allowed"
                  : "bg-fb-blue text-white hover:bg-blue-600"}`}
            >
              {creating ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </span>
              ) : (
                "Create Group"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
