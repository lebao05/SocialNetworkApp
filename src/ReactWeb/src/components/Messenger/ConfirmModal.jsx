import React from "react";

/**
 * Simple confirmation modal used before blocking or unblocking a user.
 *
 * Props:
 *  - open          : bool
 *  - title         : string
 *  - message       : string
 *  - confirmLabel  : string (e.g. "Block")
 *  - confirmDanger : bool – red button styling
 *  - loading       : bool – disable buttons while request is in flight
 *  - onConfirm     : () => void
 *  - onCancel      : () => void
 */
export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  confirmDanger = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-fb-text">{title}</h2>
        <p className="text-sm text-fb-subtext leading-relaxed whitespace-pre-line">
          {message}
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-fb-text bg-[#E4E6EB] hover:bg-[#D8DADF] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer ${
              confirmDanger
                ? "bg-red-500 hover:bg-red-600"
                : "bg-[#1877F2] hover:bg-[#166FE5]"
            }`}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
