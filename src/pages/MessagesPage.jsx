import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";

/* ── Mock Data ── */
const MOCK_CONVERSATIONS = [
  {
    id: 1,
    name: "Aria Chen",
    initials: "AC",
    lastMessage: "That sounds like an amazing idea! Let's do it.",
    time: "2m",
    unread: 2,
    online: true,
    gradient: "linear-gradient(135deg, #a855f7, #ec4899)",
  },
  {
    id: 2,
    name: "Marcus Rivera",
    initials: "MR",
    lastMessage: "I just finished the new layout. Check it out!",
    time: "15m",
    unread: 0,
    online: true,
    gradient: "linear-gradient(135deg, #6366f1, #a855f7)",
  },
  {
    id: 3,
    name: "Luna Patel",
    initials: "LP",
    lastMessage: "Thanks for sharing those resources 🙌",
    time: "1h",
    unread: 0,
    online: false,
    gradient: "linear-gradient(135deg, #ec4899, #f97316)",
  },
  {
    id: 4,
    name: "Design Team",
    initials: "DT",
    lastMessage: "Alex: Let's schedule a review for tomorrow",
    time: "3h",
    unread: 5,
    online: false,
    gradient: "linear-gradient(135deg, #22c55e, #06b6d4)",
  },
  {
    id: 5,
    name: "Kai Nakamura",
    initials: "KN",
    lastMessage: "The animation looks smooth now!",
    time: "5h",
    unread: 0,
    online: false,
    gradient: "linear-gradient(135deg, #f97316, #eab308)",
  },
  {
    id: 6,
    name: "Sophie Laurent",
    initials: "SL",
    lastMessage: "See you at the meetup!",
    time: "1d",
    unread: 0,
    online: false,
    gradient: "linear-gradient(135deg, #06b6d4, #6366f1)",
  },
  {
    id: 7,
    name: "Creative Hub",
    initials: "CH",
    lastMessage: "You: I'll send the files tonight",
    time: "2d",
    unread: 0,
    online: false,
    gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)",
  },
];

const MOCK_MESSAGES = [
  {
    id: 1,
    sender: "them",
    text: "Hey! Did you check out the new design updates?",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "me",
    text: "Yes! The glassmorphism effects look completely stunning. Can't wait to use them.",
    time: "10:32 AM",
  },
  {
    id: 3,
    sender: "them",
    text: "Right? The blur effects and translucent cards are so clean. I think we should apply them to the dashboard too.",
    time: "10:33 AM",
  },
  {
    id: 4,
    sender: "me",
    text: "Absolutely. I'll start working on the dashboard components tomorrow.",
    time: "10:35 AM",
  },
  {
    id: 5,
    sender: "them",
    text: "That sounds like an amazing idea! Let's do it.",
    time: "10:36 AM",
  },
];

/* ── Conversation Item ── */
const ConversationItem = ({ convo, isActive, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-200 text-left group"
    style={{
      background: isActive
        ? "linear-gradient(135deg, rgba(168,85,247,0.12), rgba(99,102,241,0.12))"
        : "transparent",
      border: isActive
        ? "1px solid rgba(168,85,247,0.2)"
        : "1px solid transparent",
    }}
  >
    {/* Avatar */}
    <div className="relative flex-shrink-0">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold transition-transform duration-200 group-hover:scale-105"
        style={{ background: convo.gradient }}
      >
        {convo.initials}
      </div>
      {convo.online && (
        <div
          className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2"
          style={{
            background: "#22c55e",
            borderColor: "#0d0b1a",
          }}
        />
      )}
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-0.5">
        <h4
          className={`text-sm font-semibold truncate ${
            convo.unread > 0 ? "text-white" : "text-slate-200"
          }`}
        >
          {convo.name}
        </h4>
        <span
          className={`text-[11px] flex-shrink-0 ml-2 ${
            convo.unread > 0
              ? "text-purple-400 font-semibold"
              : "text-slate-500"
          }`}
        >
          {convo.time}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <p
          className={`text-xs truncate ${
            convo.unread > 0 ? "text-slate-300 font-medium" : "text-slate-500"
          }`}
        >
          {convo.lastMessage}
        </p>
        {convo.unread > 0 && (
          <div
            className="flex-shrink-0 ml-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
          >
            {convo.unread}
          </div>
        )}
      </div>
    </div>
  </button>
);

/* ── Chat Bubble ── */
const ChatBubble = ({ message }) => {
  const isMe = message.sender === "me";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1`}>
      <div
        className={`max-w-[75%] px-4 py-2.5 text-[14px] leading-relaxed ${
          isMe
            ? "text-white rounded-2xl rounded-br-md"
            : "text-slate-200 rounded-2xl rounded-bl-md"
        }`}
        style={{
          background: isMe
            ? "linear-gradient(135deg, #7c3aed, #a855f7)"
            : "rgba(255,255,255,0.06)",
          border: isMe ? "none" : "1px solid rgba(255,255,255,0.06)",
          boxShadow: isMe ? "0 4px 16px rgba(168,85,247,0.25)" : "none",
        }}
      >
        {message.text}
      </div>
    </div>
  );
};

/* ── Typing Indicator ── */
const TypingIndicator = () => (
  <div className="flex justify-start mb-1">
    <div
      className="px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-slate-400"
          style={{
            animation: `typing 1.4s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  </div>
);

/* ── Empty Chat State ── */
const EmptyChatState = () => (
  <div className="flex-1 flex flex-col items-center justify-center gap-5">
    <div
      className="w-20 h-20 rounded-3xl flex items-center justify-center"
      style={{
        background: "rgba(168,85,247,0.1)",
        border: "1px solid rgba(168,85,247,0.2)",
      }}
    >
      <Icon
        icon="mdi:message-text-outline"
        width={36}
        className="text-purple-400"
      />
    </div>
    <div className="text-center">
      <p className="text-white font-bold text-xl font-[Syne]">
        Select a conversation
      </p>
      <p className="text-slate-500 text-sm mt-2 max-w-xs">
        Choose from your existing conversations or start a new one
      </p>
    </div>
    <button
      className="mt-1 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: "linear-gradient(135deg, #a855f7, #7c3aed)",
        color: "#fff",
        boxShadow: "0 4px 16px rgba(168,85,247,0.3)",
      }}
    >
      <Icon icon="mdi:plus" width={16} className="inline mr-1.5 -mt-0.5" />
      New Message
    </button>
  </div>
);

/* ══════════════════════════════════════
   Main Messages Page
══════════════════════════════════════ */
export default function MessagesPage() {
  const [activeConvo, setActiveConvo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  /* ── Scroll to bottom ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* ── Filter conversations ── */
  const filteredConvos = MOCK_CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  /* ── Send message ── */
  const handleSend = () => {
    if (!messageInput.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "me",
      text: messageInput.trim(),
      time: "Now",
    };

    setMessages((prev) => [...prev, newMsg]);
    setMessageInput("");

    // Simulate typing response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "them",
          text: "That's great! I'll get back to you soon.",
          time: "Now",
        },
      ]);
    }, 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectConvo = (convo) => {
    setActiveConvo(convo);
    // In a real app, this would load messages for the conversation
  };

  return (
    <main className="flex-1 p-6 md:p-8 overflow-hidden flex flex-col h-screen">
      {/* ── Header ── */}
      <header className="mb-5 flex items-end justify-between">
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, #a855f7, #7c3aed)",
            color: "#fff",
            boxShadow: "0 4px 16px rgba(168,85,247,0.3)",
          }}
        >
          <Icon icon="mdi:plus" width={18} />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </header>

      {/* ── Main Chat Container ── */}
      <div
        className="flex-1 flex rounded-[28px] overflow-hidden min-h-0"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* ── Conversations Sidebar ── */}
        <div
          className={`w-full md:w-80 lg:w-[340px] flex-shrink-0 flex flex-col border-r border-white/5 ${
            activeConvo ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Search */}
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Icon
                icon="mdi:magnify"
                width={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none transition-all duration-200 placeholder:text-slate-500"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(168,85,247,0.3)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.06)";
                }}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex px-4 pt-3 gap-1">
            {["All", "Unread", "Groups"].map((tab, i) => (
              <button
                key={tab}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                style={{
                  background: i === 0 ? "rgba(168,85,247,0.12)" : "transparent",
                  color: i === 0 ? "#c084fc" : "#64748b",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-0.5">
            {filteredConvos.map((convo) => (
              <ConversationItem
                key={convo.id}
                convo={convo}
                isActive={activeConvo?.id === convo.id}
                onClick={() => selectConvo(convo)}
              />
            ))}
            {filteredConvos.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-sm">
                No conversations found
              </div>
            )}
          </div>
        </div>

        {/* ── Chat Area ── */}
        <div
          className={`flex-1 flex flex-col min-w-0 ${
            !activeConvo ? "hidden md:flex" : "flex"
          }`}
        >
          {activeConvo ? (
            <>
              {/* Chat Header */}
              <div
                className="px-6 py-4 flex items-center justify-between border-b border-white/5"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div className="flex items-center gap-3.5">
                  {/* Mobile back button */}
                  <button
                    onClick={() => setActiveConvo(null)}
                    className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all mr-1"
                  >
                    <Icon icon="mdi:arrow-left" width={20} />
                  </button>
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: activeConvo.gradient }}
                    >
                      {activeConvo.initials}
                    </div>
                    {activeConvo.online && (
                      <div
                        className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                        style={{
                          background: "#22c55e",
                          borderColor: "#0d0b1a",
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-[15px]">
                      {activeConvo.name}
                    </h3>
                    <p className="text-slate-500 text-xs">
                      {activeConvo.online ? "Online" : "Last seen recently"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200">
                    <Icon icon="mdi:phone-outline" width={20} />
                  </button>
                  <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200">
                    <Icon icon="mdi:video-outline" width={20} />
                  </button>
                  <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200">
                    <Icon icon="mdi:dots-vertical" width={20} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
                {/* Date separator */}
                <div className="flex items-center gap-4 my-2">
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-slate-600 text-[11px] font-semibold uppercase tracking-wider">
                    Today
                  </span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                {messages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} />
                ))}

                {isTyping && <TypingIndicator />}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div
                className="px-5 py-4 border-t border-white/5"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div
                  className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-purple-400 hover:bg-white/5 transition-all duration-200 flex-shrink-0">
                    <Icon icon="mdi:plus-circle-outline" width={22} />
                  </button>
                  <input
                    ref={inputRef}
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-white text-[15px] focus:outline-none placeholder:text-slate-500 min-w-0"
                  />
                  <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-purple-400 hover:bg-white/5 transition-all duration-200 flex-shrink-0">
                    <Icon icon="mdi:emoticon-outline" width={22} />
                  </button>
                  <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-purple-400 hover:bg-white/5 transition-all duration-200 flex-shrink-0">
                    <Icon icon="mdi:image-outline" width={22} />
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!messageInput.trim()}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all duration-200 flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                    style={{
                      background: messageInput.trim()
                        ? "linear-gradient(135deg, #a855f7, #7c3aed)"
                        : "rgba(255,255,255,0.06)",
                      boxShadow: messageInput.trim()
                        ? "0 4px 12px rgba(168,85,247,0.3)"
                        : "none",
                    }}
                  >
                    <Icon icon="mdi:send" width={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <EmptyChatState />
          )}
        </div>
      </div>

      {/* ── Styles ── */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </main>
  );
}
