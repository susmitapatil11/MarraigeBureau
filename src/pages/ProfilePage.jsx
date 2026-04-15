import React, { useEffect, useMemo, useState } from "react";
import { profiles } from "../ui/mockData.js";
import { auth, db } from "../firebase.js";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { uploadImageToCloudinary } from "../lib/cloudinary.js";

function Section({ title, children }) {
  return (
    <section className="glass p-6" style={{ borderRadius: 18 }}>
      <div className="kicker">{title}</div>
      <div style={{ marginTop: 10 }} className="stack">
        {children}
      </div>
    </section>
  );
}

function KV({ k, v }) {
  return (
    <div className="fmsKV">
      <div className="kicker">{k}</div>
      <div style={{ fontWeight: 750, letterSpacing: 0.2 }}>{v}</div>
    </div>
  );
}

export default function ProfilePage() {
  const fallback = profiles[0];
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = auth.currentUser;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setError("");
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (cancelled) return;
        const data = snap.exists() ? snap.data() : null;
        setPhotoUrl(data?.photoUrl || user.photoURL || "");
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load profile.");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const p = useMemo(() => {
    if (!user) return fallback;
    return {
      ...fallback,
      name: user.displayName || fallback.name,
      image: photoUrl || user.photoURL || fallback.image
    };
  }, [fallback, photoUrl, user]);

  const completion = 78;

  async function onPickFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess("");
    setUploading(true);
    try {
      const uploaded = await uploadImageToCloudinary(file, { folder: "marriage-bureau/users" });
      setPhotoUrl(uploaded.url || "");

      if (user) {
        await addDoc(collection(db, "images"), {
          uid: user.uid,
          url: uploaded.url || "",
          publicId: uploaded.publicId || null,
          width: uploaded.width || null,
          height: uploaded.height || null,
          bytes: uploaded.bytes || null,
          format: uploaded.format || null,
          createdAt: serverTimestamp()
        });

        await updateDoc(doc(db, "users", user.uid), {
          photoUrl: uploaded.url || "",
          photoPublicId: uploaded.publicId || null,
          updatedAt: serverTimestamp()
        });
      }

      setSuccess("Successfully uploaded.");
    } catch (err) {
      setError(err?.message || "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="section">
      <div className="stack" style={{ marginBottom: 16 }}>
        <div className="kicker">Profile</div>
        <h2 className="h2">A structured profile view</h2>
      </div>

      <div className="glass p-6" style={{ borderRadius: 18, marginBottom: 18 }}>
        <div className="kicker">Photo</div>
        <div className="flex items-center justify-between gap-12" style={{ marginTop: 10, flexWrap: "wrap" }}>
          <div className="muted" style={{ lineHeight: 1.6 }}>
            Upload a profile image (stored on Cloudinary).
            {user ? " It will be saved to your Firestore profile." : " (Login to save it to your profile.)"}
          </div>
          <label className="pill" style={{ padding: "10px 12px", border: "1px solid var(--border)", cursor: "pointer" }}>
            <input type="file" accept="image/*" onChange={onPickFile} disabled={uploading} style={{ display: "none" }} />
            {uploading ? "Uploading..." : "Upload photo"}
          </label>
        </div>
        {error ? (
          <div className="muted" style={{ marginTop: 10, color: "var(--danger, #ff5a6a)" }}>
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="muted" style={{ marginTop: 10, color: "var(--success, #2ecc71)" }}>
            {success}
          </div>
        ) : null}
      </div>

      <div className="glass p-6" style={{ borderRadius: 18, marginBottom: 18 }}>
        <div className="flex items-start justify-between gap-12">
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 38, fontWeight: 600 }}>
              {p.name}, {p.age}
            </div>
            <div className="muted" style={{ marginTop: 6 }}>
              {p.title} • {p.location}
            </div>
            <div style={{ marginTop: 12 }} className="flex flex-wrap gap-10 items-center">
              <div className="fmsBadge fmsBadgeVerified">Verified</div>
              <div className="fmsBadge">Profile ID: FMS-1024</div>
              <div className="fmsBadge">Match Score: {p.match}%</div>
            </div>
          </div>

          <div style={{ width: 320 }}>
            <div className="kicker">Profile completion</div>
            <div className="fmsProgress" style={{ marginTop: 10 }}>
              <div className="fmsProgressFill" style={{ width: `${completion}%` }} />
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12, lineHeight: 1.6 }}>
              Complete family and partner preference sections to improve recommendations.
            </div>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.15fr 0.85fr", gap: 18 }}>
        <div className="stack" style={{ gap: 18 }}>
          <Section title="Personal Details">
            <div className="grid gridCols2">
              <KV k="Height" v={'5\'5"'} />
              <KV k="Marital Status" v="Never Married" />
              <KV k="Mother Tongue" v="Hindi" />
              <KV k="Location" v={p.location} />
            </div>
          </Section>

          <Section title="Religious Details">
            <div className="grid gridCols2">
              <KV k="Religion" v="Hindu" />
              <KV k="Caste" v="—" />
              <KV k="Gotra" v="—" />
              <KV k="Manglik" v="No" />
            </div>
          </Section>

          <Section title="Education & Career">
            <div className="grid gridCols2">
              <KV k="Education" v="Graduate" />
              <KV k="Profession" v={p.title} />
              <KV k="Working With" v="Private Sector" />
              <KV k="Income" v="—" />
            </div>
          </Section>

          <Section title="Family Details">
            <div className="grid gridCols2">
              <KV k="Family Type" v="Nuclear" />
              <KV k="Family Values" v="Traditional" />
              <KV k="Father" v="Employed" />
              <KV k="Mother" v="Homemaker" />
            </div>
          </Section>

          <Section title="Lifestyle">
            <div className="grid gridCols2">
              <KV k="Diet" v="Vegetarian" />
              <KV k="Smoking" v="No" />
              <KV k="Drinking" v="No" />
              <KV k="Hobbies" v="Music, Reading" />
            </div>
          </Section>

          <Section title="About Me">
            <div className="muted" style={{ lineHeight: 1.8 }}>
              {p.about}
            </div>
          </Section>
        </div>

        <div className="stack" style={{ gap: 18 }}>
          <Section title="Partner Preferences">
            <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 10 }}>
              <KV k="Age" v="24–32" />
              <KV k="Religion" v="Any" />
              <KV k="Education" v="Graduate+" />
              <KV k="Location" v="India" />
              <KV k="Lifestyle" v="Family-first" />
            </div>
          </Section>

          <Section title="Safety & Trust">
            <div className="muted" style={{ lineHeight: 1.8 }}>
              Verified details and clear communication help build trust. Report any suspicious activity and keep
              personal information private until you feel confident.
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

