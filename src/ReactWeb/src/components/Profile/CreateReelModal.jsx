import React, { useEffect, useMemo, useRef, useState } from "react";
import { Film, LoaderCircle, Play, Square, UploadCloud, Video, Wand2, Volume2, VolumeX, X } from "lucide-react";
import { createReelApi } from "../../apis/reelApi";

const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR;

export default function CreateReelModal({ isOpen, onClose, displayUser, onSubmit }) {
  const [caption, setCaption] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [audioTitle, setAudioTitle] = useState("Original audio");
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [previewVolume, setPreviewVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [previewDuration, setPreviewDuration] = useState(0);
  const [previewCurrentTime, setPreviewCurrentTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef(null);
  const previewVideoRef = useRef(null);
  const activeObjectUrlsRef = useRef([]);

  useEffect(() => {
    if (!isOpen) {
      setCaption("");
      setVideoUrl("");
      setVideoFile(null);
      setThumbnailUrl("");
      setThumbnailFile(null);
      setAudioTitle("Original audio");
      setIsGeneratingThumbnail(false);
      setGenerationError("");
      setIsPreviewPlaying(false);
      setPreviewVolume(1);
      setIsMuted(false);
      setPreviewDuration(0);
      setPreviewCurrentTime(0);
      setIsSubmitting(false);
      setSubmitError("");
      fileInputRef.current && (fileInputRef.current.value = "");
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      activeObjectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      activeObjectUrlsRef.current = [];
    };
  }, []);

  const previewBackground = useMemo(() => {
    return thumbnailUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&auto=format&fit=crop&q=80";
  }, [thumbnailUrl]);

  if (!isOpen) return null;

  const handleBackdropClose = () => onClose();

  const handleFilePick = () => {
    fileInputRef.current?.click();
  };

  const registerObjectUrl = (url) => {
    activeObjectUrlsRef.current.push(url);
    return url;
  };

  const generateThumbnailFromVideo = (file) => new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const objectUrl = registerObjectUrl(URL.createObjectURL(file));

    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.src = objectUrl;

    const cleanup = () => {
      video.removeAttribute("src");
      video.load();
    };

    video.onloadedmetadata = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        cleanup();
        reject(new Error("Unable to read video duration."));
        return;
      }

      const targetTime = Math.min(1, Math.max(video.duration * 0.25, 0.1), Math.max(video.duration - 0.1, 0));
      video.currentTime = targetTime;
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 720;
      canvas.height = video.videoHeight || 1280;

      const context = canvas.getContext("2d");
      if (!context) {
        cleanup();
        reject(new Error("Canvas is not supported in this browser."));
        return;
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        cleanup();

        if (!blob) {
          reject(new Error("Could not export video thumbnail."));
          return;
        }

        const thumbFile = new File([blob], `${file.name.replace(/\.[^/.]+$/, "")}-thumbnail.jpg`, {
          type: "image/jpeg",
        });
        const thumbUrl = registerObjectUrl(URL.createObjectURL(blob));
        resolve({ thumbFile, thumbUrl });
      }, "image/jpeg", 0.92);
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("Video could not be loaded for thumbnail generation."));
    };
  });

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setGenerationError("");

    if (!file.type.startsWith("video/")) {
      setGenerationError("Please choose a video file for your reel.");
      return;
    }

    const nextVideoUrl = registerObjectUrl(URL.createObjectURL(file));
    setVideoUrl(nextVideoUrl);
    setVideoFile(file);
    setPreviewCurrentTime(0);
    setPreviewDuration(0);
    setIsPreviewPlaying(false);
    setIsGeneratingThumbnail(true);

    try {
      const { thumbFile, thumbUrl } = await generateThumbnailFromVideo(file);
      setThumbnailFile(thumbFile);
      setThumbnailUrl(thumbUrl);
    } catch (error) {
      setGenerationError(error.message || "Failed to generate thumbnail.");
      setThumbnailFile(null);
      setThumbnailUrl("");
    } finally {
      setIsGeneratingThumbnail(false);
    }
  };

  const handleSubmit = async () => {
    if (!videoFile) {
      setSubmitError("Please select a video before creating the reel.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await createReelApi({
        caption,
        audioTitle,
        visibility: 0,
        videoFile,
        thumbnailFile,
      });
      await onSubmit?.();
      onClose();
    } catch (err) {
      console.error("Failed to create reel:", err);
      setSubmitError(err?.response?.data?.message || err?.message || "Failed to create reel. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviewToggle = async () => {
    if (!videoUrl || !previewVideoRef.current) return;

    try {
      if (previewVideoRef.current.paused) {
        await previewVideoRef.current.play();
        setIsPreviewPlaying(true);
      } else {
        previewVideoRef.current.pause();
        setIsPreviewPlaying(false);
      }
    } catch {
      setGenerationError("Unable to play this video preview in the browser.");
    }
  };

  const handleSeek = (event) => {
    if (!previewVideoRef.current) return;

    const nextTime = Number(event.target.value);
    previewVideoRef.current.currentTime = nextTime;
    setPreviewCurrentTime(nextTime);
  };

  const handleVolumeChange = (event) => {
    if (!previewVideoRef.current) return;

    const nextVolume = Number(event.target.value);
    previewVideoRef.current.volume = nextVolume;
    previewVideoRef.current.muted = nextVolume === 0;
    setPreviewVolume(nextVolume);
    setIsMuted(nextVolume === 0);
  };

  const handleMuteToggle = () => {
    if (!previewVideoRef.current) return;

    const nextMuted = !previewVideoRef.current.muted;
    previewVideoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 p-4" onClick={handleBackdropClose}>
      <div
        className="flex h-[min(92vh,760px)] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex-1 bg-[#111827] p-6 text-white">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Preview</p>
              <h2 className="mt-1 cursor-pointer text-2xl font-bold">Create Reel</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mx-auto flex h-[calc(100%-56px)] max-w-[360px] items-center justify-center">
            <div className="group relative aspect-[9/16] w-full overflow-hidden rounded-[28px] bg-black shadow-2xl">
              {videoUrl ? (
                <video
                  ref={previewVideoRef}
                  src={videoUrl}
                  className="h-full w-full object-cover"
                  playsInline
                  preload="metadata"
                  volume={previewVolume}
                  muted={isMuted}
                  onPlay={() => setIsPreviewPlaying(true)}
                  onPause={() => setIsPreviewPlaying(false)}
                  onEnded={() => { setIsPreviewPlaying(false); setPreviewCurrentTime(0); }}
                  onTimeUpdate={() => { if (previewVideoRef.current) setPreviewCurrentTime(previewVideoRef.current.currentTime); }}
                  onLoadedMetadata={() => {
                    if (previewVideoRef.current) {
                      previewVideoRef.current.volume = previewVolume;
                      previewVideoRef.current.muted = isMuted;
                      setPreviewDuration(previewVideoRef.current.duration);
                    }
                  }}
                />
              ) : (
                <img src={previewBackground} alt="Reel preview" className="h-full w-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/80" />
              <button
                type="button"
                onClick={handlePreviewToggle}
                disabled={!videoUrl}
                className={`absolute cursor-pointer left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition ${videoUrl ? "bg-black/35 text-white hover:bg-black/50" : "cursor-not-allowed bg-black/20 text-white/60"}`}
                title={videoUrl ? (isPreviewPlaying ? "Pause preview" : "Play preview") : "Upload a video to preview playback"}
              >
                {isPreviewPlaying
                  ? <Square size={20} fill="currentColor" className="cursor-pointer" />
                  : <Play size={20} fill="currentColor" className="cursor-pointer" />
                }
              </button>
              <div className={`absolute right-4 top-4 flex cursor-pointer items-center gap-2 rounded-full bg-black/35 px-3 py-2 text-white backdrop-blur-sm transition-all duration-200 ${videoUrl ? "w-11 overflow-hidden group-hover:w-32 hover:w-32" : "w-11 overflow-hidden cursor-not-allowed"}`}>
                <button
                  type="button"
                  onClick={handleMuteToggle}
                  disabled={!videoUrl}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${videoUrl ? "hover:bg-white/10" : "cursor-not-allowed text-white/60"}`}
                  title={isMuted ? "Unmute preview" : "Mute preview"}
                >
                  {isMuted || previewVolume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : previewVolume}
                  onChange={handleVolumeChange}
                  disabled={!videoUrl}
                  className={`h-1.5 w-20 min-w-0 accent-white transition-opacity duration-200 ${videoUrl ? "cursor-pointer opacity-0 group-hover:opacity-100 hover:opacity-100" : "cursor-not-allowed opacity-0"}`}
                  title="Adjust preview volume"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">

                <div className="mb-3 flex items-center gap-2.5">
                  <img src={displayUser?.avatar || DEFAULT_AVATAR} alt={displayUser?.name || "You"} className="h-10 w-10 rounded-full border border-white/40 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-bold">{displayUser?.name || "You"}</p>
                    <p className="truncate text-[12px] text-white/75">{audioTitle} {videoUrl ? "· video ready" : "· waiting for upload"}</p>
                  </div>
                </div>
                <p className="line-clamp-3 text-[13px] font-medium leading-snug text-white/95">
                  {caption || "Please add a caption to your reel!"}
                </p>
                {videoUrl && (
                  <div className="mb-3 rounded-xl">
                    <input
                      type="range"
                      min="0"
                      max={previewDuration || 0}
                      step="0.1"
                      value={Math.min(previewCurrentTime, previewDuration || 0)}
                      onChange={handleSeek}
                      className="h-1.5 w-full cursor-pointer accent-white"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[380px] overflow-y-auto border-l border-[#e4e6eb] bg-white">
          <div className="border-b border-[#e4e6eb] px-5 py-4">
            <h3 className="text-lg font-bold text-[#050505]">Reel details</h3>
            <p className="mt-1 text-sm text-[#65676b]">Upload a video, let the browser capture a thumbnail, and send both to the backend.</p>
          </div>

          <div className="space-y-5 px-5 py-5">
            <div className="flex items-center gap-3 rounded-xl bg-[#f0f2f5] p-3">
              <img src={displayUser?.avatar || DEFAULT_AVATAR} alt={displayUser?.name || "You"} className="h-11 w-11 rounded-full object-cover" />
              <div>
                <p className="text-[14px] font-semibold text-[#050505]">{displayUser?.name || "You"}</p>
                <p className="text-[12px] text-[#65676b]">Sharing to your profile reels</p>
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#050505]">Caption</span>
              <textarea
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                rows={4}
                placeholder="Describe your reel, add hashtags, or mention the vibe..."
                className="w-full resize-none rounded-xl border border-[#d8dadf] px-3 py-2.5 text-sm text-[#050505] outline-none transition focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20"
              />
            </label>

            <div>
              <span className="mb-2 block text-sm font-semibold text-[#050505]">Video upload</span>
              <button
                type="button"
                onClick={handleFilePick}
                className="group relative flex w-full overflow-hidden rounded-2xl border border-dashed border-[#bfdbfe] bg-gradient-to-br from-[#f8fbff] via-white to-[#eef4ff] p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#60a5fa] hover:shadow-md"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_42%)] opacity-80" />
                <div className="relative flex w-full items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1877f2] text-white shadow-lg shadow-blue-500/20 transition group-hover:scale-105">
                    {isGeneratingThumbnail ? <LoaderCircle size={24} className="animate-spin" /> : <UploadCloud size={24} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#050505]">Choose reel video only</p>
                    <p className="mt-1 text-xs leading-5 text-[#65676b]">
                      Only video files are accepted. Frontend will load the video, jump to around 1 second, draw it to a canvas, and export a thumbnail image.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#e8f1ff] px-2.5 py-1 text-[11px] font-semibold text-[#1877f2]">Auto thumbnail</span>
                      <span className="rounded-full bg-[#f0fdf4] px-2.5 py-1 text-[11px] font-semibold text-[#15803d]">Frontend only</span>
                    </div>
                  </div>
                </div>
              </button>
              <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleFileChange} />

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#e4e6eb] bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#050505]">
                    <Video size={18} className="text-[#1877f2]" />
                    Uploaded video
                  </div>
                  <p className="text-xs leading-5 text-[#65676b]">
                    {videoUrl ? "Video selected and ready for upload to backend." : "No video selected yet."}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#e4e6eb] bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#050505]">
                    <Film size={18} className="text-[#7c3aed]" />
                    Generated thumbnail
                  </div>
                  <p className="text-xs leading-5 text-[#65676b]">
                    {isGeneratingThumbnail
                      ? "Generating thumbnail from the browser video frame..."
                      : thumbnailFile
                        ? `Thumbnail ready: ${thumbnailFile.name}`
                        : "Thumbnail will be created automatically after video selection."}
                  </p>
                </div>
              </div>

              {generationError && (
                <p className="mt-3 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-xs font-medium text-[#b91c1c]">
                  {generationError}
                </p>
              )}
          {submitError && (
                <p className="mt-3 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-xs font-medium text-[#b91c1c]">
                  {submitError}
                </p>
              )}
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#050505]">Audio label</span>
              <div className="relative overflow-hidden rounded-2xl border border-[#d8dadf] bg-white shadow-sm transition focus-within:border-[#1877f2] focus-within:ring-2 focus-within:ring-[#1877f2]/20">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#1877f2]">
                  <Wand2 size={18} />
                </div>
                <input
                  value={audioTitle}
                  onChange={(event) => setAudioTitle(event.target.value)}
                  className="w-full bg-transparent py-3 pl-10 pr-3 text-sm text-[#050505] outline-none"
                  placeholder="Original audio"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#050505]">
                <Film size={16} className="text-[#7c3aed]" />
                Thumbnail preview
              </span>
              {thumbnailUrl ? (
                <div className="relative overflow-hidden rounded-2xl border border-[#e4e6eb] bg-white shadow-sm transition hover:border-[#60a5fa]">
                  <img src={thumbnailUrl} alt="Generated thumbnail" className="aspect-[9/16] w-full object-cover" />
                  <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                    Auto-generated from video
                  </div>
                </div>
              ) : (
                <div className="flex aspect-[9/16] w-full items-center justify-center rounded-2xl border border-dashed border-[#e4e6eb] bg-[#fafafa] text-center">
                  <div>
                    <Film size={32} className="mx-auto mb-2 text-[#d1d5db]" />
                    <p className="text-xs font-semibold text-[#9ca3af]">Thumbnail appears here</p>
                    <p className="mt-1 text-[11px] text-[#d1d5db]">after video selection</p>
                  </div>
                </div>
              )}
            </label>
          </div>

          <div className="sticky bottom-0 border-t border-[#e4e6eb] bg-white px-5 py-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl bg-[#e4e6eb] px-4 py-2.5 text-sm font-semibold text-[#050505] transition hover:bg-[#d8dadf]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !videoFile}
                className="flex-1 rounded-xl bg-[#1877f2] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating..." : "Create reel"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
