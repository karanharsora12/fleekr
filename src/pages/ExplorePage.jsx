import { useEffect, useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { getExplorePosts } from "../services/postService";
import { mediaUrl } from "../utils/helper";
import PostDetailModal from "../components/PostDetailModal";

/* ── Category Tags ── */
const CATEGORIES = [
  { key: "all", label: "All", icon: "mdi:compass-outline" },
  { key: "trending", label: "Trending", icon: "mdi:fire" },
  { key: "latest", label: "Latest", icon: "mdi:clock-outline" },
  { key: "photos", label: "Photos", icon: "mdi:image-outline" },
  { key: "videos", label: "Videos", icon: "mdi:video-outline" },
];

/* ── Shimmer Skeleton ── */
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

const ExploreSkeleton = () => (
  <div>
    <div className="mb-8 max-w-2xl">
      <Shimmer className="h-14 rounded-2xl" />
    </div>
    <div className="flex gap-3 mb-8 overflow-hidden">
      {[1, 2, 3, 4, 5].map((i) => (
        <Shimmer key={i} className="h-10 w-24 rounded-full flex-shrink-0" />
      ))}
    </div>
    <div className="columns-2 md:columns-3 gap-4 space-y-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="break-inside-avoid">
          <Shimmer
            className="rounded-[24px]"
            style={{ height: `${180 + (i % 3) * 80}px` }}
          />
        </div>
      ))}
    </div>
  </div>
);

/* ── Post Grid Card ── */
const ExploreCard = ({ post, index, onOpen }) => {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const firstMedia = post.media?.[0];
  const hasMedia = firstMedia && post.media.length > 0;
  const isVideo = firstMedia?.media_type?.startsWith("video");

  const initials = post.user?.name
    ? post.user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const heightClass = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]"][
    index % 3
  ];

  return (
    <div
      className="break-inside-avoid mb-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative rounded-[24px] overflow-hidden cursor-pointer group"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
        onClick={() => onOpen(post)}
      >
        {/* Media */}
        <div className={`relative ${heightClass} bg-black/30`}>
          {!imgLoaded && hasMedia && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon
                icon="mdi:loading"
                width={28}
                className="text-purple-500 animate-spin"
              />
            </div>
          )}

          {hasMedia ? (
            isVideo ? (
              <video
                src={mediaUrl(firstMedia.media_url)}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  hovered ? "scale-110" : "scale-100"
                } ${imgLoaded ? "" : "opacity-0"}`}
                muted
                loop
                autoPlay={hovered}
                onLoadedData={() => setImgLoaded(true)}
              />
            ) : (
              <img
                src={mediaUrl(firstMedia.media_url)}
                alt={post.caption || "Explore post"}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  hovered ? "scale-110" : "scale-100"
                } ${imgLoaded ? "" : "opacity-0"}`}
                onLoad={() => setImgLoaded(true)}
              />
            )
          ) : (
            <div
              className="w-full h-full flex items-center justify-center p-6 text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(99,102,241,0.15))",
              }}
            >
              <p className="text-slate-300 text-sm leading-relaxed line-clamp-6">
                {post.caption}
              </p>
            </div>
          )}

          {/* Multi-media badge */}
          {post.media?.length > 1 && (
            <div
              className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white z-10"
              style={{
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Icon icon="mdi:image-multiple-outline" width={12} />
              {post.media.length}
            </div>
          )}

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

          {/* Hover overlay with stats */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-300"
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: hovered ? "blur(2px)" : "blur(0px)",
              opacity: hovered ? 1 : 0,
            }}
          >
            <div className="flex items-center gap-6 text-white">
              <span className="flex items-center gap-2 text-base font-bold">
                <Icon icon="mdi:heart" width={22} />
                {post.likes_count || 0}
              </span>
              <span className="flex items-center gap-2 text-base font-bold">
                <Icon icon="mdi:comment" width={22} />
                {post.comments_count || 0}
              </span>
            </div>
          </div>

          {/* User info at bottom */}
          {post.user && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2.5 z-10 pointer-events-none">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #ec4899)",
                  boxShadow: "0 2px 8px rgba(168,85,247,0.4)",
                }}
              >
                {initials}
              </div>
              <span className="text-white text-sm font-semibold truncate drop-shadow-md">
                {post.user.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Empty State ── */
const EmptyState = ({ query }) => (
  <div className="flex flex-col items-center justify-center py-28 gap-5 animate-fadeIn">
    <div
      className="w-20 h-20 rounded-3xl flex items-center justify-center"
      style={{
        background: "rgba(168,85,247,0.1)",
        border: "1px solid rgba(168,85,247,0.2)",
      }}
    >
      <Icon icon="mdi:magnify-close" width={36} className="text-purple-400" />
    </div>
    <div className="text-center">
      <p className="text-white font-bold text-xl font-[Syne]">
        {query ? "No results found" : "Nothing to explore yet"}
      </p>
      <p className="text-slate-500 text-sm mt-2 max-w-xs">
        {query
          ? `We couldn't find anything matching "${query}". Try a different search.`
          : "When people share public posts, they'll appear here for you to discover."}
      </p>
    </div>
  </div>
);

/* ══════════════════════════════════════
   Main Explore Page
══════════════════════════════════════ */
export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const postsRes = await getExplorePosts();

        const raw = postsRes;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : Array.isArray(raw?.data?.data)
              ? raw.data.data
              : [];
        setPosts(list);
      } catch (err) {
        console.error("Failed to load explore data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* ── Filtered posts ── */
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.caption?.toLowerCase().includes(q) ||
          p.user?.name?.toLowerCase().includes(q),
      );
    }

    if (activeCategory === "photos") {
      result = result.filter(
        (p) =>
          p.media?.length > 0 && p.media[0].media_type?.startsWith("image"),
      );
    } else if (activeCategory === "videos") {
      result = result.filter(
        (p) =>
          p.media?.length > 0 && p.media[0].media_type?.startsWith("video"),
      );
    } else if (activeCategory === "trending") {
      result.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
    } else if (activeCategory === "latest") {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return result;
  }, [posts, searchQuery, activeCategory]);

  return (
    <main className="flex-1 p-8 md:p-10 overflow-y-auto">
      {/* ── Header ── */}
      <header className="mb-8">
        <h1
          className="text-white text-3xl md:text-4xl font-bold mb-1.5 tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Explore
        </h1>
        <p className="text-slate-400 text-sm font-medium">
          Discover trending content and new creators
        </p>
      </header>

      {/* ── Search Bar ── */}
      <div className="mb-6 max-w-2xl relative">
        <Icon
          icon="mdi:magnify"
          width={22}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for posts, people..."
          className="w-full rounded-2xl py-3.5 pl-12 pr-12 text-white text-[15px] focus:outline-none transition-all duration-200 placeholder:text-slate-500"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(168,85,247,0.4)";
            e.target.style.background = "rgba(255,255,255,0.06)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255,255,255,0.08)";
            e.target.style.background = "rgba(255,255,255,0.04)";
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <Icon icon="mdi:close" width={16} />
          </button>
        )}
      </div>

      {/* ── Category Tags ── */}
      <div className="mb-8 flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
            style={{
              background:
                activeCategory === cat.key
                  ? "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(99,102,241,0.2))"
                  : "rgba(255,255,255,0.04)",
              border: `1px solid ${
                activeCategory === cat.key
                  ? "rgba(168,85,247,0.35)"
                  : "rgba(255,255,255,0.06)"
              }`,
              color: activeCategory === cat.key ? "#c084fc" : "#94a3b8",
            }}
          >
            <Icon icon={cat.icon} width={16} />
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <ExploreSkeleton />
      ) : filteredPosts.length === 0 ? (
        <EmptyState query={searchQuery} />
      ) : (
        <div className="flex gap-6">
          {/* ── Main Grid ── */}
          <div className="flex-1">
            <div className="columns-2 md:columns-3 gap-4">
              {filteredPosts.map((post, i) => (
                <ExploreCard
                  key={post.id}
                  post={post}
                  index={i}
                  onOpen={setSelectedPost}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Post Detail Modal ── */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}
