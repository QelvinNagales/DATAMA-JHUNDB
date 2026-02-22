import { useEffect, useState, useRef, type FormEvent } from "react";
import { apiFetch } from "@/api/client";
import { Search, Plus, Download, Undo2, X, FileText, ChevronDown } from "lucide-react";

interface Loan {
  loan_id: number;
  member_id: number;
  member_name: string;
  book_id: number;
  book_title: string;
  isbn: string;
  borrowed_at: string;
  due_date: string;
  returned_at: string | null;
  status: string;
}

interface LoanReceipt {
  loan_id: number;
  member_name: string;
  book_title: string;
  isbn: string;
  borrowed_at: string;
  due_date: string;
}

export default function AdminLoans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Overdue" | "Returned">("");
  const [showNewLoan, setShowNewLoan] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [memberId, setMemberId] = useState("");
  const [bookId, setBookId] = useState("");
  const [receipt, setReceipt] = useState<LoanReceipt | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const fetchLoans = (q = "", status = "") => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    const qs = params.toString();
    apiFetch(`/api/loans${qs ? `?${qs}` : ""}`)
      .then((data: Loan[]) => setLoans(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLoans(); }, []);

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
    fetchLoans(searchInput.trim(), statusFilter);
  };

  const handleStatusChange = (s: string) => {
    const val = s as "" | "Active" | "Overdue" | "Returned";
    setStatusFilter(val);
    fetchLoans(searchInput.trim(), val);
  };

  const handleNewLoan = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(""); setFormLoading(true);
    try {
      const data = await apiFetch("/api/loans", {
        method: "POST",
        body: JSON.stringify({ member_id: Number(memberId), book_id: Number(bookId) }),
      });
      setReceipt(data.receipt || {
        loan_id: data.loan_id,
        member_name: `Member #${memberId}`,
        book_title: `Book #${bookId}`,
        isbn: "",
        borrowed_at: new Date().toISOString(),
        due_date: new Date(Date.now() + 14 * 86400000).toISOString(),
      });
      setShowNewLoan(false);
      fetchLoans(searchInput.trim(), statusFilter);
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Failed to create loan.";
      setFormError(msg);
    } finally { setFormLoading(false); }
  };

  const handleReturn = async (loanId: number) => {
    if (!confirm("Mark this loan as returned?")) return;
    try {
      await apiFetch(`/api/loans/${loanId}/return`, { method: "PUT" });
      fetchLoans(searchInput.trim(), statusFilter);
    } catch { alert("Return failed."); }
  };

  const exportCSV = () => {
    const headers = ["Loan ID", "Member", "Book", "ISBN", "Borrowed", "Due", "Returned", "Status"];
    const rows = loans.map((l) => [
      l.loan_id,
      `"${l.member_name}"`,
      `"${l.book_title}"`,
      l.isbn,
      new Date(l.borrowed_at).toLocaleDateString(),
      new Date(l.due_date).toLocaleDateString(),
      l.returned_at ? new Date(l.returned_at).toLocaleDateString() : "",
      l.status,
    ].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `loans_export_${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const printReceipt = () => {
    if (!receiptRef.current) return;
    const printWindow = window.open("", "_blank", "width=420,height=600");
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Loan Receipt</title>
      <style>body{font-family:system-ui,sans-serif;padding:32px;max-width:360px;margin:0 auto}
      h2{text-align:center;margin-bottom:4px}p.sub{text-align:center;color:#666;font-size:12px;margin-top:0}
      table{width:100%;border-collapse:collapse;margin-top:16px}td{padding:6px 0;border-bottom:1px dashed #ddd;font-size:13px}
      td:first-child{color:#888;width:40%}.footer{text-align:center;margin-top:24px;font-size:11px;color:#888}
      </style></head><body>`);
    printWindow.document.write(receiptRef.current.innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const statusBadge = (s: string) => {
    const clr = s === "Active" ? "bg-sky-100/60 text-sky-700" : s === "Overdue" ? "bg-rose-100/60 text-rose-700" : "bg-emerald-100/60 text-emerald-700";
    return <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${clr}`}>{s}</span>;
  };

  return (
    <>
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-slate-400">Librarian Portal</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Loans</h1>
        <p className="mt-1 text-sm text-slate-500">Manage book circulation, issue invoices, and export records.</p>
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
              {statusFilter || "All Statuses"}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
            </button>
            {filterOpen && (
              <div className="absolute left-0 top-full z-30 mt-2 min-w-[10rem] overflow-hidden rounded-2xl border border-white/60 bg-white/80 py-1 shadow-xl backdrop-blur-2xl">
                {([["", "All Statuses"], ["Active", "Active"], ["Overdue", "Overdue"], ["Returned", "Returned"]] as const).map(([val, label]) => (
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
          <button type="button" onClick={() => { setFormError(""); setMemberId(""); setBookId(""); setShowNewLoan(true); }} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-slate-800 hover:shadow-lg active:scale-[0.98]">
            <Plus className="h-4 w-4" /> New Loan
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/60 bg-white/40 shadow-lg backdrop-blur-xl">
        {loading ? (
          <div className="py-16 text-center text-slate-500">Loading loans…</div>
        ) : loans.length === 0 ? (
          <div className="py-16 text-center text-slate-400">No loans found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/40 bg-white/30 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Member</th>
                <th className="px-5 py-3">Book</th>
                <th className="px-5 py-3">Borrowed</th>
                <th className="px-5 py-3">Due</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/30">
              {loans.map((l) => (
                <tr key={l.loan_id} className="transition hover:bg-white/30">
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{l.loan_id}</td>
                  <td className="px-5 py-3 font-medium text-slate-800">{l.member_name}</td>
                  <td className="px-5 py-3 text-slate-700">{l.book_title}</td>
                  <td className="px-5 py-3 text-slate-600">{fmtDate(l.borrowed_at)}</td>
                  <td className="px-5 py-3 text-slate-600">{fmtDate(l.due_date)}</td>
                  <td className="px-5 py-3">{statusBadge(l.status)}</td>
                  <td className="px-5 py-3 text-right">
                    {l.status !== "Returned" && (
                      <button type="button" onClick={() => handleReturn(l.loan_id)} className="inline-flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50/80 px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm hover:bg-emerald-100/80">
                        <Undo2 className="h-3 w-3" /> Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* New Loan Modal */}
      {showNewLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => setShowNewLoan(false)}>
          <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/80 p-8 shadow-2xl backdrop-blur-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Issue New Loan</h2>
              <button type="button" onClick={() => setShowNewLoan(false)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            {formError && <div className="mb-4 rounded-2xl border border-rose-200/80 bg-rose-50/90 px-4 py-3 text-sm text-rose-800">{formError}</div>}
            <form onSubmit={handleNewLoan} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-slate-500">Member ID</label>
                <input type="number" value={memberId} onChange={(e) => setMemberId(e.target.value)} required className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-300/80" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-slate-500">Book ID</label>
                <input type="number" value={bookId} onChange={(e) => setBookId(e.target.value)} required className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-300/80" />
              </div>
              <div className="mt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowNewLoan(false)} className="rounded-full border border-slate-200/60 bg-white/60 px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-white/80">Cancel</button>
                <button type="submit" disabled={formLoading} className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white shadow-md hover:bg-slate-800 disabled:opacity-70">
                  {formLoading ? "Processing…" : "Issue Loan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => setReceipt(null)}>
          <div className="w-full max-w-sm rounded-3xl border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900"><FileText className="h-5 w-5 text-amber-600" /> Loan Receipt</h2>
              <button type="button" onClick={() => setReceipt(null)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <div ref={receiptRef}>
              <h2>City Archive Library</h2>
              <p className="sub">Loan Receipt</p>
              <table>
                <tbody>
                  <tr><td>Loan #</td><td>{receipt.loan_id}</td></tr>
                  <tr><td>Member</td><td>{receipt.member_name}</td></tr>
                  <tr><td>Book</td><td>{receipt.book_title}</td></tr>
                  <tr><td>ISBN</td><td>{receipt.isbn || "—"}</td></tr>
                  <tr><td>Borrowed</td><td>{fmtDate(receipt.borrowed_at)}</td></tr>
                  <tr><td>Due Date</td><td>{fmtDate(receipt.due_date)}</td></tr>
                </tbody>
              </table>
              <p className="footer">Thank you for using City Archive Library.</p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setReceipt(null)} className="rounded-full border border-slate-200/60 bg-white/60 px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-white/80">Close</button>
              <button type="button" onClick={printReceipt} className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white shadow-md hover:bg-slate-800">Print Receipt</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
