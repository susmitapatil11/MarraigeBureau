import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { IconButton } from "../components/Button.jsx";
import { Glass } from "../components/Glass.jsx";
import { chatService, userService, connectionService } from "../services/index.js";
import { auth } from "../firebase.js";

export default function ChatPage() {
  const [userChats, setUserChats] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const user = auth.currentUser;

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (activeId) {
      loadMessages(activeId);
    }
  }, [activeId]);

  const loadChats = async () => {
    if (!user) return;
    
    try {
      const result = await chatService.getUserChats(user.uid);
      if (result.success) {
        setUserChats(result.data);
        if (result.data.length > 0 && !activeId) {
          setActiveId(result.data[0].id);
        }
      } else {
        setError(result.error || "Failed to load chats");
      }
    } catch (error) {
      setError(error.message || "Failed to load chats");
    }
  };

  const loadMessages = async (chatId) => {
    setLoading(true);
    try {
      const result = await chatService.getMessages(chatId);
      if (result.success) {
        setMessages(result.data);
        // Mark messages as read
        await chatService.markMessagesRead(chatId, user.uid);
      } else {
        setError(result.error || "Failed to load messages");
      }
    } catch (error) {
      setError(error.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const onSend = async () => {
    if (!draft.trim() || !activeId) return;
    
    const messageText = draft.trim();
    setDraft("");
    
    try {
      const result = await chatService.sendMessage(activeId, user.uid, messageText);
      if (result.success) {
        // Reload messages to show the new one
        await loadMessages(activeId);
        // Update chat list to show new last message
        await loadChats();
      } else {
        setError(result.error || "Failed to send message");
        setDraft(messageText); // Restore draft on error
      }
    } catch (error) {
      setError(error.message || "Failed to send message");
      setDraft(messageText); // Restore draft on error
    }
  };

  const active = useMemo(() => 
    userChats.find((c) => c.id === activeId) || userChats[0] || null, 
    [activeId, userChats]
  );

  return (
    <div className="section">
      <div className="stack" style={{ marginBottom: 16 }}>
        <div className="kicker">Chat</div>
        <h2 className="h2">Simple and respectful conversations</h2>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "360px 1fr", gap: 18 }}>
        <Glass className="p-4" style={{ borderRadius: 22, height: 560 }}>
          <div className="kicker" style={{ marginBottom: 10 }}>
            Recent
          </div>
          <div className="stack" style={{ gap: 10 }}>
            {userChats.length === 0 ? (
              <div className="muted" style={{ textAlign: "center", padding: "20px" }}>
                No chats yet. Start connecting with people to begin chatting.
              </div>
            ) : (
              userChats.map((chat) => {
                const isActive = chat.id === activeId;
                const otherUserId = chat.participants.find(id => id !== user.uid);
                const chatName = `User ${otherUserId?.slice(0, 8)}`; // Placeholder name
                const lastMessage = chat.lastMessage?.text || "No messages yet";
                const time = chat.lastMessage?.timestamp ? 
                  new Date(chat.lastMessage.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                  "";

                return (
                  <button
                    key={chat.id}
                    onClick={() => setActiveId(chat.id)}
                    className="pill"
                    style={{
                      border: "1px solid rgba(255,255,255,0.16)",
                      background: isActive ? "var(--gold-soft)" : "rgba(255,255,255,0.06)",
                      padding: "10px 12px",
                      textAlign: "left",
                      transition: "background 200ms var(--ease-out), opacity 200ms var(--ease-out)",
                      opacity: isActive ? 1 : 0.9
                    }}
                  >
                    <div className="flex items-center justify-between gap-10">
                      <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>{chatName}</div>
                      <div className="muted text-[12px]">{time}</div>
                    </div>
                    <div className="muted text-[13px]" style={{ marginTop: 4 }}>
                      {lastMessage}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </Glass>

        <Glass className="p-5" style={{ borderRadius: 22, height: 560, display: "flex", flexDirection: "column" }}>
          <div className="flex items-center justify-between gap-12">
            <div>
              <div className="kicker">Chatting with</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600 }}>
                {active ? `User ${active.participants.find(id => id !== user.uid)?.slice(0, 8)}` : "Select a chat"}
              </div>
            </div>
            <div className="muted text-[12px]">Verified • Premium</div>
          </div>

          <div className="hairline" style={{ margin: "14px 0" }} />

          {error && (
            <div className="muted" style={{ color: "var(--danger, #ff5a6a)", padding: 8, borderRadius: 8, marginBottom: 8 }}>
              {error}
            </div>
          )}

          <div style={{ flex: 1, overflow: "auto", paddingRight: 6 }} className="stack">
            {loading ? (
              <div className="muted" style={{ textAlign: "center", padding: "20px" }}>
                Loading messages...
              </div>
            ) : !active ? (
              <div className="muted" style={{ textAlign: "center", padding: "20px" }}>
                Select a chat to start messaging
              </div>
            ) : messages.length === 0 ? (
              <div className="muted" style={{ textAlign: "center", padding: "20px" }}>
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((m, idx) => (
                <motion.div
                  key={m.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.2), ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    alignSelf: m.senderId === user.uid ? "flex-end" : "flex-start",
                    maxWidth: "78%"
                  }}
                >
                  <div
                    className="pill"
                    style={{
                      padding: "10px 12px",
                      border: "1px solid rgba(255,255,255,0.18)",
                      background: m.senderId === user.uid ? "rgba(198,163,91,0.18)" : "rgba(255,255,255,0.06)",
                      lineHeight: 1.6
                    }}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="hairline" style={{ margin: "14px 0" }} />

          <div className="pill" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write something warm..."
              className="pill"
              disabled={!active || loading}
              style={{
                flex: 1,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.06)",
                color: "var(--text)",
                padding: "12px 14px",
                outline: "none",
                opacity: (!active || loading) ? 0.6 : 1
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
            />
            <IconButton 
              aria-label="Send" 
              onClick={onSend}
              disabled={!active || loading || !draft.trim()}
            >
              <Send size={18} />
            </IconButton>
          </div>
        </Glass>
      </div>

      <div className="md:hidden muted" style={{ marginTop: 12, fontSize: 12 }}>
        Tip: on mobile, use the bottom navigation to switch sections.
      </div>
    </div>
  );
}

