type AdminPage = "cto" | "circulation" | "cataloging" | "member-registration" | "financial-settlement";

interface CTODashboardPageProps {
  onNavigate: (page: AdminPage) => void;
  onLogout: () => void;
}

const inventoryGaps = [
  { term: "Manga", searches: 47 },
  { term: "Stephen Hawking", searches: 31 },
  { term: "Dune", searches: 28 },
  { term: "Korean Fiction", searches: 19 },
  { term: "Rizal Diaries", searches: 14 },
];

const hoarderAlerts = [
  {
    memberId: 14,
    name: "R. Santos",
    detail: "Attempted 6th loan — limit exceeded",
    severity: "red" as const,
  },
  {
    memberId: 27,
    name: "M. dela Cruz",
    detail: "Attempted 6th loan — limit exceeded",
    severity: "amber" as const,
  },
  {
    memberId: 83,
    name: "J. Reyes",
    detail: "Attempted 6th loan — limit exceeded",
    severity: "amber" as const,
  },
];

export default function CTODashboardPage({ onNavigate, onLogout }: CTODashboardPageProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-amber-100 font-sans text-slate-900">
      {/* Warm matte acrylic mesh background — identical to all pages */}
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
          {/* Dashboard — active */}
          <button
            type="button"
            onClick={() => onNavigate("cto")}
            className="flex w-full items-center gap-3 rounded-2xl bg-white/70 px-3 py-2.5 text-left text-sm font-semibold text-slate-900 shadow-sm transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 flex-none text-slate-700" aria-hidden="true">
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

          {/* Financial Settlement */}
          <button
            type="button"
            onClick={() => onNavigate("financial-settlement")}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition hover:bg-white/40 hover:text-slate-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 flex-none" aria-hidden="true">
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
            CTO Overview: Business Intelligence
          </h1>
        </header>

        {/* ── KPI Cards Row ── */}
        <section aria-label="Key Performance Indicators" className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Card 1 — Look-to-Book Conversion */}
          <div className="rounded-2xl border border-white/60 bg-white/40 p-6 shadow-lg backdrop-blur-xl">
            <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
              Look-to-Book Conversion
            </p>
            <div className="mt-3 flex items-end gap-3">
              <span className="text-4xl font-bold tracking-tight text-slate-900">12.4%</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="mb-1 h-6 w-6 flex-none text-emerald-600"
              >
                <path fill="currentColor" d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
              </svg>
            </div>
            <p className="mt-2 text-sm font-medium text-emerald-600">+2.1% this week</p>
            <p className="mt-0.5 text-xs text-slate-400">Searches that resulted in a loan</p>
          </div>

          {/* Card 2 — Active Loans */}
          <div className="rounded-2xl border border-white/60 bg-white/40 p-6 shadow-lg backdrop-blur-xl">
            <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
              Currently Checked Out
            </p>
            <div className="mt-3">
              <span className="text-4xl font-bold tracking-tight text-slate-900">142</span>
              <span className="ml-2 text-lg font-medium text-slate-500">Books</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">Active loans across all members</p>
          </div>

          {/* Card 3 — Unpaid Fines */}
          <div className="rounded-2xl border border-white/60 bg-white/40 p-6 shadow-lg backdrop-blur-xl">
            <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
              Unpaid Fines
            </p>
            <div className="mt-3">
              <span className="text-4xl font-bold tracking-tight text-slate-900">₱840.00</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">Total outstanding across all accounts</p>
          </div>
        </section>

        {/* ── Inventory Gaps Panel ── */}
        <section aria-label="Inventory Gaps" className="mb-8">
          <div className="rounded-3xl border border-white/60 bg-white/50 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Inventory Gaps (Dead-End Searches)
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Search queries that returned zero results — potential acquisition targets.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100/60 px-3 py-1 text-xs font-medium text-emerald-700 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Sourced from MongoDB Telemetry
              </span>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-white/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/50 bg-white/30">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-slate-400">
                      Search Term
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-slate-400">
                      No. of Searches
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-slate-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryGaps.map((row, i) => (
                    <tr
                      key={row.term}
                      className={`border-b border-white/40 transition hover:bg-white/30 ${
                        i === inventoryGaps.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-slate-800">{row.term}</td>
                      <td className="px-4 py-3 text-slate-600">{row.searches}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100/60 px-2.5 py-0.5 text-xs font-medium text-red-700">
                          No Results
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Hoarder Alerts Panel ── */}
        <section aria-label="Hoarder Alerts">
          <div className="rounded-3xl border border-white/60 bg-white/50 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Hoarder Alerts</h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Members who triggered the 5-book active loan constraint.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-100/60 px-3 py-1 text-xs font-medium text-orange-700 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                Sourced from MySQL{" "}
                <code className="font-mono">trg_limit_active_loans</code>
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {hoarderAlerts.map((alert) => (
                <div
                  key={alert.memberId}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/50 bg-white/30 px-4 py-3 backdrop-blur-sm transition hover:bg-white/50"
                >
                  <div className="flex items-center gap-3">
                    {/* Severity badge */}
                    {alert.severity === "red" ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-100/70 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-3 w-3" aria-hidden="true">
                          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        Critical
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-100/70 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-3 w-3" aria-hidden="true">
                          <path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                        </svg>
                        Warning
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Member ID: {alert.memberId} — {alert.name}
                      </p>
                      <p className="text-xs text-slate-500">{alert.detail}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">Trigger fired</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Floating glassmorphism footer */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 px-4 sm:px-6 lg:px-8">
        <footer className="pointer-events-auto mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs text-slate-600 shadow-2xl shadow-orange-200/60 ring-1 ring-white/50 backdrop-blur-2xl sm:px-6 sm:text-sm">
          <span className="truncate">Created by JhunDB Database Solutions</span>
          <a
            href="#"
            className="ml-4 text-slate-500 underline-offset-4 transition hover:text-slate-800 hover:underline"
          >
            Privacy
          </a>
        </footer>
      </div>
    </div>
  );
}
