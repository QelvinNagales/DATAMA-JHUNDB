import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";

const initialLoans = [
  { id: "L001", member: "Sarah Johnson", book: "To Kill a Mockingbird", librarian: "Robert Thompson", checkout: "2026-01-15", due: "2026-02-15", status: "Returned" },
  { id: "L002", member: "James Williams", book: "1984", librarian: "Robert Thompson", checkout: "2026-01-20", due: "2026-02-20", status: "Overdue" },
  { id: "L003", member: "Emily Brown", book: "Pride and Prejudice", librarian: "Linda White", checkout: "2026-01-25", due: "2026-02-05", status: "Overdue" },
  { id: "L004", member: "Michael Davis", book: "The Great Gatsby", librarian: "Linda White", checkout: "2026-02-01", due: "2026-03-01", status: "Active" },
  { id: "L005", member: "Olivia Martinez", book: "The Old Man and the Sea", librarian: "Patricia Harris", checkout: "2026-02-05", due: "2026-03-05", status: "Active" },
];

const statusStyle: Record<string, { color: string; bg: string }> = {
  Active:   { color: "#c2185b", bg: "#fce4ec" },
  Overdue:  { color: "#e57373", bg: "#fff0f0" },
  Returned: { color: "#388e3c", bg: "#e8f5e9" },
};

const TH: React.CSSProperties = { color: "#9c4a70", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "12px 20px", textAlign: "left" };
const TD: React.CSSProperties = { padding: "13px 20px" };

export default function AdminLoans() {
  const [loans, setLoans] = useState(initialLoans);
  const [search, setSearch] = useState("");

  const markReturned = (id: string) => setLoans((prev) => prev.map((l) => l.id === id ? { ...l, status: "Returned" } : l));
  const filtered = loans.filter((l) => l.member.toLowerCase().includes(search.toLowerCase()) || l.book.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#5d2f3a", margin: 0 }}>Loans</h1>
          <p style={{ fontSize: 13, color: "#9e7a7a", marginTop: 4 }}>Manage book loans</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,#f48fb1,#ffd54f)", color: "white", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <ArrowLeftRight size={14} /> + Create Loan
        </button>
      </div>
      <div style={{ position: "relative", maxWidth: 320 }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "#c8a0a0" }}>
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L19 20.5 20.5 19 15.5 14zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" fill="currentColor" />
        </svg>
        <input type="text" placeholder="Search loans..." value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", boxSizing: "border-box", paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, border: "1.5px solid #ffd6e0", borderRadius: 8, fontSize: 13, color: "#5d2f3a", background: "white", outline: "none" }}
          onFocus={(e) => e.target.style.borderColor = "#f48fb1"} onBlur={(e) => e.target.style.borderColor = "#ffd6e0"} />
      </div>
      <div style={{ background: "white", borderRadius: 16, overflow: "hidden", border: "1px solid #ffd6e0", boxShadow: "0 2px 16px rgba(244,143,177,0.1)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "linear-gradient(135deg, #fce4ec, #fff9c4)" }}>
                {["Member", "Book", "Librarian", "Checkout", "Due", "Status", "Actions"].map((h) => <th key={h} style={TH}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((loan, i) => (
                <tr key={loan.id} style={{ borderTop: i === 0 ? "none" : "1px solid #ffe0e8", transition: "background 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fff8f8")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ ...TD, fontWeight: 600, fontSize: 14, color: "#5d2f3a" }}>{loan.member}</td>
                  <td style={{ ...TD, fontSize: 13, color: "#9e7a7a" }}>{loan.book}</td>
                  <td style={{ ...TD, fontSize: 13, color: "#9e7a7a" }}>{loan.librarian}</td>
                  <td style={{ ...TD, fontSize: 13, color: "#9e7a7a" }}>{loan.checkout}</td>
                  <td style={{ ...TD, fontSize: 13, color: "#9e7a7a" }}>{loan.due}</td>
                  <td style={TD}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600, color: statusStyle[loan.status].color, background: statusStyle[loan.status].bg }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusStyle[loan.status].color }} />
                      {loan.status}
                    </span>
                  </td>
                  <td style={TD}>
                    {loan.status !== "Returned" && (
                      <button onClick={() => markReturned(loan.id)}
                        style={{ display: "flex", alignItems: "center", gap: 5, background: "linear-gradient(135deg,#f48fb1,#ffd54f)", color: "white", border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: 13, height: 13 }}>
                          <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" fill="currentColor" />
                        </svg>
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "10px 20px", borderTop: "1px solid #ffe0e8", background: "#fff8f8", fontSize: 12, color: "#b89090" }}>Showing {filtered.length} of {loans.length} loans</div>
      </div>
    </div>
  );
}
