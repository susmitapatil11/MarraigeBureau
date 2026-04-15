import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { IconButton } from "../components/Button.jsx";
import { Glass } from "../components/Glass.jsx";
import { chats } from "../ui/mockData.js";

export default function ChatPage() {
  const [activeId, setActiveId] = useState(chats[0]?.id);
  const [draft, setDraft] = useState("");
  const active = useMemo(() => chats.find((c) => c.id === activeId) ?? chats[0], [activeId]);

  const onSend = () => {
    if (!draft.trim()) return;
    setDraft("");
  };

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
            {chats.map((c) => {
              const isActive = c.id === activeId;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
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
                    <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>{c.name}</div>
                    <div className="muted text-[12px]">{c.time}</div>
                  </div>
                  <div className="muted text-[13px]" style={{ marginTop: 4 }}>
                    {c.last}
                  </div>
                </button>
              );
            })}
          </div>
        </Glass>

        <Glass className="p-5" style={{ borderRadius: 22, height: 560, display: "flex", flexDirection: "column" }}>
          <div className="flex items-center justify-between gap-12">
            <div>
              <div className="kicker">Chatting with</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600 }}>
                {active?.name ?? "—"}
              </div>
            </div>
            <div className="muted text-[12px]">Verified • Premium</div>
          </div>

          <div className="hairline" style={{ margin: "14px 0" }} />

          <div style={{ flex: 1, overflow: "auto", paddingRight: 6 }} className="stack">
            {(active?.messages ?? []).map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.2), ease: [0.16, 1, 0.3, 1] }}
                style={{
                  alignSelf: m.me ? "flex-end" : "flex-start",
                  maxWidth: "78%"
                }}
              >
                <div
                  className="pill"
                  style={{
                    padding: "10px 12px",
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: m.me ? "rgba(198,163,91,0.18)" : "rgba(255,255,255,0.06)",
                    lineHeight: 1.6
                  }}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="hairline" style={{ margin: "14px 0" }} />

          <div className="pill" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write something warm..."
              className="pill"
              style={{
                flex: 1,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.06)",
                color: "var(--text)",
                padding: "12px 14px",
                outline: "none"
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSend();
              }}
            />
            <IconButton aria-label="Send" onClick={onSend}>
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

