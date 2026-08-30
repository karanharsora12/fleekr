import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { getMe } from "../services/authService";
import { getUserPosts } from "../services/postService";
import { mediaUrl } from "../utils/helper";
import PostDetailModal from "../components/PostDetailModal";

/* ── Stat pill ── */
const Stat = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <span className="text-white font-bold text-xl leading-none">{value}</span>
    <span className="text-slate-500 text-xs mt-1 font-medium">{label}</span>
  </div>
);

/* ── Skeleton shimmer ── */
const Shimmer = ({ className }) => (
  <div
    className={`animate-pulse rounded-xl ${className}`}
    style={{ background: "rgba(255,255,255,0.07)" }}
  />
);

/* ── Single Post Card ── */
const PostCard = ({ post, onOpen }) => {
  const firstMedia = post.media?.[0];
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(post)}
    >
      {firstMedia ? (
        firstMedia.media_type === "video" ? (
          <video
            src={mediaUrl(firstMedia.media_url)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            muted
            loop
            autoPlay={hovered}
          />
        ) : (
          <img
            src={mediaUrl(firstMedia.media_url)}
            alt={post.caption || "Post"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )
      ) : (
        /* Text-only post fallback */
        <div
          className="w-full h-full flex items-center justify-center p-4 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(99,102,241,0.2))",
          }}
        >
          <p className="text-slate-300 text-sm line-clamp-4 leading-relaxed">
            {post.caption}
          </p>
        </div>
      )}

      {/* Hover overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.55)",
          opacity: hovered ? 1 : 0,
        }}
      >
        {firstMedia?.media_type === "video" && (
          <Icon
            icon="mdi:play-circle-outline"
            width={36}
            className="text-white drop-shadow-lg"
          />
        )}
        {post.caption && (
          <p className="text-white text-xs text-center px-4 line-clamp-3 leading-relaxed">
            {post.caption}
          </p>
        )}
      </div>

      {/* Multi-media badge */}
      {post.media?.length > 1 && (
        <div
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <Icon icon="mdi:image-multiple-outline" width={12} />
          {post.media.length}
        </div>
      )}

      {/* Privacy badge */}
      {post.privacy !== "public" && (
        <div className="absolute top-2 left-2">
          <Icon
            icon={
              post.privacy === "private"
                ? "mdi:lock-outline"
                : "mdi:account-group-outline"
            }
            width={14}
            className="text-white drop-shadow"
          />
        </div>
      )}
    </div>
  );
};

/* ── Empty state ── */
const EmptyPosts = () => (
  <div className="col-span-3 flex flex-col items-center justify-center py-20 gap-4">
    <div
      className="w-20 h-20 rounded-3xl flex items-center justify-center"
      style={{
        background: "rgba(168,85,247,0.1)",
        border: "1px solid rgba(168,85,247,0.2)",
      }}
    >
      <Icon icon="mdi:image-outline" width={36} className="text-purple-400" />
    </div>
    <div className="text-center">
      <p className="text-white font-bold text-lg">No posts yet</p>
      <p className="text-slate-500 text-sm mt-1">
        Share your first moment with the world
      </p>
    </div>
  </div>
);

/* ── Tab bar ── */
const TABS = [
  { key: "posts", icon: "mdi:grid", label: "Posts" },
  { key: "saved", icon: "mdi:bookmark-outline", label: "Saved" },
  { key: "tagged", icon: "mdi:tag-outline", label: "Tagged" },
];

/* ══════════════════════════════════════
   Main Profile Page
══════════════════════════════════════ */
export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    getMe()
      .then((res) => setUser(res))
      .catch(console.error)
      .finally(() => setLoadingUser(false));

    getUserPosts()
      .then((res) => {
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data)
          ? res.data.data
          : [];
        setPosts(list);
      })
      .catch(console.error)
      .finally(() => setLoadingPosts(false));
  }, []);

  /* ── Derived display values ── */
  const displayName = user?.name ?? "—";
  const username = user?.username ?? user?.email?.split("@")[0] ?? "—";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <main className="flex-1 overflow-y-auto bg-[#080710]">
      {/* ── Cover Banner ── */}
      <div
        className="w-full relative"
        style={{
          height: "220px",
          background:
            "linear-gradient(135deg, #7c3aed 0%, #a855f7 40%, #ec4899 100%)",
        }}
      >
        {/* subtle texture overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 40%)",
          }}
        />
      </div>

      {/* ── Profile Card ── */}
      <div className="px-8 pb-8">
        <div
          className="rounded-[24px] relative -mt-6 px-8 pt-0 pb-6"
          style={{
            background: "rgba(13,11,26,0.95)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Avatar — sits on the banner seam */}
          <div className="relative -top-10 mb-[-10px] flex items-end justify-between">
            <div
              className="w-[90px] h-[90px] rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #a855f7, #6366f1)",
                border: "4px solid #080710",
                boxShadow:
                  "0 0 0 1px rgba(168,85,247,0.4), 0 8px 32px rgba(168,85,247,0.3)",
              }}
            >
              {loadingUser ? (
                <Icon icon="mdi:account" width={40} className="text-white/60" />
              ) : (
                initials
              )}
            </div>

            {/* Edit Profile */}
            <button
              id="edit-profile-btn"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:scale-[1.02] active:scale-100"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <Icon icon="mdi:pencil-outline" width={16} />
              Edit Profile
            </button>
          </div>

          {/* Name & username */}
          {loadingUser ? (
            <div className="space-y-2 mb-4">
              <Shimmer className="h-6 w-40" />
              <Shimmer className="h-4 w-24" />
            </div>
          ) : (
            <div className="mb-3">
              <h1
                className="text-white text-2xl font-bold leading-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {displayName}
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">@{username}</p>
            </div>
          )}

          {/* Bio */}
          <p className="text-slate-300 text-sm leading-relaxed mb-5 max-w-lg">
            Content creator &amp; digital artist &nbsp;|&nbsp; Sharing my
            journey through art, travel &amp; creativity
            <br />
            New York City &nbsp;|&nbsp; Commission open
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8">
            <Stat value={loadingPosts ? "—" : posts.length} label="Posts" />
            <div className="w-px h-8 bg-white/10" />
            <Stat value="124K" label="Followers" />
            <div className="w-px h-8 bg-white/10" />
            <Stat value="892" label="Following" />
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div
          className="mt-4 flex rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              id={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all duration-200"
              style={{
                background:
                  activeTab === tab.key
                    ? "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(99,102,241,0.2))"
                    : "transparent",
                color: activeTab === tab.key ? "#c084fc" : "#64748b",
                borderBottom:
                  activeTab === tab.key
                    ? "2px solid #a855f7"
                    : "2px solid transparent",
              }}
            >
              <Icon icon={tab.icon} width={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Post Grid ── */}
        {activeTab === "posts" && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {loadingPosts ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Shimmer key={i} className="aspect-square rounded-2xl" />
              ))
            ) : posts.length === 0 ? (
              <EmptyPosts />
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onOpen={setSelectedPost}
                />
              ))
            )}
          </div>
        )}

        {/* Saved / Tagged placeholder tabs */}
        {activeTab !== "posts" && (
          <div className="mt-10 flex flex-col items-center justify-center py-16 gap-3">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Icon
                icon={
                  activeTab === "saved"
                    ? "mdi:bookmark-outline"
                    : "mdi:tag-outline"
                }
                width={28}
                className="text-slate-500"
              />
            </div>
            <p className="text-slate-500 text-sm">
              {activeTab === "saved"
                ? "No saved posts yet"
                : "No tagged posts yet"}
            </p>
          </div>
        )}
      </div>

      {/* ── Post Detail Modal ── */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </main>
  );
}
