import React, { useEffect, useState } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

// Fullscreen image viewer used by the profile page (cover + avatar) and any
// other surface that wants a "click to expand" experience.
//
// Usage:
//   const [src, setSrc] = useState(null);
//   <ImageLightbox src={src} alt="..." onClose={() => setSrc(null)} />
//
// Pass `src={null}` (or omit it) to hide. ESC, backdrop click, or the X button
// all close. Mouse-wheel zooms; the reset button restores 1×.
export default function ImageLightbox({ src, alt = "", onClose }) {
  const [scale, setScale] = useState(1);
  const open = !!src;

  useEffect(() => {
    if (!open) return;
    setScale(1);
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const zoomIn = () => setScale((s) => Math.min(4, +(s + 0.25).toFixed(2)));
  const zoomOut = () => setScale((s) => Math.max(1, +(s - 0.25).toFixed(2)));
  const reset = () => setScale(1);

  const onWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Image viewer"}
      className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
      onWheel={onWheel}
    >
      {/* Toolbar */}
      <div
        className="absolute top-4 right-4 flex items-center gap-2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={zoomOut}
          disabled={scale <= 1}
          aria-label="Zoom out"
          className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ZoomOut size={18} />
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={scale === 1}
          aria-label="Reset zoom"
          className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCcw size={18} />
        </button>
        <button
          type="button"
          onClick={zoomIn}
          disabled={scale >= 4}
          aria-label="Zoom in"
          className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ZoomIn size={18} />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition"
        >
          <X size={18} />
        </button>
      </div>

      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-w-[95vw] max-h-[90vh] object-contain rounded-md shadow-2xl select-none transition-transform duration-150"
        style={{ transform: `scale(${scale})`, cursor: scale > 1 ? "zoom-out" : "zoom-in" }}
        draggable={false}
      />
    </div>
  );
}