import { useEffect, useState, useRef, type FormEvent } from "react";
import { apiFetch } from "@/api/client";
import emailjs from "@emailjs/browser";
import { Search, Download, Bell, CheckCircle2, ChevronDown } from "lucide-react";

/* ── EmailJS config – replace with your own IDs ── */
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

interface Fine {
  fine_id: number;
  loan_id: number;
  member_id: number;
  member_name: string;
  member_email: string;
  book_title: string;
  amount: string | number;
  is_paid: boolean;
  issued_at: string;
  settled_at: string | null;
}

export default function AdminFines() {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Paid" | "Unpaid">("");
  const [notifying, setNotifying] = useState<number | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const fetchFines = (q = "", status = "") => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    const qs = params.toString();
    apiFetch(`/api/fines${qs ? `?${qs}` : ""}`)
      .then((data: Fine[]) => setFines(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFines(); }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    fetchFines(searchInput.trim(), statusFilter);
  };

  const handleStatusChange = (s: string) => {
    const val = s as "" | "Paid" | "Unpaid";
    setStatusFilter(val);
    fetchFines(searchInput.trim(), val);
  };

  const handleSettle = async (fineId: number) => {
    if (!confirm("Settle this fine?")) return;
    try {
      await apiFetch(`/api/fines/settle/${fineId}`, { method: "PUT" });
      fetchFines(searchInput.trim(), statusFilter);
    } catch { alert("Settlement failed."); }
  };

  const handleNotify = async (fine: Fine) => {
    if (!fine.member_email) { alert("Member has no email address on file."); return; }
    setNotifying(fine.fine_id);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: fine.member_email,
          to_name: fine.member_name,
          fine_amount: `₱${Number(fine.amount).toFixed(2)}`,
          book_title: fine.book_title,
          fine_id: fine.fine_id,
          issued_date: new Date(fine.issued_at).toLocaleDateString(),
          library_name: "City Archive Library",
        },
        EMAILJS_PUBLIC_KEY,
      );
      alert(`Notification sent to ${fine.member_email}`);
    } catch {
      alert("Failed to send notification. Check EmailJS configuration.");
    } finally { setNotifying(null); }
  };

  const exportCSV = () => {
    const headers = ["Fine ID", "Loan ID", "Member", "Email", "Book", "Amount", "Status", "Issued", "Settled"];
    const rows = fines.map((f) => [
      f.fine_id,
      f.loan_id,
      `"${f.member_name}"`,
      f.member_email,
      `"${f.book_title}"`,
      Number(f.amount).toFixed(2),
      f.is_paid ? "Paid" : "Unpaid",
      new Date(f.issued_at).toLocaleDateString(),
      f.settled_at ? new Date(f.settled_at).toLocaleDateString() : "",
    ].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `fines_export_${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <>
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-slate-400">Librarian Portal</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Fines</h1>
        <p className="mt-1 text-sm text-slate-500">Track overdue fines, settle payments, and notify members.</p>
      </header>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <form onSubmit={handleSearch} className="flex flex-1 items-center gap-3 rounded-full border border-white/60 bg-white/50 px-4 py-2.5 shadow-xl backdrop-blur-xl transition-all focus-within:ring-2 focus-within:ring-sky-300/80 sm:max-w-md">
          <Search className="h-4 w-4 flex-none text-slate-400" />
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by member or book…" className="flex-1 border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none" />
          <button type="submit" className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white shadow-md hover:bg-slate-800">Search</button>
        </form>
        <div className="flex flex-wrap items-center gap-2">
          {/* Custom status dropdown */}
          <div className="relative" ref={filterRef}>
            <button type="button" onClick={() => setFilterOpen(!filterOpen)} className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/50 px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-xl transition hover:bg-white/70">
              {statusFilter || "All"}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
            </button>
            {filterOpen && (
              <div className="absolute left-0 top-full z-30 mt-2 min-w-[9rem] overflow-hidden rounded-2xl border border-white/60 bg-white/80 py-1 shadow-xl backdrop-blur-2xl">
                {([["", "All"], ["Unpaid", "Unpaid"], ["Paid", "Paid"]] as const).map(([val, label]) => (
                  <button key={val} type="button" onClick={() => { handleStatusChange(val); setFilterOpen(false); }} className={`flex w-full items-center px-4 py-2 text-left text-sm transition hover:bg-white/60 ${statusFilter === val ? "font-semibold text-slate-900 bg-white/50" : "text-slate-600"}`}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button type="button" onClick={exportCSV} className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/60 px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-xl hover:bg-white/80">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/60 bg-white/40 shadow-lg backdrop-blur-xl">
        {loading ? (
          <div className="py-16 text-center text-slate-500">Loading fines…</div>
        ) : fines.length === 0 ? (
          <div className="py-16 text-center text-slate-400">No fines found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/40 bg-white/30 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Member</th>
                <th className="px-5 py-3">Book</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Issued</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/30">
              {fines.map((f) => (
                <tr key={f.fine_id} className="transition hover:bg-white/30">
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{f.fine_id}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-800">{f.member_name}</p>
                    <p className="text-[11px] text-slate-400">{f.member_email || "No email"}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-700">{f.book_title}</td>
                  <td className="px-5 py-3 font-semibold text-slate-900">₱{Number(f.amount).toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${f.is_paid ? "bg-emerald-100/60 text-emerald-700" : "bg-rose-100/60 text-rose-700"}`}>
                      {f.is_paid ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{fmtDate(f.issued_at)}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      {!f.is_paid && (
                        <>
                          <button type="button" onClick={() => handleSettle(f.fine_id)} className="inline-flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50/80 px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm hover:bg-emerald-100/80">
                            <CheckCircle2 className="h-3 w-3" /> Settle
                          </button>
                          <button type="button" onClick={() => handleNotify(f)} disabled={notifying === f.fine_id} className="inline-flex items-center gap-1 rounded-full border border-amber-200/60 bg-amber-50/80 px-3 py-1 text-xs font-medium text-amber-700 shadow-sm hover:bg-amber-100/80 disabled:opacity-60">
                            <Bell className="h-3 w-3" /> {notifying === f.fine_id ? "Sending…" : "Notify"}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Config reminder */}
      <div className="mt-6 rounded-2xl border border-amber-200/60 bg-amber-50/50 px-5 py-4 text-sm text-amber-800 backdrop-blur-xl">
        <strong>EmailJS Setup:</strong> Open <code className="mx-1 rounded bg-amber-100/60 px-1.5 py-0.5 text-xs">fe/src/admin/AdminFines.tsx</code> and replace <code className="mx-1 rounded bg-amber-100/60 px-1.5 py-0.5 text-xs">YOUR_SERVICE_ID</code>, <code className="mx-1 rounded bg-amber-100/60 px-1.5 py-0.5 text-xs">YOUR_TEMPLATE_ID</code>, and <code className="mx-1 rounded bg-amber-100/60 px-1.5 py-0.5 text-xs">YOUR_PUBLIC_KEY</code> with your EmailJS credentials.
      </div>
    </>
  );
}
