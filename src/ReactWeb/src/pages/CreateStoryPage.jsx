import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  X, Camera, Image, Type, Palette, Shuffle, Sparkles, LayoutPanelLeft, Play, Loader2
} from "lucide-react";
import { useAuth } from "../contexts/authContext";
import { useStories } from "../contexts/StoriesContext";
import { uploadStoryMediaApi } from "../apis/storyApi";

const TEXT_BG_OPTIONS = [
  { id: "pink", gradient: "linear-gradient(135deg, #ff6b9d, #c44ea0)", label: "Pink" },
  { id: "purple", gradient: "linear-gradient(135deg, #a855f7, #6b21a8)", label: "Purple" },
  { id: "lblue", gradient: "linear-gradient(135deg, #60a5fa, #1d4ed8)", label: "Light Blue" },
  { id: "orange", gradient: "linear-gradient(135deg, #fb923c, #c2410c)", label: "Orange" },
  { id: "dgreen", gradient: "linear-gradient(135deg, #16a34a, #14532d)", label: "Dark Green" },
  { id: "lgreen", gradient: "linear-gradient(135deg, #4ade80, #166534)", label: "Light Green" },
  { id: "yellow", gradient: "linear-gradient(135deg, #fbbf24, #b45309)", label: "Yellow" },
];

const TEXT_STYLES = [
  { id: "classic", fontFamily: "Georgia, serif", fontSize: 32, fontWeight: "400", textShadow: "none", color: "#ffffff", textAlign: "center" },
  { id: "bold", fontFamily: "Impact, sans-serif", fontSize: 36, fontWeight: "900", textShadow: "none", color: "#ffffff", textAlign: "center" },
  { id: "shadow", fontFamily: "Arial Black, sans-serif", fontSize: 30, fontWeight: "900", textShadow: "2px 2px 8px #000", color: "#ffffff", textAlign: "center" },
  { id: "colorful", fontFamily: "Georgia, serif", fontSize: 32, fontWeight: "400", textShadow: "none", color: "#ffdf5d", textAlign: "center" },
  { id: "glossy", fontFamily: "Arial, sans-serif", fontSize: 28, fontWeight: "700", textShadow: "0 0 10px #fff", color: "#ffffff", textAlign: "center" },
  { id: "vintage", fontFamily: "Times New Roman, serif", fontSize: 30, fontWeight: "400", textShadow: "1px 1px 0 #000", color: "#ffe066", textAlign: "center" },
];

const TEXT_COLOR_OPTIONS = [
  "#ffffff",
  "#000000",
  "#ffdf5d",
  "#ff6b6b",
  "#60a5fa",
  "#4ade80",
  "#f472b6",
  "#c084fc",
];

function DraggableText({ text, style, containerRef, onPositionChange }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const updatePosition = useCallback((nextPos) => {
    setPos(nextPos);
    onPositionChange?.(nextPos);
  }, [onPositionChange]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    if (!containerRef.current) return;
    dragging.current = true;
    const rect = containerRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - (pos.x / 100) * rect.width,
      y: e.clientY - (pos.y / 100) * rect.height,
    };
  };

  const handleMouseMove = useCallback((e) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newX = ((e.clientX - offset.current.x) / rect.width) * 100;
    const newY = ((e.clientY - offset.current.y) / rect.height) * 100;
    updatePosition({
      x: Math.max(8, Math.min(92, newX)),
      y: Math.max(10, Math.min(90, newY)),
    });
  }, [containerRef, updatePosition]);

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
        fontSize: `calc(${style.fontSize} * 1cqw / 4.3)`,
        fontWeight: style.fontWeight,
        textShadow: style.textShadow,
        color: style.color,
        textAlign: style.textAlign,
        width: "84%",
        lineHeight: 1.25,
        pointerEvents: "auto",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {text}
    </div>
  );
}

function ToolChip({ icon, label, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${
        active
          ? "border-[#0866ff] bg-[#e7f3ff] text-[#0866ff]"
          : "border-[#d8dbe1] bg-white text-[#1c1e21] hover:border-[#0866ff]/40 hover:bg-[#f7faff]"
      }`}
    >
      {React.createElement(icon, { size: 15 })}
      {label}
    </button>
  );
}

function buildUserDisplayName(user) {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  return fullName || user?.name || "You";
}

export default function CreateStoryPage() {
  const navigate = useNavigate();
  const previewRef = useRef(null);
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null);
  const { user } = useAuth();
  const {
    createStory,
    isCreatingStory,
    createStoryError,
    clearCreateStoryError,
  } = useStories();

  const [mode, setMode] = useState("text");
  const [textValue, setTextValue] = useState("");
  const [selectedBg, setSelectedBg] = useState(TEXT_BG_OPTIONS[0]);
  const [selectedStyle, setSelectedStyle] = useState(TEXT_STYLES[0]);
  const [textColor, setTextColor] = useState(TEXT_STYLES[0].color);
  const [mediaSrc, setMediaSrc] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
  const [selectedFile, setSelectedFile] = useState(null);
  const selectedFileRef = useRef(null);

  const displayUser = useMemo(() => ({
    avatar: user?.avatarUrl || user?.avatar || import.meta.env.VITE_DEFAULT_AVATAR,
    name: buildUserDisplayName(user),
    id: user?.id,
  }), [user]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const resetMediaModeState = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setMediaSrc(null);
    setMediaType(null);
    setTextPosition({ x: 50, y: 50 });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    selectedFileRef.current = null;
    setSelectedFile(null);
  }, []);

  const switchMode = useCallback((nextMode) => {
    if (nextMode === mode) return;

    clearCreateStoryError();

    if (nextMode === "media") {
      setTextValue("");
      setTextPosition({ x: 50, y: 50 });
    } else {
      resetMediaModeState();
      setTextValue("");
      setSelectedBg(TEXT_BG_OPTIONS[0]);
      setSelectedStyle(TEXT_STYLES[0]);
      setTextColor(TEXT_STYLES[0].color);
      setTextPosition({ x: 50, y: 50 });
    }

    setMode(nextMode);
  }, [clearCreateStoryError, mode, resetMediaModeState]);

  const handleClose = () => navigate(-1);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    clearCreateStoryError();

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setMediaSrc(url);
    setMediaType(file.type.startsWith("video") ? "video" : "image");
    selectedFileRef.current = file;
    setSelectedFile(file);
    setMode("media");
  };

  const handleRandomBg = () => {
    const others = TEXT_BG_OPTIONS.filter((bg) => bg.id !== selectedBg.id);
    setSelectedBg(others[Math.floor(Math.random() * others.length)]);
  };

  const handleRandomStyle = () => {
    const others = TEXT_STYLES.filter((style) => style.id !== selectedStyle.id);
    const nextStyle = others[Math.floor(Math.random() * others.length)];
    setSelectedStyle(nextStyle);
    setTextColor(nextStyle.color);
  };

  const canShare = mode === "text" ? !!textValue.trim() : !!selectedFile;

  const handleShareStory = async () => {
    if (!canShare || isCreatingStory) return;

    clearCreateStoryError();

    try {
      let mediaUrl = null;
      let mediaTypeValue = 0;

      if (mode === "media" && selectedFile) {
        const uploadResult = await uploadStoryMediaApi(selectedFile);
        mediaUrl = uploadResult.url;
        mediaTypeValue = 1;
      }

      const payload = {
        mediaUrl,
        mediaType: mediaTypeValue,
        backgroundGradient: mode === "text" ? selectedBg.gradient : null,
        textContent: textValue.trim() || null,
        textColor,
        textStyle: selectedStyle.id,
        textPositionX: textPosition.x.toFixed(2),
        textPositionY: textPosition.y.toFixed(2),
        fontFamily: selectedStyle.fontFamily,
      };

      const result = await createStory(payload);

      if (result.success) {
        navigate(-1);
      }
    } catch (err) {
      console.error("Failed to share story:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden bg-[#f0f2f5]">
      <div className="flex h-full w-full flex-col lg:flex-row">
        <aside className="order-2 lg:order-1 flex w-full flex-1 min-h-0 lg:flex-none lg:w-[380px] lg:shrink-0 flex-col overflow-hidden bg-white lg:h-full lg:border-r border-t lg:border-t-0 border-[#d9dde3]">
          <div className="flex h-full min-h-0 w-full flex-col">
            <div className="border-b border-[#eef0f3] px-4 py-3 sm:px-5 sm:py-4 shrink-0">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#f0f2f5] text-[#1c1e21] transition hover:bg-[#e4e6eb] sm:h-10 sm:w-10"
                >
                  <X size={16} className="sm:!h-[18px] sm:!w-[18px]" />
                </button>
                <div className="flex-1">
                  <h1 className="text-base font-bold text-[#050505] sm:text-lg">Create story</h1>
                  <p className="mt-0.5 text-[11px] text-[#65676b] sm:text-xs">Design a clean text or media story before sharing.</p>
                </div>
              </div>
            </div>

            <div className="border-b border-[#eef0f3] px-4 py-3 sm:px-5 sm:py-4 shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={displayUser.avatar}
                  alt="me"
                  className="h-11 w-11 rounded-full object-cover ring-1 ring-black/10"
                />
                <div>
                  <p className="text-sm font-semibold text-[#050505]">{displayUser.name}</p>
                  <p className="text-xs text-[#65676b]">Sharing to your story</p>
                </div>
              </div>
            </div>

            <div className="border-b border-[#eef0f3] px-4 py-4 sm:px-5 shrink-0">
              <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                <ToolChip icon={Type} label="Text" active={mode === "text"} onClick={() => switchMode("text")} />
                <ToolChip icon={Image} label="Media" active={mode === "media"} onClick={() => switchMode("media")} />
              </div>
              <p className="mt-3 text-xs leading-5 text-[#65676b]">
                Switching to text mode removes uploaded media. In media mode, you can now add text on top of the image or video.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
              {createStoryError && (
                <div className="mb-4 rounded-2xl border border-[#f5c2c7] bg-[#fff1f2] px-4 py-3 text-sm text-[#b42318]">
                  {createStoryError}
                </div>
              )}

              {mode === "text" && (
                <div className="space-y-5 sm:space-y-6">
                  <div className="rounded-2xl border border-[#e4e6eb] bg-[#f8fafc] p-3 sm:p-4">
                    <div className="mb-3 flex items-center gap-2 text-[#050505]">
                      <Sparkles size={16} className="text-[#0866ff]" />
                      <p className="text-sm font-semibold">Text story tools</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <ToolChip icon={Shuffle} label="Shuffle style" onClick={handleRandomStyle} />
                      <ToolChip icon={Palette} label="Shuffle bg" onClick={handleRandomBg} />
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-[13px] font-semibold text-[#65676b]">Write your message</p>
                    <textarea
                      value={textValue}
                      onChange={(e) => setTextValue(e.target.value)}
                      placeholder="Type something memorable..."
                      rows={4}
                      className="w-full resize-none rounded-2xl border border-[#d8dbe1] bg-[#f7f8fa] px-4 py-3 text-sm text-[#050505] outline-none transition focus:border-[#0866ff] focus:bg-white"
                    />
                  </div>

                  <div>
                    <p className="mb-3 text-[13px] font-semibold text-[#65676b]">Background</p>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-4 sm:gap-3">
                      {TEXT_BG_OPTIONS.map((bg) => (
                        <button
                          key={bg.id}
                          type="button"
                          onClick={() => setSelectedBg(bg)}
                          className={`aspect-square h-auto w-full cursor-pointer rounded-2xl transition ${
                            selectedBg.id === bg.id
                              ? "scale-[1.04] ring-2 ring-[#0866ff] ring-offset-2"
                              : "hover:scale-[1.03]"
                          }`}
                          style={{ background: bg.gradient }}
                          title={bg.label}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-[13px] font-semibold text-[#65676b]">Text style</p>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {TEXT_STYLES.map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => {
                            setSelectedStyle(style);
                            setTextColor(style.color);
                          }}
                          className={`flex h-12 cursor-pointer items-center justify-center rounded-2xl border text-[14px] font-semibold transition sm:h-14 ${
                            selectedStyle.id === style.id
                              ? "border-[#0866ff] bg-[#e7f3ff] text-[#0866ff]"
                              : "border-[#d8dbe1] bg-white text-[#1c1e21] hover:border-[#b8bdc7]"
                          }`}
                          style={{ fontFamily: style.fontFamily }}
                        >
                          Aa
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-[13px] font-semibold text-[#65676b]">Text color</p>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {TEXT_COLOR_OPTIONS.map((color) => {
                        const isActive = textColor === color;
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setTextColor(color)}
                            className={`h-9 w-9 rounded-full border-2 transition sm:h-10 sm:w-10 ${
                              isActive
                                ? "scale-110 border-[#0866ff] ring-2 ring-[#dbeafe]"
                                : "border-white/80 hover:scale-105"
                            } ${color === "#ffffff" ? "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]" : ""}`}
                            style={{ backgroundColor: color }}
                            aria-label={`Choose text color ${color}`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#f0f2f5] p-3 text-xs leading-5 text-[#65676b] sm:p-4">
                    Drag the text directly on the preview to position it where you want.
                  </div>
                </div>
              )}

              {mode === "media" && (
                <div className="space-y-5 sm:space-y-6">
                  <div className="rounded-2xl border border-[#e4e6eb] bg-[#f8fafc] p-3 sm:p-4">
                    <div className="mb-3 flex items-center gap-2 text-[#050505]">
                      <LayoutPanelLeft size={16} className="text-[#0866ff]" />
                      <p className="text-sm font-semibold">Media story tools</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-[#cfd4dc] bg-white px-3 py-3 text-left transition hover:border-[#0866ff] hover:bg-[#f8fbff] sm:px-4 sm:py-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e7f3ff] text-[#0866ff] sm:h-11 sm:w-11">
                        <Camera size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#050505]">Upload photo or video</p>
                        <p className="text-xs text-[#65676b]">JPG, PNG, GIF, MP4</p>
                      </div>
                    </button>
                  </div>

                  {mediaSrc ? (
                    <div className="overflow-hidden rounded-2xl border border-[#d8dbe1] bg-white">
                      {mediaType === "video" ? (
                        <video src={mediaSrc} className="h-40 w-full object-cover sm:h-52" controls />
                      ) : (
                        <img src={mediaSrc} alt="Selected media" className="h-40 w-full object-cover sm:h-52" />
                      )}
                      <div className="flex items-center justify-between px-3 py-3 sm:px-4 sm:py-3">
                        <div>
                          <p className="text-sm font-semibold text-[#050505]">Media selected</p>
                          <p className="text-xs text-[#65676b]">Add overlay text below and drag it on the preview.</p>
                        </div>
                        <button
                          type="button"
                          onClick={resetMediaModeState}
                          className="text-sm font-semibold text-[#d93025] transition hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-[#f0f2f5] p-4 text-center text-sm text-[#65676b]">
                      Your uploaded media preview will appear here.
                    </div>
                  )}

                  <div>
                    <p className="mb-3 text-[13px] font-semibold text-[#65676b]">Overlay text</p>
                    <textarea
                      value={textValue}
                      onChange={(e) => setTextValue(e.target.value)}
                      placeholder="Add text on top of your photo or video..."
                      rows={3}
                      className="w-full resize-none rounded-2xl border border-[#d8dbe1] bg-[#f7f8fa] px-4 py-3 text-sm text-[#050505] outline-none transition focus:border-[#0866ff] focus:bg-white"
                    />
                  </div>

                  <div>
                    <p className="mb-3 text-[13px] font-semibold text-[#65676b]">Overlay style</p>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {TEXT_STYLES.map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => {
                            setSelectedStyle(style);
                            setTextColor(style.color);
                          }}
                          className={`flex h-12 cursor-pointer items-center justify-center rounded-2xl border text-[14px] font-semibold transition sm:h-14 ${
                            selectedStyle.id === style.id
                              ? "border-[#0866ff] bg-[#e7f3ff] text-[#0866ff]"
                              : "border-[#d8dbe1] bg-white text-[#1c1e21] hover:border-[#b8bdc7]"
                          }`}
                          style={{ fontFamily: style.fontFamily }}
                        >
                          Aa
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-[13px] font-semibold text-[#65676b]">Overlay color</p>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {TEXT_COLOR_OPTIONS.map((color) => {
                        const isActive = textColor === color;
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setTextColor(color)}
                            className={`h-9 w-9 rounded-full border-2 transition sm:h-10 sm:w-10 ${
                              isActive
                                ? "scale-110 border-[#0866ff] ring-2 ring-[#dbeafe]"
                                : "border-white/80 hover:scale-105"
                            } ${color === "#ffffff" ? "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]" : ""}`}
                            style={{ backgroundColor: color }}
                            aria-label={`Choose overlay color ${color}`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#f0f2f5] p-3 text-xs leading-5 text-[#65676b] sm:p-4">
                    Media stays in media mode, and now you can add draggable text over it. Switching to text mode will still remove the media.
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-[#eef0f3] px-4 py-3 sm:px-5 sm:py-4 shrink-0">
              <button
                type="button"
                onClick={handleShareStory}
                disabled={!canShare || isCreatingStory}
                aria-busy={isCreatingStory}
                aria-label={isCreatingStory ? "Sharing your story" : "Share story"}
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                  canShare && !isCreatingStory
                    ? "cursor-pointer bg-[#0866ff] text-white hover:bg-[#0757d8] active:scale-[0.99]"
                    : isCreatingStory
                      ? "cursor-wait bg-[#0866ff]/85 text-white"
                      : "cursor-not-allowed bg-[#e4e6eb] text-[#bcc0c4]"
                }`}
              >
                {isCreatingStory ? (
                  <>
                    <Loader2 size={16} className="animate-spin shrink-0" aria-hidden="true" />
                    <span>Sharing…</span>
                  </>
                ) : (
                  <span>Share story</span>
                )}
              </button>
            </div>
          </div>
        </aside>

        <main className="order-1 lg:order-2 flex min-h-0 shrink-0 h-[38vh] sm:h-[45vh] lg:h-full lg:flex-1 items-center justify-center bg-[radial-gradient(circle_at_top,_#1d2433,_#0f1115_60%)] p-3 sm:p-6 lg:p-8">
          <div className="flex h-full w-full max-w-[820px] flex-col justify-center">
            <div className="hidden lg:flex mb-3 shrink-0 items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55 sm:text-sm">Preview</p>
                <h2 className="mt-1 text-lg font-bold text-white sm:text-2xl lg:text-2xl">Your story canvas</h2>
              </div>
              <div className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/75 backdrop-blur-sm sm:text-xs">
                {mode === "text" ? "Text story" : mediaType === "video" ? "Video story" : "Photo story"}
              </div>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center rounded-[20px] border border-white/10 bg-white/5 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:rounded-[32px] sm:p-3 lg:shadow-[0_30px_80px_rgba(0,0,0,0.45)] h-full">
              <div
                ref={previewRef}
                className="relative aspect-[9/16] h-full max-h-full w-auto overflow-hidden rounded-[18px] bg-[#1c1e21] sm:rounded-[28px]"
                style={{ maxWidth: "100%", containerType: "inline-size" }}
              >
                {mode === "text" && (
                  <div className="absolute inset-0" style={{ background: selectedBg.gradient }} />
                )}

                {mode === "media" && !mediaSrc && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]">
                    <div className="space-y-[3.5cqw] p-[4cqw] text-center text-[#b0b3b8]">
                      <div className="mx-auto flex h-[15cqw] w-[15cqw] items-center justify-center rounded-full bg-white/10">
                        <Play className="w-[6.5cqw] h-[6.5cqw]" />
                      </div>
                      <p className="text-[3.2cqw]">Choose a photo or video to start your story</p>
                    </div>
                  </div>
                )}

                {mode === "media" && mediaSrc && (
                  mediaType === "video" ? (
                    <video
                      src={mediaSrc}
                      className="absolute inset-0 h-full w-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={mediaSrc}
                      alt="Story preview"
                      className="absolute inset-0 h-full w-full object-cover"
                      draggable={false}
                    />
                  )
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />

                <div className="absolute left-[5cqw] right-[5cqw] top-[5cqw] flex items-center justify-between text-white/90">
                  <div className="flex items-center gap-[2.8cqw]">
                    <img
                      src={displayUser.avatar}
                      alt="me"
                      className="h-[9.3cqw] w-[9.3cqw] rounded-full border border-white/30 object-cover"
                    />
                    <div>
                      <p className="text-[3.25cqw] font-semibold text-white leading-none">{displayUser.name}</p>
                      <p className="mt-[0.5cqw] text-[2.8cqw] text-white/70 leading-none">Just now</p>
                    </div>
                  </div>
                </div>

                {textValue && (
                  <DraggableText
                    text={textValue}
                    style={{ ...selectedStyle, color: textColor }}
                    containerRef={previewRef}
                    onPositionChange={setTextPosition}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

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
