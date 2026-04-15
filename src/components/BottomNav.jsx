import React from "react";
import { NavLink } from "react-router-dom";
import { HeartHandshake, Home, MessageCircle, Sparkles, UserRound } from "lucide-react";
import { Glass } from "./Glass.jsx";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/recommendations", label: "Matches", icon: Sparkles },
  { to: "/requests", label: "Requests", icon: HeartHandshake },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/stories", label: "Stories", icon: UserRound }
];

export function BottomNav() {
  return (
    <div className="md:hidden" style={{ position: "fixed", left: 0, right: 0, bottom: 14, zIndex: 50 }}>
      <div className="container">
        <Glass className="pill px-2 py-2" style={{ borderRadius: 22 }}>
          <div className="flex items-center justify-between">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  "pill flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors " +
                  (isActive
                    ? "bg-[color:var(--gold-soft)] border border-[color:var(--border)]"
                    : "opacity-80 hover:opacity-100")
                }
              >
                <Icon size={18} />
                <span className="text-[10px] tracking-wide">{label}</span>
              </NavLink>
            ))}
          </div>
        </Glass>
      </div>
    </div>
  );
}

