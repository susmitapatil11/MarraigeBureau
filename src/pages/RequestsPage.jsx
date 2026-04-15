import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "../components/Button.jsx";
import { Glass } from "../components/Glass.jsx";
import { Tabs } from "../ui/Tabs.jsx";
import { connectionService, userService, chatService } from "../services/index.js";
import { auth } from "../firebase.js";

export default function RequestsPage() {
  const [tab, setTab] = useState("received");
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const user = auth.currentUser;

  useEffect(() => {
    loadRequests();
  }, [tab]);

  const loadRequests = async () => {
    if (!user) return;
    
    setLoading(true);
    setError("");
    
    try {
      const [receivedResult, sentResult] = await Promise.all([
        connectionService.getReceivedRequests(user.uid),
        connectionService.getSentRequests(user.uid)
      ]);

      if (receivedResult.success) {
        setReceivedRequests(receivedResult.data);
      } else {
        setError(receivedResult.error || "Failed to load received requests");
      }

      if (sentResult.success) {
        setSentRequests(sentResult.data);
      } else {
        setError(prev => prev || (sentResult.error || "Failed to load sent requests"));
      }
    } catch (error) {
      setError(error.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const items = useMemo(
    () => (tab === "received" ? receivedRequests : sentRequests),
    [tab, receivedRequests, sentRequests]
  );

  const handleAcceptRequest = async (connectionId) => {
    try {
      const result = await connectionService.acceptRequest(connectionId);
      if (result.success) {
        // Reload requests
        await loadRequests();
      } else {
        setError(result.error || "Failed to accept request");
      }
    } catch (error) {
      setError(error.message || "Failed to accept request");
    }
  };

  const handleRejectRequest = async (connectionId) => {
    try {
      const result = await connectionService.rejectRequest(connectionId);
      if (result.success) {
        // Reload requests
        await loadRequests();
      } else {
        setError(result.error || "Failed to reject request");
      }
    } catch (error) {
      setError(error.message || "Failed to reject request");
    }
  };

  const handleSendInterest = async (toUserId) => {
    try {
      const result = await connectionService.sendRequest(user.uid, toUserId, 0); // Mock match score
      if (result.success) {
        // Reload requests
        await loadRequests();
      } else {
        setError(result.error || "Failed to send interest");
      }
    } catch (error) {
      setError(error.message || "Failed to send interest");
    }
  };

  return (
    <div className="section">
      <div className="stack" style={{ marginBottom: 16 }}>
        <div className="kicker">Requests</div>
        <h2 className="h2">Manage received and sent requests</h2>
      </div>

      {error && (
        <div className="muted" style={{ color: "var(--danger, #ff5a6a)", padding: 12, borderRadius: 8, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: "received", label: `Received (${receivedRequests.length})` },
          { value: "sent", label: `Sent (${sentRequests.length})` }
        ]}
      />

      <div className="grid" style={{ marginTop: 16 }}>
        {loading ? (
          <div className="muted" style={{ textAlign: "center", padding: "40px" }}>
            Loading requests...
          </div>
        ) : items.length === 0 ? (
          <div className="muted" style={{ textAlign: "center", padding: "40px" }}>
            {tab === "received" ? "No received requests yet" : "No sent requests yet"}
          </div>
        ) : (
          items.map((r, idx) => {
            const otherUserId = tab === "received" ? r.requesterId : r.receiverId;
            const displayName = `User ${otherUserId?.slice(0, 8)}`; // Placeholder name
            
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: Math.min(idx * 0.03, 0.18), ease: [0.16, 1, 0.3, 1] }}
              >
                <Glass className="p-6" style={{ borderRadius: 22 }}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
                    <div className="flex items-center gap-12">
                      <div
                        className="pill"
                        style={{
                          width: 56,
                          height: 56,
                          border: "1px solid rgba(255,255,255,0.22)",
                          background:
                            "linear-gradient(135deg, rgba(198,163,91,0.22), rgba(138,91,98,0.14))"
                        }}
                      />
                      <div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600 }}>
                          {displayName}
                        </div>
                        <div className="muted" style={{ marginTop: 4 }}>
                          Status: {r.status}
                        </div>
                        <div className="muted" style={{ marginTop: 2, fontSize: 12 }}>
                          {r.createdAt ? new Date(r.createdAt.toDate()).toLocaleDateString() : "Recently"}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-10">
                      <div
                        className="pill"
                        style={{
                          padding: "8px 12px",
                          border: "1px solid rgba(255,255,255,0.16)",
                          background: "rgba(255,255,255,0.07)"
                        }}
                      >
                        <span className="kicker">Match</span>
                        <span style={{ marginLeft: 10, fontWeight: 800, letterSpacing: 0.4 }}>
                          {r.matchScore || 85}%
                        </span>
                      </div>

                      {tab === "received" ? (
                        <>
                          <Button 
                            variant="primary"
                            onClick={() => handleAcceptRequest(r.id)}
                            disabled={r.status !== "pending"}
                          >
                            <Check size={18} />
                            Accept
                          </Button>
                          <Button 
                            variant="secondary"
                            onClick={() => handleRejectRequest(r.id)}
                            disabled={r.status !== "pending"}
                          >
                            <X size={18} />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Button variant="secondary" disabled>
                          {r.status === "pending" ? "Pending" : r.status}
                        </Button>
                      )}
                    </div>
                  </div>
                </Glass>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

