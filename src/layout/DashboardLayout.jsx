import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import CreatePostModal from "../components/CreatePostModal";

/* ── Sidebar Component ── */
const Sidebar = ({ onCreatePost }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = [
    { icon: "mdi:home-variant-outline", label: "Home", path: "/home" },
    { icon: "mdi:compass-outline", label: "Explore", path: "/explore" },
    { icon: "mdi:message-text-outline", label: "Messages", path: "/messages" },
    { icon: "mdi:bell-outline", label: "Notifications", path: "/notifications" },
    { icon: "mdi:account-outline", label: "Profile", path: "/profile" },
    { icon: "mdi:magnify", label: "Search", path: "/search" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="w-64 flex flex-col h-screen border-r border-white/5 bg-[#0d0b1a] sticky top-0">
      {/* Logo */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/20">
          F
        </div>
        <span
          className="text-white text-2xl font-bold tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Fleekr
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => item.path && navigate(item.path)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${
              item.path && location.pathname === item.path
                ? "bg-purple-500/10 text-purple-400"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon
              icon={item.icon}
              width={22}
              className={
                item.path && location.pathname === item.path
                  ? "text-purple-400"
                  : "group-hover:scale-110 transition-transform"
              }
            />
            <span className="font-medium text-[15px]">{item.label}</span>
            {item.path && location.pathname === item.path && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
            )}
          </button>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 mt-auto space-y-4">
        <button
          id="create-post-btn"
          onClick={onCreatePost}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:scale-[1.02] transition-transform active:scale-100"
        >
          <Icon icon="mdi:plus" width={20} />
          Create Post
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <Icon icon="mdi:logout" width={22} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

import RightSidebar from "../components/RightSidebar";

/* ── Main Dashboard Layout ── */
export default function DashboardLayout() {
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <div className="min-h-screen bg-[#080710] flex font-sans selection:bg-purple-500/30">
      <Sidebar onCreatePost={() => setShowCreatePost(true)} />

      <Outlet />

      <RightSidebar />

      {showCreatePost && (
        <CreatePostModal onClose={() => setShowCreatePost(false)} />
      )}

      {/* ── Help button ── */}
      <button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition shadow-2xl z-50 group"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(10px)",
        }}
        aria-label="Help"
      >
        <Icon
          icon="mdi:help"
          width={24}
          className="group-hover:rotate-12 transition-transform"
        />
      </button>
    </div>
  );
}
