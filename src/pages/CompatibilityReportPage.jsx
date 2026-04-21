import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../firebase.js";
import { compatibilityService } from "../services/index.js";
import { Button } from "../components/Button.jsx";
import { Glass } from "../components/Glass.jsx";
import { motion } from "framer-motion";
import { COMPATIBILITY_SECTIONS } from "../lib/compatibilityQuestions.js";
import { userService } from "../services/index.js";

export default function CompatibilityReportPage() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);
  const [partnerName, setPartnerName] = useState("your partner");

  useEffect(() => {
    if (!user) return;
    
    const loadReport = async () => {
      try {
        const result = await compatibilityService.getReport(matchId);
        
        if (result.success && result.data) {
          setReport(result.data);
          
          // Try to fetch partner name
          const partnerId = result.data.participants.find(id => id !== user.uid);
          if (partnerId) {
            const partnerResult = await userService.getProfile(partnerId);
            if (partnerResult.success && partnerResult.data) {
              setPartnerName(partnerResult.data.fullName);
            }
          }
        } else {
          // If report not found, check if it's because waiting for partner or if the user hasn't submitted yet
          const resp = await compatibilityService.getUserResponse(matchId, user.uid);
          if (resp.success) {
            // User submitted, waiting for partner
          } else {
            // User hasn't even submitted
            navigate(`/compatibility-test/${matchId}`);
          }
        }
      } catch (err) {
        setError(err.message || "Failed to load compatibility report");
      } finally {
        setLoading(false);
      }
    };
    
    loadReport();
  }, [user, matchId, navigate]);

  if (loading) {
    return <div className="section muted" style={{ textAlign: "center", marginTop: 40 }}>Analyzing compatibility...</div>;
  }

  if (error) {
    return (
      <div className="section">
        <div className="muted" style={{ color: "var(--danger, #ff5a6a)", padding: 12, borderRadius: 8 }}>
          {error}
        </div>
        <Button onClick={() => navigate("/chat")} style={{ marginTop: 20 }}>Return to Chat</Button>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="section">
        <Glass className="p-8 stack items-center justify-center text-center" style={{ borderRadius: 22, minHeight: 300 }}>
          <div className="kicker" style={{ marginBottom: 12 }}>Test Submitted</div>
          <h2 className="h2" style={{ marginBottom: 16 }}>Waiting for {partnerName}</h2>
          <div className="muted" style={{ maxWidth: 400, lineHeight: 1.6 }}>
            You have successfully completed your compatibility test! We are now waiting for your partner to complete theirs. 
            Once both tests are finished, your personalized compatibility report will be unlocked here automatically.
          </div>
          <Button onClick={() => navigate("/chat")} style={{ marginTop: 30 }}>Return to Chat</Button>
        </Glass>
      </div>
    );
  }

  const { overall, level, sections } = report.scores;

  let color = "var(--success, #2ecc71)";
  if (overall < 40) color = "var(--danger, #ff5a6a)";
  else if (overall < 60) color = "var(--warning, #f39c12)";
  else if (overall < 80) color = "var(--gold-soft)";

  return (
    <motion.div 
      className="section"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="stack" style={{ marginBottom: 20, textAlign: "center" }}>
        <div className="kicker">Analysis Complete</div>
        <h2 className="h2" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Compatibility Report</h2>
        <div className="muted" style={{ fontSize: 13 }}>
          Based on scientifically aligned psychological metrics
        </div>
      </div>

      <Glass className="p-8 stack items-center text-center" style={{ borderRadius: 24, marginBottom: 24 }}>
        <div className="kicker" style={{ marginBottom: 8 }}>Overall Match</div>
        
        <div style={{ position: "relative", width: 140, height: 140, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)", position: "absolute", top: 0, left: 0 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-rose)" />
                <stop offset="100%" stopColor="var(--accent-violet)" />
              </linearGradient>
            </defs>
            <circle cx="70" cy="70" r="64" fill="none" stroke="var(--glass-border)" strokeWidth="8" />
            <motion.circle 
              cx="70" cy="70" r="64" fill="none" 
              stroke="url(#scoreGradient)" 
              strokeWidth="8" 
              strokeDasharray="402"
              initial={{ strokeDashoffset: 402 }}
              animate={{ strokeDashoffset: 402 - (overall / 100) * 402 }}
              strokeLinecap="round" 
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            />
          </svg>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700, color: 'var(--accent-rose)' }}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {overall}%
            </motion.span>
          </div>
        </div>
        
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: 0.5, color }}>{level}</div>
        <div className="muted" style={{ marginTop: 8 }}>
          Your compatibility with <span style={{ color: "var(--text)" }}>{partnerName}</span>
        </div>
      </Glass>

      <div className="grid md:grid-cols-2" style={{ gap: 20, marginBottom: 24 }}>
        <Glass className="p-6" style={{ borderRadius: 16 }}>
          <div className="kicker" style={{ color: "var(--success, #2ecc71)", marginBottom: 12 }}>Strengths</div>
          <ul className="stack" style={{ gap: 8, paddingLeft: 12, listStyleType: "disc" }}>
            {report.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </Glass>
        
        <Glass className="p-6" style={{ borderRadius: 16 }}>
          <div className="kicker" style={{ color: "var(--warning, #f39c12)", marginBottom: 12 }}>Needs Attention</div>
          <ul className="stack" style={{ gap: 8, paddingLeft: 12, listStyleType: "disc" }}>
            {report.needsAttention.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </Glass>
      </div>

      <Glass className="p-6" style={{ borderRadius: 16, marginBottom: 24 }}>
        <div className="kicker" style={{ marginBottom: 12 }}>Recommendation</div>
        <div style={{ fontSize: 16, lineHeight: 1.6, fontStyle: "italic", borderLeft: "3px solid var(--gold-soft)", paddingLeft: 16 }}>
          "{report.insight}"
        </div>
      </Glass>

      <div className="kicker" style={{ marginBottom: 16 }}>Section Breakdown</div>
      <div className="stack" style={{ gap: 12, marginBottom: 40 }}>
        {COMPATIBILITY_SECTIONS.map((section, idx) => {
          const score = sections[idx] || 0;
          let barColor = "var(--success, #2ecc71)";
          if (score < 40) barColor = "var(--danger, #ff5a6a)";
          else if (score < 60) barColor = "var(--warning, #f39c12)";
          else if (score < 80) barColor = "var(--gold-soft)";

          return (
            <Glass key={idx} className="p-4" style={{ borderRadius: 12 }}>
              <div className="flex justify-between items-center" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{section}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: barColor }}>{score}%</span>
              </div>
              <div style={{ height: 6, width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", background: barColor, width: `${score}%`, borderRadius: 10 }} />
              </div>
            </Glass>
          );
        })}
      </div>

      <div className="flex justify-center" style={{ paddingBottom: 40 }}>
        <Button onClick={() => window.print()} variant="secondary">
          Print Report (PDF)
        </Button>
        <Button onClick={() => navigate("/chat")} style={{ marginLeft: 16 }}>
          Return to Chat
        </Button>
      </div>
    </motion.div>
  );
}
