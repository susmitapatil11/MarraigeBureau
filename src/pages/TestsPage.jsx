import React, { useState, useEffect } from "react";
import { auth } from "../firebase.js";
import { connectionService, compatibilityService, userService } from "../services/index.js";
import { useNavigate } from "react-router-dom";
import { Glass } from "../components/Glass.jsx";
import { Button } from "../components/Button.jsx";

export default function TestsPage() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;
  const navigate = useNavigate();

  const loadTests = async () => {
    if (!user) return;
    try {
      // Fetch both sent and accepted requests to show tests
      const sentRes = await connectionService.getSentRequests(user.uid);
      const accRes = await connectionService.getUserConnections(user.uid);
      
      const combined = [...(sentRes.data || []), ...(accRes.data || [])];
      
      // Load user details and test statuses for each connection
      const enriched = await Promise.all(combined.map(async (conn) => {
        const otherUserId = conn.requesterId === user.uid ? conn.receiverId : conn.requesterId;
        const profileRes = await userService.getUserProfile(otherUserId);
        
        let testStatus = "take_test"; // take_test, waiting, view_report
        
        const myTest = await compatibilityService.getUserResponse(conn.id, user.uid);
        if (myTest.success) {
          const theirTest = await compatibilityService.getUserResponse(conn.id, otherUserId);
          if (theirTest.success) {
            testStatus = "view_report";
          } else {
            testStatus = "waiting";
          }
        }
        
        return {
          ...conn,
          otherUser: profileRes.success ? profileRes.data : { fullName: "Unknown User" },
          testStatus
        };
      }));
      
      setConnections(enriched);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
  }, [user]);

  if (!user) return <div className="section muted">Please login to view tests.</div>;
  if (loading) return <div className="section muted" style={{ marginTop: 24, padding: 40, textAlign: "center" }}>Loading your compatibility tests...</div>;

  return (
    <div className="section">
      <div className="stack" style={{ marginBottom: 24, marginTop: 24 }}>
        <div className="kicker">Compatibility Tests</div>
        <h2 className="h2">Manage your compatibility tests</h2>
      </div>

      <div className="grid">
        {connections.length === 0 ? (
          <div className="muted p-4">No active connections or sent requests found. Send some interests first!</div>
        ) : (
          connections.map(conn => (
            <Glass key={conn.id} className="p-5" style={{ borderRadius: 16 }}>
              <div className="flex items-center justify-between gap-12" style={{ flexWrap: "wrap" }}>
                <div className="flex flex-col">
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600 }}>Test with {conn.otherUser.fullName}</div>
                  <div className="muted text-[13px]" style={{ marginTop: 4 }}>
                    Connection Status: {conn.status === "pending" ? "Request Pending" : "Request Accepted"}
                  </div>
                </div>
                
                <div style={{ marginTop: 8 }}>
                  {conn.testStatus === "take_test" && (
                    <Button onClick={() => navigate(`/test/${conn.id}`)}>
                      Give Test
                    </Button>
                  )}
                  {conn.testStatus === "waiting" && (
                    <Button variant="secondary" disabled>
                      Waiting for partner
                    </Button>
                  )}
                  {conn.testStatus === "view_report" && (
                    <Button onClick={() => navigate(`/compatibility-report/${conn.id}`)}>
                      View Match Report
                    </Button>
                  )}
                </div>
              </div>
            </Glass>
          ))
        )}
      </div>
    </div>
  );
}
