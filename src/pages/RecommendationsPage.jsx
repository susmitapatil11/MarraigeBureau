import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import { Button } from "../components/Button.jsx";
import { Glass } from "../components/Glass.jsx";
import { ProfileModal } from "../ui/ProfileModal.jsx";
import { ProfileCard } from "../ui/ProfileCard.jsx";
import { searchService, userService, connectionService } from "../services/index.js";
import { auth } from "../firebase.js";

export default function RecommendationsPage() {
  const [selected, setSelected] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        let lookingFor = "Bride"; // Default if not logged in
        if (user) {
          const userProfile = await userService.getProfile(user.uid);
          if (userProfile.success && userProfile.data?.lookingFor) {
            lookingFor = userProfile.data.lookingFor === "Bride" ? "Groom" : "Bride";
          }
        }
        
        const result = await searchService.advancedSearch({ lookingFor, limit: 20 });
        if (result.success) {
          const formatted = result.data
            .filter(u => u.id !== user?.uid)
            .map(u => ({
              id: u.id,
              name: u.fullName || "User",
              age: u.age || "--",
              location: u.location || "Unknown",
              title: u.profession || "Not specified",
              match: Math.floor(Math.random() * 15) + 85, // Mock score for now
              badges: u.isVerified ? ["Verified"] : [],
              about: u.aboutMe || "No description provided.",
              image: u.photoUrl || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=70"
            }));
          setList(formatted);
        }
      } catch (e) {
        console.error("Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [user]);

  const handleSendInterest = async (toUserId) => {
    if (!user) {
      alert("Please login to send interest");
      return null;
    }
    setSending(toUserId);
    try {
      const result = await connectionService.sendRequest(user.uid, toUserId, 90);
      if (result.success) {
        return result.data.id;
      } else {
        alert(result.error);
        return null;
      }
    } catch (error) {
      alert("Failed to send interest");
      return null;
    } finally {
      setSending(null);
    }
  };

  return (
    <div className="section">
      <div className="stack" style={{ marginBottom: 16 }}>
        <div className="kicker">Recommendations</div>
        <div className="flex items-end justify-between gap-12">
          <h2 className="h2">Suitable matches for your preferences</h2>
          <Button variant="secondary" className="hidden sm:inline-flex">
            <Sparkles size={18} />
            Update preferences
          </Button>
        </div>
      </div>

      <Glass className="p-5" style={{ borderRadius: 22, marginBottom: 18 }}>
        <div className="grid gridCols2">
          {[
            ["Age", "24–36"],
            ["Location", "India • Metro"],
            ["Religion/Caste", "As per preference"],
            ["Education", "Graduate+"]
          ].map(([k, v]) => (
            <div
              key={k}
              className="pill"
              style={{
                padding: "10px 14px",
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.35)"
              }}
            >
              <div className="kicker">{k}</div>
              <div style={{ fontWeight: 700, letterSpacing: 0.2 }}>{v}</div>
            </div>
          ))}
        </div>
      </Glass>

      <div className="grid gridCols3">
        {loading ? (
          <div className="muted" style={{ padding: "40px", gridColumn: "1 / -1", textAlign: "center" }}>
            Loading database profiles...
          </div>
        ) : list.length === 0 ? (
          <div className="muted" style={{ padding: "40px", gridColumn: "1 / -1", textAlign: "center" }}>
            No registered profiles found right now.
          </div>
        ) : (
          list.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(idx * 0.03, 0.2), ease: [0.16, 1, 0.3, 1] }}
            >
              <ProfileCard profile={p} onOpen={() => setSelected(p)} showInterest onSendInterest={handleSendInterest} />
            </motion.div>
          ))
        )}
      </div>

      <ProfileModal profile={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

