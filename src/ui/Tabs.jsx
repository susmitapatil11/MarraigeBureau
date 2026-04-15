import React from "react";
import { Glass } from "../components/Glass.jsx";

export function Tabs({ items, value, onChange }) {
  return (
    <Glass className="pill p-2" style={{ borderRadius: 999 }}>
      <div className="flex flex-wrap gap-2">
        {items.map((it) => {
          const active = it.value === value;
          return (
            <button
              key={it.value}
              className="pill"
              onClick={() => onChange?.(it.value)}
              style={{
                padding: "10px 14px",
                border: "1px solid rgba(255,255,255,0.16)",
                background: active ? "var(--gold-soft)" : "rgba(255,255,255,0.06)",
                color: "var(--text)",
                cursor: "pointer",
                transition: "background 200ms var(--ease-out), opacity 200ms var(--ease-out)",
                opacity: active ? 1 : 0.88
              }}
            >
              <span style={{ fontSize: 13, letterSpacing: 0.2, fontWeight: 800 }}>
                {it.label}
              </span>
            </button>
          );
        })}
      </div>
    </Glass>
  );
}

