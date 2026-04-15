import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "../components/Button.jsx";
import { Glass } from "../components/Glass.jsx";
import { ProfileModal } from "../ui/ProfileModal.jsx";
import { ProfileCard } from "../ui/ProfileCard.jsx";
import { useNavigate } from "react-router-dom";
import { searchService, connectionService } from "../services/index.js";
import { auth } from "../firebase.js";

export default function HomePage() {
  const [selected, setSelected] = useState(null);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const result = await searchService.advancedSearch({ limit: 6 });
        if (result.success) {
          const formatted = result.data
            .filter(u => u.id !== user?.uid)
            .map(u => ({
              id: u.id,
              name: u.fullName || "User",
              age: u.age || "--",
              location: u.location || "Unknown",
              title: u.profession || "Not specified",
              match: Math.floor(Math.random() * 15) + 85,
              badges: u.isVerified ? ["Verified"] : [],
              about: u.aboutMe || "No description provided.",
              image: u.photoUrl || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=70"
            }));
          setFeatured(formatted);
        }
      } catch (e) {
        console.error("Failed to load featured profiles", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeatured();
  }, [user]);

  const handleSendInterest = async (toUserId) => {
    if (!user) {
      alert("Please login to send interest");
      return;
    }
    try {
      const result = await connectionService.sendRequest(user.uid, toUserId, 85);
      if (result.success) {
        alert("Interest sent successfully!");
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert("Failed to send interest");
    }
  };

  return (
    <div className="section">
      <Hero onOpenProfile={setSelected} />

      <div className="section">
        <div className="stack" style={{ marginBottom: 16 }}>
          <div className="kicker">Curated matches</div>
          <div className="flex items-end justify-between gap-12">
            <h2 className="h2">Featured Profiles</h2>
            <span className="muted text-[12px] hidden sm:block">
              Premium, verified, and thoughtfully recommended.
            </span>
          </div>
        </div>

        <div className="grid gridCols3">
          {loading ? (
            <div className="muted" style={{ padding: "40px", gridColumn: "1 / -1", textAlign: "center" }}>
              Loading featured profiles...
            </div>
          ) : featured.length === 0 ? (
            <div className="muted" style={{ padding: "40px", gridColumn: "1 / -1", textAlign: "center" }}>
              No registered profiles found right now.
            </div>
          ) : (
            featured.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProfileCard profile={p} onOpen={() => setSelected(p)} showInterest onSendInterest={handleSendInterest} />
              </motion.div>
            ))
          )}
        </div>
      </div>

      <HowItWorks />

      <ProfileModal profile={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function Hero({ onOpenProfile }) {
  const heroImg =
    "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=1600&q=70";
  return (
    <div style={{ paddingTop: 10 }}>
      <motion.div
        className="glass"
        style={{
          borderRadius: 18,
          padding: "26px",
          position: "relative",
          overflow: "hidden"
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(90deg, rgba(248,245,240,0.95), rgba(248,245,240,0.78), rgba(248,245,240,0.40)), url(${heroImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(1.05) contrast(1.03)",
            opacity: 0.92
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(900px 420px at 12% 0%, rgba(197,164,109,0.18), transparent 64%), radial-gradient(820px 520px at 88% 14%, rgba(128,0,32,0.10), transparent 64%)",
            opacity: 0.65
          }}
        />
        <div style={{ position: "relative", zIndex: 2 }} className="grid" >
          <div className="kicker">Find My Self</div>
          <h1 className="h1">
            Find Your Life Partner <br />
            <span style={{ color: "var(--maroon)", fontWeight: 700 }}>with Trust and Tradition</span>
          </h1>
          <p className="muted" style={{ fontSize: 16, maxWidth: 720, lineHeight: 1.75 }}>
            A reliable platform for meaningful connections. Clear profiles, respectful communication,
            and a family-first approach—built for seriousness, simplicity, and peace of mind.
          </p>

          <div className="flex flex-wrap items-center gap-10" style={{ marginTop: 10 }}>
            <div className="flex flex-wrap gap-10">
              <Button>
                Register Free
              </Button>
              <Button variant="secondary" onClick={() => onOpenProfile(null)}>
                Browse Profiles
              </Button>
            </div>

            <QuickSearch />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function QuickSearch() {
  const navigate = useNavigate();
  return (
    <Glass className="p-4" style={{ borderRadius: 14 }}>
      <div className="kicker" style={{ marginBottom: 10 }}>
        Quick Search
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        <select className="fmsField">
          <option>Looking For</option>
          <option>Bride</option>
          <option>Groom</option>
        </select>
        <select className="fmsField">
          <option>Age Range</option>
          <option>21–25</option>
          <option>26–30</option>
          <option>31–35</option>
        </select>
        <select className="fmsField">
          <option>Religion</option>
          <option>Hindu</option>
          <option>Muslim</option>
          <option>Christian</option>
          <option>Sikh</option>
          <option>Jain</option>
          <option>Other</option>
        </select>
        <input className="fmsField" placeholder="Location" />
        <Button className="fmsBtnPrimary" style={{ width: "100%" }} onClick={() => navigate("/search")}>
          <Search size={18} />
          Search Users
        </Button>
      </div>
      <div className="muted" style={{ fontSize: 12, marginTop: 10, lineHeight: 1.6 }}>
        Tip: Use Recommendations for curated matches, or Search for detailed filters.
      </div>
    </Glass>
  );
}

function HowItWorks() {
  const steps = [
    { title: "Create your profile", desc: "Share verified and complete information with clear privacy controls." },
    { title: "Get suitable recommendations", desc: "Browse profiles matched to your preferences and values." },
    { title: "Connect respectfully", desc: "Send requests and chat with clarity—focus on sincerity and family values." }
  ];

  return (
    <div className="section">
      <div className="stack" style={{ marginBottom: 16 }}>
        <div className="kicker">How it works</div>
        <h2 className="h2">A simple and trustworthy journey</h2>
      </div>

      <div className="grid gridCols3">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.55, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <Glass className="p-6" style={{ borderRadius: 20 }}>
              <div className="kicker">Step {i + 1}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, marginTop: 6, marginBottom: 8 }}>
                {s.title}
              </div>
              <div className="muted" style={{ lineHeight: 1.7 }}>
                {s.desc}
              </div>
            </Glass>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

