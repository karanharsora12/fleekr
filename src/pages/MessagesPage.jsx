import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useSearchParams } from "react-router-dom";
import { getConversations, getMessages, sendMessage } from "../services/chatService";
import { getMe } from "../services/authService";
import echo from "../utils/echo";

/* ── Conversation Item ── */
const ConversationItem = ({ convo, isActive, onClick }) => {
  const otherUser = convo.users?.[0] || {};
  const name = otherUser.name || "Unknown User";
  const initials = name.substring(0, 2).toUpperCase();
  const lastMsg = convo.messages?.[0]?.message || "Start a conversation";
  
  // Create a consistent gradient based on user ID or name length
  const colors = [
    ["#a855f7", "#ec4899"],
    ["#6366f1", "#a855f7"],
    ["#ec4899", "#f97316"],
    ["#22c55e", "#06b6d4"],
    ["#06b6d4", "#6366f1"]
  ];
  const colorPair = colors[(otherUser.id || 0) % colors.length];
  const gradient = `linear-gradient(135deg, ${colorPair[0]}, ${colorPair[1]})`;

  return (
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
      <div className="relative flex-shrink-0">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold transition-transform duration-200 group-hover:scale-105 overflow-hidden"
          style={{ background: gradient }}
        >
          {initials}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h4 className="text-sm font-semibold truncate text-slate-200 group-hover:text-white">
            {name}
          </h4>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs truncate text-slate-500 group-hover:text-slate-400">
            {lastMsg}
          </p>
        </div>
      </div>
    </button>
  );
};

/* ── Chat Bubble ── */
const ChatBubble = ({ message, isMe }) => (
  <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1`}>
    <div
      className={`max-w-[75%] px-4 py-2.5 text-[14px] leading-relaxed break-words whitespace-pre-wrap ${
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
      {message.message}
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
        Choose from your existing conversations to start chatting
      </p>
    </div>
  </div>
);

export default function MessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialConvoId = searchParams.get("convo");

  const [currentUser, setCurrentUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // 1. Fetch Current User & Conversations
  useEffect(() => {
    const init = async () => {
      try {
        const me = await getMe();
        setCurrentUser(me);

        const res = await getConversations();
        const convos = res?.conversations || res?.data?.conversations || [];
        setConversations(convos);

        // If there's a ?convo=ID in the URL, try to set it as active
        if (initialConvoId) {
          const found = convos.find(c => c.id.toString() === initialConvoId);
          if (found) {
            setActiveConvo(found);
          }
        }
      } catch (err) {
        console.error("Error loading chat data", err);
      } finally {
        setInitialLoading(false);
      }
    };
    init();
  }, [initialConvoId]);

  // 2. Fetch Messages for Active Conversation
  const loadMessages = async (convoId) => {
    try {
      const res = await getMessages(convoId);
      const msgs = res?.messages || res?.data?.messages || [];
      // Backend returns latest() which is descending order. We need oldest first to render top-to-bottom.
      setMessages([...msgs].reverse());
    } catch (err) {
      console.error("Error loading messages", err);
    }
  };

  useEffect(() => {
    if (activeConvo) {
      loadMessages(activeConvo.id);
      setSearchParams({ convo: activeConvo.id });

      // Subscribe to private channel
      const channel = echo.private(`conversation.${activeConvo.id}`);
      
      channel.listen('MessageSent', (e) => {
        // Only append if it's not our own message (which was appended optimistically)
        setMessages((prev) => {
          if (prev.find(m => m.id === e.message.id)) return prev;
          return [...prev, e.message];
        });
      });

      return () => {
        channel.stopListening('MessageSent');
        echo.leave(`conversation.${activeConvo.id}`);
      };
    } else {
      setMessages([]);
      setSearchParams({});
    }
  }, [activeConvo, setSearchParams]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle Send
  const handleSend = async () => {
    if (!messageInput.trim() || !activeConvo || isSending) return;
    
    const text = messageInput.trim();
    setMessageInput("");
    setIsSending(true);

    // Optimistic UI update
    const optMsg = {
      id: "temp-" + Date.now(),
      sender_id: currentUser.id,
      message: text,
    };
    setMessages(prev => [...prev, optMsg]);

    try {
      const res = await sendMessage(activeConvo.id, text);
      const savedMsg = res?.data || res;
      // Replace optimistic message with real one to avoid duplicates on broadcast
      setMessages(prev => prev.map(m => m.id === optMsg.id ? savedMsg : m));
    } catch (error) {
      console.error("Error sending message", error);
      // Revert optimistic message
      setMessages(prev => prev.filter(m => m.id !== optMsg.id));
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredConvos = conversations.filter((c) => {
    const otherUser = c.users?.[0] || {};
    return (otherUser.name || "").toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <main className="flex-1 p-6 md:p-8 overflow-hidden flex flex-col h-screen">
      {/* ── Header ── */}
      <header className="mb-5 flex items-end justify-between">
        <h1 className="text-white text-2xl font-bold font-[Syne]">Messages</h1>
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
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-0.5">
            {initialLoading ? (
              <div className="text-center py-10">
                <Icon icon="mdi:loading" className="animate-spin text-purple-400 mx-auto" width={24} />
              </div>
            ) : filteredConvos.length > 0 ? (
              filteredConvos.map((convo) => (
                <ConversationItem
                  key={convo.id}
                  convo={convo}
                  isActive={activeConvo?.id === convo.id}
                  onClick={() => setActiveConvo(convo)}
                />
              ))
            ) : (
              <div className="text-center py-10 text-slate-500 text-sm px-4">
                No conversations found. Go to a user's profile to start chatting.
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
                  <button
                    onClick={() => setActiveConvo(null)}
                    className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all mr-1"
                  >
                    <Icon icon="mdi:arrow-left" width={20} />
                  </button>
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold bg-purple-500"
                    >
                      {(activeConvo.users?.[0]?.name || "U").substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-[15px]">
                      {activeConvo.users?.[0]?.name || "Unknown User"}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
                {messages.map((msg) => (
                  <ChatBubble 
                    key={msg.id} 
                    message={msg} 
                    isMe={msg.sender_id === currentUser?.id}
                  />
                ))}
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
                  <input
                    ref={inputRef}
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-white text-[15px] focus:outline-none placeholder:text-slate-500 min-w-0"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!messageInput.trim() || isSending}
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
                    <Icon icon={isSending ? "mdi:loading" : "mdi:send"} className={isSending ? "animate-spin" : ""} width={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <EmptyChatState />
          )}
        </div>
      </div>
    </main>
  );
}
