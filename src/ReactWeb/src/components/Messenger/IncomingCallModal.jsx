import React, { useEffect, useRef } from "react";
import { useCall } from "../../contexts/CallContext";
import { MdCallEnd } from "react-icons/md";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

export default function IncomingCallModal() {
  const { incomingCall, callState, answerCall, rejectCall } = useCall();
  const oscillatorRef = useRef(null);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    if (callState === "ringing" && incomingCall) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, ctx.currentTime);

        const ring = () => {
          if (!audioCtxRef.current || !oscillatorRef.current) return;
          const t = audioCtxRef.current.currentTime;
          osc.frequency.setValueAtTime(440, t);
          osc.frequency.setValueAtTime(520, t + 0.2);
          osc.frequency.setValueAtTime(440, t + 0.4);
          gain.gain.setValueAtTime(0.15, t);
          gain.gain.setValueAtTime(0, t + 0.7);
          oscillatorRef.current = setTimeout(ring, 2000);
        };
        ring();
      } catch (_) {}
    }
    return () => {
      if (oscillatorRef.current) clearTimeout(oscillatorRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [callState, incomingCall]);

  if (callState !== "ringing" || !incomingCall) return null;

  const isVideo = incomingCall.isVideo ?? false;

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
        <div className="relative bg-white rounded-2xl w-[340px] p-6 flex flex-col items-center" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}>
          {/* Avatar with call type badge */}
          <div className="relative mb-4">
            <img
              src={incomingCall.callerAvatar || DEFAULT_AVATAR}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-green-200 animate-pulse"
              alt={incomingCall.callerName}
              onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
            />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
              {isVideo ? (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57-.11.35-.02.74-.25 1.01l-2.2 2.21z" />
                </svg>
              )}
            </div>
          </div>

          {/* Name */}
          <h2 className="text-xl font-bold text-fb-text mb-1">{incomingCall.callerName}</h2>
          <p className="text-sm text-green-500 font-medium mb-6">
            {isVideo ? "Incoming video call..." : "Incoming audio call..."}
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-8">
            {/* Reject */}
            <button
              onClick={rejectCall}
              className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors shadow-lg cursor-pointer"
              title="Decline"
            >
              <MdCallEnd className="w-7 h-7 text-white" />
            </button>

            {/* Accept */}
            <button
              onClick={answerCall}
              className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-colors shadow-lg cursor-pointer"
              title="Accept"
            >
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.24.32-.67.11-.98s-.61-.38-.98-.11L7.75 8.3c-1.41.97-2.78 2.29-4.04 3.79C2.02 14.02 1.3 16.32 1.06 18.1c-.05.37.07.74.32.98.26.25.61.3.91.15 1.25-.61 2.64-1.16 4.12-1.61.36-.11.78.01.93.28l.98 1.64c.19.32.59.43.9.24 1.18-.71 2.58-.9 3.99-.53 1.19.31 2.29 1 3.25 2 .25.25.62.25.87.01.25-.25.25-.63.01-.88z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
