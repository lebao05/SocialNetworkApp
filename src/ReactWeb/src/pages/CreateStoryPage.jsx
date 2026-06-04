import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  X, Camera, Image, Type, Palette,
  ChevronLeft, ChevronRight, Shuffle
} from "lucide-react";
import { currentUser } from "../data/mockData";

const TEXT_BG_OPTIONS = [
  { id: "pink",    gradient: "linear-gradient(135deg, #ff6b9d, #c44ea0)",       label: "Pink" },
  { id: "purple",  gradient: "linear-gradient(135deg, #a855f7, #6b21a8)",         label: "Purple" },
  { id: "lblue",   gradient: "linear-gradient(135deg, #60a5fa, #1d4ed8)",         label: "Light Blue" },
  { id: "orange",  gradient: "linear-gradient(135deg, #fb923c, #c2410c)",         label: "Orange" },
  { id: "dgreen",  gradient: "linear-gradient(135deg, #16a34a, #14532d)",         label: "Dark Green" },
  { id: "lgreen",  gradient: "linear-gradient(135deg, #4ade80, #166534)",         label: "Light Green" },
  { id: "yellow",  gradient: "linear-gradient(135deg, #fbbf24, #b45309)",         label: "Yellow" },
];

const TEXT_STYLES = [
  { id: "classic",   fontFamily: "Georgia, serif",           fontSize: 32, fontWeight: "400", textShadow: "none",              color: "#ffffff", textAlign: "center" },
  { id: "bold",      fontFamily: "Impact, sans-serif",        fontSize: 36, fontWeight: "900", textShadow: "none",              color: "#ffffff", textAlign: "center" },
  { id: "shadow",    fontFamily: "Arial Black, sans-serif",   fontSize: 30, fontWeight: "900", textShadow: "2px 2px 8px #000", color: "#ffffff", textAlign: "center" },
  { id: "colorful",  fontFamily: "Georgia, serif",           fontSize: 32, fontWeight: "400", textShadow: "none",              color: "#ff4500", textAlign: "center" },
  { id: "glossy",    fontFamily: "Arial, sans-serif",        fontSize: 28, fontWeight: "700", textShadow: "0 0 10px #fff",   color: "#ffffff", textAlign: "center" },
  { id: "vintage",  fontFamily: "Times New Roman, serif",   fontSize: 30, fontWeight: "400", textShadow: "1px 1px 0 #000",   color: "#ffe066", textAlign: "center" },
];

function DraggableText({ text, style, containerRef }) {
  const [pos, setPos] = useState({ x: 50, y: 50 }); // percent
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    e.preventDefault();
    dragging.current = true;
    const rect = containerRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - (pos.x / 100) * rect.width,
      y: e.clientY - (pos.y / 100) * rect.height,
    };
    startPos.current = { ...pos };
  };

  const handleMouseMove = useCallback((e) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newX = ((e.clientX - offset.current.x) / rect.width) * 100;
    const newY = ((e.clientY - offset.current.y) / rect.height) * 100;
    setPos({
      x: Math.max(0, Math.min(100, newX)),
      y: Math.max(0, Math.min(100, newY)),
    });
  }, [containerRef]);

  const handleMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  if (!text) return null;

  return (
    <div
      onMouseDown={handleMouseDown}
      className="absolute select-none cursor-grab active:cursor-grabbing"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: "translate(-50%, -50%)",
        fontFamily: style.fontFamily,
        fontSize: `${style.fontSize}px`,
        fontWeight: style.fontWeight,
        textShadow: style.textShadow,
        color: style.color,
        textAlign: style.textAlign,
        width: "90%",
        lineHeight: 1.3,
        pointerEvents: "auto",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {text}
    </div>
  );
}

export default function CreateStoryPage() {
  const navigate = useNavigate();
  const previewRef = useRef(null);
  const fileInputRef = useRef(null);

  const [mode, setMode] = useState("text"); // "text" | "media"
  const [caption, setCaption] = useState("");

  // Text mode state
  const [textValue, setTextValue] = useState("");
  const [selectedBg, setSelectedBg] = useState(TEXT_BG_OPTIONS[0]);
  const [selectedStyle, setSelectedStyle] = useState(TEXT_STYLES[0]);

  // Media mode state
  const [mediaSrc, setMediaSrc] = useState(null);
  const [mediaType, setMediaType] = useState(null); // "image" | "video"

  const handleClose = () => navigate(-1);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMediaSrc(url);
    setMediaType(file.type.startsWith("video") ? "video" : "image");
  };

  const handleRandomBg = () => {
    const others = TEXT_BG_OPTIONS.filter(b => b.id !== selectedBg.id);
    setSelectedBg(others[Math.floor(Math.random() * others.length)]);
  };

  const handleRandomStyle = () => {
    const others = TEXT_STYLES.filter(s => s.id !== selectedStyle.id);
    setSelectedStyle(others[Math.floor(Math.random() * others.length)]);
  };

  const canShare = mode === "text" ? !!textValue.trim() : !!mediaSrc;

  return (
    <div className="fixed inset-0 z-[200] flex bg-black overflow-hidden">

      {/* ── LEFT PANEL: Preview ────────────────────────────────────────── */}
      <div className="relative flex-[3] flex flex-col">

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-black/40 backdrop-blur-sm">
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2">
            {/* Text / Media mode toggle */}
            <div className="flex rounded-full bg-black/40 p-0.5">
              <button
                onClick={() => setMode("text")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  mode === "text" ? "bg-white text-black" : "text-white hover:bg-white/20"
                }`}
              >
                <Type size={14} /> Text
              </button>
              <button
                onClick={() => setMode("media")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  mode === "media" ? "bg-white text-black" : "text-white hover:bg-white/20"
                }`}
              >
                <Image size={14} /> Media
              </button>
            </div>
          </div>

          <div className="w-8" />
        </div>

        {/* Preview area */}
        <div
          ref={previewRef}
          className="relative flex-1 overflow-hidden"
        >
          {/* Text mode background */}
          {mode === "text" && (
            <div
              className="absolute inset-0"
              style={{ background: selectedBg.gradient }}
            />
          )}

          {/* Media mode background */}
          {mode === "media" && !mediaSrc && (
            <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
              <div className="text-center text-[#65676b] space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#3a3b3c] flex items-center justify-center">
                  <Image size={28} className="text-[#65676b]" />
                </div>
                <p className="text-sm">Your photo or video will appear here</p>
              </div>
            </div>
          )}

          {mode === "media" && mediaSrc && (
            <>
              {mediaType === "video" ? (
                <video
                  src={mediaSrc}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                />
              ) : (
                <img
                  src={mediaSrc}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />
              )}
            </>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

          {/* Draggable text */}
          {(mode === "text" || (mode === "media" && textValue)) && (
            <DraggableText
              text={textValue}
              style={selectedStyle}
              containerRef={previewRef}
            />
          )}
        </div>

        {/* Bottom caption input */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2.5">
            <Type size={16} className="text-white/70 flex-shrink-0" />
            <input
              type="text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Add text..."
              className="flex-1 bg-transparent text-white text-[15px] placeholder:text-white/50 outline-none"
            />
          </div>
        </div>

        {/* Tool row above bottom bar */}
        <div className="absolute bottom-16 left-0 right-0 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Text style picker */}
            <button
              onClick={handleRandomStyle}
              title="Change text style"
              className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
            >
              <Shuffle size={14} />
            </button>
            {/* Color palette */}
            <button
              onClick={handleRandomBg}
              title="Change background"
              className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
            >
              <Palette size={14} />
            </button>
            {/* Camera */}
            <button
              title="Add photo"
              onClick={() => fileInputRef.current?.click()}
              className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
            >
              <Camera size={14} />
            </button>
          </div>

          {/* Share button */}
          <button
            disabled={!canShare}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              canShare
                ? "bg-[#0866ff] hover:bg-[#0056e0] text-white"
                : "bg-white/20 text-white/40 cursor-not-allowed"
            }`}
          >
            Share Story
          </button>
        </div>
      </div>

      {/* ── RIGHT PANEL: Editor ────────────────────────────────────────── */}
      <div className="w-[320px] shrink-0 bg-white flex flex-col overflow-y-auto border-l border-[#ced0d4]">

        {/* Header */}
        <div className="px-4 py-4 border-b border-[#ced0d4]">
          <h2 className="text-lg font-bold text-[#050505]">Create story</h2>
          <p className="text-xs text-[#65676b] mt-0.5">Add a story to share with your friends</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#ced0d4]">
          <button
            onClick={() => setMode("text")}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
              mode === "text"
                ? "border-[#0866ff] text-[#0866ff]"
                : "border-transparent text-[#65676b] hover:text-[#050505]"
            }`}
          >
            Text
          </button>
          <button
            onClick={() => setMode("media")}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
              mode === "media"
                ? "border-[#0866ff] text-[#0866ff]"
                : "border-transparent text-[#65676b] hover:text-[#050505]"
            }`}
          >
            Media
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* ── TEXT TAB ─────────────────────────────────────────────── */}
          {mode === "text" && (
            <div className="p-4 space-y-6">

              {/* Background colors */}
              <div>
                <p className="text-[13px] font-semibold text-[#65676b] mb-3">Background color</p>
                <div className="grid grid-cols-4 gap-2">
                  {TEXT_BG_OPTIONS.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => setSelectedBg(bg)}
                      className={`h-14 rounded-xl transition-all ${
                        selectedBg.id === bg.id
                          ? "ring-2 ring-[#0866ff] ring-offset-1 scale-105"
                          : "hover:scale-105"
                      }`}
                      style={{ background: bg.gradient }}
                      title={bg.label}
                    />
                  ))}
                </div>
              </div>

              {/* Text styles */}
              <div>
                <p className="text-[13px] font-semibold text-[#65676b] mb-3">Text style</p>
                <div className="grid grid-cols-3 gap-2">
                  {TEXT_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
                      className={`h-12 rounded-xl border-2 text-[13px] font-semibold transition-all ${
                        selectedStyle.id === style.id
                          ? "border-[#0866ff] bg-blue-50 text-[#0866ff]"
                          : "border-[#ced0d4] text-[#050505] hover:border-[#a8a8a8]"
                      }`}
                    >
                      Aa
                    </button>
                  ))}
                </div>
              </div>

              {/* Text input */}
              <div>
                <p className="text-[13px] font-semibold text-[#65676b] mb-2">Your text</p>
                <textarea
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder="Type something..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-[#ced0d4] bg-[#f0f2f5] px-3 py-2.5 text-sm text-[#050505] placeholder:text-[#a8a8a8] outline-none focus:border-[#0866ff] focus:ring-1 focus:ring-[#0866ff] transition"
                />
              </div>

              {/* Preview hint */}
              <div className="rounded-xl bg-[#f0f2f5] p-3 text-xs text-[#65676b] leading-relaxed">
                <strong className="text-[#050505]">Tip:</strong> Drag the text on the preview to position it anywhere. The text will appear centered on your story by default.
              </div>
            </div>
          )}

          {/* ── MEDIA TAB ─────────────────────────────────────────────── */}
          {mode === "media" && (
            <div className="p-4 space-y-4">
              <p className="text-[13px] font-semibold text-[#65676b] mb-1">Choose a photo or video</p>

              {/* Upload buttons */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-[#ced0d4] hover:border-[#a8a8a8] hover:bg-[#f0f2f5] transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#e4e6eb] flex items-center justify-center">
                  <Image size={18} className="text-[#65676b]" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[#050505]">Upload from device</p>
                  <p className="text-xs text-[#65676b]">JPG, PNG, GIF, MP4</p>
                </div>
              </button>

              {mediaSrc && (
                <div className="rounded-xl overflow-hidden border border-[#ced0d4]">
                  {mediaType === "video" ? (
                    <video src={mediaSrc} className="w-full h-40 object-cover" controls />
                  ) : (
                    <img src={mediaSrc} alt="" className="w-full h-40 object-cover" />
                  )}
                  <div className="p-2 flex justify-end">
                    <button
                      onClick={() => { setMediaSrc(null); setMediaType(null); }}
                      className="text-xs text-red-500 hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* Text overlay info */}
              <div className="rounded-xl bg-[#f0f2f5] p-3 text-xs text-[#65676b] leading-relaxed">
                <strong className="text-[#050505]">Text overlay:</strong> Type text in the caption area on the left to add a draggable text box over your photo or video.
              </div>
            </div>
          )}
        </div>

        {/* User info footer */}
        <div className="px-4 py-3 border-t border-[#ced0d4] flex items-center gap-3">
          <img
            src={currentUser?.avatar || import.meta.env.VITE_DEFAULT_AVATAR}
            alt="me"
            className="w-8 h-8 rounded-full object-cover border border-[#ced0d4]"
          />
          <div>
            <p className="text-[13px] font-semibold text-[#050505]">{currentUser?.name || "You"}</p>
            <p className="text-[11px] text-[#65676b]">Sharing to your story</p>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
