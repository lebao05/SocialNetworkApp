import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  X, Camera, Image, Type, Palette, Shuffle, Sparkles, LayoutPanelLeft, Play
} from "lucide-react";
import { currentUser } from "../data/mockData";

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

function DraggableText({ text, style, containerRef }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

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
    setPos({
      x: Math.max(8, Math.min(92, newX)),
      y: Math.max(10, Math.min(90, newY)),
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

function ToolChip({ icon: Icon, label, active = false, onClick }) {
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
      <Icon size={15} />
      {label}
    </button>
  );
}

export default function CreateStoryPage() {
  const navigate = useNavigate();
  const previewRef = useRef(null);
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null);

  const [mode, setMode] = useState("text");
  const [textValue, setTextValue] = useState("");
  const [selectedBg, setSelectedBg] = useState(TEXT_BG_OPTIONS[0]);
  const [selectedStyle, setSelectedStyle] = useState(TEXT_STYLES[0]);
  const [textColor, setTextColor] = useState(TEXT_STYLES[0].color);
  const [mediaSrc, setMediaSrc] = useState(null);
  const [mediaType, setMediaType] = useState(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const resetTextModeState = useCallback(() => {
    setTextValue("");
    setSelectedBg(TEXT_BG_OPTIONS[0]);
    setSelectedStyle(TEXT_STYLES[0]);
    setTextColor(TEXT_STYLES[0].color);
  }, []);

  const resetMediaModeState = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setMediaSrc(null);
    setMediaType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const switchMode = useCallback((nextMode) => {
    if (nextMode === mode) return;

    if (nextMode === "media") {
      setTextValue("");
    } else {
      resetMediaModeState();
      setTextValue("");
      setSelectedBg(TEXT_BG_OPTIONS[0]);
      setSelectedStyle(TEXT_STYLES[0]);
    }

    setMode(nextMode);
  }, [mode, resetMediaModeState]);

  const handleClose = () => navigate(-1);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setMediaSrc(url);
    setMediaType(file.type.startsWith("video") ? "video" : "image");
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

  const canShare = mode === "text" ? !!textValue.trim() : !!mediaSrc;

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden bg-[#f0f2f5]">
      <div className="flex h-full w-full flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-[#d9dde3] bg-white lg:h-full lg:w-[380px] lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col">
            <div className="border-b border-[#eef0f3] px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#f0f2f5] text-[#1c1e21] transition hover:bg-[#e4e6eb]"
                >
                  <X size={18} />
                </button>
                <div className="flex-1">
                  <h1 className="text-lg font-bold text-[#050505]">Create story</h1>
                  <p className="mt-0.5 text-xs text-[#65676b]">Design a clean text or media story before sharing.</p>
                </div>
              </div>
            </div>

            <div className="border-b border-[#eef0f3] px-5 py-4">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser?.avatar || import.meta.env.VITE_DEFAULT_AVATAR}
                  alt="me"
                  className="h-11 w-11 rounded-full object-cover ring-1 ring-black/10"
                />
                <div>
                  <p className="text-sm font-semibold text-[#050505]">{currentUser?.name || "You"}</p>
                  <p className="text-xs text-[#65676b]">Sharing to your story</p>
                </div>
              </div>
            </div>

            <div className="border-b border-[#eef0f3] px-5 py-4">
              <div className="flex flex-wrap gap-2">
                <ToolChip icon={Type} label="Text mode" active={mode === "text"} onClick={() => switchMode("text")} />
                <ToolChip icon={Image} label="Media mode" active={mode === "media"} onClick={() => switchMode("media")} />
              </div>
              <p className="mt-3 text-xs leading-5 text-[#65676b]">
                Switching to text mode removes uploaded media. In media mode, you can now add text on top of the image or video.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {mode === "text" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-[#e4e6eb] bg-[#f8fafc] p-4">
                    <div className="mb-3 flex items-center gap-2 text-[#050505]">
                      <Sparkles size={16} className="text-[#0866ff]" />
                      <p className="text-sm font-semibold">Text story tools</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <ToolChip icon={Shuffle} label="Shuffle style" onClick={handleRandomStyle} />
                      <ToolChip icon={Palette} label="Shuffle background" onClick={handleRandomBg} />
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-[13px] font-semibold text-[#65676b]">Write your message</p>
                    <textarea
                      value={textValue}
                      onChange={(e) => setTextValue(e.target.value)}
                      placeholder="Type something memorable..."
                      rows={5}
                      className="w-full resize-none rounded-2xl border border-[#d8dbe1] bg-[#f7f8fa] px-4 py-3 text-sm text-[#050505] outline-none transition focus:border-[#0866ff] focus:bg-white"
                    />
                  </div>

                  <div>
                    <p className="mb-3 text-[13px] font-semibold text-[#65676b]">Background</p>
                    <div className="grid grid-cols-4 gap-3">
                      {TEXT_BG_OPTIONS.map((bg) => (
                        <button
                          key={bg.id}
                          type="button"
                          onClick={() => setSelectedBg(bg)}
                          className={`h-16 cursor-pointer rounded-2xl transition ${
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
                    <div className="grid grid-cols-3 gap-3">
                      {TEXT_STYLES.map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => {
                            setSelectedStyle(style);
                            setTextColor(style.color);
                          }}
                          className={`flex h-14 cursor-pointer items-center justify-center rounded-2xl border text-[14px] font-semibold transition ${
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
                    <div className="flex flex-wrap gap-3">
                      {TEXT_COLOR_OPTIONS.map((color) => {
                        const isActive = textColor === color;
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setTextColor(color)}
                            className={`h-10 w-10 rounded-full border-2 transition ${
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

                  <div className="rounded-2xl bg-[#f0f2f5] p-4 text-xs leading-5 text-[#65676b]">
                    Drag the text directly on the preview to position it where you want.
                  </div>
                </div>
              )}

              {mode === "media" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-[#e4e6eb] bg-[#f8fafc] p-4">
                    <div className="mb-3 flex items-center gap-2 text-[#050505]">
                      <LayoutPanelLeft size={16} className="text-[#0866ff]" />
                      <p className="text-sm font-semibold">Media story tools</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-[#cfd4dc] bg-white px-4 py-4 text-left transition hover:border-[#0866ff] hover:bg-[#f8fbff]"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e7f3ff] text-[#0866ff]">
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
                        <video src={mediaSrc} className="h-52 w-full object-cover" controls />
                      ) : (
                        <img src={mediaSrc} alt="Selected media" className="h-52 w-full object-cover" />
                      )}
                      <div className="flex items-center justify-between px-4 py-3">
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
                    <div className="rounded-2xl bg-[#f0f2f5] p-5 text-center text-sm text-[#65676b]">
                      Your uploaded media preview will appear here.
                    </div>
                  )}

                  <div>
                    <p className="mb-3 text-[13px] font-semibold text-[#65676b]">Overlay text</p>
                    <textarea
                      value={textValue}
                      onChange={(e) => setTextValue(e.target.value)}
                      placeholder="Add text on top of your photo or video..."
                      rows={4}
                      className="w-full resize-none rounded-2xl border border-[#d8dbe1] bg-[#f7f8fa] px-4 py-3 text-sm text-[#050505] outline-none transition focus:border-[#0866ff] focus:bg-white"
                    />
                  </div>

                  <div>
                    <p className="mb-3 text-[13px] font-semibold text-[#65676b]">Overlay style</p>
                    <div className="grid grid-cols-3 gap-3">
                      {TEXT_STYLES.map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => {
                            setSelectedStyle(style);
                            setTextColor(style.color);
                          }}
                          className={`flex h-14 cursor-pointer items-center justify-center rounded-2xl border text-[14px] font-semibold transition ${
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
                    <div className="flex flex-wrap gap-3">
                      {TEXT_COLOR_OPTIONS.map((color) => {
                        const isActive = textColor === color;
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setTextColor(color)}
                            className={`h-10 w-10 rounded-full border-2 transition ${
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

                  <div className="rounded-2xl bg-[#f0f2f5] p-4 text-xs leading-5 text-[#65676b]">
                    Media stays in media mode, and now you can add draggable text over it. Switching to text mode will still remove the media.
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-[#eef0f3] px-5 py-4">
              <button
                type="button"
                disabled={!canShare}
                className={`w-full rounded-xl px-4 py-3 text-sm font-bold transition ${
                  canShare
                    ? "cursor-pointer bg-[#0866ff] text-white hover:bg-[#0757d8]"
                    : "cursor-not-allowed bg-[#e4e6eb] text-[#bcc0c4]"
                }`}
              >
                Share story
              </button>
            </div>
          </div>
        </aside>

        <main className="flex min-h-0 flex-1 items-center justify-center bg-[radial-gradient(circle_at_top,_#1d2433,_#0f1115_60%)] p-4 sm:p-6 lg:p-10">
          <div className="w-full max-w-[820px]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/55">Preview</p>
                <h2 className="mt-1 text-2xl font-bold text-white">Your story canvas</h2>
              </div>
              <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/75 backdrop-blur-sm">
                {mode === "text" ? "Text story" : mediaType === "video" ? "Video story" : "Photo story"}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-3 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
              <div
                ref={previewRef}
                className="relative mx-auto aspect-[9/16] w-full max-w-[430px] overflow-hidden rounded-[28px] bg-[#1c1e21]"
              >
                {mode === "text" && (
                  <div className="absolute inset-0" style={{ background: selectedBg.gradient }} />
                )}

                {mode === "media" && !mediaSrc && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]">
                    <div className="space-y-3 text-center text-[#b0b3b8]">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                        <Play size={28} />
                      </div>
                      <p className="text-sm">Choose a photo or video to start your story</p>
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

                <div className="absolute left-5 right-5 top-5 flex items-center justify-between text-white/90">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser?.avatar || import.meta.env.VITE_DEFAULT_AVATAR}
                      alt="me"
                      className="h-10 w-10 rounded-full border border-white/30 object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">{currentUser?.name || "You"}</p>
                      <p className="text-xs text-white/70">Just now</p>
                    </div>
                  </div>
                </div>

                {textValue && (
                  <DraggableText
                    text={textValue}
                    style={{ ...selectedStyle, color: textColor }}
                    containerRef={previewRef}
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
