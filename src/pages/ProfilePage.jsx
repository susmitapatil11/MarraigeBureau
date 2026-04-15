import React, { useEffect, useMemo, useState } from "react";
import { profiles } from "../ui/mockData.js";
import { auth } from "../firebase.js";
import { userService, imageService } from "../services/index.js";
import { uploadImageToCloudinary } from "../lib/cloudinary.js";
import ProfileEdit from "../components/ProfileEdit.jsx";

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
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const user = auth.currentUser;

  const loadProfile = async () => {
    setError("");
    if (!user) return;
    try {
      const result = await userService.getProfile(user.uid);
      
      if (result.success) {
        setUserProfile(result.data);
        setPhotoUrl(result.data.photoUrl || user.photoURL || "");
      } else {
        setError(result.error || "Failed to load profile.");
      }
    } catch (e) {
      setError(e?.message || "Failed to load profile.");
    }
  };

  useEffect(() => {
    let cancelled = false;
    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const p = useMemo(() => {
    if (!user) return fallback;
    if (userProfile) {
      return {
        ...fallback,
        name: userProfile.fullName || user.displayName || fallback.name,
        age: userProfile.age || fallback.age,
        location: userProfile.location || fallback.location,
        title: userProfile.profession || fallback.title,
        image: photoUrl || user.photoURL || fallback.image,
        about: userProfile.aboutMe || fallback.about,
        match: Math.floor(Math.random() * 15) + 85 // Mock match score
      };
    }
    return fallback;
  }, [fallback, photoUrl, user, userProfile]);

  const completion = userProfile?.profileCompletion || 78;

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
        // Save image metadata
        await imageService.saveImage(user.uid, {
          url: uploaded.url || "",
          publicId: uploaded.publicId || null,
          width: uploaded.width || null,
          height: uploaded.height || null,
          bytes: uploaded.bytes || null,
          format: uploaded.format || null,
          type: "profile"
        });

        // Update user profile with photo URL
        await userService.updateProfile(user.uid, {
          photoUrl: uploaded.url || "",
          photoPublicId: uploaded.publicId || null
        });
      }

      setSuccess("Profile photo updated successfully.");
    } catch (err) {
      setError(err?.message || "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  if (isEditing) {
    return (
      <div className="section">
        <div className="flex items-center justify-between gap-12" style={{ marginBottom: 16 }}>
          <div className="stack">
            <div className="kicker">Profile</div>
            <h2 className="h2">Edit Profile</h2>
          </div>
        </div>
        <ProfileEdit 
          onSave={() => {
            setIsEditing(false);
            // Reload profile data
            loadProfile();
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="section">
      <div className="flex items-center justify-between gap-12" style={{ marginBottom: 16 }}>
        <div className="stack">
          <div className="kicker">Profile</div>
          <h2 className="h2">A structured profile view</h2>
        </div>
        {user && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="pill"
            style={{ padding: "10px 16px", border: "1px solid var(--border)", cursor: "pointer" }}
          >
            Edit Profile
          </button>
        )}
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
              {p.title} · {p.location}
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
              <KV k="Age" v={userProfile?.age || "-"} />
              <KV k="Height" v={userProfile?.height || "-"} />
              <KV k="Marital Status" v={userProfile?.maritalStatus || "-"} />
              <KV k="Mother Tongue" v={userProfile?.motherTongue || "-"} />
              <KV k="Location" v={userProfile?.location || "-"} />
            </div>
          </Section>

          <Section title="Religious Details">
            <div className="grid gridCols2">
              <KV k="Religion" v={userProfile?.religion || "-"} />
              <KV k="Caste" v={userProfile?.caste || "-"} />
              <KV k="Gotra" v={userProfile?.gotra || "-"} />
              <KV k="Manglik" v={userProfile?.manglik || "-"} />
            </div>
          </Section>

          <Section title="Education & Career">
            <div className="grid gridCols2">
              <KV k="Education" v={userProfile?.education || "-"} />
              <KV k="Profession" v={userProfile?.profession || "-"} />
              <KV k="Working With" v={userProfile?.workingWith || "-"} />
              <KV k="Income" v={userProfile?.income || "-"} />
            </div>
          </Section>

          <Section title="Family Details">
            <div className="grid gridCols2">
              <KV k="Family Type" v={userProfile?.familyType || "-"} />
              <KV k="Family Values" v={userProfile?.familyValues || "-"} />
              <KV k="Father" v={userProfile?.fatherOccupation || "-"} />
              <KV k="Mother" v={userProfile?.motherOccupation || "-"} />
            </div>
          </Section>

          <Section title="Lifestyle">
            <div className="grid gridCols2">
              <KV k="Diet" v={userProfile?.diet || "-"} />
              <KV k="Smoking" v={userProfile?.smoking || "-"} />
              <KV k="Drinking" v={userProfile?.drinking || "-"} />
              <KV k="Hobbies" v={userProfile?.hobbies || "-"} />
            </div>
          </Section>

          <Section title="About Me">
            <div className="muted" style={{ lineHeight: 1.8 }}>
              {userProfile?.aboutMe || "-"}
            </div>
          </Section>
        </div>

        <div className="stack" style={{ gap: 18 }}>
          <Section title="Partner Preferences">
            <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 10 }}>
              <KV k="Age" v={`${userProfile?.partnerPreferences?.ageMin || 18}-${userProfile?.partnerPreferences?.ageMax || 100}`} />
              <KV k="Religion" v={userProfile?.partnerPreferences?.religion || "Any"} />
              <KV k="Education" v={userProfile?.partnerPreferences?.education || "Any"} />
              <KV k="Location" v={userProfile?.partnerPreferences?.location || "India"} />
              <KV k="Lifestyle" v={userProfile?.partnerPreferences?.lifestyle || "Any"} />
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

