import { useState } from "react";
import { Feather } from "lucide-react";

const mockAuthors = [
  { id: "A001", name: "Harper Lee" },
  { id: "A002", name: "George Orwell" },
  { id: "A003", name: "Jane Austen" },
  { id: "A004", name: "Mark Twain" },
  { id: "A005", name: "F. Scott Fitzgerald" },
  { id: "A006", name: "Ernest Hemingway" },
];

export default function AdminAuthors() {
  const [search, setSearch] = useState("");

  const filtered = mockAuthors.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "hsl(220,60%,15%)" }}>Authors</h1>
          <p className="mt-1 text-sm" style={{ color: "hsl(220,15%,46%)" }}>Manage book authors</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ background: "hsl(220,85%,50%)" }}>
          <Feather className="h-4 w-4" /> + Add Author
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "hsl(220,15%,65%)" }}>
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L19 20.5 20.5 19 15.5 14zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" fill="currentColor" />
        </svg>
        <input
          type="text"
          placeholder="Search authors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border pl-9 pr-4 py-2 text-sm outline-none transition"
          style={{ borderColor: "hsl(220,20%,88%)", background: "white", color: "hsl(220,60%,15%)" }}
          onFocus={(e) => e.target.style.borderColor = "hsl(220,85%,50%)"}
          onBlur={(e) => e.target.style.borderColor = "hsl(220,20%,88%)"}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden"
        style={{ background: "white", borderColor: "hsl(220,20%,88%)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "hsl(220,20%,97%)" }}>
                {["ID", "Name", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "hsl(220,15%,46%)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((author) => (
                <tr key={author.id} style={{ borderTop: "1px solid hsl(220,20%,94%)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(220,20%,98%)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td className="px-6 py-4 font-mono text-xs" style={{ color: "hsl(220,15%,55%)" }}>{author.id}</td>
                  <td className="px-6 py-4 font-medium" style={{ color: "hsl(220,60%,15%)" }}>{author.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="rounded p-1.5 transition hover:bg-slate-100">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" style={{ color: "hsl(220,15%,55%)" }}>
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
                        </svg>
                      </button>
                      <button className="rounded p-1.5 transition hover:bg-red-50">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" style={{ color: "hsl(0,72%,51%)" }}>
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor" />
                        </svg>
                      </button>
                    </div>
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
