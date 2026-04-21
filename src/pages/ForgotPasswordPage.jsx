import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button.jsx";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
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
          Forgot Password
        </div>
        <div className="muted" style={{ marginTop: 8, lineHeight: 1.7 }}>
          Enter your registered email or mobile number. We will send a reset link/OTP.
        </div>

        <div className="stack" style={{ marginTop: 18 }}>
          <label className="stack" style={{ gap: 6 }}>
            <span className="kicker">Email / Mobile</span>
            <input className="fmsField" placeholder="Enter email or mobile number" />
          </label>
          <Button style={{ width: "100%" }}>Send reset link / OTP</Button>
          <Link className="muted" to="/login" style={{ textAlign: "center", fontSize: 13 }}>
            Back to login
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

