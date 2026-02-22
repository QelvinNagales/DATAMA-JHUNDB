import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";

const initialLoans = [
  { id: "L001", member: "Sarah Johnson", book: "To Kill a Mockingbird", librarian: "Robert Thompson", checkout: "2026-01-15", due: "2026-02-15", status: "Returned" },
  { id: "L002", member: "James Williams", book: "1984", librarian: "Robert Thompson", checkout: "2026-01-20", due: "2026-02-20", status: "Overdue" },
  { id: "L003", member: "Emily Brown", book: "Pride and Prejudice", librarian: "Linda White", checkout: "2026-01-25", due: "2026-02-05", status: "Overdue" },
  { id: "L004", member: "Michael Davis", book: "The Great Gatsby", librarian: "Linda White", checkout: "2026-02-01", due: "2026-03-01", status: "Active" },
  { id: "L005", member: "Olivia Martinez", book: "The Old Man and the Sea", librarian: "Patricia Harris", checkout: "2026-02-05", due: "2026-03-05", status: "Active" },
  { id: "L006", member: "Sarah Johnson", book: "Animal Farm", librarian: "Robert Thompson", checkout: "2026-01-10", due: "2026-01-25", status: "Overdue" },
  { id: "L007", member: "Daniel Garcia", book: "Adventures of Huckleberry Finn", librarian: "Patricia Harris", checkout: "2026-02-08", due: "2026-03-08", status: "Active" },
  { id: "L008", member: "Sophia Wilson", book: "A Farewell to Arms", librarian: "Robert Thompson", checkout: "2025-12-20", due: "2026-01-20", status: "Returned" },
];

const statusStyle: Record<string, { color: string; bg: string }> = {
  Active: { color: "hsl(220,85%,50%)", bg: "hsl(220,85%,50%,0.1)" },
  Overdue: { color: "hsl(0,72%,51%)", bg: "hsl(0,72%,51%,0.1)" },
  Returned: { color: "hsl(152,60%,40%)", bg: "hsl(152,60%,40%,0.1)" },
};

export default function AdminLoans() {
  const [loans, setLoans] = useState(initialLoans);
  const [search, setSearch] = useState("");

  const markReturned = (id: string) => {
    setLoans((prev) => prev.map((l) => l.id === id ? { ...l, status: "Returned" } : l));
  };

  const filtered = loans.filter(
    (l) =>
      l.member.toLowerCase().includes(search.toLowerCase()) ||
      l.book.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "hsl(220,60%,15%)" }}>Loans</h1>
          <p className="mt-1 text-sm" style={{ color: "hsl(220,15%,46%)" }}>Manage book loans</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ background: "hsl(220,85%,50%)" }}>
          <ArrowLeftRight className="h-4 w-4" /> + Create Loan
        </button>
      </div>

      <div className="relative max-w-sm">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "hsl(220,15%,65%)" }}>
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L19 20.5 20.5 19 15.5 14zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" fill="currentColor" />
        </svg>
        <input type="text" placeholder="Search loans..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border pl-9 pr-4 py-2 text-sm outline-none transition"
          style={{ borderColor: "hsl(220,20%,88%)", background: "white", color: "hsl(220,60%,15%)" }}
          onFocus={(e) => e.target.style.borderColor = "hsl(220,85%,50%)"}
          onBlur={(e) => e.target.style.borderColor = "hsl(220,20%,88%)"}
        />
      </div>

      <div className="rounded-xl border overflow-hidden"
        style={{ background: "white", borderColor: "hsl(220,20%,88%)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "hsl(220,20%,97%)" }}>
                {["Member", "Book", "Librarian", "Checkout", "Due", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "hsl(220,15%,46%)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((loan) => (
                <tr key={loan.id} style={{ borderTop: "1px solid hsl(220,20%,94%)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(220,20%,98%)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td className="px-6 py-4 font-medium" style={{ color: "hsl(220,60%,15%)" }}>{loan.member}</td>
                  <td className="px-6 py-4" style={{ color: "hsl(220,15%,46%)" }}>{loan.book}</td>
                  <td className="px-6 py-4" style={{ color: "hsl(220,15%,46%)" }}>{loan.librarian}</td>
                  <td className="px-6 py-4" style={{ color: "hsl(220,15%,46%)" }}>{loan.checkout}</td>
                  <td className="px-6 py-4" style={{ color: "hsl(220,15%,46%)" }}>{loan.due}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={{ color: statusStyle[loan.status].color, background: statusStyle[loan.status].bg }}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {loan.status !== "Returned" && (
                      <button onClick={() => markReturned(loan.id)}
                        className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition hover:opacity-80"
                        style={{ borderColor: "hsl(220,85%,50%)", color: "hsl(220,85%,50%)", background: "white" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-3.5 w-3.5">
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
      </div>
    </div>
  );
}
