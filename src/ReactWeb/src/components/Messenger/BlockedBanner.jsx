import React from "react";

/**
 * Banner shown inside ChatInfoDirect when block-related state is detected.
 *
 * Variants:
 *  - "blocking" : current user has blocked the other user.
 *                 Shows message + "Unblock" button.
 *  - "blockedBy": current user has been blocked by the other user.
 *                 Shows a read-only notice.
 */
export default function BlockedBanner({ variant, name, loading, onUnblock }) {
  const isBlocking = variant === "blocking";

  return (
    <div className="mx-4 mt-4 bg-[#F0F2F5] rounded-xl p-4 flex flex-col gap-3 border border-[#E4E6EB]">
      {/* Icon + heading */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-[#E4E6EB]">
          <svg
            className="w-5 h-5 text-fb-text"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9V8h2v9zm4 0h-2V8h2v9z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-fb-text">
            {isBlocking
              ? `You can't message or call ${name || "this person"}.`
              : "You can't message or call this account."}
          </p>
          <p className="text-sm text-fb-subtext mt-1 leading-snug">
            {isBlocking
              ? `Unblock ${name || "this person"} to start a conversation again.`
              : "You can no longer see their messages or call information."}
          </p>
        </div>
      </div>

      {isBlocking && (
        <button
          onClick={onUnblock}
          disabled={loading}
          className="self-end px-4 py-1.5 bg-[#E4E6EB] hover:bg-[#D8DADF] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg text-sm font-semibold text-fb-text transition-all duration-150 cursor-pointer"
        >
          {loading ? "Unblocking..." : "Unblock"}
        </button>
      )}
    </div>
  );
}
