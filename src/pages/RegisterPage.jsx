import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button.jsx";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js";

function Field({ label, type = "text", placeholder, value, onChange }) {
  return (
    <label className="stack" style={{ gap: 6 }}>
      <span className="kicker">{label}</span>
      <input className="fmsField" type={type} placeholder={placeholder} value={value} onChange={onChange} />
    </label>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lookingFor, setLookingFor] = useState("Bride");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = useMemo(() => {
    if (!fullName.trim()) return false;
    if (!email.trim()) return false;
    if (password.length < 6) return false;
    if (password !== confirmPassword) return false;
    return true;
  }, [confirmPassword, email, fullName, password]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isValid) {
      if (password !== confirmPassword) setError("Passwords do not match.");
      else if (password.length < 6) setError("Password must be at least 6 characters.");
      else setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, { displayName: fullName.trim() });

      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        lookingFor,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setSuccess("Account created successfully.");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section">
      <div
        className="glass"
        style={{
          borderRadius: 18,
          padding: 24,
          width: "min(620px, 100%)",
          margin: "0 auto"
        }}
      >
        <div className="kicker">Authentication</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 600, marginTop: 6 }}>
          Register Free
        </div>
        <div className="muted" style={{ marginTop: 8, lineHeight: 1.7 }}>
          Create a profile with accurate details. Verification improves trust and recommendations.
        </div>

        <form onSubmit={onSubmit}>
          <div className="grid gridCols2" style={{ marginTop: 18 }}>
            <Field label="Full Name" placeholder="Enter your name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Field label="Mobile Number" placeholder="Enter mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Field label="Email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">Looking For</span>
              <select className="fmsField" value={lookingFor} onChange={(e) => setLookingFor(e.target.value)}>
                <option>Bride</option>
                <option>Groom</option>
              </select>
            </label>
            <Field label="Password" type="password" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Field
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error ? (
            <div className="muted" style={{ marginTop: 12, color: "var(--danger, #ff5a6a)", lineHeight: 1.6 }}>
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="muted" style={{ marginTop: 12, color: "var(--success, #2ecc71)", lineHeight: 1.6 }}>
              {success}
            </div>
          ) : null}

          <div className="muted" style={{ fontSize: 12, marginTop: 12, lineHeight: 1.6 }}>
            By registering, you agree to maintain respectful communication and provide truthful information.
          </div>

          <Button type="submit" disabled={!isValid || loading} style={{ width: "100%", marginTop: 14 }}>
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
          <Link className="muted" to="/login" style={{ textAlign: "center", fontSize: 13, display: "block", marginTop: 10 }}>
            Already have an account? Login
          </Link>
        </form>
      </div>
    </div>
  );
}

