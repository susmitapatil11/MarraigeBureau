import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button.jsx";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import { motion } from "framer-motion";

function AuthShell({ title, subtitle, children }) {
  return (
    <motion.div 
      className="section"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div
        className="glass"
        style={{
          borderRadius: 18,
          padding: 24,
          width: "min(520px, 100%)",
          margin: "0 auto"
        }}
      >
        <div className="kicker">Authentication</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 600, marginTop: 6 }}>
          {title}
        </div>
        <div className="muted" style={{ marginTop: 8, lineHeight: 1.7 }}>
          {subtitle}
        </div>
        <div style={{ marginTop: 18 }} className="stack">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

function Field({ label, type = "text", placeholder, value, onChange }) {
  return (
    <label className="stack" style={{ gap: 6 }}>
      <span className="kicker">{label}</span>
      <input className="fmsField" type={type} placeholder={placeholder} value={value} onChange={onChange} />
    </label>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Login"
      subtitle="Access your profile, requests, and messages securely."
    >
      <form onSubmit={onSubmit} className="stack" style={{ gap: 14 }}>
        <Field label="Email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field label="Password" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <div className="flex items-center justify-between gap-12" style={{ marginTop: 6 }}>
          <label className="flex items-center gap-10" style={{ gap: 10 }}>
            <input type="checkbox" />
            <span className="muted" style={{ fontSize: 13 }}>Remember me</span>
          </label>
          <Link className="muted" to="/forgot-password" style={{ fontSize: 13 }}>
            Forgot password?
          </Link>
        </div>

        {error ? (
          <div className="muted" style={{ color: "var(--danger, #ff5a6a)" }}>
            {error}
          </div>
        ) : null}

        <Button type="submit" disabled={!email.trim() || !password || loading} style={{ width: "100%", marginTop: 8 }}>
          {loading ? "Logging in..." : "Login"}
        </Button>
        <Link className="muted" to="/register" style={{ textAlign: "center", fontSize: 13 }}>
          New to Find My Self? Register free
        </Link>
      </form>
    </AuthShell>
  );
}

