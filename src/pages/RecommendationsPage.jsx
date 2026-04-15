import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "../components/Button.jsx";
import { Glass } from "../components/Glass.jsx";
import { ProfileModal } from "../ui/ProfileModal.jsx";
import { ProfileCard } from "../ui/ProfileCard.jsx";
import { profiles } from "../ui/mockData.js";

export default function RecommendationsPage() {
  const [selected, setSelected] = useState(null);
  const list = useMemo(() => profiles, []);

  return (
    <div className="section">
      <div className="stack" style={{ marginBottom: 16 }}>
        <div className="kicker">Recommendations</div>
        <div className="flex items-end justify-between gap-12">
          <h2 className="h2">Suitable matches for your preferences</h2>
          <Button variant="secondary" className="hidden sm:inline-flex">
            <Sparkles size={18} />
            Update preferences
          </Button>
        </div>
      </div>

      <Glass className="p-5" style={{ borderRadius: 22, marginBottom: 18 }}>
        <div className="grid gridCols2">
          {[
            ["Age", "24–36"],
            ["Location", "India • Metro"],
            ["Religion/Caste", "As per preference"],
            ["Education", "Graduate+"]
          ].map(([k, v]) => (
            <div
              key={k}
              className="pill"
              style={{
                padding: "10px 14px",
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.35)"
              }}
            >
              <div className="kicker">{k}</div>
              <div style={{ fontWeight: 700, letterSpacing: 0.2 }}>{v}</div>
            </div>
          ))}
        </div>
      </Glass>

      <div className="grid gridCols3">
        {list.map((p, idx) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: Math.min(idx * 0.03, 0.2), ease: [0.16, 1, 0.3, 1] }}
          >
            <ProfileCard profile={p} onOpen={() => setSelected(p)} showInterest />
          </motion.div>
        ))}
      </div>

      <ProfileModal profile={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

