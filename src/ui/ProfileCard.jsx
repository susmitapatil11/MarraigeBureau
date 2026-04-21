import React, { useState } from "react";
import { Heart, Sparkles, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/Button.jsx";
import { Glass } from "../components/Glass.jsx";
import { useNavigate } from "react-router-dom";

export function ProfileCard({ profile, onOpen, showInterest = false, onSendInterest }) {
  const navigate = useNavigate();
  const [testConnectionId, setTestConnectionId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInterestClick = async () => {
    if (!onSendInterest) return;
    setLoading(true);
    try {
      const connId = await onSendInterest(profile.id);
      if (connId) {
        setTestConnectionId(connId);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.div transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} className="hover-lift">
      <Glass className="p-4" style={{ borderRadius: 28, overflow: "hidden" }}>
        <button
          onClick={onOpen}
          className="pill"
          style={{
            border: "none",
            padding: 0,
            margin: 0,
            background: "transparent",
            width: "100%",
            textAlign: "left",
            cursor: "pointer"
          }}
        >
          <div
            style={{
              height: 240,
              borderRadius: 24,
              backgroundImage: `url(${profile.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "1px solid var(--glass-border)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.00), rgba(0,0,0,0.4))"
              }}
            />
            <div style={{ position: "absolute", left: 16, bottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {profile.badges?.map((b) => (
                <span
                  key={b}
                  className="pill"
                  style={{
                    padding: "6px 12px",
                    border: "1px solid rgba(255,255,255,0.3)",
                    background: "rgba(0,0,0,0.4)",
                    backdropFilter: "blur(4px)",
                    color: "white",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: 0.5
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </button>

        <div style={{ marginTop: 16, padding: '0 4px' }} className="stack">
          <div className="flex items-start justify-between gap-12">
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>
                {profile.name}, {profile.age}
              </div>
              <div className="muted" style={{ marginTop: 4, fontWeight: 500 }}>
                {profile.title} • {profile.location}
              </div>
            </div>
            <div
              className="pill"
              style={{
                padding: "8px 12px",
                border: "1px solid var(--border-theme)",
                background: "rgba(231, 76, 91, 0.08)",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: 'var(--accent-primary)'
              }}
            >
              <Sparkles size={14} />
              <span style={{ fontWeight: 800, fontSize: 13 }}>
                {profile.match}%
              </span>
            </div>
          </div>

          <div className="muted" style={{ lineHeight: 1.6, fontSize: 13, minHeight: 40 }}>
            {profile.about}
          </div>

          <div className="flex items-center justify-between gap-12" style={{ marginTop: 8 }}>
            <Button variant="secondary" onClick={onOpen} className="pill" style={{ flex: 1 }}>
              Profile
            </Button>
            {showInterest ? (
              testConnectionId ? (
                <Button variant="primary" onClick={() => navigate(`/test/${testConnectionId}`)} className="pill" style={{ flex: 1.5 }}>
                  <ClipboardList size={18} />
                  Match Test
                </Button>
              ) : (
                <Button variant="primary" onClick={handleInterestClick} disabled={loading} className="pill" style={{ flex: 1.5 }}>
                  <Heart size={18} />
                  {loading ? "Sending..." : "Interested"}
                </Button>
              )
            ) : null}
          </div>
        </div>
      </Glass>
    </motion.div>
  );
}

