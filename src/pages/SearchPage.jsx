import React, { useMemo, useState } from "react";
import { ProfileCard } from "../ui/ProfileCard.jsx";
import { ProfileModal } from "../ui/ProfileModal.jsx";
import { profiles } from "../ui/mockData.js";

export default function SearchPage() {
  const [selected, setSelected] = useState(null);
  const list = useMemo(() => profiles, []);

  return (
    <div className="section">
      <div className="stack" style={{ marginBottom: 16 }}>
        <div className="kicker">Search & Match</div>
        <h2 className="h2">Filter profiles with clarity</h2>
        <div className="muted" style={{ lineHeight: 1.7, maxWidth: 860 }}>
          Use structured filters to narrow down by age, community, education, profession, and location.
          Profiles are presented in a simple list focused on essentials.
        </div>
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "320px 1fr",
          gap: 18,
          alignItems: "start"
        }}
      >
        <aside className="glass p-5" style={{ borderRadius: 18 }}>
          <div className="kicker" style={{ marginBottom: 12 }}>
            Filters
          </div>

          <div className="stack" style={{ gap: 10 }}>
            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">Age</span>
              <select className="fmsField">
                <option>Any</option>
                <option>21–25</option>
                <option>26–30</option>
                <option>31–35</option>
                <option>36–40</option>
              </select>
            </label>

            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">Religion</span>
              <select className="fmsField">
                <option>Any</option>
                <option>Hindu</option>
                <option>Muslim</option>
                <option>Christian</option>
                <option>Sikh</option>
                <option>Jain</option>
              </select>
            </label>

            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">Caste</span>
              <input className="fmsField" placeholder="Optional" />
            </label>

            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">Education</span>
              <select className="fmsField">
                <option>Any</option>
                <option>Graduate</option>
                <option>Post Graduate</option>
                <option>Doctorate</option>
              </select>
            </label>

            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">Profession</span>
              <input className="fmsField" placeholder="e.g., Engineer, Doctor" />
            </label>

            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">Location</span>
              <input className="fmsField" placeholder="City / State" />
            </label>

            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">Income</span>
              <select className="fmsField">
                <option>Any</option>
                <option>Below 5 LPA</option>
                <option>5–10 LPA</option>
                <option>10–20 LPA</option>
                <option>20+ LPA</option>
              </select>
            </label>

            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">Lifestyle</span>
              <select className="fmsField">
                <option>Any</option>
                <option>Family-first</option>
                <option>Traditional</option>
                <option>Balanced</option>
              </select>
            </label>
          </div>
        </aside>

        <main className="stack" style={{ gap: 14 }}>
          <div className="glass p-4" style={{ borderRadius: 18 }}>
            <div className="flex items-center justify-between gap-12">
              <div>
                <div className="kicker">Results</div>
                <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>
                  Showing {list.length} profiles
                </div>
              </div>
              <select className="fmsField" style={{ width: 240 }}>
                <option>Sort: Recommended</option>
                <option>Sort: Newest</option>
                <option>Sort: Age</option>
              </select>
            </div>
          </div>

          <div className="grid gridCols2">
            {list.map((p) => (
              <ProfileCard key={p.id} profile={p} onOpen={() => setSelected(p)} showInterest />
            ))}
          </div>
        </main>
      </div>

      <ProfileModal profile={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

