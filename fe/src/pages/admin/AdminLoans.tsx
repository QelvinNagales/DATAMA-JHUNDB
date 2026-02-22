const mockLoans = [
  { id: 1, member: "Maria Santos", book: "Noli Me Tangere", borrowed: "Feb 15, 2026", due: "Mar 1, 2026", status: "Active" },
  { id: 2, member: "Juan dela Cruz", book: "El Filibusterismo", borrowed: "Feb 1, 2026", due: "Feb 15, 2026", status: "Overdue" },
  { id: 3, member: "Ana Reyes", book: "Florante at Laura", borrowed: "Feb 10, 2026", due: "Feb 24, 2026", status: "Active" },
  { id: 4, member: "Pedro Bautista", book: "Ibong Adarna", borrowed: "Jan 20, 2026", due: "Feb 3, 2026", status: "Returned" },
  { id: 5, member: "Rosa Garcia", book: "Po-on", borrowed: "Feb 18, 2026", due: "Mar 4, 2026", status: "Active" },
];

const statusStyle: Record<string, { color: string; bg: string }> = {
  Active: { color: "hsl(220,85%,50%)", bg: "hsl(220,85%,50%,0.1)" },
  Overdue: { color: "hsl(0,72%,51%)", bg: "hsl(0,72%,51%,0.1)" },
  Returned: { color: "hsl(152,60%,40%)", bg: "hsl(152,60%,40%,0.1)" },
};

export default function AdminLoans() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "hsl(220,60%,15%)" }}>Loans</h1>
        <p className="mt-1 text-sm" style={{ color: "hsl(220,15%,46%)" }}>Track all book loans and returns</p>
      </div>

      <div className="rounded-xl border overflow-hidden"
        style={{ background: "white", borderColor: "hsl(220,20%,88%)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "hsl(220,20%,97%)" }}>
                {["Member", "Book", "Borrowed", "Due Date", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "hsl(220,15%,46%)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockLoans.map((loan) => (
                <tr key={loan.id} style={{ borderTop: "1px solid hsl(220,20%,94%)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(220,20%,98%)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td className="px-6 py-4 font-medium" style={{ color: "hsl(220,60%,15%)" }}>{loan.member}</td>
                  <td className="px-6 py-4" style={{ color: "hsl(220,15%,46%)" }}>{loan.book}</td>
                  <td className="px-6 py-4" style={{ color: "hsl(220,15%,46%)" }}>{loan.borrowed}</td>
                  <td className="px-6 py-4" style={{ color: "hsl(220,15%,46%)" }}>{loan.due}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={{ color: statusStyle[loan.status].color, background: statusStyle[loan.status].bg }}>
                      {loan.status}
                    </span>
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
