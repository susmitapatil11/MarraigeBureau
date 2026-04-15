import React from "react";
import { profiles, requestsReceived, chats } from "../ui/mockData.js";

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
    <div className="section">
      <div className="stack" style={{ marginBottom: 16 }}>
        <div className="kicker">Dashboard</div>
        <h2 className="h2">Your profile and activity</h2>
        <div className="muted" style={{ lineHeight: 1.7, maxWidth: 860 }}>
          A quick summary of profile completion, matches, requests, and messages—presented simply for clarity.
        </div>
      </div>

      <div className="grid gridCols3">
        <StatCard label="Profile completion" value={`${completion}%`} helper="Complete your details to improve match quality." />
        <StatCard label="Matches" value={profiles.length} helper="Based on your preferences and activity." />
        <StatCard label="Received requests" value={requestsReceived.length} helper="Review and respond respectfully." />
      </div>

      <div className="grid gridCols2" style={{ marginTop: 18 }}>
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
    </div>
  );
}

