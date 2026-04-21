import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button.jsx";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { userService } from "../services/index.js";
import { auth } from "../firebase.js";

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
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("Never Married");
  const [motherTongue, setMotherTongue] = useState("");
  const [location, setLocation] = useState("");
  const [religion, setReligion] = useState("");
  const [education, setEducation] = useState("");
  const [profession, setProfession] = useState("");
  const [familyType, setFamilyType] = useState("Nuclear");
  const [familyValues, setFamilyValues] = useState("Traditional");
  const [diet, setDiet] = useState("Vegetarian");
  const [aboutMe, setAboutMe] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    setLoading(true);
    try {
      console.log("Starting Firebase registration...");
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      console.log("Firebase auth successful:", cred.user.uid);
      
      await updateProfile(cred.user, { displayName: fullName.trim() });
      console.log("Profile display name updated");

      // Create complete user profile
      const userData = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        lookingFor,
        age: parseInt(age),
        height: height.trim(),
        maritalStatus,
        motherTongue: motherTongue.trim(),
        location: location.trim(),
        religion: religion.trim(),
        education: education.trim(),
        profession: profession.trim(),
        familyType,
        familyValues,
        diet,
        aboutMe: aboutMe.trim(),
        partnerPreferences: {
          ageMin: 18,
          ageMax: 100,
          religion: "Any",
          education: "Any",
          location: "India",
          lifestyle: "Any"
        }
      };

      console.log("Creating user profile with data:", userData);
      const result = await userService.createProfile(cred.user.uid, userData);
      console.log("Profile creation result:", result);
      
      if (result.success) {
        setSuccess("Account created successfully.");
        setTimeout(() => navigate("/dashboard"), 800);
      } else {
        setError(result.error || "Failed to create profile.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
            <Field label="Age" type="number" placeholder="Enter age (18-100)" value={age} onChange={(e) => setAge(e.target.value)} />
            <Field label="Height" placeholder="e.g., 5'5&quot;" value={height} onChange={(e) => setHeight(e.target.value)} />
            <Field label="Mother Tongue" placeholder="e.g., Hindi, English" value={motherTongue} onChange={(e) => setMotherTongue(e.target.value)} />
            <Field label="Location" placeholder="City, State" value={location} onChange={(e) => setLocation(e.target.value)} />
            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">Religion</span>
              <select className="fmsField" value={religion} onChange={(e) => setReligion(e.target.value)}>
                <option value="">Select Religion</option>
                <option>Hindu</option>
                <option>Muslim</option>
                <option>Christian</option>
                <option>Sikh</option>
                <option>Jain</option>
                <option>Buddhist</option>
                <option>Other</option>
              </select>
            </label>
            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">Marital Status</span>
              <select className="fmsField" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}>
                <option>Never Married</option>
                <option>Divorced</option>
                <option>Widowed</option>
                <option>Awaiting Divorce</option>
              </select>
            </label>
            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">Education</span>
              <select className="fmsField" value={education} onChange={(e) => setEducation(e.target.value)}>
                <option value="">Select Education</option>
                <option>High School</option>
                <option>Graduate</option>
                <option>Post Graduate</option>
                <option>Doctorate</option>
                <option>Professional</option>
              </select>
            </label>
            <Field label="Profession" placeholder="e.g., Engineer, Doctor" value={profession} onChange={(e) => setProfession(e.target.value)} />
            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">Family Type</span>
              <select className="fmsField" value={familyType} onChange={(e) => setFamilyType(e.target.value)}>
                <option>Nuclear</option>
                <option>Joint</option>
              </select>
            </label>
            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">Family Values</span>
              <select className="fmsField" value={familyValues} onChange={(e) => setFamilyValues(e.target.value)}>
                <option>Traditional</option>
                <option>Moderate</option>
                <option>Liberal</option>
              </select>
            </label>
            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">Diet</span>
              <select className="fmsField" value={diet} onChange={(e) => setDiet(e.target.value)}>
                <option>Vegetarian</option>
                <option>Non-Vegetarian</option>
                <option>Eggetarian</option>
                <option>Vegan</option>
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
          
          <div style={{ marginTop: 18 }}>
            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">About Me</span>
              <textarea 
                className="fmsField" 
                placeholder="Tell us about yourself, your interests, what you're looking for in a partner..." 
                value={aboutMe} 
                onChange={(e) => setAboutMe(e.target.value)}
                rows={4}
                style={{ resize: 'vertical' }}
              />
            </label>
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

          <Button type="submit" disabled={loading} style={{ width: "100%", marginTop: 14 }}>
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
          <Link className="muted" to="/login" style={{ textAlign: "center", fontSize: 13, display: "block", marginTop: 10 }}>
            Already have an account? Login
          </Link>
        </form>
      </div>
    </motion.div>
  );
}

