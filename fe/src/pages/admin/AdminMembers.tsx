import { Users } from "lucide-react";

const mockMembers = [
  { id: 1, name: "Maria Santos", email: "maria@email.com", status: "Active", joined: "Jan 10, 2025" },
  { id: 2, name: "Juan dela Cruz", email: "juan@email.com", status: "Active", joined: "Feb 3, 2025" },
  { id: 3, name: "Ana Reyes", email: "ana@email.com", status: "Suspended", joined: "Mar 15, 2025" },
  { id: 4, name: "Pedro Bautista", email: "pedro@email.com", status: "Active", joined: "Apr 22, 2025" },
  { id: 5, name: "Rosa Garcia", email: "rosa@email.com", status: "Active", joined: "May 5, 2025" },
];

export default function AdminMembers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "hsl(220,60%,15%)" }}>Members</h1>
          <p className="mt-1 text-sm" style={{ color: "hsl(220,15%,46%)" }}>Manage library members</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white"
          style={{ background: "hsl(220,85%,50%)" }}>
          <Users className="h-4 w-4" /> Add Member
        </button>
      </div>

      <div className="rounded-xl border overflow-hidden"
        style={{ background: "white", borderColor: "hsl(220,20%,88%)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "hsl(220,20%,97%)" }}>
                {["Name", "Email", "Status", "Joined"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "hsl(220,15%,46%)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockMembers.map((m) => (
                <tr key={m.id} style={{ borderTop: "1px solid hsl(220,20%,94%)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(220,20%,98%)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td className="px-6 py-4 font-medium" style={{ color: "hsl(220,60%,15%)" }}>{m.name}</td>
                  <td className="px-6 py-4" style={{ color: "hsl(220,15%,46%)" }}>{m.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={{
                        color: m.status === "Active" ? "hsl(152,60%,40%)" : "hsl(0,72%,51%)",
                        background: m.status === "Active" ? "hsl(152,60%,40%,0.1)" : "hsl(0,72%,51%,0.1)",
                      }}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-6 py-4" style={{ color: "hsl(220,15%,46%)" }}>{m.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
