import React, { useMemo, useState, useEffect } from "react";
import { ProfileCard } from "../ui/ProfileCard.jsx";
import { ProfileModal } from "../ui/ProfileModal.jsx";
import { searchService, userService, connectionService } from "../services/index.js";
import { auth } from "../firebase.js";

export default function SearchPage() {
  const [selected, setSelected] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    lookingFor: "",
    ageMin: "",
    ageMax: "",
    religion: "",
    caste: "",
    education: "",
    profession: "",
    location: "",
    income: "",
    lifestyle: ""
  });

  const user = auth.currentUser;

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      if (user) {
        // Get user's looking for preference
        const userProfile = await userService.getProfile(user.uid);
        if (userProfile.success) {
          setFilters(prev => ({
            ...prev,
            lookingFor: userProfile.data.lookingFor === "Bride" ? "Groom" : "Bride"
          }));
        }
      }

      // Load initial results
      await performSearch();
    } catch (error) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    setLoading(true);
    setError("");
    
    try {
      const searchFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "")
      );
      
      const result = await searchService.advancedSearch(searchFilters);
      
      if (result.success) {
        setSearchResults(result.data);
      } else {
        setError(result.error || "Search failed");
        setSearchResults([]);
      }
    } catch (error) {
      setError(error.message || "Search failed");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    performSearch();
  };

  const handleSendInterest = async (toUserId) => {
    if (!user) {
      alert("Please login to send interest");
      return null;
    }
    setSending(toUserId);
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
    } finally {
      setSending(null);
    }
  };

  // Transform Firestore data to ProfileCard format
  const transformProfileData = (user) => {
    return {
      id: user.uid,
      name: user.fullName,
      age: user.age,
      location: user.location,
      title: user.profession,
      match: Math.floor(Math.random() * 15) + 85, // Mock match score
      badges: user.isVerified ? ["Verified"] : [],
      about: user.aboutMe || "",
      image: user.photoUrl || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=70"
    };
  };

  const list = searchResults.map(transformProfileData);

  return (
    <div className="section">
      <div className="stack" style={{ marginBottom: 16 }}>
        <div className="kicker">Search & Match</div>
        <h2 className="h2">Filter profiles with clarity</h2>
        <div className="muted" style={{ lineHeight: 1.7, maxWidth: 860 }}>
          Use structured filters to narrow down by age, community, education, profession, and location.
          Profiles are presented in a simple list focused on essentials.
        </div>
      </div>

      {error && (
        <div className="muted" style={{ color: "var(--danger, #ff5a6a)", padding: 12, borderRadius: 8, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div
        className="grid"
        style={{
          gridTemplateColumns: "320px 1fr",
          gap: 18,
          alignItems: "start"
        }}
      >
        <aside className="glass p-5" style={{ borderRadius: 18 }}>
          <div className="kicker" style={{ marginBottom: 12 }}>
            Filters
          </div>

          <div className="stack" style={{ gap: 10 }}>
            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">Age Range</span>
              <div className="flex gap-4">
                <input 
                  className="fmsField" 
                  type="number" 
                  placeholder="Min" 
                  value={filters.ageMin}
                  onChange={(e) => updateFilter('ageMin', e.target.value)}
                  style={{ flex: 1 }}
                />
                <input 
                  className="fmsField" 
                  type="number" 
                  placeholder="Max" 
                  value={filters.ageMax}
                  onChange={(e) => updateFilter('ageMax', e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
            </label>

            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">Religion</span>
              <select 
                className="fmsField" 
                value={filters.religion}
                onChange={(e) => updateFilter('religion', e.target.value)}
              >
                <option value="">Any</option>
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
              <span className="kicker">Caste</span>
              <input 
                className="fmsField" 
                placeholder="Optional" 
                value={filters.caste}
                onChange={(e) => updateFilter('caste', e.target.value)}
              />
            </label>

            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">Education</span>
              <select 
                className="fmsField"
                value={filters.education}
                onChange={(e) => updateFilter('education', e.target.value)}
              >
                <option value="">Any</option>
                <option>High School</option>
                <option>Graduate</option>
                <option>Post Graduate</option>
                <option>Doctorate</option>
                <option>Professional</option>
              </select>
            </label>

            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">Profession</span>
              <input 
                className="fmsField" 
                placeholder="e.g., Engineer, Doctor" 
                value={filters.profession}
                onChange={(e) => updateFilter('profession', e.target.value)}
              />
            </label>

            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">Location</span>
              <input 
                className="fmsField" 
                placeholder="City / State" 
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
              />
            </label>

            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">Income</span>
              <select 
                className="fmsField"
                value={filters.income}
                onChange={(e) => updateFilter('income', e.target.value)}
              >
                <option value="">Any</option>
                <option>Below 5 LPA</option>
                <option>5-10 LPA</option>
                <option>10-20 LPA</option>
                <option>20+ LPA</option>
              </select>
            </label>

            <label className="stack" style={{ gap: 6 }}>
              <span className="kicker">Lifestyle</span>
              <select 
                className="fmsField"
                value={filters.lifestyle}
                onChange={(e) => updateFilter('lifestyle', e.target.value)}
              >
                <option value="">Any</option>
                <option>Family-first</option>
                <option>Traditional</option>
                <option>Balanced</option>
                <option>Modern</option>
              </select>
            </label>

            <button 
              className="pill" 
              onClick={handleSearch}
              disabled={loading}
              style={{ 
                padding: "12px", 
                border: "1px solid var(--border)", 
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </aside>

        <main className="stack" style={{ gap: 14 }}>
          <div className="glass p-4" style={{ borderRadius: 18 }}>
            <div className="flex items-center justify-between gap-12">
              <div>
                <div className="kicker">Results</div>
                <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>
                  Showing {list.length} profiles
                </div>
              </div>
              <select className="fmsField" style={{ width: 240 }}>
                <option>Sort: Recommended</option>
                <option>Sort: Newest</option>
                <option>Sort: Age</option>
              </select>
            </div>
          </div>

          <div className="grid gridCols2">
            {list.map((p) => (
              <ProfileCard key={p.id} profile={p} onOpen={() => setSelected(p)} showInterest onSendInterest={handleSendInterest} />
            ))}
          </div>
        </main>
      </div>

      <ProfileModal profile={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

