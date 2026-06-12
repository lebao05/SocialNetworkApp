import React, { useEffect, useRef } from "react";
import { useCall } from "../../contexts/CallContext";
import { useChat } from "../../contexts/ChatContext";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

export default function ActiveCallUI() {
  const {
    callState,
    callTarget,
    isMuted,
    isVideoOff,
    isVideoCall,
    callDuration,
    formatDuration,
    toggleMute,
    toggleVideo,
    endCall,
    remoteStream,
    localStream,
    incomingCall,
  } = useCall();

  const { isOnline } = useChat();
  const audioRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const targetAvatar = callTarget?.avatar || DEFAULT_AVATAR;

  // Attach remote stream to audio/video elements
  useEffect(() => {
    if (audioRef.current && remoteStream) {
      audioRef.current.srcObject = remoteStream;
      audioRef.current.play().catch(() => {});
    }
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch(() => {});
    }
  }, [remoteStream]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  if (callState !== "active" && callState !== "calling") return null;

  const targetOnline = callTarget?.id ? isOnline(callTarget.id) : false;
  const showVideo = isVideoCall && callState === "active";

  return (
    <>
      <audio ref={audioRef} autoPlay playsInline />

      <div className="fixed inset-0 z-[60] flex flex-col bg-gradient-to-b from-[#1c1c1c] to-[#2d2d2d]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            {/* Back/close */}
            <button
              onClick={endCall}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Target info */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={targetAvatar}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
                  alt={callTarget?.name}
                  onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                />
                {callState === "active" && targetOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#2d2d2d]" />
                )}
              </div>
              <div>
                <p className="text-white font-semibold text-base">{callTarget?.name || "Unknown"}</p>
                <p className="text-white/60 text-xs">
                  {callState === "calling"
                    ? "Calling..."
                    : targetOnline
                    ? "Connected"
                    : "On call"}
                </p>
              </div>
            </div>
          </div>

          {/* Duration */}
          {callState === "active" && (
            <div className="text-white/80 text-sm font-mono tabular-nums">
              {formatDuration(callDuration)}
            </div>
          )}
        </div>

        {/* Remote video / Avatar area */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 relative">
          {/* Remote video */}
          {showVideo && remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              {/* Avatar */}
              <div className="relative">
                <img
                  src={targetAvatar}
                  className={`w-40 h-40 rounded-full object-cover ${callState === "active" && !isMuted ? "ring-4 ring-green-400" : "ring-4 ring-white/20"}`}
                  alt={callTarget?.name}
                  onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                />
                {callState === "active" && !isMuted && (
                  <div className="absolute inset-0 rounded-full">
                    <div className="absolute inset-0 rounded-full border-2 border-green-400/30 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-2 border-green-400/20 animate-ping" style={{ animationDelay: "0.5s" }} />
                  </div>
                )}
              </div>

              {/* Status text */}
              <p className="text-white/70 text-base">
                {callState === "calling" ? "Calling..." : "In call"}
              </p>

              {/* Waveform */}
              {callState === "active" && !isMuted && (
                <div className="flex items-center gap-1 h-12">
                  {[0.4, 0.7, 1.0, 0.6, 0.8, 0.5, 0.9, 0.3, 0.7, 1.0, 0.5, 0.8, 0.4, 0.9, 0.6].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-green-400 rounded-full animate-[bounce_1s_ease-in-out_infinite]"
                      style={{
                        height: `${h * 100}%`,
                        animationDelay: `${i * 0.07}s`,
                        opacity: 0.6 + h * 0.4,
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Local video PIP */}
          {showVideo && localStream && (
            <div className="absolute bottom-32 right-6 w-36 h-24 bg-black rounded-xl overflow-hidden border-2 border-white/20 shadow-lg">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {isVideoOff && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4a1 1 0 00-1 1v10a1 1 0 001 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z" />
                  </svg>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 pb-12">
          {/* Mute */}
          <button
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors cursor-pointer
              ${isMuted ? "bg-red-500 hover:bg-red-600" : "bg-white/10 hover:bg-white/20"}`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16c-2.47 0-4.52-1.8-4.93-4.15-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V21c0 .55.45 1 1 1s1-.45 1-1v-3.28c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
              </svg>
            )}
          </button>

          {/* End call */}
          <button
            onClick={endCall}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors shadow-lg cursor-pointer"
            title="End call"
          >
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.24.32-.67.11-.98s-.61-.38-.98-.11L7.75 8.3c-1.41.97-2.78 2.29-4.04 3.79C2.02 14.02 1.3 16.32 1.06 18.1c-.05.37.07.74.32.98.26.25.61.3.91.15 1.25-.61 2.64-1.16 4.12-1.61.36-.11.78.01.93.28l.98 1.64c.19.32.59.43.9.24 1.18-.71 2.58-.9 3.99-.53 1.19.31 2.29 1 3.25 2 .25.25.62.25.87.01.25-.25.25-.63.01-.88z" />
            </svg>
          </button>

          {/* Video toggle — only show for video calls */}
          {isVideoCall && (
            <button
              onClick={toggleVideo}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors cursor-pointer
                ${isVideoOff ? "bg-red-500 hover:bg-red-600" : "bg-white/10 hover:bg-white/20"}`}
              title={isVideoOff ? "Turn camera on" : "Turn camera off"}
            >
              {isVideoOff ? (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4a1 1 0 00-1 1v10a1 1 0 001 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
