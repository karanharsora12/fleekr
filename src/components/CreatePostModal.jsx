import { useState, useRef, useCallback } from "react";
import { Icon } from "@iconify/react";
import { uploadMedia, createPost } from "../services/postService";

const PRIVACY_OPTIONS = [
  { value: "public", label: "Public", icon: "mdi:earth", desc: "Anyone can see" },
  { value: "followers", label: "Followers", icon: "mdi:account-group-outline", desc: "Followers only" },
  { value: "private", label: "Private", icon: "mdi:lock-outline", desc: "Only you" },
];

export default function CreatePostModal({ onClose }) {
  const [caption, setCaption] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [mediaItems, setMediaItems] = useState([]); // [{ file, preview, media_url, media_type, uploading, error }]
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  /* ── File picked → upload immediately ── */
  const handleFiles = useCallback(async (files) => {
    const newItems = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      media_url: null,
      media_type: file.type.startsWith("video") ? "video" : "image",
      uploading: true,
      error: null,
    }));

    setMediaItems((prev) => [...prev, ...newItems]);

    // Upload each in parallel
    await Promise.all(
      newItems.map(async (item) => {
        try {
          const res = await uploadMedia(item.file);
          setMediaItems((prev) =>
            prev.map((m) =>
              m.id === item.id
                ? { ...m, media_url: res.media_url, media_type: res.media_type, uploading: false }
                : m
            )
          );
        } catch {
          setMediaItems((prev) =>
            prev.map((m) =>
              m.id === item.id ? { ...m, uploading: false, error: "Upload failed" } : m
            )
          );
        }
      })
    );
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeMedia = (id) =>
    setMediaItems((prev) => prev.filter((m) => m.id !== id));

  /* ── Submit ── */
  const handleSubmit = async () => {
    const readyMedia = mediaItems.filter((m) => m.media_url && !m.error);
    if (!caption.trim() && readyMedia.length === 0) {
      setError("Add a caption or at least one media file.");
      return;
    }
    const pendingUploads = mediaItems.some((m) => m.uploading);
    if (pendingUploads) {
      setError("Please wait for all uploads to finish.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await createPost({
        caption: caption.trim() || null,
        privacy,
        media: readyMedia.map(({ media_url, media_type }) => ({ media_url, media_type })),
      });
      setSuccess(true);
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Failed to create post. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* ── Modal card ── */}
      <div
        className="w-full max-w-lg rounded-[28px] flex flex-col overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #13111f, #0d0b1a)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(168,85,247,0.08)",
          maxHeight: "90vh",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Icon icon="mdi:pencil-outline" width={16} className="text-white" />
            </div>
            <h2 className="text-white font-bold text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>
              Create Post
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Close"
          >
            <Icon icon="mdi:close" width={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Caption */}
          <div>
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Caption
            </label>
            <textarea
              id="post-caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption…"
              rows={3}
              maxLength={2200}
              className="w-full rounded-2xl px-4 py-3 text-white text-sm placeholder-slate-500 resize-none outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(168,85,247,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
            <p className="text-right text-[11px] text-slate-600 mt-1">{caption.length}/2200</p>
          </div>

          {/* Privacy */}
          <div>
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Privacy
            </label>
            <div className="flex gap-2">
              {PRIVACY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  id={`privacy-${opt.value}`}
                  onClick={() => setPrivacy(opt.value)}
                  className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl transition-all text-center"
                  style={{
                    background:
                      privacy === opt.value
                        ? "rgba(168,85,247,0.15)"
                        : "rgba(255,255,255,0.04)",
                    border:
                      privacy === opt.value
                        ? "1px solid rgba(168,85,247,0.5)"
                        : "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <Icon
                    icon={opt.icon}
                    width={18}
                    className={privacy === opt.value ? "text-purple-400" : "text-slate-500"}
                  />
                  <span
                    className="text-[12px] font-semibold"
                    style={{ color: privacy === opt.value ? "#c084fc" : "#64748b" }}
                  >
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Media Drop Zone */}
          <div>
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Media
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-2xl flex flex-col items-center justify-center gap-2 py-8 cursor-pointer transition-all group"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1.5px dashed rgba(255,255,255,0.1)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            >
              <Icon icon="mdi:cloud-upload-outline" width={32} className="text-slate-500 group-hover:text-purple-400 transition-colors" />
              <p className="text-slate-500 text-sm group-hover:text-slate-400 transition-colors">
                Drop files here or <span className="text-purple-400 font-semibold">browse</span>
              </p>
              <p className="text-slate-600 text-xs">Images & videos supported</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {/* Media Previews */}
          {mediaItems.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {mediaItems.map((item) => (
                <div key={item.id} className="relative rounded-2xl overflow-hidden aspect-square group">
                  {item.media_type === "video" ? (
                    <video
                      src={item.preview}
                      className="w-full h-full object-cover"
                      muted
                    />
                  ) : (
                    <img
                      src={item.preview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Uploading overlay */}
                  {item.uploading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1"
                      style={{ background: "rgba(0,0,0,0.6)" }}>
                      <Icon icon="mdi:loading" width={24} className="text-purple-400 animate-spin" />
                      <span className="text-[10px] text-slate-300">Uploading…</span>
                    </div>
                  )}

                  {/* Error overlay */}
                  {item.error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1"
                      style={{ background: "rgba(239,68,68,0.3)" }}>
                      <Icon icon="mdi:alert-circle-outline" width={22} className="text-red-400" />
                      <span className="text-[10px] text-red-300">{item.error}</span>
                    </div>
                  )}

                  {/* Success tick */}
                  {!item.uploading && !item.error && item.media_url && (
                    <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <Icon icon="mdi:check" width={12} className="text-white" />
                    </div>
                  )}

                  {/* Remove */}
                  <button
                    onClick={() => removeMedia(item.id)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "rgba(0,0,0,0.7)" }}
                    aria-label="Remove media"
                  >
                    <Icon icon="mdi:close" width={14} className="text-white" />
                  </button>

                  {/* Type badge */}
                  <div className="absolute bottom-1.5 left-1.5">
                    <Icon
                      icon={item.media_type === "video" ? "mdi:play-circle-outline" : "mdi:image-outline"}
                      width={16}
                      className="text-white drop-shadow"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl text-red-400 text-sm"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <Icon icon="mdi:alert-circle-outline" width={18} />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl text-slate-400 font-semibold text-sm hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            id="submit-post-btn"
            onClick={handleSubmit}
            disabled={submitting || success}
            className="flex-1 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: success
                ? "linear-gradient(135deg, #22c55e, #16a34a)"
                : "linear-gradient(135deg, #a855f7, #6366f1)",
              boxShadow: "0 4px 24px rgba(168,85,247,0.25)",
            }}
          >
            {success ? (
              <>
                <Icon icon="mdi:check-circle-outline" width={18} className="text-white" />
                <span className="text-white">Posted!</span>
              </>
            ) : submitting ? (
              <>
                <Icon icon="mdi:loading" width={18} className="text-white animate-spin" />
                <span className="text-white">Posting…</span>
              </>
            ) : (
              <>
                <Icon icon="mdi:send-outline" width={18} className="text-white" />
                <span className="text-white">Share Post</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
