import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { IconButton } from "../components/Button.jsx";
import { Glass } from "../components/Glass.jsx";

export function ProfileModal({ profile, onClose }) {
  useEffect(() => {
    if (!profile) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [profile, onClose]);

  return (
    <AnimatePresence>
      {profile ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            display: "grid",
            placeItems: "center",
            padding: 18
          }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose?.();
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.45)"
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 12, scale: 0.98, filter: "blur(10px)" }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: "min(980px, 100%)", position: "relative", zIndex: 1 }}
          >
            <Glass className="p-5" style={{ borderRadius: 26 }}>
              <div className="flex items-start justify-between gap-12">
                <div>
                  <div className="kicker">Profile preview</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 600, marginTop: 6 }}>
                    {profile.name}, {profile.age}
                  </div>
                  <div className="muted" style={{ marginTop: 6 }}>
                    {profile.title} • {profile.location}
                  </div>
                </div>
                <IconButton aria-label="Close" onClick={onClose}>
                  <X size={18} />
                </IconButton>
              </div>

              <div className="grid" style={{ gridTemplateColumns: "1.1fr 0.9fr", gap: 16, marginTop: 14 }}>
                <div
                  className="pill"
                  style={{
                    borderRadius: 22,
                    minHeight: 360,
                    backgroundImage: `url(${profile.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: "1px solid rgba(255,255,255,0.18)",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.00), rgba(0,0,0,0.50))"
                    }}
                  />
                  <div style={{ position: "absolute", left: 14, bottom: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {profile.badges?.map((b) => (
                      <span
                        key={b}
                        className="pill"
                        style={{
                          padding: "7px 10px",
                          border: "1px solid rgba(255,255,255,0.18)",
                          background: "rgba(255,255,255,0.10)",
                          color: "white",
                          fontSize: 11,
                          letterSpacing: 0.6
                        }}
                      >
                        {b}
                      </span>
                    ))}
                    <span
                      className="pill"
                      style={{
                        padding: "7px 14px",
                        border: "1px solid var(--border-theme)",
                        background: "rgba(231, 76, 91, 0.1)",
                        color: "var(--accent-primary)",
                        fontSize: 11,
                        letterSpacing: 0.6,
                        boxShadow: "0 0 15px rgba(231, 76, 91, 0.1)"
                      }}
                    >
                      Match {profile.match}%
                    </span>
                  </div>
                </div>

                <div className="stack">
                  <Glass className="p-5" style={{ borderRadius: 22 }}>
                    <div className="kicker">About</div>
                    <div className="muted" style={{ lineHeight: 1.75, marginTop: 8 }}>
                      {profile.about}
                    </div>
                  </Glass>

                  <Glass className="p-5" style={{ borderRadius: 22 }}>
                    <div className="kicker">Preferences</div>
                    <div className="stack" style={{ marginTop: 10 }}>
                      {[
                        ["Intent", "Marriage • 6–12 months"],
                        ["Lifestyle", "Minimal • Family-first"],
                        ["Values", "Trust • Tradition • Growth"]
                      ].map(([k, v]) => (
                        <div
                          key={k}
                          className="pill"
                          style={{
                            padding: "10px 12px",
                            border: "1px solid rgba(255,255,255,0.16)",
                            background: "rgba(255,255,255,0.06)"
                          }}
                        >
                          <div className="kicker">{k}</div>
                          <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </Glass>
                </div>
              </div>
            </Glass>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

