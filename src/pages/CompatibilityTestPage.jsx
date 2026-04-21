import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../firebase.js";
import { compatibilityService } from "../services/index.js";
import { COMPATIBILITY_QUESTIONS, COMPATIBILITY_SECTIONS } from "../lib/compatibilityQuestions.js";
import { Button } from "../components/Button.jsx";
import { Glass } from "../components/Glass.jsx";
import { motion } from "framer-motion";

export default function CompatibilityTestPage() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    // Check if user has already submitted the test
    const checkStatus = async () => {
      try {
        const response = await compatibilityService.getUserResponse(matchId, user.uid);
        if (response.success) {
          // Already submitted, maybe report is ready or it's waiting
          const reportCheck = await compatibilityService.getReport(matchId);
          if (reportCheck.success) {
            navigate(`/compatibility-report/${matchId}`);
          } else {
            // Still waiting for partner
            navigate(`/compatibility-report/${matchId}`);
          }
        }
      } catch (err) {
        setError(err.message || "Failed to load test status");
      } finally {
        setLoading(false);
      }
    };
    
    checkStatus();
  }, [user, matchId, navigate]);

  const questionsInSection = useMemo(() => {
    return COMPATIBILITY_QUESTIONS.filter(q => q.section === currentSection);
  }, [currentSection]);

  const allQuestionsAnswered = useMemo(() => {
    return COMPATIBILITY_QUESTIONS.every(q => answers[q.id] !== undefined && answers[q.id] !== "");
  }, [answers]);

  const sectionQuestionsAnswered = useMemo(() => {
    return questionsInSection.every(q => answers[q.id] !== undefined && answers[q.id] !== "");
  }, [answers, questionsInSection]);

  const handleNext = () => {
    if (currentSection < COMPATIBILITY_SECTIONS.length - 1) {
      setCurrentSection(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!allQuestionsAnswered) {
      setError("Please answer all questions before submitting.");
      return;
    }
    
    setSubmitting(true);
    setError("");

    try {
      const result = await compatibilityService.saveResponses(matchId, user.uid, answers);
      if (result.success) {
        navigate(`/compatibility-report/${matchId}`);
      } else {
        setError(result.error || "Failed to submit responses");
      }
    } catch (err) {
      setError(err.message || "Failed to submit responses");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="section muted" style={{ textAlign: "center", marginTop: 40 }}>Loading test...</div>;
  }

  return (
    <motion.div 
      className="section"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="stack" style={{ marginBottom: 20 }}>
        <div className="kicker">Compatibility Test</div>
        <h2 className="h2" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{COMPATIBILITY_SECTIONS[currentSection]}</h2>
        <div className="muted" style={{ fontSize: 13 }}>
          Section {currentSection + 1} of {COMPATIBILITY_SECTIONS.length}
        </div>
      </div>

      <div style={{ height: 6, width: "100%", background: "rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden", marginBottom: 24, border: '1px solid var(--glass-border)' }}>
        <motion.div 
          style={{ 
            height: "100%", 
            background: "var(--gradient-primary)", 
            width: `${((currentSection + 1) / COMPATIBILITY_SECTIONS.length) * 100}%`
          }} 
          animate={{ width: `${((currentSection + 1) / COMPATIBILITY_SECTIONS.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {error && (
        <div className="muted" style={{ color: "var(--danger, #ff5a6a)", padding: 12, borderRadius: 8, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div className="stack" style={{ gap: 20 }}>
        {questionsInSection.map((q) => (
          <Glass key={q.id} className="p-5" style={{ borderRadius: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>{q.text}</div>
            
            {q.type === "choice" ? (
              <div className="stack" style={{ gap: 8 }}>
                {q.options.map(opt => (
                  <label 
                    key={opt}
                    className="pill flex items-center gap-12"
                    style={{
                      padding: "14px 18px",
                      cursor: "pointer",
                      border: answers[q.id] === opt ? "1px solid var(--accent-rose)" : "1px solid var(--glass-border)",
                      background: answers[q.id] === opt ? "rgba(232, 160, 191, 0.1)" : "rgba(255,255,255,0.02)",
                      transition: "all 0.2s",
                      boxShadow: answers[q.id] === opt ? "0 0 15px rgba(232, 160, 191, 0.15)" : "none"
                    }}
                  >
                    <input 
                      type="radio" 
                      name={q.id} 
                      value={opt} 
                      checked={answers[q.id] === opt}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                      style={{ accentColor: "var(--gold)" }}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="stack" style={{ gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }} className="muted text-[13px]">
                  <span>1 (Low)</span>
                  <span>5 (High)</span>
                </div>
                <input 
                  type="range" 
                  min={q.min} 
                  max={q.max} 
                  value={answers[q.id] || "3"} 
                  onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: parseInt(e.target.value) }))}
                  style={{ width: "100%", accentColor: "var(--gold-soft)" }}
                />
                <div style={{ textAlign: "center", fontWeight: 600, fontSize: 18, color: "var(--gold-soft)" }}>
                  {answers[q.id] || "3"}
                </div>
                {!answers[q.id] && (
                  <div className="muted text-center text-[12px] mt-2">
                    Move the slider to record your answer
                  </div>
                )}
              </div>
            )}
          </Glass>
        ))}
      </div>

      <div className="flex justify-between" style={{ marginTop: 24, paddingBottom: 40 }}>
        <Button variant="secondary" onClick={handlePrev} disabled={currentSection === 0}>
          Back
        </Button>

        {currentSection < COMPATIBILITY_SECTIONS.length - 1 ? (
          <Button onClick={handleNext} disabled={!sectionQuestionsAnswered}>
            Next Section
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting || !allQuestionsAnswered}>
            {submitting ? "Submitting..." : "Submit Test"}
          </Button>
        )}
      </div>

    </motion.div>
  );
}
