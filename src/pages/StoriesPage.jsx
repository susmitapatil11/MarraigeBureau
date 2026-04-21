import React, { useState } from "react";
import { motion } from "framer-motion";
import { Glass } from "../components/Glass.jsx";
import { stories } from "../ui/mockData.js";

export default function StoriesPage() {
  const [expanded, setExpanded] = useState(null);

  return (
    <motion.div 
      className="section"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="stack" style={{ marginBottom: 16 }}>
        <div className="kicker">Success Stories</div>
        <h2 className="h2" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Where traditions meet tomorrow</h2>
      </div>

      <div className="grid gridCols2">
        {stories.map((s, idx) => {
          const open = expanded === s.id;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: Math.min(idx * 0.04, 0.2), ease: [0.16, 1, 0.3, 1] }}
            >
              <Glass 
                className="p-6" 
                style={{ 
                  borderRadius: 22,
                  border: '1px solid var(--accent-gold)',
                  boxShadow: '0 0 24px var(--shadow-glow)',
                  opacity: 0.95
                }}
              >
                <div className="flex items-start justify-between gap-12">
                  <div>
                    <div className="kicker">{s.location}</div>
                    <div style={{ 
                      fontFamily: "var(--font-display)", 
                      fontSize: 26, 
                      fontWeight: 600, 
                      marginTop: 6,
                      background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-rose))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {s.couple}
                    </div>
                    <div className="muted" style={{ lineHeight: 1.7, marginTop: 10 }}>
                      {open ? s.full : s.preview}
                    </div>
                  </div>
                  <div
                    className="pill"
                    style={{
                      width: 80,
                      height: 80,
                      border: "2px solid var(--accent-gold)",
                      backgroundImage: `url(${s.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      boxShadow: '0 0 20px rgba(183, 110, 121, 0.3)'
                    }}
                  />
                </div>

                <button
                  className="pill"
                  onClick={() => setExpanded(open ? null : s.id)}
                  style={{
                    marginTop: 14,
                    padding: "10px 12px",
                    width: "fit-content",
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(255,255,255,0.06)",
                    cursor: "pointer"
                  }}
                >
                  {open ? "Show less" : "Read story"}
                </button>
              </Glass>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

