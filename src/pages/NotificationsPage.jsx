import { useState } from "react";
import { Icon } from "@iconify/react";

/* ── Mock Data ── */
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "like",
    user: "Aria Chen",
    initials: "AC",
    gradient: "linear-gradient(135deg, #a855f7, #ec4899)",
    text: "liked your post",
    detail: "Beautiful sunset captured from the rooftop!",
    time: "2m ago",
    read: false,
    icon: "mdi:heart",
    iconColor: "#ec4899",
    iconBg: "rgba(236,72,153,0.12)",
  },
  {
    id: 2,
    type: "comment",
    user: "Marcus Rivera",
    initials: "MR",
    gradient: "linear-gradient(135deg, #6366f1, #a855f7)",
    text: "commented on your photo",
    detail: "This is absolutely stunning work! The composition is perfect.",
    time: "15m ago",
    read: false,
    icon: "mdi:comment",
    iconColor: "#a855f7",
    iconBg: "rgba(168,85,247,0.12)",
  },
  {
    id: 3,
    type: "follow",
    user: "Luna Patel",
    initials: "LP",
    gradient: "linear-gradient(135deg, #ec4899, #f97316)",
    text: "started following you",
    detail: null,
    time: "1h ago",
    read: false,
    icon: "mdi:account-plus",
    iconColor: "#6366f1",
    iconBg: "rgba(99,102,241,0.12)",
    followBack: true,
  },
  {
    id: 4,
    type: "like",
    user: "Kai Nakamura",
    initials: "KN",
    gradient: "linear-gradient(135deg, #f97316, #eab308)",
    text: "liked your post",
    detail: "Creative workspace setup — minimal but functional.",
    time: "2h ago",
    read: true,
    icon: "mdi:heart",
    iconColor: "#ec4899",
    iconBg: "rgba(236,72,153,0.12)",
  },
  {
    id: 5,
    type: "mention",
    user: "Sophie Laurent",
    initials: "SL",
    gradient: "linear-gradient(135deg, #06b6d4, #6366f1)",
    text: "mentioned you in a comment",
    detail: "@you should definitely check this out!",
    time: "5h ago",
    read: true,
    icon: "mdi:at",
    iconColor: "#06b6d4",
    iconBg: "rgba(6,182,212,0.12)",
  },
  {
    id: 6,
    type: "comment",
    user: "Design Team",
    initials: "DT",
    gradient: "linear-gradient(135deg, #22c55e, #06b6d4)",
    text: "replied to your comment",
    detail: "Great suggestion! We'll incorporate that in the next sprint.",
    time: "8h ago",
    read: true,
    icon: "mdi:comment",
    iconColor: "#a855f7",
    iconBg: "rgba(168,85,247,0.12)",
  },
  {
    id: 7,
    type: "like",
    user: "Creative Hub",
    initials: "CH",
    gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)",
    text: "and 12 others liked your post",
    detail: "Weekly design inspiration — Vol. 24",
    time: "1d ago",
    read: true,
    icon: "mdi:heart",
    iconColor: "#ec4899",
    iconBg: "rgba(236,72,153,0.12)",
  },
  {
    id: 8,
    type: "follow",
    user: "Alex Morgan",
    initials: "AM",
    gradient: "linear-gradient(135deg, #eab308, #22c55e)",
    text: "started following you",
    detail: null,
    time: "1d ago",
    read: true,
    icon: "mdi:account-plus",
    iconColor: "#6366f1",
    iconBg: "rgba(99,102,241,0.12)",
    followBack: true,
  },
  {
    id: 9,
    type: "mention",
    user: "Jordan Lee",
    initials: "JL",
    gradient: "linear-gradient(135deg, #ec4899, #a855f7)",
    text: "mentioned you in a post",
    detail: "Collab project with @you — coming soon!",
    time: "2d ago",
    read: true,
    icon: "mdi:at",
    iconColor: "#06b6d4",
    iconBg: "rgba(6,182,212,0.12)",
  },
];

const FILTERS = [
  { key: "all", label: "All", icon: "mdi:bell-outline" },
  { key: "like", label: "Likes", icon: "mdi:heart-outline" },
  { key: "comment", label: "Comments", icon: "mdi:comment-outline" },
  { key: "follow", label: "Follows", icon: "mdi:account-plus-outline" },
  { key: "mention", label: "Mentions", icon: "mdi:at" },
];

/* ── Time Groups ── */
const groupByTime = (notifications) => {
  const groups = { Today: [], Yesterday: [], "This Week": [], Earlier: [] };

  notifications.forEach((n) => {
    const t = n.time.toLowerCase();
    if (t.includes("m ago") || t.includes("h ago")) groups["Today"].push(n);
    else if (t.includes("1d ago")) groups["Yesterday"].push(n);
    else if (t.includes("d ago")) groups["This Week"].push(n);
    else groups["Earlier"].push(n);
  });

  return Object.entries(groups).filter(([, items]) => items.length > 0);
};

/* ── Notification Item ── */
const NotificationItem = ({ notif, onMarkRead }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-start gap-4 px-6 py-4 transition-all duration-200 cursor-pointer group relative"
      style={{
        background: !notif.read
          ? "rgba(168,85,247,0.04)"
          : hovered
            ? "rgba(255,255,255,0.02)"
            : "transparent",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !notif.read && onMarkRead(notif.id)}
    >
      {/* Unread dot */}
      {!notif.read && (
        <div
          className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
          style={{ background: "#a855f7", boxShadow: "0 0 8px #a855f7" }}
        />
      )}

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold transition-transform duration-200 group-hover:scale-105"
          style={{ background: notif.gradient }}
        >
          {notif.initials}
        </div>
        {/* Type badge */}
        <div
          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2"
          style={{
            background: notif.iconBg,
            borderColor: "#0d0b1a",
          }}
        >
          <Icon icon={notif.icon} width={12} style={{ color: notif.iconColor }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-[14px] leading-relaxed">
          <span className="text-white font-semibold">{notif.user}</span>{" "}
          <span className="text-slate-400">{notif.text}</span>
        </p>
        {notif.detail && (
          <p
            className="text-xs mt-1.5 line-clamp-2 leading-relaxed"
            style={{ color: "#64748b" }}
          >
            {notif.detail}
          </p>
        )}
        <p className="text-slate-600 text-[11px] mt-1.5 font-medium">
          {notif.time}
        </p>
      </div>

      {/* Action */}
      <div className="flex-shrink-0 pt-1">
        {notif.type === "follow" && notif.followBack ? (
          <button
            className="px-4 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #a855f7, #7c3aed)",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(168,85,247,0.3)",
            }}
          >
            Follow
          </button>
        ) : notif.type === "like" || notif.type === "comment" ? (
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{
              background: hovered ? "rgba(255,255,255,0.06)" : "transparent",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "#64748b",
            }}
          >
            <Icon icon="mdi:chevron-right" width={18} />
          </button>
        ) : null}
      </div>
    </div>
  );
};

/* ── Empty State ── */
const EmptyState = ({ filter }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-5 animate-fadeIn">
    <div
      className="w-20 h-20 rounded-3xl flex items-center justify-center"
      style={{
        background: "rgba(168,85,247,0.1)",
        border: "1px solid rgba(168,85,247,0.2)",
      }}
    >
      <Icon
        icon="mdi:bell-off-outline"
        width={36}
        className="text-purple-400"
      />
    </div>
    <div className="text-center">
      <p className="text-white font-bold text-xl font-[Syne]">
        No notifications yet
      </p>
      <p className="text-slate-500 text-sm mt-2 max-w-xs">
        {filter === "all"
          ? "When someone interacts with your posts, you'll see it here."
          : `No ${filter} notifications to show.`}
      </p>
    </div>
  </div>
);

/* ══════════════════════════════════════
   Main Notifications Page
══════════════════════════════════════ */
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications =
    activeFilter === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeFilter);

  const grouped = groupByTime(filteredNotifications);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <main className="flex-1 p-8 md:p-10 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        {/* ── Header ── */}
        <header className="mb-8 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h1
                className="text-white text-3xl md:text-4xl font-bold tracking-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                    boxShadow: "0 2px 8px rgba(168,85,247,0.3)",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-slate-400 text-sm font-medium">
              Stay up to date with your activity
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-purple-400 text-sm font-semibold hover:text-purple-300 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </header>

        {/* ── Filter Tabs ── */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
              style={{
                background:
                  activeFilter === f.key
                    ? "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(99,102,241,0.2))"
                    : "rgba(255,255,255,0.04)",
                border: `1px solid ${
                  activeFilter === f.key
                    ? "rgba(168,85,247,0.35)"
                    : "rgba(255,255,255,0.06)"
                }`,
                color: activeFilter === f.key ? "#c084fc" : "#94a3b8",
              }}
            >
              <Icon icon={f.icon} width={16} />
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Notifications List ── */}
        {filteredNotifications.length === 0 ? (
          <EmptyState filter={activeFilter} />
        ) : (
          <div
            className="rounded-[28px] overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {grouped.map(([label, items]) => (
              <div key={label}>
                {/* Group header */}
                <div
                  className="px-6 py-3 flex items-center gap-3"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                    {label}
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  />
                </div>

                {/* Items */}
                {items.map((notif) => (
                  <NotificationItem
                    key={notif.id}
                    notif={notif}
                    onMarkRead={markAsRead}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Styles ── */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}
