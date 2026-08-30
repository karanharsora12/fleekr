import { useEffect, useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import { mediaUrl } from "../utils/helper";

/* ── Relative Time ── */
const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w`;
};

/* ── Mock Comments ── */
const MOCK_COMMENTS = [
  { id: 1, user: "Luna Patel", initials: "LP", text: "This is absolutely stunning! The colors are perfect.", time: "1h" },
  { id: 2, user: "Kai Nakamura", initials: "KN", text: "Love the composition here. Great work!", time: "45m" },
  { id: 3, user: "Sophie Laurent", initials: "SL", text: "Wow, this is incredible!", time: "30m" },
  { id: 4, user: "Design Team", initials: "DT", text: "Featured on our weekly roundup!", time: "15m" },
  { id: 5, user: "Alex Morgan", initials: "AM", text: "Can you share the camera settings?", time: "5m" },
];

/* ═══════════════════════════════════════
   Post Detail Modal (Instagram-style)
   Props: { post, onClose }
═══════════════════════════════════════ */
export default function PostDetailModal({ post, onClose }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes_count || 0);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  const allMedia = post?.media || [];
  const currentMedia = allMedia[currentMediaIndex];
  const isVideo = currentMedia?.media_type?.startsWith("video");

  const initials = post?.user?.name
    ? post.user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  /* Close on Escape */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleLike = useCallback(() => {
    setLiked((p) => !p);
    setLikeCount((p) => (liked ? p - 1 : p + 1));
  }, [liked]);

  const handleComment = () => {
    if (!commentInput.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: "You",
        initials: "Y",
        text: commentInput.trim(),
        time: "Now",
      },
    ]);
    setCommentInput("");
  };

  const nextMedia = () => {
    if (currentMediaIndex < allMedia.length - 1) {
      setCurrentMediaIndex((p) => p + 1);
      setImgLoaded(false);
    }
  };

  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex((p) => p - 1);
      setImgLoaded(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(8px)",
          animation: "fadeIn 0.2s ease",
        }}
      />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-[110] w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
      >
        <Icon icon="mdi:close" width={24} />
      </button>

      {/* Modal Content */}
      <div
        className="relative z-[105] flex flex-col md:flex-row w-full max-w-5xl max-h-[90vh] rounded-[24px] overflow-hidden"
        style={{
          background: "#0d0b1a",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          animation: "modalIn 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Left: Media ── */}
        <div className="relative flex-1 bg-black min-h-[300px] md:min-h-0 flex items-center justify-center">
          {allMedia.length === 0 ? (
            <div
              className="w-full h-full flex items-center justify-center p-8 text-center min-h-[400px]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(99,102,241,0.15))",
              }}
            >
              <p className="text-slate-300 text-base leading-relaxed max-w-sm">
                {post?.caption}
              </p>
            </div>
          ) : (
            <>
              {!imgLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon
                    icon="mdi:loading"
                    width={32}
                    className="text-purple-500 animate-spin"
                  />
                </div>
              )}
              {isVideo ? (
                <video
                  src={mediaUrl(currentMedia.media_url)}
                  controls
                  autoPlay
                  className={`w-full h-full object-contain max-h-[80vh] transition-opacity duration-300 ${
                    imgLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoadedData={() => setImgLoaded(true)}
                />
              ) : (
                <img
                  src={mediaUrl(currentMedia.media_url)}
                  alt={post?.caption || "Post"}
                  className={`w-full h-full object-contain max-h-[80vh] transition-opacity duration-300 ${
                    imgLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setImgLoaded(true)}
                />
              )}

              {/* Multi-media navigation */}
              {allMedia.length > 1 && (
                <>
                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {allMedia.map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                        style={{
                          background:
                            i === currentMediaIndex
                              ? "#fff"
                              : "rgba(255,255,255,0.3)",
                          transform:
                            i === currentMediaIndex ? "scale(1.3)" : "scale(1)",
                        }}
                      />
                    ))}
                  </div>

                  {/* Arrows */}
                  {currentMediaIndex > 0 && (
                    <button
                      onClick={prevMedia}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white z-10 transition-all duration-200 hover:scale-110"
                      style={{
                        background: "rgba(0,0,0,0.5)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <Icon icon="mdi:chevron-left" width={22} />
                    </button>
                  )}
                  {currentMediaIndex < allMedia.length - 1 && (
                    <button
                      onClick={nextMedia}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white z-10 transition-all duration-200 hover:scale-110"
                      style={{
                        background: "rgba(0,0,0,0.5)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <Icon icon="mdi:chevron-right" width={22} />
                    </button>
                  )}

                  {/* Counter */}
                  <div
                    className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[11px] font-bold text-white z-10"
                    style={{
                      background: "rgba(0,0,0,0.5)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {currentMediaIndex + 1} / {allMedia.length}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* ── Right: Details Panel ── */}
        <div className="w-full md:w-[380px] flex flex-col border-l border-white/5 max-h-[90vh] md:max-h-none">
          {/* User Header */}
          <div
            className="px-5 py-4 flex items-center justify-between border-b border-white/5 flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #ec4899)",
                }}
              >
                {initials}
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-tight">
                  {post?.user?.name}
                </p>
                <p className="text-slate-500 text-[11px]">
                  {timeAgo(post?.created_at)}
                </p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-white transition-colors">
              <Icon icon="mdi:dots-horizontal" width={20} />
            </button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
            {/* Caption as first comment */}
            {post?.caption && (
              <div className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5"
                  style={{
                    background: "linear-gradient(135deg, #a855f7, #ec4899)",
                  }}
                >
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] leading-relaxed">
                    <span className="text-white font-semibold mr-1.5">
                      {post?.user?.name}
                    </span>
                    <span className="text-slate-300">{post.caption}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                Comments
              </span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Comments */}
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${
                      c.user === "You" ? "#a855f7, #6366f1" : "#6366f1, #a855f7"
                    })`,
                  }}
                >
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] leading-relaxed">
                    <span className="text-white font-semibold mr-1.5">
                      {c.user}
                    </span>
                    <span className="text-slate-300">{c.text}</span>
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-slate-600 text-[11px]">{c.time}</span>
                    <button className="text-slate-600 text-[11px] font-semibold hover:text-slate-400 transition-colors">
                      Reply
                    </button>
                    <button className="text-slate-600 hover:text-pink-400 transition-colors">
                      <Icon icon="mdi:heart-outline" width={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="px-5 py-3 border-t border-white/5 flex-shrink-0">
            <div className="flex items-center gap-1 mb-3">
              <button
                onClick={handleLike}
                className="p-2 rounded-xl transition-all duration-200 group/like"
              >
                <Icon
                  icon={liked ? "mdi:heart" : "mdi:heart-outline"}
                  width={24}
                  className={
                    liked
                      ? "text-pink-500"
                      : "text-slate-300 group-hover/like:text-pink-400"
                  }
                />
              </button>
              <button className="p-2 rounded-xl text-slate-300 hover:text-purple-400 transition-colors">
                <Icon icon="mdi:chat-outline" width={22} />
              </button>
              <button className="p-2 rounded-xl text-slate-300 hover:text-indigo-400 transition-colors">
                <Icon icon="mdi:share-variant-outline" width={22} />
              </button>
              <div className="ml-auto">
                <button
                  onClick={() => setSaved((p) => !p)}
                  className="p-2 rounded-xl transition-all duration-200"
                >
                  <Icon
                    icon={saved ? "mdi:bookmark" : "mdi:bookmark-outline"}
                    width={22}
                    className={saved ? "text-purple-400" : "text-slate-300"}
                  />
                </button>
              </div>
            </div>

            {/* Like count */}
            {likeCount > 0 && (
              <p className="text-white text-sm font-bold mb-3">
                {likeCount.toLocaleString()} likes
              </p>
            )}

            {/* Timestamp */}
            <p className="text-slate-600 text-[11px] uppercase tracking-wider mb-3">
              {timeAgo(post?.created_at)} ago
            </p>
          </div>

          {/* Comment Input */}
          <div
            className="px-5 py-3 border-t border-white/5 flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="flex items-center gap-3">
              <button className="text-slate-400 hover:text-purple-400 transition-colors flex-shrink-0">
                <Icon icon="mdi:emoticon-outline" width={22} />
              </button>
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent text-white text-[13px] focus:outline-none placeholder:text-slate-600"
              />
              <button
                onClick={handleComment}
                disabled={!commentInput.trim()}
                className="text-purple-400 text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:text-purple-300 transition-colors flex-shrink-0"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
