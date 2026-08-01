import React from "react";

/**
 * SocialNet brand mark.
 *
 * Renders the chat-bubble + "S" icon together with the wordmark.
 * Use `iconOnly` when you only need the icon (e.g. compact nav rows).
 *
 * The SVG is inlined so it inherits the text gradient via `currentColor`
 * patterns and avoids an extra network request.
 */
export default function Logo({ iconOnly = false, className = "", iconSize = 40, textClassName = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="socialnetLogoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4F8BFF" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <path
          d="M14 8h36c5.523 0 10 4.477 10 10v22c0 5.523-4.477 10-10 10H30l-12 10c-.97.808-2.4.05-2.4-1.27V50h-1.6c-5.523 0-10-4.477-10-10V18c0-5.523 4.477-10 10-10z"
          fill="url(#socialnetLogoGrad)"
        />
        <path
          d="M32 41c-7.18 0-13-4.43-13-9.9 0-2.96 1.86-5.6 4.84-7.4a1.6 1.6 0 0 1 2.24 1.96c-.4 1.04-.08 2.07.86 2.74 1.74 1.24 5.06 1.24 6.8 0 .94-.67 1.26-1.7.86-2.74a1.6 1.6 0 0 1 2.24-1.96c2.98 1.8 4.84 4.44 4.84 7.4 0 5.47-5.82 9.9-13 9.9z"
          fill="#fff"
        />
      </svg>
      {!iconOnly && (
        <span
          className={`text-[22px] font-extrabold leading-none tracking-tight bg-gradient-to-r from-[#4F8BFF] via-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent ${textClassName}`}
        >
          SocialNet
        </span>
      )}
    </span>
  );
}
