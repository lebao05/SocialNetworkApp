import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useChat } from "../../contexts/ChatContext";
import { REACTION_TYPES } from "./MessengerFull";

export default function ChangeEmojiModal({ conversationId, currentEmoji, currentName, currentTheme, onClose }) {
  const { updateConversation } = useChat();
  const [selected, setSelected] = useState(currentEmoji || "Like");
  const [saving, setSaving] = useState(false);

  const selectedType = REACTION_TYPES.find((r) => r.value === selected);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateConversation(conversationId, {
        name: currentName ?? null,
        theme: currentTheme ?? null,
        defaultReaction: selected,
      });
      onClose();
    } catch (err) {
      console.error("Failed to save emoji:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-[380px] max-w-[92vw] max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800">Default reaction</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Preview */}
        <div className="px-5 pt-4 pb-3 text-center flex-shrink-0">
          <p className="text-sm text-gray-500 mb-3">Your quick reaction for this chat</p>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full" style={{ backgroundColor: "#F3F4F6" }}>
            <span className="text-4xl leading-none">{selectedType?.emoji}</span>
          </div>
          <p className="mt-1 text-sm font-medium text-gray-600">{selectedType?.label}</p>
        </div>

        {/* Emoji grid — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-2">
          <div className="grid grid-cols-4 gap-2">
            {REACTION_TYPES.map((reaction) => {
              const isSelected = selected === reaction.value;
              return (
                <button
                  key={reaction.value}
                  onClick={() => setSelected(reaction.value)}
                  className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  title={reaction.label}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all"
                    style={{
                      backgroundColor: isSelected ? `${reaction.color}22` : "#F3F4F6",
                      boxShadow: isSelected ? `0 0 0 2.5px ${reaction.color}` : "none",
                    }}
                  >
                    {reaction.emoji}
                  </div>
                  <span className="text-[11px] text-gray-500 leading-tight text-center px-1 truncate w-full">
                    {reaction.label}
                  </span>
                </button>
              );
            })}
          </div>
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
            disabled={saving || selected === currentEmoji}
            className="px-5 py-2 text-sm font-semibold text-white rounded-lg flex items-center gap-2 transition-all cursor-pointer"
            style={selected !== currentEmoji ? { backgroundColor: "#0084FF" } : {}}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
