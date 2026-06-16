import { useState, useRef, useEffect, useCallback } from "react";

const WAVEFORM_BARS = 12;
const CANCEL_THRESHOLD = 80; // px to slide left to cancel

function formatTime(secs) {
  if (isNaN(secs) || secs < 0) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VoiceRecorder({ theme, onSend, onPhaseChange }) {
  const [phase, setPhase] = useState("idle"); // idle | recording | recorded | playing
  const [audioUrl, setAudioUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  const [playTime, setPlayTime] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [waveHeights, setWaveHeights] = useState(Array(WAVEFORM_BARS).fill(4));

  const prevPhaseRef = useRef(phase);

  useEffect(() => {
    if (prevPhaseRef.current !== phase) {
      onPhaseChange?.(phase);
      prevPhaseRef.current = phase;
    }
  }, [phase, onPhaseChange]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const recordStartTimeRef = useRef(0);
  const isCancelledRef = useRef(false);

  // Slide-to-cancel state
  const slideStartX = useRef(0);
  const translateX = useRef(0);
  const [slideOffset, setSlideOffset] = useState(0);

  const stopRecordingCleanup = useCallback(() => {
    clearInterval(timerRef.current);
    cancelAnimationFrame(animationRef.current);
    setWaveHeights(Array(WAVEFORM_BARS).fill(4));
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const updateWaveform = useCallback(() => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteTimeDomainData(data);
    const step = Math.floor(data.length / WAVEFORM_BARS);
    const heights = Array.from({ length: WAVEFORM_BARS }, (_, i) => {
      const val = data[i * step] / 128;
      return Math.max(4, Math.round((val - 1) * 40 + 4));
    });
    setWaveHeights(heights);
    animationRef.current = requestAnimationFrame(updateWaveform);
  }, []);

  // ─── START RECORDING ────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data?.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        if (isCancelledRef.current) {
          isCancelledRef.current = false;
          stopRecordingCleanup();
          return;
        }
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setDuration(elapsed);
        setPhase("recorded");
        stopRecordingCleanup();
      };

      recorder.start(100);
      startTimeRef.current = Date.now();
      recordStartTimeRef.current = Date.now();
      setPhase("recording");
      animationRef.current = requestAnimationFrame(updateWaveform);

      timerRef.current = setInterval(() => {
        setDuration((Date.now() - startTimeRef.current) / 1000);
      }, 200);
    } catch {
      setPhase("idle");
    }
  }, [stopRecordingCleanup, updateWaveform]);

  // ─── RELEASE (stop recording) ─────────────────────────────────────────
  const stopRecording = useCallback(() => {
    setSlideOffset(0);
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    } else {
      stopRecordingCleanup();
      setPhase("idle");
    }
  }, [stopRecordingCleanup]);

  // ─── CANCEL ───────────────────────────────────────────────────────────
  const cancelRecording = useCallback(() => {
    isCancelledRef.current = true;
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setDeleting(true);
    setTimeout(() => {
      stopRecordingCleanup();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      setDuration(0);
      setPlayTime(0);
      setPhase("idle");
      setDeleting(false);
      setSlideOffset(0);
    }, 250);
  }, [stopRecordingCleanup, audioUrl]);

  // ─── PLAYBACK ─────────────────────────────────────────────────────────
  const playAudio = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.play();
    setPhase("playing");
  }, []);

  const pauseAudio = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setPhase("recorded");
  }, []);

  // ─── SEND ─────────────────────────────────────────────────────────────
  const sendAudio = useCallback(() => {
    if (!audioUrl || phase !== "recorded") return;
    const blob = audioChunksRef.current.length > 0
      ? new Blob(audioChunksRef.current, { type: "audio/webm" })
      : null;
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setDuration(0);
    setPlayTime(0);
    setPhase("idle");
    onSend?.(blob);
  }, [audioUrl, phase, onSend]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecordingCleanup();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [stopRecordingCleanup, audioUrl]);

  // ─── TOUCH/MOUSE SLIDE-TO-CANCEL ──────────────────────────────────────
  const handleSlideStart = (clientX) => {
    slideStartX.current = clientX;
    translateX.current = 0;
    setSlideOffset(0);
  };

  const handleSlideMove = (clientX) => {
    if (phase !== "recording") return;
    const delta = slideStartX.current - clientX;
    const clamped = Math.max(0, Math.min(delta, CANCEL_THRESHOLD + 20));
    translateX.current = clamped;
    setSlideOffset(clamped);
  };

  const handleSlideEnd = () => {
    if (phase !== "recording") return;
    const elapsed = Date.now() - recordStartTimeRef.current;
    if (elapsed > 350) {
      stopRecording();
    }
  };

  const handleMouseUpOrEnd = () => {
    const elapsed = Date.now() - recordStartTimeRef.current;
    if (elapsed > 350) {
      stopRecording();
    }
  };

  // ─── IDLE: mic button ─────────────────────────────────────────────────
  if (phase === "idle") {
    return (
      <button
        onMouseDown={startRecording}
        onTouchStart={(e) => { e.preventDefault(); startRecording(); }}
        onMouseUp={handleMouseUpOrEnd}
        onTouchEnd={(e) => { e.preventDefault(); handleMouseUpOrEnd(); }}
        onMouseLeave={handleMouseUpOrEnd}
        className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-70 transition-all flex-shrink-0 cursor-pointer"
        title="Click to record or hold to talk"
        style={{ color: theme.text }}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
        </svg>
      </button>
    );
  }

  // ─── RECORDING: waveform + timer + slide-to-cancel ────────────────────
  if (phase === "recording") {
    const micShake = slideOffset > 0 ? (slideOffset / CANCEL_THRESHOLD) * 8 : 0;
    const showCancel = slideOffset > 10;

    return (
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-2xl flex-shrink-0 w-full justify-between"
        style={{
          backgroundColor: theme.bubbleOther,
          transform: `translateX(-${slideOffset}px)`,
          transition: slideOffset === 0 ? "transform 0.15s ease" : "none",
        }}
        onMouseMove={(e) => handleSlideMove(e.clientX)}
        onMouseUp={handleSlideEnd}
        onMouseLeave={handleSlideEnd}
        onTouchMove={(e) => handleSlideMove(e.touches[0].clientX)}
        onTouchEnd={handleSlideEnd}
      >
        <div className="flex items-center gap-2">
          {/* Cancel/Trash button */}
          <button
            onClick={(e) => { e.stopPropagation(); cancelRecording(); }}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:opacity-75 transition-opacity cursor-pointer bg-red-100 flex-shrink-0"
            title="Cancel recording"
          >
            <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </button>

          {/* Pulsing Stop button (clickable to stop recording) */}
          <button
            onClick={(e) => { e.stopPropagation(); stopRecording(); }}
            className="flex-shrink-0 animate-pulse hover:scale-110 transition-transform cursor-pointer w-7 h-7 rounded-full flex items-center justify-center bg-red-100"
            title="Click to stop and preview"
            style={{ transform: `translateX(-${micShake}px)`, transition: "transform 0.1s" }}
          >
            <div className="w-2.5 h-2.5 bg-red-600 rounded-sm" />
          </button>
        </div>

        {/* Waveform bars */}
        <div
          className="flex items-center gap-0.5 h-8 flex-shrink-0 flex-1 max-w-[140px] justify-center mx-2"
          style={{ transform: `translateX(-${micShake}px)`, transition: "transform 0.1s" }}
        >
          {waveHeights.map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-full"
              style={{
                height: `${h}px`,
                backgroundColor: "#EF4444",
                minHeight: "4px",
              }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Timer */}
          <span
            className="text-xs font-semibold tabular-nums"
            style={{ color: theme.bubbleOtherText, transform: `translateX(-${micShake}px)`, transition: "transform 0.1s" }}
          >
            {formatTime(duration)}
          </span>

          {/* Cancel indicator — appears as you slide left */}
          {showCancel && (
            <div
              className="flex items-center gap-1 flex-shrink-0"
              style={{ opacity: slideOffset / CANCEL_THRESHOLD, transform: `translateX(-${micShake}px)`, transition: "opacity 0.1s, transform 0.1s" }}
            >
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span className="text-xs text-red-500 font-medium">Cancel</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── RECORDED: playback preview + send/delete ─────────────────────────
  if (phase === "recorded" || phase === "playing") {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-2xl flex-shrink-0 ${
          deleting ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
        style={{
          backgroundColor: theme.bubbleOther,
          transition: "opacity 0.25s, transform 0.25s",
        }}
      >
        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={() => setPlayTime(audioRef.current?.currentTime ?? 0)}
          onEnded={() => { setPhase("recorded"); setPlayTime(0); }}
        />

        {/* Play / Pause */}
        <button
          onClick={phase === "playing" ? pauseAudio : playAudio}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:opacity-80 transition-colors flex-shrink-0 cursor-pointer"
          style={{ backgroundColor: theme.bubbleSelf, color: theme.bubbleSelfText }}
        >
          {phase === "playing" ? (
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Waveform progress */}
        <div className="flex items-center gap-0.5 h-7 w-28 flex-shrink-0">
          {Array.from({ length: WAVEFORM_BARS }, (_, i) => {
            const progress = duration > 0 ? playTime / duration : 0;
            const currentBarIdx = progress * WAVEFORM_BARS;
            const active = i <= currentBarIdx;
            return (
              <div
                key={i}
                className="w-1 rounded-full"
                style={{
                  height: `${Math.max(4, 4 + (i % 3) * 3)}px`,
                  backgroundColor: active ? theme.bubbleSelf : "#D1D5DB",
                  minHeight: "4px",
                }}
              />
            );
          })}
        </div>

        {/* Timer */}
        <span className="text-xs tabular-nums" style={{ color: theme.bubbleOtherText }}>
          {phase === "playing" ? formatTime(duration - playTime) : formatTime(duration)}
        </span>

        {/* Delete */}
        <button
          onClick={cancelRecording}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:opacity-70 transition-colors flex-shrink-0 cursor-pointer"
          style={{ backgroundColor: "#FEE2E2" }}
          title="Delete recording"
        >
          <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>

        {/* Send */}
        <button
          onClick={sendAudio}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:scale-110 transition-all flex-shrink-0 cursor-pointer"
          style={{ backgroundColor: theme.bubbleSelf, color: theme.bubbleSelfText }}
          title="Send voice message"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 21L23 12 1 3v7l15 2-15 2v7z" />
          </svg>
        </button>
      </div>
    );
  }

  return null;
}
