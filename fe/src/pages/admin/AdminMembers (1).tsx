import { useState } from "react";

const mockMembers = [
  { id: "M001", name: "Sarah Johnson", phone: "0917-123-4567", email: "sarah@email.com" },
  { id: "M002", name: "James Williams", phone: "0918-234-5678", email: "james@email.com" },
  { id: "M003", name: "Emily Brown", phone: "0919-345-6789", email: "emily@email.com" },
  { id: "M004", name: "Michael Davis", phone: "0920-456-7890", email: "michael@email.com" },
  { id: "M005", name: "Olivia Martinez", phone: "0921-567-8901", email: "olivia@email.com" },
  { id: "M006", name: "Daniel Garcia", phone: "0922-678-9012", email: "daniel@email.com" },
  { id: "M007", name: "Sophia Wilson", phone: "0923-789-0123", email: "sophia@email.com" },
  { id: "M008", name: "David Anderson", phone: "0924-890-1234", email: "david@email.com" },
];

const TH: React.CSSProperties = {
  color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 600,
  textTransform: "uppercase", letterSpacing: "0.08em",
  padding: "12px 20px", textAlign: "left",
};

export default function AdminMembers() {
  const [search, setSearch] = useState("");
  const filtered = mockMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "hsl(220,60%,15%)", margin: 0 }}>Members</h1>
          <p style={{ fontSize: 13, color: "hsl(220,15%,50%)", marginTop: 4 }}>Manage library members</p>
        </div>
        <button style={{
          background: "hsl(220,85%,50%)", color: "white", border: "none",
          borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>+ Add Member</button>
      </div>

      <div style={{ position: "relative", maxWidth: 320 }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "hsl(220,15%,65%)" }}>
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L19 20.5 20.5 19 15.5 14zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" fill="currentColor" />
        </svg>
        <input type="text" placeholder="Search members..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", boxSizing: "border-box", paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, border: "1.5px solid hsl(220,20%,88%)", borderRadius: 8, fontSize: 13, color: "hsl(220,60%,15%)", background: "white", outline: "none" }}
          onFocus={(e) => e.target.style.borderColor = "hsl(220,85%,50%)"}
          onBlur={(e) => e.target.style.borderColor = "hsl(220,20%,88%)"}
        />
      </div>

      <div style={{ background: "white", borderRadius: 16, overflow: "hidden", border: "1px solid hsl(220,20%,90%)", boxShadow: "0 2px 16px rgba(30,58,138,0.07)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "hsl(220,65%,18%)" }}>
                {["ID", "Name", "Phone", "Email", "Actions"].map((h) => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={m.id}
                  style={{ borderTop: i === 0 ? "none" : "1px solid hsl(220,20%,94%)", transition: "background 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(220,40%,98%)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "13px 20px" }}>
                    <span style={{ display: "inline-block", background: "hsl(220,65%,18%)", color: "rgba(255,255,255,0.85)", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600, fontFamily: "monospace" }}>{m.id}</span>
                  </td>
                  <td style={{ padding: "13px 20px", fontWeight: 600, fontSize: 14, color: "hsl(220,60%,15%)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "hsl(220,85%,50%)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                        {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      {m.name}
                    </div>
                  </td>
                  <td style={{ padding: "13px 20px", fontSize: 13, color: "hsl(220,15%,45%)", fontFamily: "monospace" }}>{m.phone}</td>
                  <td style={{ padding: "13px 20px", fontSize: 13, color: "hsl(220,15%,50%)" }}>{m.email}</td>
                  <td style={{ padding: "13px 20px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[
                        { title: "View", bg: "hsl(220,40%,96%)", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: 14, height: 14, color: "hsl(220,50%,55%)" }}><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/></svg> },
                        { title: "Edit", bg: "hsl(220,40%,96%)", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: 14, height: 14, color: "hsl(220,50%,55%)" }}><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg> },
                        { title: "Delete", bg: "hsl(0,80%,97%)", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: 14, height: 14, color: "hsl(0,72%,55%)" }}><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg> },
                      ].map((btn) => (
                        <button key={btn.title} title={btn.title} style={{ background: btn.bg, border: "none", borderRadius: 6, padding: "6px 8px", cursor: "pointer" }}>{btn.icon}</button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "10px 20px", borderTop: "1px solid hsl(220,20%,94%)", background: "hsl(220,30%,98%)", fontSize: 12, color: "hsl(220,15%,55%)" }}>
          Showing {filtered.length} of {mockMembers.length} members
        </div>
      </div>
    </div>
  );
}
