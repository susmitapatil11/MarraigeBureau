import React from "react";
import { Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/Button.jsx";
import { Glass } from "../components/Glass.jsx";

export function ProfileCard({ profile, onOpen, showInterest = false, onSendInterest }) {
  return (
    <motion.div transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}>
      <Glass className="p-4" style={{ borderRadius: 22, overflow: "hidden" }}>
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
              height: 210,
              borderRadius: 18,
              backgroundImage: `url(${profile.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "1px solid var(--border)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.00), rgba(0,0,0,0.35))"
              }}
            />
            <div style={{ position: "absolute", left: 12, bottom: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {profile.badges?.map((b) => (
                <span
                  key={b}
                  className="pill"
                  style={{
                    padding: "6px 10px",
                    border: "1px solid rgba(255,255,255,0.22)",
                    background: "rgba(0,0,0,0.22)",
                    color: "white",
                    fontSize: 11,
                    letterSpacing: 0.4
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </button>

        <div style={{ marginTop: 12 }} className="stack">
          <div className="flex items-start justify-between gap-12">
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600 }}>
                {profile.name}, {profile.age}
              </div>
              <div className="muted" style={{ marginTop: 2 }}>
                {profile.title} • {profile.location}
              </div>
            </div>
            <div
              className="pill"
              style={{
                padding: "8px 10px",
                border: "1px solid var(--border)",
                background: "rgba(197, 164, 109, 0.14)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8
              }}
              title="Match score"
            >
              <Sparkles size={16} />
              <span style={{ fontWeight: 900, letterSpacing: 0.4 }}>
                {profile.match}%
              </span>
            </div>
          </div>

          <div className="muted" style={{ lineHeight: 1.65, fontSize: 13 }}>
            {profile.about}
          </div>

          <div className="flex items-center justify-between gap-10">
            <Button variant="secondary" onClick={onOpen}>
              View profile
            </Button>
            {showInterest ? (
              <Button variant="primary" onClick={() => onSendInterest && onSendInterest(profile.id)}>
                <Heart size={18} />
                Send Interest
              </Button>
            ) : null}
          </div>
        </div>
      </Glass>
    </motion.div>
  );
}

