import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Bell, Search, SunMoon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { IconButton } from "./Button.jsx";
import { auth } from "../firebase.js";
import { signOut } from "firebase/auth";
import { userService, notificationService } from "../services/index.js";

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

export function TopNav() {
  const scrolled = useScrolled(14);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header
      className={`fmsHeader ${scrolled ? 'scrolled' : ''}`}
      style={{
        zIndex: 1000,
      }}
    >
      <div className="container fmsHeaderInner">
        <div className="fmsBrand">
          <Link to="/" className="titleBrand" aria-label="FindMySelf" style={{ textDecoration: 'none' }}>
            <span className="wordmark" style={{ fontSize: 26, letterSpacing: '-0.03em', fontWeight: 900 }}>FindMySelf</span>
            <div className="heartDot" aria-hidden="true" style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff', boxShadow: '0 0 15px rgba(255,255,255,0.8)' }} />
          </Link>
          <div className="fmsBrandTagline" style={{ fontSize: 10, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>
            PREMIUM MATRIMONY
          </div>
        </div>

        <nav className="fmsNav md:flex" aria-label="Primary">
          {[
            ["Home", "/"],
            ["Explore", "/recommendations"],
            ["Requests", "/requests"],
            ["Chat", "/chat"],
            ["Tests", "/tests"],
            ["Stories", "/stories"]
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
          <IconButton aria-label="Search" onClick={() => navigate("/search")} className="fmsIconBtn">
            <Search size={20} />
          </IconButton>
          <NotificationsMenu />
          
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

function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifs = async () => {
      if (auth.currentUser) {
        const res = await notificationService.getUserNotifications(auth.currentUser.uid, 5);
        if (res.success) {
          setNotifications(res.data);
          setUnread(res.data.filter(n => !n.read).length);
        }
      }
    };
    if (open) fetchNotifs();
    fetchNotifs();
  }, [open, auth.currentUser]);

  useEffect(() => {
    const onDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onDown);
    return () => window.removeEventListener("keydown", onDown);
  }, []);

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      await notificationService.markAsRead(notif.id);
    }
    setOpen(false);
    if (notif.type === "match" && notif.data?.matchId) {
      navigate(`/compatibility-report/${notif.data.matchId}`);
    } else {
      navigate("/tests");
    }
  };

  return (
    <div className="relative">
      <IconButton aria-label="Notifications" onClick={() => setOpen(!open)}>
        <Bell size={18} />
        {unread > 0 && (
          <div style={{ position: "absolute", top: 4, right: 6, width: 8, height: 8, background: "var(--danger, #ff5a6a)", borderRadius: "50%" }}></div>
        )}
      </IconButton>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="fmsProfileMenu"
            style={{ right: -40, width: 320 }}
          >
            <div className="glass" style={{ borderRadius: 14, padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="kicker" style={{ paddingLeft: 6 }}>Notifications</div>
              {notifications.length === 0 ? (
                <div className="muted p-2" style={{ fontSize: 13 }}>No notifications yet.</div>
              ) : (
                notifications.map(n => (
                  <div 
                    key={n.id} 
                    className="pill pointer" 
                    style={{ 
                      padding: "12px", 
                      border: "1px solid var(--glass-border)",
                      background: n.read ? "transparent" : "rgba(16, 185, 129, 0.08)",
                      transition: "all 0.2s"
                    }}
                    onClick={() => handleNotificationClick(n)}
                  >
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{n.title}</div>
                    <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>{n.message}</div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
