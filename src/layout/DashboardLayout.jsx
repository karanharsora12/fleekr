import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import CreatePostModal from "../components/CreatePostModal";

/* ── Sidebar Component ── */
const Sidebar = ({ onCreatePost }) => {
  const navigate = useNavigate();
  const menuItems = [
    { icon: "mdi:home-variant-outline", label: "Home", path: "/dashboard" },
    { icon: "mdi:compass-outline", label: "Explore" },
    { icon: "mdi:message-text-outline", label: "Messages" },
    { icon: "mdi:bell-outline", label: "Notifications" },
    { icon: "mdi:account-outline", label: "Profile", path: "/profile" },
    { icon: "mdi:view-dashboard", label: "Dashboard", path: "/dashboard" },
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
              item.path && window.location.pathname === item.path
                ? "bg-purple-500/10 text-purple-400"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon
              icon={item.icon}
              width={22}
              className={
                item.path && window.location.pathname === item.path
                  ? "text-purple-400"
                  : "group-hover:scale-110 transition-transform"
              }
            />
            <span className="font-medium text-[15px]">{item.label}</span>
            {item.path && window.location.pathname === item.path && (
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

/* ── Metric Card ── */
const MetricCard = ({ icon, label, value, trend, isPositive, iconColor }) => (
  <div className="bg-white/5 border border-white/5 rounded-[28px] p-6 backdrop-blur-md hover:border-white/10 transition-colors">
    <div className="flex justify-between items-start mb-6">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: `${iconColor}15`, color: iconColor }}
      >
        <Icon icon={icon} width={24} />
      </div>
      <div
        className={`flex items-center gap-1 text-[13px] font-bold px-2.5 py-1 rounded-full ${
          isPositive
            ? "bg-green-500/10 text-green-400"
            : "bg-red-500/10 text-red-400"
        }`}
      >
        <Icon
          icon={isPositive ? "mdi:trending-up" : "mdi:trending-down"}
          width={16}
        />
        {trend}
      </div>
    </div>
    <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
    <h3 className="text-white text-3xl font-bold tracking-tight">{value}</h3>
  </div>
);

/* ── Charts ── */
const EngagementChart = () => (
  <div className="bg-white/5 border border-white/5 rounded-[32px] p-8 flex-1">
    <div className="flex justify-between items-center mb-8">
      <div>
        <h3 className="text-white text-lg font-bold">Engagement Overview</h3>
        <p className="text-slate-400 text-xs">Views and likes this week</p>
      </div>
      <Icon icon="mdi:trending-up" width={24} className="text-purple-400" />
    </div>

    <div className="h-48 w-full relative">
      <svg
        className="w-full h-full"
        viewBox="0 0 400 150"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid Lines */}
        <line
          x1="0"
          y1="0"
          x2="400"
          y2="0"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1="37.5"
          x2="400"
          y2="37.5"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1="75"
          x2="400"
          y2="75"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1="112.5"
          x2="400"
          y2="112.5"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
        />

        {/* Area */}
        <path
          d="M0 120 C 40 120, 60 110, 80 100 C 120 80, 140 10, 180 50 C 220 90, 260 70, 300 80 C 340 90, 380 70, 400 80 L 400 150 L 0 150 Z"
          fill="url(#chartGradient)"
        />
        {/* Line */}
        <path
          d="M0 120 C 40 120, 60 110, 80 100 C 120 80, 140 10, 180 50 C 220 90, 260 70, 300 80 C 340 90, 380 70, 400 80"
          fill="none"
          stroke="#a855f7"
          strokeWidth="3"
        />
      </svg>
      {/* Labels */}
      <div className="flex justify-between mt-4 text-[10px] text-slate-500 font-bold tracking-widest px-1 uppercase">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
    </div>
  </div>
);

const ReachChart = () => (
  <div className="bg-white/5 border border-white/5 rounded-[32px] p-8 flex-1">
    <div className="flex justify-between items-center mb-8">
      <div>
        <h3 className="text-white text-lg font-bold">Monthly Reach</h3>
        <p className="text-slate-400 text-xs">Total accounts reached</p>
      </div>
      <Icon icon="mdi:eye-outline" width={24} className="text-indigo-400" />
    </div>

    <div className="h-48 flex items-end justify-between gap-4 px-2">
      {[40, 30, 50, 80, 100, 140].map((height, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-4">
          <div
            className="w-full rounded-t-xl bg-gradient-to-t from-indigo-500/20 to-indigo-500 hover:from-indigo-400/40 hover:to-indigo-400 transition-all cursor-pointer"
            style={{ height: `${height}px` }}
          />
        </div>
      ))}
    </div>
    {/* Labels */}
    <div className="flex justify-between mt-4 text-[10px] text-slate-500 font-bold tracking-widest px-1 uppercase">
      <span>Jan</span>
      <span>Feb</span>
      <span>Mar</span>
      <span>Apr</span>
      <span>May</span>
      <span>Jun</span>
    </div>
  </div>
);

/* ── Main Dashboard Page ── */
export default function DashboardLayout() {
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <div className="min-h-screen bg-[#080710] flex font-sans selection:bg-purple-500/30">
      <Sidebar onCreatePost={() => setShowCreatePost(true)} />

      <Outlet />

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
