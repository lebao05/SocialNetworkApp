import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useChat } from "../../contexts/ChatContext";

export default function ChangeNameModal({ conversationId, currentName, currentTheme, currentDefaultReaction, onClose }) {
  const { updateConversation } = useChat();
  const [name, setName] = useState(currentName || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  console.log(currentName);
  console.log(currentTheme);
  console.log(currentDefaultReaction);
  const trimmed = name.trim();

  const handleSave = async () => {
    if (!trimmed) {
      setError("Group name cannot be empty.");
      return;
    }
    if (trimmed.length > 100) {
      setError("Group name must be 100 characters or less.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await updateConversation(conversationId, {
        name: trimmed,
        theme: currentTheme ?? null,
        defaultReaction: currentDefaultReaction ?? null,
      });
      onClose();
    } catch (err) {
      console.error("Failed to save name:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-[420px] max-w-[92vw] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800">Change group name</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex-shrink-0">
          <p className="text-sm text-gray-500 mb-3">
            Give your group a new name — members will be notified.
          </p>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="Group name"
            maxLength={100}
            autoFocus
            className={`w-full px-3 py-2.5 rounded-lg border text-base text-gray-800 placeholder-gray-400
              outline-none focus:ring-2 transition-all
              ${error ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300 focus:border-blue-400"}`}
          />
          {error && (
            <p className="mt-1.5 text-sm text-red-500">{error}</p>
          )}
          <p className="mt-1.5 text-xs text-gray-400 text-right">{trimmed.length}/100</p>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !trimmed || trimmed === (currentName || "").trim()}
            className="px-5 py-2 text-sm font-semibold text-white rounded-lg flex items-center gap-2 transition-all cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed"
            style={trimmed && trimmed !== (currentName || "").trim() ? { backgroundColor: "#0084FF" } : {}}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
