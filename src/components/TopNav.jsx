import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Bell, Search, SunMoon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { IconButton } from "./Button.jsx";
import { auth } from "../firebase.js";
import { signOut } from "firebase/auth";
import { userService } from "../services/index.js";

function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

export function TopNav({ theme, onToggleTheme }) {
  const scrolled = useScrolled(14);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = useMemo(() => location.pathname === "/", [location.pathname]);

  return (
    <header
      className="fmsHeader"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        boxShadow: scrolled ? "0 10px 26px rgba(42, 31, 26, 0.10)" : "none"
      }}
    >
      <div className="container fmsHeaderInner">
        <div className="fmsBrand">
          <div className="titleBrand" aria-label="Find My Self">
            <span className="wordmark">Find My Self</span>
            <span className="goldDot" aria-hidden="true" />
          </div>
          <div className="muted fmsBrandTagline">
            trusted matrimony service
          </div>
        </div>

        <nav className="fmsNav md:flex" aria-label="Primary">
          {[
            ["Home", "/"],
            ["Recommendations", "/recommendations"],
            ["Requests", "/requests"],
            ["Chat", "/chat"],
            ["Success Stories", "/stories"]
          ].map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                "fmsNavLink " + (isActive ? "fmsNavLinkActive" : "")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="fmsHeaderActions">
          <IconButton aria-label="Search" onClick={() => navigate("/search")}>
            <Search size={18} />
          </IconButton>
          <IconButton aria-label="Notifications">
            <Bell size={18} />
          </IconButton>
          <IconButton
            aria-label="Toggle theme"
            onClick={onToggleTheme}
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          >
            <SunMoon size={18} />
          </IconButton>

          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileName, setProfileName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        const res = await userService.getProfile(u.uid);
        if (res.success && res.data) {
          setProfileName(res.data.fullName || "User");
        } else {
          setProfileName("Profile");
        }
      } else {
        setProfileName("");
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const onDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onDown);
    return () => window.removeEventListener("keydown", onDown);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
    navigate("/");
  };

  const menuItems = user 
    ? [
        { label: "Dashboard", to: "/dashboard" },
        { label: "My Profile", to: "/profile" },
        { label: "Search", to: "/search" }
      ]
    : [
        { label: "Login", to: "/login" },
        { label: "Register", to: "/register" }
      ];

  const initial = profileName ? profileName.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.99 }}
        onClick={() => setOpen((v) => !v)}
        className="fmsProfileBtn"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="fmsProfileAvatar" aria-hidden="true">{user ? initial : "?"}</span>
        <span className="hidden sm:block">{user ? profileName : "Login / Register"}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="fmsProfileMenu"
          >
            <div className="glass" style={{ borderRadius: 14, padding: 8 }} role="menu">
              {menuItems.map((it) => (
                <Link
                  key={it.to}
                  to={it.to}
                  onClick={() => setOpen(false)}
                  className="fmsMenuItem"
                  role="menuitem"
                >
                  {it.label}
                </Link>
              ))}
              {user && (
                <button
                  onClick={handleLogout}
                  className="fmsMenuItem"
                  role="menuitem"
                  style={{ width: "100%", textAlign: "left", color: "var(--danger, #ff5a6a)" }}
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

