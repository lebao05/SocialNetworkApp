import React, { useState } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { useChat } from "../../contexts/ChatContext";
import { CHAT_THEMES } from "../../data/chatThemes";

export default function ChangeThemeModal({ conversationId, currentTheme, onClose }) {
  const { updateConversation } = useChat();
  const [selected, setSelected] = useState(currentTheme || "default");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const themeValue = selected === "default" ? null : selected;
      await updateConversation(conversationId, { name: null, theme: themeValue, defaultReaction: null });
      onClose();
    } catch (err) {
      console.error("Failed to save theme:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-[580px] max-w-[92vw] max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Chat colour and background</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Theme grid */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="text-sm text-gray-500 mb-4">Choose a background to set the mood for this conversation.</p>
          <div className="grid grid-cols-5 gap-3">
            {CHAT_THEMES.map((theme) => {
              const isSelected = selected === theme.id;
              const isMidnight = theme.id === "midnight";
              return (
                <button
                  key={theme.id}
                  onClick={() => setSelected(theme.id)}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                  title={theme.label}
                >
                  {/* Background preview swatch */}
                  <div
                    className="w-16 h-12 rounded-xl overflow-hidden flex items-end p-1 shadow-sm ring-2 transition-all relative"
                    style={{
                      backgroundColor: theme.bg,
                      color: theme.text,
                      ringColor: isSelected ? theme.bubbleSelf : "#E5E7EB",
                      boxShadow: isSelected ? `0 0 0 2px white, 0 0 0 4px ${theme.bubbleSelf}` : undefined,
                    }}
                  >
                    {/* Bubble preview */}
                    <div
                      className="h-3 w-5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: theme.bubbleSelf }}
                    />
                    <div
                      className="h-3 w-5 rounded-full flex-shrink-0 ml-0.5"
                      style={{ backgroundColor: theme.bubbleOther }}
                    />
                    {/* Check overlay */}
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check
                          className="w-5 h-5"
                          style={{ color: isMidnight ? "#E8EAF6" : theme.bubbleSelf }}
                        />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors leading-tight text-center">
                    {theme.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || selected === currentTheme}
            className="px-5 py-2 text-sm font-semibold text-white rounded-lg flex items-center gap-2 transition-all cursor-pointer"
            style={selected !== currentTheme ? { backgroundColor: "#0084FF" } : {}}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : null}
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
