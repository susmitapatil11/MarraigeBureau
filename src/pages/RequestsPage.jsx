import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "../components/Button.jsx";
import { Glass } from "../components/Glass.jsx";
import { Tabs } from "../ui/Tabs.jsx";
import { requestsReceived, requestsSent } from "../ui/mockData.js";

export default function RequestsPage() {
  const [tab, setTab] = useState("received");
  const items = useMemo(
    () => (tab === "received" ? requestsReceived : requestsSent),
    [tab]
  );

  return (
    <div className="section">
      <div className="stack" style={{ marginBottom: 16 }}>
        <div className="kicker">Requests</div>
        <h2 className="h2">Manage received and sent requests</h2>
      </div>

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: "received", label: `Received (${requestsReceived.length})` },
          { value: "sent", label: `Sent (${requestsSent.length})` }
        ]}
      />

      <div className="grid" style={{ marginTop: 16 }}>
        {items.map((r, idx) => (
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
                      {r.name}, {r.age}
                    </div>
                    <div className="muted" style={{ marginTop: 4 }}>
                      {r.location} • {r.title}
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
                      {r.match}%
                    </span>
                  </div>

                  {tab === "received" ? (
                    <>
                      <Button variant="primary">
                        <Check size={18} />
                        Accept
                      </Button>
                      <Button variant="secondary">
                        <X size={18} />
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Button variant="secondary">View status</Button>
                  )}
                </div>
              </div>
            </Glass>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

