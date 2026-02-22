import { useState } from "react";

const initialFines = [
  { id: "F001", member: "Emily Brown", book: "Pride and Prejudice", amount: 55.00, status: "Unpaid" },
  { id: "F002", member: "Sarah Johnson", book: "Animal Farm", amount: 120.00, status: "Unpaid" },
  { id: "F003", member: "Sophia Wilson", book: "A Farewell to Arms", amount: 20.00, status: "Paid" },
  { id: "F004", member: "James Williams", book: "1984", amount: 85.00, status: "Unpaid" },
  { id: "F005", member: "Michael Davis", book: "The Great Gatsby", amount: 45.00, status: "Paid" },
];

const TH: React.CSSProperties = {
  color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 600,
  textTransform: "uppercase", letterSpacing: "0.08em",
  padding: "12px 20px", textAlign: "left",
};

export default function AdminFines() {
  const [fines, setFines] = useState(initialFines);
  const [search, setSearch] = useState("");

  const markPaid = (id: string) => setFines((prev) => prev.map((f) => f.id === id ? { ...f, status: "Paid" } : f));

  const filtered = fines.filter(
    (f) => f.member.toLowerCase().includes(search.toLowerCase()) || f.book.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnpaid = fines.filter((f) => f.status === "Unpaid").reduce((sum, f) => sum + f.amount, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "hsl(220,60%,15%)", margin: 0 }}>Fines</h1>
          <p style={{ fontSize: 13, color: "hsl(220,15%,50%)", marginTop: 4 }}>Manage outstanding and paid fines</p>
        </div>
        <div style={{ background: "hsl(30,95%,92%)", border: "1.5px solid hsl(30,95%,75%)", borderRadius: 10, padding: "8px 18px", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "hsl(30,70%,40%)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Unpaid</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "hsl(30,80%,35%)" }}>₱{totalUnpaid.toFixed(2)}</div>
        </div>
      </div>

      <div style={{ position: "relative", maxWidth: 320 }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "hsl(220,15%,65%)" }}>
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L19 20.5 20.5 19 15.5 14zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" fill="currentColor" />
        </svg>
        <input type="text" placeholder="Search fines..." value={search}
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
                {["Fine ID", "Member", "Book", "Amount", "Status", "Actions"].map((h) => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((fine, i) => (
                <tr key={fine.id}
                  style={{ borderTop: i === 0 ? "none" : "1px solid hsl(220,20%,94%)", transition: "background 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(220,40%,98%)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "13px 20px" }}>
                    <span style={{ display: "inline-block", background: "hsl(220,65%,18%)", color: "rgba(255,255,255,0.85)", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600, fontFamily: "monospace" }}>{fine.id}</span>
                  </td>
                  <td style={{ padding: "13px 20px", fontWeight: 600, fontSize: 14, color: "hsl(220,60%,15%)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "hsl(220,85%,50%)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                        {fine.member.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      {fine.member}
                    </div>
                  </td>
                  <td style={{ padding: "13px 20px", fontSize: 13, color: "hsl(220,15%,50%)" }}>{fine.book}</td>
                  <td style={{ padding: "13px 20px", fontWeight: 700, fontSize: 14, color: fine.status === "Unpaid" ? "hsl(30,80%,35%)" : "hsl(220,60%,15%)" }}>
                    ₱{fine.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: "13px 20px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600, color: fine.status === "Paid" ? "hsl(152,60%,35%)" : "hsl(30,80%,40%)", background: fine.status === "Paid" ? "hsl(152,60%,92%)" : "hsl(30,95%,90%)" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: fine.status === "Paid" ? "hsl(152,60%,45%)" : "hsl(30,95%,50%)" }} />
                      {fine.status}
                    </span>
                  </td>
                  <td style={{ padding: "13px 20px" }}>
                    {fine.status === "Unpaid" && (
                      <button onClick={() => markPaid(fine.id)} style={{ display: "flex", alignItems: "center", gap: 5, background: "hsl(220,65%,18%)", color: "white", border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
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
        <div style={{ padding: "10px 20px", borderTop: "1px solid hsl(220,20%,94%)", background: "hsl(220,30%,98%)", fontSize: 12, color: "hsl(220,15%,55%)" }}>
          Showing {filtered.length} of {fines.length} fines
        </div>
      </div>
    </div>
  );
}
