import { BookOpen, Users, ArrowLeftRight, DollarSign, UserCog, TrendingUp } from "lucide-react";

const stats = [
  { title: "Total Books", value: "10,248", icon: BookOpen, color: "hsl(220,85%,50%)", bg: "hsl(220,85%,50%,0.08)" },
  { title: "Active Members", value: "2,419", icon: Users, color: "hsl(152,60%,40%)", bg: "hsl(152,60%,40%,0.08)" },
  { title: "Active Loans", value: "384", icon: ArrowLeftRight, color: "hsl(30,95%,55%)", bg: "hsl(30,95%,55%,0.08)" },
  { title: "Unpaid Fines", value: "₱12,450", icon: DollarSign, color: "hsl(0,72%,51%)", bg: "hsl(0,72%,51%,0.08)" },
];

const recentLoans = [
  { member: "Maria Santos", book: "Noli Me Tangere", date: "Feb 22, 2026", status: "Active" },
  { member: "Juan dela Cruz", book: "El Filibusterismo", date: "Feb 21, 2026", status: "Overdue" },
  { member: "Ana Reyes", book: "Florante at Laura", date: "Feb 20, 2026", status: "Active" },
  { member: "Pedro Bautista", book: "Ibong Adarna", date: "Feb 19, 2026", status: "Returned" },
  { member: "Rosa Garcia", book: "Po-on", date: "Feb 18, 2026", status: "Active" },
];

const statusColor: Record<string, { color: string; bg: string }> = {
  Active: { color: "hsl(220,85%,50%)", bg: "hsl(220,85%,50%,0.1)" },
  Overdue: { color: "hsl(0,72%,51%)", bg: "hsl(0,72%,51%,0.1)" },
  Returned: { color: "hsl(152,60%,40%)", bg: "hsl(152,60%,40%,0.1)" },
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "hsl(220,60%,15%)" }}>Dashboard</h1>
        <p className="mt-1 text-sm" style={{ color: "hsl(220,15%,46%)" }}>
          Welcome back — here's what's happening in the library today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.title}
            className="rounded-xl border p-5"
            style={{ background: "white", borderColor: "hsl(220,20%,88%)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "hsl(220,15%,46%)" }}>{stat.title}</p>
                <p className="mt-1 text-2xl font-bold" style={{ color: "hsl(220,60%,15%)" }}>{stat.value}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg"
                style={{ background: stat.bg }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Loans table */}
      <div className="rounded-xl border overflow-hidden"
        style={{ background: "white", borderColor: "hsl(220,20%,88%)" }}>
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid hsl(220,20%,88%)" }}>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" style={{ color: "hsl(220,85%,50%)" }} />
            <h2 className="font-semibold" style={{ color: "hsl(220,60%,15%)" }}>Recent Loans</h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "hsl(220,20%,97%)" }}>
                {["Member", "Book", "Date", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "hsl(220,15%,46%)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentLoans.map((loan, i) => (
                <tr key={i}
                  style={{ borderTop: "1px solid hsl(220,20%,94%)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(220,20%,98%)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-6 py-4 font-medium" style={{ color: "hsl(220,60%,15%)" }}>{loan.member}</td>
                  <td className="px-6 py-4" style={{ color: "hsl(220,15%,46%)" }}>{loan.book}</td>
                  <td className="px-6 py-4" style={{ color: "hsl(220,15%,46%)" }}>{loan.date}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={{
                        color: statusColor[loan.status].color,
                        background: statusColor[loan.status].bg,
                      }}>
                      {loan.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Manage Members", icon: Users, path: "/admin/members" },
          { label: "Manage Books", icon: BookOpen, path: "/admin/books" },
          { label: "View All Loans", icon: ArrowLeftRight, path: "/admin/loans" },
          { label: "Track Fines", icon: DollarSign, path: "/admin/fines" },
          { label: "Manage Librarians", icon: UserCog, path: "/admin/librarians" },
        ].map((item) => (
          <a key={item.label} href={item.path}
            className="flex items-center gap-3 rounded-xl border p-4 text-sm font-medium transition-all duration-200"
            style={{
              background: "white",
              borderColor: "hsl(220,20%,88%)",
              color: "hsl(220,60%,15%)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "hsl(220,85%,50%)";
              (e.currentTarget as HTMLElement).style.background = "hsl(220,85%,50%,0.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "hsl(220,20%,88%)";
              (e.currentTarget as HTMLElement).style.background = "white";
            }}
          >
            <item.icon className="h-4 w-4" style={{ color: "hsl(220,85%,50%)" }} />
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}
