import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { getAllUsers } from "../services/userService";
import { mediaUrl } from "../utils/helper";
import CreatePostModal from "../components/CreatePostModal";
import { getMe } from "../services/authService";

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

/* ── Skeleton Shimmer ── */
const Shimmer = ({ className }) => (
  <div
    className={`animate-pulse ${className}`}
    style={{
      background:
        "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s ease-in-out infinite",
    }}
  />
);

const FeedSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="rounded-[28px] overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="p-5 flex items-center gap-4">
          <Shimmer className="w-11 h-11 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Shimmer className="h-4 w-28 rounded-lg" />
            <Shimmer className="h-3 w-20 rounded-lg" />
          </div>
          <Shimmer className="w-6 h-6 rounded-lg" />
        </div>
        <Shimmer className="w-full aspect-[4/3]" />
        <div className="p-5 space-y-3">
          <div className="flex gap-5">
            <Shimmer className="w-8 h-8 rounded-full" />
            <Shimmer className="w-8 h-8 rounded-full" />
            <Shimmer className="w-8 h-8 rounded-full" />
            <div className="ml-auto">
              <Shimmer className="w-8 h-8 rounded-full" />
            </div>
          </div>
          <Shimmer className="h-4 w-24 rounded-lg" />
          <Shimmer className="h-4 w-full rounded-lg" />
          <Shimmer className="h-4 w-3/4 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

/* ── Quick Post Composer ── */
const QuickPostComposer = ({ onOpen, user }) => {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : null;

  return (
    <div
      className="rounded-[28px] p-5 mb-6 cursor-pointer group transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)" }}
        >
          {initials || <Icon icon="mdi:account" width={22} />}
        </div>
        <div
          className="flex-1 px-5 py-3 rounded-2xl text-slate-500 text-[15px] transition-all duration-200 group-hover:text-slate-400"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          What's on your mind?
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
            style={{
              background: "rgba(168,85,247,0.1)",
              border: "1px solid rgba(168,85,247,0.2)",
            }}
          >
            <Icon
              icon="mdi:image-outline"
              width={20}
              className="text-purple-400"
            />
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            <Icon
              icon="mdi:video-outline"
              width={20}
              className="text-indigo-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Post Card ── */
const PostCard = ({ user, post }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes_count || 0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleSave = (e) => {
    e.stopPropagation();
    setSaved((prev) => !prev);
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const firstMedia = post?.media?.[0];
  const hasMedia = firstMedia && post.media.length > 0;

  return (
    <article
      className="rounded-[28px] overflow-hidden animate-fadeIn"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* ── Header ── */}
      <div className="p-5 flex items-center justify-between">
        <div
          className="flex items-center gap-3.5 cursor-pointer group"
          onClick={goToProfile}
        >
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
            style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}
          >
            {initials}
          </div>
          <div>
            <h3 className="text-white font-semibold text-[15px] leading-tight group-hover:text-purple-300 transition-colors">
              {user?.name}
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              @{user?.name?.toLowerCase().replace(/\s+/g, "")} ·{" "}
              {timeAgo(post?.created_at)}
            </p>
          </div>
        </div>
        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all duration-200">
          <Icon icon="mdi:dots-horizontal" width={20} />
        </button>
      </div>

      {/* ── Caption (before media) ── */}
      {post?.caption && (
        <div className="px-5 pb-4">
          <p className="text-slate-200 text-[15px] leading-relaxed">
            {post.caption}
          </p>
        </div>
      )}

      {/* ── Media ── */}
      {hasMedia && (
        <div className="relative w-full bg-black/40">
          {!imageLoaded && (
            <div className="w-full aspect-[4/3] flex items-center justify-center">
              <Icon
                icon="mdi:loading"
                width={32}
                className="text-purple-500 animate-spin"
              />
            </div>
          )}
          {firstMedia.media_type?.startsWith("video") ? (
            <video
              src={mediaUrl(firstMedia.media_url)}
              controls
              className={`w-full max-h-[580px] object-cover ${
                imageLoaded ? "" : "hidden"
              }`}
              onLoadedData={() => setImageLoaded(true)}
            />
          ) : (
            <img
              src={mediaUrl(firstMedia.media_url)}
              alt={post.caption || "Post"}
              className={`w-full max-h-[580px] object-cover ${
                imageLoaded ? "" : "hidden"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          )}

          {/* Multi-media badge */}
          {post.media.length > 1 && (
            <div
              className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-white"
              style={{
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Icon icon="mdi:image-multiple-outline" width={14} />
              {post.media.length}
            </div>
          )}
        </div>
      )}

      {/* ── Actions ── */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center gap-1">
          {/* Like */}
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 group/like"
            style={{
              background: liked ? "rgba(236,72,153,0.1)" : "transparent",
            }}
          >
            <div
              className={`transition-transform duration-200 ${
                liked ? "scale-110" : "group-hover/like:scale-110"
              }`}
            >
              <Icon
                icon={liked ? "mdi:heart" : "mdi:heart-outline"}
                width={24}
                className={
                  liked
                    ? "text-pink-500"
                    : "text-slate-400 group-hover/like:text-pink-400"
                }
              />
            </div>
            {likeCount > 0 && (
              <span
                className={`text-sm font-semibold ${
                  liked ? "text-pink-500" : "text-slate-400"
                }`}
              >
                {likeCount}
              </span>
            )}
          </button>

          {/* Comment */}
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 group/comment">
            <div className="transition-transform duration-200 group-hover/comment:scale-110">
              <Icon
                icon="mdi:chat-outline"
                width={22}
                className="text-slate-400 group-hover/comment:text-purple-400"
              />
            </div>
            {post?.comments_count > 0 && (
              <span className="text-sm font-semibold text-slate-400">
                {post.comments_count}
              </span>
            )}
          </button>

          {/* Share */}
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 group/share">
            <div className="transition-transform duration-200 group-hover/share:scale-110">
              <Icon
                icon="mdi:share-variant-outline"
                width={22}
                className="text-slate-400 group-hover/share:text-indigo-400"
              />
            </div>
          </button>

          {/* Bookmark */}
          <div className="ml-auto">
            <button
              onClick={handleSave}
              className="p-2 rounded-xl transition-all duration-200 group/save"
              style={{
                background: saved ? "rgba(168,85,247,0.1)" : "transparent",
              }}
            >
              <Icon
                icon={saved ? "mdi:bookmark" : "mdi:bookmark-outline"}
                width={22}
                className={
                  saved
                    ? "text-purple-400"
                    : "text-slate-400 group-hover/save:text-purple-400"
                }
              />
            </button>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      {(likeCount > 0 || post?.comments_count > 0) && (
        <div className="px-5 pb-5 pt-1">
          {likeCount > 0 && (
            <p className="text-white text-sm font-semibold mb-1">
              {likeCount} {likeCount === 1 ? "like" : "likes"}
            </p>
          )}
          {post?.comments_count > 0 && (
            <button className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
              View all {post.comments_count} comment
              {post.comments_count !== 1 ? "s" : ""}
            </button>
          )}
        </div>
      )}
    </article>
  );
};

/* ── Empty State ── */
const EmptyFeed = ({ onOpen }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-5 animate-fadeIn">
    <div
      className="w-20 h-20 rounded-3xl flex items-center justify-center"
      style={{
        background: "rgba(168,85,247,0.1)",
        border: "1px solid rgba(168,85,247,0.2)",
      }}
    >
      <Icon icon="mdi:post-outline" width={36} className="text-purple-400" />
    </div>
    <div className="text-center">
      <p className="text-white font-bold text-xl font-[Syne]">No posts yet</p>
      <p className="text-slate-500 text-sm mt-2 max-w-xs">
        When people share posts, they'll show up here. Be the first to share
        something!
      </p>
    </div>
    <button
      onClick={onOpen}
      className="mt-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-purple-500/20 hover:scale-[1.03] active:scale-100 transition-transform duration-200"
    >
      Create your first post
    </button>
  </div>
);

/* ── Error State ── */
const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fadeIn">
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center"
      style={{
        background: "rgba(239,68,68,0.1)",
        border: "1px solid rgba(239,68,68,0.2)",
      }}
    >
      <Icon
        icon="mdi:alert-circle-outline"
        width={32}
        className="text-red-400"
      />
    </div>
    <p className="text-red-400 text-sm font-medium text-center max-w-xs">
      {message}
    </p>
    <button
      onClick={onRetry}
      className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#e2e8f0",
      }}
    >
      Try again
    </button>
  </div>
);

/* ══════════════════════════════════════
   Main Home Page
══════════════════════════════════════ */
export default function HomePage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const sentinelRef = useRef(null);
  const pageRef = useRef(1);

  const fetchUsers = useCallback(async (pageNum, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);

      const response = await getAllUsers(pageNum);

      const payload = response?.data ?? response;
      const list = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : [];
      const mapped = list.map((u) => ({
        ...u,
        latestPost: u.latest_post || null,
      }));

      if (append) {
        setUsers((prev) => [...prev, ...mapped]);
      } else {
        setUsers(mapped);
      }

      setHasMore(mapped.length > 0);
    } catch (err) {
      console.error("Failed to load feed:", err);
      if (!append) setError("Failed to load feed. Please try again later.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  /* ── Initial data load ── */
  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const load = async () => {
      const [meResult] = await Promise.allSettled([getMe()]);
      if (meResult.status === "fulfilled") {
        setCurrentUser(meResult.value);
      }
      pageRef.current = 1;
      await fetchUsers(1);
    };
    load();
  }, [fetchUsers]);

  /* ── Infinite Scroll Observer ── */
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          pageRef.current += 1;
          fetchUsers(pageRef.current, true);
        }
      },
      { threshold: 0.1 },
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [hasMore, loadingMore, loading, fetchUsers]);

  const handleRetry = () => {
    setError("");
    pageRef.current = 1;
    fetchUsers(1);
  };

  return (
    <main className="flex-1 p-8 md:p-10 overflow-y-auto">
      {/* ── Feed ── */}
      <div className="max-w-xl mx-auto">
        {/* Quick Composer */}
        {!loading && !error && (
          <QuickPostComposer
            onOpen={() => setShowCreatePost(true)}
            user={currentUser}
          />
        )}

        {/* Loading Skeleton */}
        {loading && <FeedSkeleton />}

        {/* Error */}
        {error && !loading && (
          <ErrorState message={error} onRetry={handleRetry} />
        )}

        {/* Empty */}
        {!loading && !error && users.length === 0 && (
          <EmptyFeed onOpen={() => setShowCreatePost(true)} />
        )}

        {/* Post Cards */}
        {!loading && !error && users.length > 0 && (
          <div className="space-y-5">
            {users.map(
              (user) =>
                user.latestPost && (
                  <PostCard key={user.id} user={user} post={user.latestPost} />
                ),
            )}

            {/* No-post users */}
            {users.some((u) => !u.latestPost) && (
              <div className="space-y-5">
                {users
                  .filter((u) => !u.latestPost)
                  .map((user) => (
                    <div
                      key={`no-post-${user.id}`}
                      className="rounded-[28px] p-5 text-center"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{
                            background:
                              "linear-gradient(135deg, #a855f7, #ec4899)",
                          }}
                        >
                          {user.name
                            ?.split(" ")
                            .map((w) => w[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <span className="text-white font-semibold text-[15px]">
                          {user.name}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm italic">
                        {user.name} hasn't posted anything yet.
                      </p>
                    </div>
                  ))}
              </div>
            )}

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="h-1" />

            {/* Loading more indicator */}
            {loadingMore && (
              <div className="flex justify-center py-6">
                <Icon
                  icon="mdi:loading"
                  width={28}
                  className="animate-spin text-purple-500"
                />
              </div>
            )}

            {/* End of feed */}
            {!hasMore && users.length > 0 && !loading && (
              <div className="text-center py-8">
                <p className="text-slate-600 text-sm">You're all caught up</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Create Post Modal ── */}
      {showCreatePost && (
        <CreatePostModal onClose={() => setShowCreatePost(false)} />
      )}

      {/* ── Shimmer keyframe ── */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </main>
  );
}
