import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Users, Calendar, MapPin, Heart, ChevronDown } from "lucide-react";
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
  const [errorMsg, setErrorMsg] = useState("");
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
          setErrorMsg("");
        } else {
          console.error("Failed to load featured profiles:", result.error);
          setErrorMsg(result.error);
        }
      } catch (e) {
        console.error("Failed to execute search", e);
        setErrorMsg(e.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeatured();
  }, [user]);

  const handleSendInterest = async (toUserId) => {
    if (!user) {
      alert("Please login to send interest");
      return null;
    }
    try {
      const result = await connectionService.sendRequest(user.uid, toUserId, 85);
      if (result.success) {
        return result.data.id;
      } else {
        alert(result.error);
        return null;
      }
    } catch (error) {
      alert("Failed to send interest");
      return null;
    }
  };

  return (
    <motion.div 
      className="section"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Hero onOpenProfile={setSelected} />

      <div className="section">
        <div className="stack" style={{ marginBottom: 16 }}>
          <div className="kicker">Curated matches</div>
          <div className="flex items-end justify-between gap-12">
            <h2 className="h2" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Featured Profiles</h2>
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
          ) : errorMsg ? (
            <div className="muted" style={{ padding: "40px", gridColumn: "1 / -1", textAlign: "center", color: 'red' }}>
              Database Error: {errorMsg}. (Check your Firebase Security Rules!)
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
                className="glow-card"
              >
                <ProfileCard profile={p} onOpen={() => setSelected(p)} showInterest onSendInterest={handleSendInterest} />
              </motion.div>
            ))
          )}
        </div>
      </div>

      <HowItWorks />

      <ProfileModal profile={selected} onClose={() => setSelected(null)} />
    </motion.div>
  );
}

function Hero({ onOpenProfile }) {
  const heroImg = "/src/assets/indian_hero.png";
  
  return (
    <div style={{ padding: '20px 0' }}>
      <motion.div
        className="glass"
        style={{
          borderRadius: 32,
          overflow: "hidden",
          border: '1px solid var(--glass-border)',
          background: 'var(--bg-card)',
          minHeight: '640px',
          display: 'flex',
          flexDirection: window.innerWidth < 1024 ? 'column' : 'row'
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Left Content */}
        <div style={{ 
          flex: 1, 
          padding: '80px 60px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          background: 'var(--bg-primary)',
          zIndex: 2
        }}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="kicker" 
            style={{ color: 'var(--accent-gold)', fontWeight: 700 }}
          >
            FindMySelf — PREMIUM MATRIMONY
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="h1" 
            style={{ fontSize: 'clamp(36px, 5vw, 60px)', marginTop: 24, marginBottom: 28 }}
          >
            Begin Your <br />
            <span style={{ color: 'var(--accent-primary)' }}>Beautiful Journey</span> <br />
            With Tradition.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="muted" 
            style={{ fontSize: 17, maxWidth: 480, lineHeight: 1.8, marginBottom: 44 }}
          >
            A reliable platform for meaningful connections. Clear profiles, respectful communication, 
            and a family-first approach—built for seriousness, simplicity, and peace of mind.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="flex flex-wrap items-center gap-12"
          >
            <Button className="pill" style={{ padding: '16px 44px', fontSize: 16 }}>
              Register Free
            </Button>
            <Button variant="secondary" className="pill" style={{ padding: '16px 36px' }} onClick={() => onOpenProfile(null)}>
              Check Profiles
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{ marginTop: 52 }}
          >
            <QuickSearch />
          </motion.div>
        </div>

        {/* Right Image Section */}
        <div style={{ 
          flex: 1.2, 
          position: 'relative',
          overflow: 'hidden',
          minHeight: '400px',
          borderLeft: '1px solid var(--glass-border)'
        }}>
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${heroImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Overlay for better text blending */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, var(--bg-primary), transparent 15%)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(231, 76, 91, 0.3), transparent)',
            pointerEvents: 'none'
          }} />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="glass"
            style={{
              position: 'absolute',
              bottom: 40,
              right: 40,
              padding: '24px',
              maxWidth: 300,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <div className="kicker" style={{ fontSize: 10, color: '#4A151B', opacity: 0.8 }}>FEATURED COUPLE</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginTop: 4, color: '#4A151B' }}>
              A Romantic Garden Sunset
            </div>
            <div className="muted" style={{ fontSize: 13, marginTop: 10, color: '#4A151B', opacity: 0.8, lineHeight: 1.6 }}>
              "Tradition meets modern elegance in the warmth of the evening sun."
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}


function CustomSelect({ icon: Icon, label, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative" style={{ width: '100%' }}>
      <div 
        className="fmsSelectWrapper fmsField glass" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '12px',
          height: '52px'
        }}
      >
        <div className="flex items-center gap-12">
          {Icon && <Icon size={18} color="var(--accent-primary)" />}
          <span style={{ fontSize: 14, fontWeight: 500 }}>{value || label}</span>
        </div>
        <ChevronDown size={16} color="var(--accent-gold)" style={{ 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s var(--ease-soft)'
        }} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glassDropdown"
            style={{ 
              position: 'absolute', 
              top: 'calc(100% + 8px)', 
              left: 0, 
              right: 0, 
              zIndex: 50,
              maxHeight: '200px',
              overflowY: 'auto',
              padding: '8px'
            }}
          >
            {options.map((opt) => (
              <div
                key={opt}
                className="glassDropdownOption"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                {opt}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {isOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, zIndex: 40 }} 
          onClick={() => setIsOpen(false)} 
        />
      )}
    </div>
  );
}

function QuickSearch() {
  const navigate = useNavigate();
  const [lookingFor, setLookingFor] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [religion, setReligion] = useState("");

  return (
    <motion.div 
      className="quickSearchCard glass p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      style={{ 
        maxWidth: 1000, 
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.4)'
      }}
    >
      <div className="stack" style={{ gap: 24 }}>
        <div className="flex items-center gap-12">
          <div className="heartDot" style={{ background: 'var(--accent-primary)', width: 8, height: 8 }} />
          <div className="kicker" style={{ color: 'var(--text-primary)', letterSpacing: '0.2em' }}>Quick Search Filters</div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          <CustomSelect 
            icon={Users} 
            label="Looking For" 
            value={lookingFor}
            onChange={setLookingFor}
            options={["Bride", "Groom"]} 
          />

          <CustomSelect 
            icon={Calendar} 
            label="Age Range" 
            value={ageRange}
            onChange={setAgeRange}
            options={["21–25", "26–30", "31–35", "36+"]} 
          />

          <CustomSelect 
            icon={Heart} 
            label="Religion" 
            value={religion}
            onChange={setReligion}
            options={["Hindu", "Muslim", "Christian", "Sikh", "Jain"]} 
          />

          <div className="relative">
            <div className="fmsField glass" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12,
              paddingLeft: 12,
              height: '52px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.25)',
              borderRadius: '12px'
            }}>
              <MapPin size={18} color="var(--accent-primary)" />
              <input 
                className="fmsField" 
                placeholder="Location" 
                style={{ 
                  border: 'none', 
                  background: 'transparent', 
                  padding: 0,
                  height: '100%',
                  color: 'inherit',
                  boxShadow: 'none'
                }} 
              />
            </div>
          </div>
        </div>

        <Button 
          className="pill" 
          style={{ 
            width: "100%", 
            justifyContent: 'center', 
            padding: '20px',
            fontSize: 16,
            fontWeight: 800,
            boxShadow: '0 10px 30px rgba(231, 76, 91, 0.2)'
          }} 
          onClick={() => navigate("/search")}
        >
          <Search size={20} />
          Explore Matched Profiles
        </Button>

        <div className="muted" style={{ fontSize: 12, textAlign: 'center', opacity: 0.8, letterSpacing: 0.5 }}>
          Begin your discovery with verified members only.
        </div>
      </div>
    </motion.div>
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

