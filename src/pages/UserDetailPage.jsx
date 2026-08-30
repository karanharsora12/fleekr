import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { getUserById } from "../services/userService";
import { getPostsByUserId } from "../services/postService";
import {
  followUser,
  unfollowUser,
  isFollowingUser,
  getFollowers,
  getFollowing,
} from "../services/followService";
import { startConversation } from "../services/chatService";
import { getMe } from "../services/authService";
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

      {post.media?.length > 1 && (
        <div
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <Icon icon="mdi:image-multiple-outline" width={12} />
          {post.media.length}
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
      <p className="text-slate-500 text-sm mt-1">This user hasn't posted anything</p>
    </div>
  </div>
);

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  
  // Follower stats
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get current user to check if visiting own profile
        const me = await getMe();
        setCurrentUser(me);

        if (me?.id?.toString() === id) {
           navigate('/profile', { replace: true });
           return;
        }

        // Get user profile details
        const userRes = await getUserById(id);
        if (userRes?.data) {
          setProfileUser(userRes.data);
        } else {
          setProfileUser({ id, name: "Unknown User", username: "unknown" });
        }

        // Fetch follow stats
        const followStatus = await isFollowingUser(id);
        setIsFollowing(followStatus?.is_following || false);

        const followersData = await getFollowers(id);
        setFollowerCount(followersData?.count || 0);

        const followingData = await getFollowing(id);
        setFollowingCount(followingData?.count || 0);

      } catch (error) {
        console.error("Error fetching user detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoadingPosts(true);
        const res = await getPostsByUserId(id);
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data)
          ? res.data.data
          : [];
        setPosts(list);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoadingPosts(false);
      }
    };
    if (id) fetchPosts();
  }, [id]);

  const toggleFollow = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(id);
        setIsFollowing(false);
        setFollowerCount(prev => Math.max(0, prev - 1));
      } else {
        await followUser(id);
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Follow action failed:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMessageClick = async () => {
    try {
      const res = await startConversation(id);
      const convoId = res?.conversation?.id || res?.data?.conversation?.id;
      if (convoId) {
        navigate(`/messages?convo=${convoId}`);
      } else {
        navigate("/messages");
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  const displayName = profileUser?.name ?? "—";
  const username = profileUser?.username ?? profileUser?.email?.split("@")[0] ?? "—";
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
          background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 40%, #06b6d4 100%)",
        }}
      >
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white backdrop-blur-md hover:bg-black/50 transition"
        >
          <Icon icon="mdi:arrow-left" width={20} />
        </button>
        <div
          className="absolute inset-0 pointer-events-none"
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
          {/* Avatar & Follow Button */}
          <div className="relative -top-10 mb-[-10px] flex items-end justify-between">
            <div
              className="w-[90px] h-[90px] rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                border: "4px solid #080710",
                boxShadow: "0 0 0 1px rgba(59,130,246,0.4), 0 8px 32px rgba(59,130,246,0.3)",
              }}
            >
              {loading ? (
                <Icon icon="mdi:account" width={40} className="text-white/60" />
              ) : profileUser?.avatar ? (
                <img src={mediaUrl(profileUser.avatar)} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>

            {/* Actions */}
            {!loading && (
              <div className="flex gap-2">
                {isFollowing && (
                  <button
                    onClick={handleMessageClick}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 text-white"
                    title="Message"
                  >
                    <Icon icon="mdi:message-outline" width={18} />
                  </button>
                )}
                <button
                  onClick={toggleFollow}
                  disabled={actionLoading}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:scale-[1.02] active:scale-100 ${
                    isFollowing 
                      ? "bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200" 
                      : "bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/25"
                  } ${actionLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {actionLoading ? (
                     <Icon icon="mdi:loading" className="animate-spin" width={18} />
                  ) : isFollowing ? (
                    <>
                      <Icon icon="mdi:account-check-outline" width={18} />
                      Following
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:account-plus-outline" width={18} />
                      Follow
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Name & username */}
          {loading ? (
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

          {/* Stats */}
          <div className="flex items-center gap-8 mt-6">
            <Stat value={loadingPosts ? "—" : posts.length} label="Posts" />
            <div className="w-px h-8 bg-white/10" />
            <Stat value={loading ? "—" : followerCount} label="Followers" />
            <div className="w-px h-8 bg-white/10" />
            <Stat value={loading ? "—" : followingCount} label="Following" />
          </div>
        </div>

        {/* ── Post Grid ── */}
        <div className="mt-8 grid grid-cols-3 gap-2">
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
