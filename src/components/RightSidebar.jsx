import { useEffect, useState } from "react";
import { getAllUsers } from "../services/userService";

/* ── Suggested Creator Card ── */
const CreatorCard = ({ user }) => {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="flex items-center gap-3 py-2 transition-all duration-200 cursor-pointer group bg-transparent border-none">
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
        style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p className="text-white text-sm font-semibold truncate hover:underline">
          {user.name}
        </p>
        <p className="text-slate-400 text-xs truncate">
          Suggested for you
        </p>
      </div>
      <button
        className="text-xs font-bold transition-all duration-200 flex-shrink-0 text-purple-500 hover:text-white bg-transparent border-none p-0"
        onClick={(e) => e.stopPropagation()}
      >
        Follow
      </button>
    </div>
  );
};

export default function RightSidebar() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers()
      .then((res) => {
        const raw = res;
        const list = Array.isArray(raw?.data?.data)
          ? raw.data.data
          : Array.isArray(raw?.data)
            ? raw.data
            : Array.isArray(raw)
              ? raw
              : [];
        setUsers(list.slice(0, 5));
      })
      .catch(console.error);
  }, []);

  if (users.length === 0) return null;

  return (
    <aside className="hidden lg:block w-72 flex-shrink-0 border-l border-white/5 bg-[#080710] overflow-y-auto h-screen p-6 sticky top-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 font-bold text-sm tracking-wide">
          Suggested for you
        </h3>
        <button className="text-white hover:text-slate-300 text-xs font-semibold transition-colors">
          See All
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {users.map((user) => (
          <CreatorCard key={user.id} user={user} />
        ))}
      </div>

      {/* Tags cloud */}
      <div className="mt-8">
        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
          Popular Tags
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            "photography",
            "travel",
            "art",
            "food",
            "fashion",
            "music",
            "design",
            "nature",
          ].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "#94a3b8",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Footer Links */}
      <div className="mt-8 text-[11px] text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
        <a href="#" className="hover:underline">About</a>
        <a href="#" className="hover:underline">Help</a>
        <a href="#" className="hover:underline">Press</a>
        <a href="#" className="hover:underline">API</a>
        <a href="#" className="hover:underline">Jobs</a>
        <a href="#" className="hover:underline">Privacy</a>
        <a href="#" className="hover:underline">Terms</a>
      </div>
      <div className="mt-4 text-[11px] text-slate-500 uppercase tracking-widest">
        © 2026 FLEEKR
      </div>
    </aside>
  );
}
