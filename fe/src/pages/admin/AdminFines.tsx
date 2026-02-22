import { useState } from "react";

const initialFines = [
  { id: "F001", member: "Emily Brown", book: "Pride and Prejudice", amount: 55.00, status: "Unpaid" },
  { id: "F002", member: "Sarah Johnson", book: "Animal Farm", amount: 120.00, status: "Unpaid" },
  { id: "F003", member: "Sophia Wilson", book: "A Farewell to Arms", amount: 20.00, status: "Paid" },
  { id: "F004", member: "James Williams", book: "1984", amount: 85.00, status: "Unpaid" },
  { id: "F005", member: "Michael Davis", book: "The Great Gatsby", amount: 45.00, status: "Paid" },
];

const TH: React.CSSProperties = { color: "#9c4a70", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "12px 20px", textAlign: "left" };
const TD: React.CSSProperties = { padding: "13px 20px" };

export default function AdminFines() {
  const [fines, setFines] = useState(initialFines);
  const [search, setSearch] = useState("");

  const markPaid = (id: string) => setFines((prev) => prev.map((f) => f.id === id ? { ...f, status: "Paid" } : f));
  const filtered = fines.filter((f) => f.member.toLowerCase().includes(search.toLowerCase()) || f.book.toLowerCase().includes(search.toLowerCase()));
  const totalUnpaid = fines.filter((f) => f.status === "Unpaid").reduce((sum, f) => sum + f.amount, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#5d2f3a", margin: 0 }}>Fines</h1>
          <p style={{ fontSize: 13, color: "#9e7a7a", marginTop: 4 }}>Manage outstanding and paid fines</p>
        </div>
        <div style={{ background: "#fff0f5", border: "1.5px solid #ffd6e0", borderRadius: 10, padding: "8px 18px", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#c2185b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Unpaid</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#9c4a70" }}>₱{totalUnpaid.toFixed(2)}</div>
        </div>
      </div>
      <div style={{ position: "relative", maxWidth: 320 }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "#c8a0a0" }}>
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L19 20.5 20.5 19 15.5 14zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" fill="currentColor" />
        </svg>
        <input type="text" placeholder="Search fines..." value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", boxSizing: "border-box", paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, border: "1.5px solid #ffd6e0", borderRadius: 8, fontSize: 13, color: "#5d2f3a", background: "white", outline: "none" }}
          onFocus={(e) => e.target.style.borderColor = "#f48fb1"} onBlur={(e) => e.target.style.borderColor = "#ffd6e0"} />
      </div>
      <div style={{ background: "white", borderRadius: 16, overflow: "hidden", border: "1px solid #ffd6e0", boxShadow: "0 2px 16px rgba(244,143,177,0.1)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "linear-gradient(135deg, #fce4ec, #fff9c4)" }}>
                {["Fine ID", "Member", "Book", "Amount", "Status", "Actions"].map((h) => <th key={h} style={TH}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((fine, i) => (
                <tr key={fine.id} style={{ borderTop: i === 0 ? "none" : "1px solid #ffe0e8", transition: "background 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fff8f8")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={TD}><span style={{ display: "inline-block", background: "linear-gradient(135deg,#f48fb1,#ffd54f)", color: "white", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600, fontFamily: "monospace" }}>{fine.id}</span></td>
                  <td style={TD}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#f48fb1,#ffd54f)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                        {fine.member.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14, color: "#5d2f3a" }}>{fine.member}</span>
                    </div>
                  </td>
                  <td style={{ ...TD, fontSize: 13, color: "#9e7a7a" }}>{fine.book}</td>
                  <td style={{ ...TD, fontWeight: 700, fontSize: 14, color: fine.status === "Unpaid" ? "#c2185b" : "#5d2f3a" }}>₱{fine.amount.toFixed(2)}</td>
                  <td style={TD}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600, color: fine.status === "Paid" ? "#388e3c" : "#c2185b", background: fine.status === "Paid" ? "#e8f5e9" : "#fce4ec" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: fine.status === "Paid" ? "#388e3c" : "#f48fb1" }} />
                      {fine.status}
                    </span>
                  </td>
                  <td style={TD}>
                    {fine.status === "Unpaid" && (
                      <button onClick={() => markPaid(fine.id)}
                        style={{ display: "flex", alignItems: "center", gap: 5, background: "linear-gradient(135deg,#f48fb1,#ffd54f)", color: "white", border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: 13, height: 13 }}>
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
                        </svg>
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "10px 20px", borderTop: "1px solid #ffe0e8", background: "#fff8f8", fontSize: 12, color: "#b89090" }}>Showing {filtered.length} of {fines.length} fines</div>
      </div>
    </div>
  );
}
