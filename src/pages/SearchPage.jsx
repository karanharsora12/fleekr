import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { getAllUsers } from "../services/userService";
import { mediaUrl } from "../utils/helper";

/* ── Skeleton Loader ── */
const Shimmer = ({ className }) => (
  <div
    className={`bg-white/5 relative overflow-hidden ${className}`}
    style={{
      backgroundImage:
        "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite linear",
    }}
  />
);

const UserSkeleton = () => (
  <div className="flex items-center gap-4 p-4 rounded-[20px] bg-white/5 border border-white/5">
    <Shimmer className="w-14 h-14 rounded-full flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Shimmer className="h-4 w-32 rounded-full" />
      <Shimmer className="h-3 w-20 rounded-full" />
    </div>
    <Shimmer className="h-9 w-24 rounded-xl" />
  </div>
);

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const response = await getAllUsers(page, debouncedQuery);
        // Laravel paginated response usually has data inside data.data
        const paginatedData = response?.data?.data || response?.data || response;
        const usersArray = Array.isArray(paginatedData.data) ? paginatedData.data : (Array.isArray(paginatedData) ? paginatedData : []);
        
        if (page === 1) {
          setUsers(usersArray);
        } else {
          setUsers((prev) => [...prev, ...usersArray]);
        }

        // Determine if there are more pages
        const currentPage = paginatedData.current_page || 1;
        const lastPage = paginatedData.last_page || 1;
        setHasMore(currentPage < lastPage);

      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    fetchUsers();
  }, [page, debouncedQuery]);

  return (
    <main className="flex-1 p-8 md:p-10 overflow-y-auto">
      {/* ── Header ── */}
      <header className="mb-8">
        <h1
          className="text-white text-3xl md:text-4xl font-bold mb-1.5 tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Search
        </h1>
        <p className="text-slate-400 text-sm font-medium">
          Find creators and friends
        </p>
      </header>

      {/* ── Search Bar ── */}
      <div className="mb-8 max-w-2xl relative">
        <Icon
          icon="mdi:magnify"
          width={22}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search for people..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
        />
      </div>

      {/* ── Results List ── */}
      {loading ? (
        <div className="max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <UserSkeleton key={i} />
          ))}
        </div>
      ) : users.length > 0 ? (
        <div className="max-w-3xl flex flex-col items-center">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 p-4 rounded-[20px] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
              >
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {user.avatar ? (
                    <img
                      src={mediaUrl(user.avatar)}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon
                      icon="mdi:account"
                      width={28}
                      className="text-slate-500"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-[15px] truncate group-hover:text-purple-400 transition-colors">
                    {user.name}
                  </h3>
                  <p className="text-slate-400 text-xs truncate">
                    @{user.username || (user.email && user.email.split("@")[0]) || "user"}
                  </p>
                </div>

                {/* Action */}
                <Link
                  to={`/user/${user.id}`}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 transition-colors"
                >
                  View
                </Link>
              </div>
            ))}
          </div>

          {hasMore && (
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={loadingMore}
              className="mt-8 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-all border border-white/5 disabled:opacity-50"
            >
              {loadingMore ? (
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:loading" className="animate-spin" width={18} />
                  Loading...
                </div>
              ) : (
                "Load More"
              )}
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-20 max-w-2xl">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Icon icon="mdi:account-search" width={32} className="text-slate-500" />
          </div>
          <h3 className="text-white text-lg font-bold mb-2">No users found</h3>
          <p className="text-slate-400 text-sm">
            We couldn't find anyone matching "{searchQuery}"
          </p>
        </div>
      )}

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </main>
  );
}
