import { useState, useEffect } from "react";
import { apiFetch } from "@/api/client";

type AdminPage = "cto" | "circulation" | "cataloging" | "member-registration" | "financial-settlement";

interface FinancialSettlementPageProps {
  onNavigate: (page: AdminPage) => void;
  onLogout: () => void;
}

interface Fine {
  fine_id: string;
  loan_id: string;
  member_name: string;
  amount: string;
  amountNum: number;
  is_paid: boolean;
}

export default function FinancialSettlementPage({ onNavigate, onLogout }: FinancialSettlementPageProps) {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/fines/unpaid")
      .then((data: { fine_id: number; loan_id: number; amount: number; is_paid: boolean }[]) => {
        const mapped: Fine[] = (data || []).map((row) => ({
          fine_id: String(row.fine_id),
          loan_id: String(row.loan_id),
          member_name: "—",
          amount: typeof row.amount === "number" ? `₱${row.amount.toFixed(2)}` : String(row.amount),
          amountNum: Number(row.amount) || 0,
          is_paid: Boolean(row.is_paid),
        }));
        setFines(mapped);
      })
      .catch((err: { message?: string }) => setError(err?.message || "Failed to load fines."))
      .finally(() => setLoading(false));
  }, []);

  const handleSettle = (fine_id: string) => {
    apiFetch("/api/fines/settle/" + fine_id, { method: "PUT" })
      .then(() => {
        setFines((prev) =>
          prev.map((f) => (f.fine_id === fine_id ? { ...f, is_paid: true } : f))
        );
      })
      .catch((err: { message?: string }) => setError(err?.message || "Failed to settle fine."));
  };

  const totalUnpaid = fines
    .filter((f) => !f.is_paid)
    .reduce((sum, f) => sum + f.amountNum, 0);

  return (
    <div className="relative min-h-screen overflow-hidden bg-amber-100 font-sans text-slate-900">
      {/* Warm matte acrylic mesh background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[56rem] w-[56rem] -translate-x-1/2 rounded-full bg-amber-300/80 blur-3xl" />
        <div className="absolute -left-40 top-10 h-[48rem] w-[48rem] rounded-full bg-rose-300/75 blur-3xl" />
        <div className="absolute -right-40 top-32 h-[52rem] w-[52rem] rounded-full bg-orange-300/70 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-[52rem] w-[52rem] -translate-x-1/2 rounded-full bg-pink-300/70 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[40rem] w-[40rem] rounded-full bg-yellow-200/60 blur-3xl" />
      </div>

      {/* Floating glassmorphism sidebar */}
      <aside className="fixed left-4 top-4 bottom-4 z-20 flex w-56 flex-col rounded-3xl border border-white/60 bg-white/50 p-4 shadow-2xl shadow-orange-200/40 backdrop-blur-2xl">
        {/* Brand */}
        <div className="mb-8 px-2 pt-2">
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400">City Archive</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800">Librarian Intranet</p>
        </div>

        {/* Nav links */}
        <nav className="flex flex-1 flex-col gap-1">
          {/* Dashboard */}
          <button
            type="button"
            onClick={() => onNavigate("cto")}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition hover:bg-white/40 hover:text-slate-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 flex-none" aria-hidden="true">
              <path fill="currentColor" d="M3 13h8V3H3zm0 8h8v-6H3zm10 0h8V11h-8zm0-18v6h8V3z" />
            </svg>
            Dashboard
          </button>

          {/* Circulation Desk */}
          <button
            type="button"
            onClick={() => onNavigate("circulation")}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition hover:bg-white/40 hover:text-slate-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 flex-none" aria-hidden="true">
              <path fill="currentColor" d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z" />
            </svg>
            Circulation Desk
          </button>

          {/* Member Registration */}
          <button
            type="button"
            onClick={() => onNavigate("member-registration")}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition hover:bg-white/40 hover:text-slate-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 flex-none" aria-hidden="true">
              <path fill="currentColor" d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            Member Registration
          </button>

          {/* Financial Settlement — active */}
          <button
            type="button"
            onClick={() => onNavigate("financial-settlement")}
            className="flex w-full items-center gap-3 rounded-2xl bg-white/70 px-3 py-2.5 text-left text-sm font-semibold text-slate-900 shadow-sm transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 flex-none text-slate-700" aria-hidden="true">
              <path fill="currentColor" d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
            </svg>
            Financial Settlement
          </button>

          {/* Cataloging */}
          <button
            type="button"
            onClick={() => onNavigate("cataloging")}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition hover:bg-white/40 hover:text-slate-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 flex-none" aria-hidden="true">
              <path fill="currentColor" d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
            </svg>
            Cataloging
          </button>
        </nav>

        {/* Logout pinned to bottom */}
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-2xl border border-white/60 bg-white/60 px-3 py-2.5 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:bg-white/80 hover:shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 flex-none text-slate-500" aria-hidden="true">
            <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
          </svg>
          Logout
        </button>
      </aside>

      {/* Main content — offset by sidebar width */}
      <div className="relative ml-64 min-h-screen px-8 py-10 pb-16">
        {/* Page header */}
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400">Librarian Intranet</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Financial Settlement Desk
          </h1>
          <p className="mt-1 text-sm text-slate-500">Outstanding Account Receivables</p>
        </header>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200/80 bg-rose-50/90 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-slate-500">Loading fines…</p>
        ) : (
        <>
        {/* Summary stat */}
        <div className="mb-6 inline-flex items-center gap-3 rounded-2xl border border-white/60 bg-white/40 px-5 py-3 shadow-lg backdrop-blur-xl">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-slate-400">Total Outstanding</p>
            <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
              ₱{totalUnpaid.toFixed(2)}
            </p>
          </div>
          <div className="ml-4 h-10 w-px bg-white/40" />
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-slate-400">Unpaid Records</p>
            <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
              {fines.filter((f) => !f.is_paid).length}
            </p>
          </div>
        </div>

        {/* Fines table container */}
        <div className="w-full max-w-5xl rounded-3xl border border-white/60 bg-white/40 shadow-2xl backdrop-blur-2xl">
          {/* Table header bar */}
          <div className="flex items-center justify-between border-b border-white/30 px-8 py-5">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Overdue Fines</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Collect payment and mark accounts as settled.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/70 bg-amber-100/50 px-3 py-1 text-xs font-medium text-amber-700 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              {fines.filter((f) => !f.is_paid).length} Unpaid
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/30 bg-white/20">
                  <th className="px-8 py-4 text-left text-xs font-medium uppercase tracking-widest text-slate-400">
                    Fine ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-widest text-slate-400">
                    Loan ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-widest text-slate-400">
                    Member Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-widest text-slate-400">
                    Amount Due
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-widest text-slate-400">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-widest text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {fines.map((fine) => (
                  <tr
                    key={fine.fine_id}
                    className="border-b border-white/30 hover:bg-white/20 transition-colors"
                  >
                    {/* Fine ID */}
                    <td className="px-8 py-5">
                      <span className="font-mono text-xs font-semibold tracking-wider text-slate-500">
                        {fine.fine_id}
                      </span>
                    </td>

                    {/* Loan ID */}
                    <td className="px-6 py-5">
                      <span className="font-mono text-xs text-slate-500">
                        {fine.loan_id}
                      </span>
                    </td>

                    {/* Member Name */}
                    <td className="px-6 py-5">
                      <span className="font-medium text-slate-800">{fine.member_name}</span>
                    </td>

                    {/* Amount Due */}
                    <td className="px-6 py-5">
                      <span className="text-base font-semibold tracking-tight text-slate-900">
                        {fine.amount}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-5">
                      {fine.is_paid ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100/60 px-3 py-1 text-xs font-semibold text-emerald-700 backdrop-blur-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-100/60 px-3 py-1 text-xs font-semibold text-amber-700 backdrop-blur-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          Unpaid
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-5">
                      {!fine.is_paid ? (
                        <button
                          type="button"
                          onClick={() => handleSettle(fine.fine_id)}
                          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition duration-150 ease-out hover:bg-slate-800 hover:shadow-md active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/80"
                        >
                          Settle
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state — all settled */}
          {fines.every((f) => f.is_paid) && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100/60 border border-emerald-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 text-emerald-600" aria-hidden="true">
                  <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-700">All fines settled</p>
              <p className="mt-0.5 text-xs text-slate-400">No outstanding account receivables at this time.</p>
            </div>
          )}

          {/* Table footer */}
          <div className="flex items-center justify-between px-8 py-4">
            <p className="text-xs text-slate-400">
              Showing {fines.length} records · {fines.filter((f) => f.is_paid).length} settled
            </p>
            <p className="text-xs text-slate-400">
              [MySQL] <code className="font-mono">fines</code> table
            </p>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
