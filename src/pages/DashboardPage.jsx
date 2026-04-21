import React from "react";
import { profiles, requestsReceived, chats } from "../ui/mockData.js";
import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground.jsx";

function StatCard({ label, value, helper }) {
  return (
    <div className="glass p-5" style={{ borderRadius: 18 }}>
      <div className="kicker">{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 600, marginTop: 6 }}>
        {value}
      </div>
      {helper ? (
        <div className="muted" style={{ marginTop: 6, lineHeight: 1.7 }}>
          {helper}
        </div>
      ) : null}
    </div>
  );
}

export default function DashboardPage() {
  const completion = 78;

  return (
    <motion.div 
      className="section"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ paddingTop: 40 }}
    >
      <AnimatedBackground />
      <div className="stack" style={{ marginBottom: 32, position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="kicker" style={{ color: 'var(--accent-primary)' }}>User Dashboard</motion.div>
        <h2 className="h2" style={{ fontSize: 42 }}>Welcome back, <br /><span style={{ color: 'var(--accent-primary)' }}>FindMySelf</span> Profile</h2>
        <div className="muted" style={{ lineHeight: 1.8, maxWidth: 700, fontSize: 16 }}>
          A quick summary of profile completion, matches, requests, and messages—presented simply for clarity and elegance.
        </div>
      </div>

      <div className="grid gridCols3" style={{ position: 'relative', zIndex: 1, gap: 24 }}>
        <StatCard label="Profile completion" value={`${completion}%`} helper="Complete your details to improve match quality." />
        <StatCard label="Active Matches" value={profiles.length} helper="Recommendations based on your lifestyle." />
        <StatCard label="Pending Requests" value={requestsReceived.length} helper="Review and respond to recent interest." />
      </div>

      <div className="grid gridCols2" style={{ marginTop: 18, position: 'relative', zIndex: 1 }}>
        <div className="glass p-6" style={{ borderRadius: 18 }}>
          <div className="kicker">Recent messages</div>
          <div style={{ marginTop: 10 }} className="stack">
            {chats.slice(0, 3).map((c) => (
              <div key={c.id} className="fmsRow">
                <div>
                  <div style={{ fontWeight: 800 }}>{c.name}</div>
                  <div className="muted" style={{ marginTop: 3 }}>{c.last}</div>
                </div>
                <div className="muted" style={{ fontSize: 12 }}>{c.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-6" style={{ borderRadius: 18 }}>
          <div className="kicker">Profile checklist</div>
          <div className="stack" style={{ marginTop: 10 }}>
            {[
              ["Personal details", true],
              ["Religious details", true],
              ["Education & career", true],
              ["Family details", false],
              ["Lifestyle", true],
              ["Partner preferences", false]
            ].map(([t, done]) => (
              <div key={t} className="fmsRow">
                <div style={{ fontWeight: 700 }}>{t}</div>
                <div className={`fmsBadge ${done ? "fmsBadgeVerified" : "fmsBadgeNew"}`}>
                  {done ? "Completed" : "Pending"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

