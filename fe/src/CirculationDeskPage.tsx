import { useState, type FormEvent } from "react";
import { apiFetch } from "@/api/client";

type AdminPage = "cto" | "circulation" | "cataloging" | "member-registration" | "financial-settlement";

interface CirculationDeskPageProps {
  onLogout: () => void;
  onNavigate: (page: AdminPage) => void;
}

export default function CirculationDeskPage({ onLogout, onNavigate }: CirculationDeskPageProps) {
  const [activeTab, setActiveTab] = useState<"borrow" | "return">("borrow");

  // Borrow form state
  const [memberId, setMemberId] = useState("");
  const [bookId, setBookId] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [borrowSuccess, setBorrowSuccess] = useState(false);

  // Return form state
  const [loanId, setLoanId] = useState("");
  const [showFine, setShowFine] = useState(false);
  const [fineAmount, setFineAmount] = useState<string | null>(null);
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnSuccess, setReturnSuccess] = useState(false);

  const handleBorrow = async (e: FormEvent) => {
    e.preventDefault();
    setShowError(false);
    setErrorMessage("");
    setBorrowSuccess(false);
    setBorrowLoading(true);
    try {
      await apiFetch("/api/borrow", {
        method: "POST",
        body: JSON.stringify({
          member_id: Number(memberId),
          book_id: Number(bookId),
        }),
      });
      setMemberId("");
      setBookId("");
      setBorrowSuccess(true);
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Request failed.";
      setErrorMessage(msg);
      setShowError(true);
    } finally {
      setBorrowLoading(false);
    }
  };

  const dismissError = () => {
    setShowError(false);
    setErrorMessage("");
  };

  const handleReturn = async (e: FormEvent) => {
    e.preventDefault();
    setShowFine(false);
    setFineAmount(null);
    setReturnSuccess(false);
    setReturnLoading(true);
    try {
      const res = await apiFetch("/api/return", {
        method: "POST",
        body: JSON.stringify({ loan_id: Number(loanId) }),
      });
      setLoanId("");
      setReturnSuccess(true);
      if (res?.fine_amount != null) {
        setFineAmount(typeof res.fine_amount === "number" ? `₱${res.fine_amount.toFixed(2)}` : String(res.fine_amount));
        setShowFine(true);
      }
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Request failed.";
      setErrorMessage(msg);
      setShowError(true);
    } finally {
      setReturnLoading(false);
    }
  };

  const dismissFine = () => setShowFine(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-amber-100 font-sans text-slate-900">
      {/* Warm matte acrylic mesh background — identical to homepage */}
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

          {/* Circulation Desk — active */}
          <button
            type="button"
            onClick={() => onNavigate("circulation")}
            className="flex w-full items-center gap-3 rounded-2xl bg-white/70 px-3 py-2.5 text-left text-sm font-semibold text-slate-900 shadow-sm transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 flex-none text-slate-700" aria-hidden="true">
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
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Circulation Desk</h1>
          <p className="mt-1 text-sm text-slate-500">Process loans and returns for library members.</p>
        </header>

        <main className="flex flex-col items-start">
          {/* Glassmorphism card */}
          <div className="w-full max-w-4xl rounded-3xl border border-white/60 bg-white/50 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">

            {/* Tab switcher */}
            <div className="mb-8 flex items-center rounded-full bg-white/30 p-1 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setActiveTab("borrow")}
                className={`flex-1 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/80 ${
                  activeTab === "borrow"
                    ? "bg-white/80 text-slate-900 shadow-sm"
                    : "text-slate-500 hover:bg-white/30 hover:text-slate-700"
                }`}
              >
                Borrow Item
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("return")}
                className={`flex-1 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/80 ${
                  activeTab === "return"
                    ? "bg-white/80 text-slate-900 shadow-sm"
                    : "text-slate-500 hover:bg-white/30 hover:text-slate-700"
                }`}
              >
                Return Item
              </button>
            </div>

            {/* Tab panels */}
            <div className="min-h-[22rem]">

              {/* ── Tab 1: Borrow Item ── */}
              {activeTab === "borrow" && (
                <div className="animate-in fade-in duration-200">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Process Loan
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-500">
                      Enter the member and book identifiers to issue a loan.
                    </p>
                  </div>

                  {/* Error alert — MySQL Error 1644 or other */}
                  {showError && (
                    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-100/50 px-4 py-3 backdrop-blur-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 flex-none text-red-600"
                      >
                        <path
                          fill="currentColor"
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                        />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-red-800">
                          {errorMessage || "Request failed"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={dismissError}
                        aria-label="Dismiss error"
                        className="flex-none text-red-400 transition hover:text-red-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="h-4 w-4"
                        >
                          <path
                            fill="currentColor"
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                          />
                        </svg>
                      </button>
                    </div>
                  )}

                  {borrowSuccess && (
                    <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-100/50 px-4 py-3 text-sm text-emerald-800">
                      Loan processed successfully.
                    </div>
                  )}

                  <form onSubmit={handleBorrow} className="flex flex-col gap-4">
                    {/* Member ID */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="member-id"
                        className="pl-1 text-xs font-medium uppercase tracking-widest text-slate-500"
                      >
                        Member ID
                      </label>
                      <input
                        id="member-id"
                        type="text"
                        value={memberId}
                        onChange={(e) => setMemberId(e.target.value)}
                        placeholder="e.g. MEM-00142"
                        required
                        className="w-full rounded-full border border-white/60 bg-white/50 px-5 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm backdrop-blur-xl outline-none transition-all duration-200 focus:border-white/70 focus:ring-2 focus:ring-sky-300/80"
                      />
                    </div>

                    {/* Book ID */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="book-id"
                        className="pl-1 text-xs font-medium uppercase tracking-widest text-slate-500"
                      >
                        Book ID
                      </label>
                      <input
                        id="book-id"
                        type="text"
                        value={bookId}
                        onChange={(e) => setBookId(e.target.value)}
                        placeholder="e.g. BOOK-00391"
                        required
                        className="w-full rounded-full border border-white/60 bg-white/50 px-5 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm backdrop-blur-xl outline-none transition-all duration-200 focus:border-white/70 focus:ring-2 focus:ring-sky-300/80"
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-4">
                      <p className="text-xs text-slate-400">
                        Librarian ID is attached automatically from your session.
                      </p>
                      <button
                        type="submit"
                        disabled={borrowLoading}
                        className="inline-flex flex-none items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white shadow-md transition duration-150 ease-out hover:bg-slate-800 hover:shadow-lg active:scale-[0.98] disabled:opacity-70"
                      >
                        {borrowLoading ? "Processing…" : "Process Loan"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ── Tab 2: Return Item ── */}
              {activeTab === "return" && (
                <div className="animate-in fade-in duration-200">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Process Return
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-500">
                      Enter the loan identifier to check in the item and
                      calculate any outstanding fines.
                    </p>
                  </div>

                  {/* Fine alert — late return */}
                  {showFine && (
                    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-100/50 px-4 py-3 backdrop-blur-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 flex-none text-amber-600"
                      >
                        <path
                          fill="currentColor"
                          d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
                        />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-amber-800">
                          Late Return — Fine Generated
                        </p>
                        <p className="mt-0.5 text-xs text-amber-700">
                          Item returned past the due date. A fine of{" "}
                          <span className="font-semibold">{fineAmount ?? "—"}</span> has
                          been automatically calculated and added to the
                          member's account.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={dismissFine}
                        aria-label="Dismiss fine alert"
                        className="flex-none text-amber-400 transition hover:text-amber-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="h-4 w-4"
                        >
                          <path
                            fill="currentColor"
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                  {returnSuccess && (
                    <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-100/50 px-4 py-3 text-sm text-emerald-800">
                      Return processed successfully.
                    </div>
                  )}

                  <form onSubmit={handleReturn} className="flex flex-col gap-4">
                    {/* Loan ID */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="loan-id"
                        className="pl-1 text-xs font-medium uppercase tracking-widest text-slate-500"
                      >
                        Loan ID
                      </label>
                      <input
                        id="loan-id"
                        type="text"
                        value={loanId}
                        onChange={(e) => setLoanId(e.target.value)}
                        placeholder="e.g. LOAN-00788"
                        required
                        className="w-full rounded-full border border-white/60 bg-white/50 px-5 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm backdrop-blur-xl outline-none transition-all duration-200 focus:border-white/70 focus:ring-2 focus:ring-sky-300/80"
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-end">
                      <button
                        type="submit"
                        disabled={returnLoading}
                        className="inline-flex flex-none items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white shadow-md transition duration-150 ease-out hover:bg-slate-800 hover:shadow-lg active:scale-[0.98] disabled:opacity-70"
                      >
                        {returnLoading ? "Processing…" : "Process Return"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>

      {/* Floating glassmorphism footer — identical to homepage */}
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
