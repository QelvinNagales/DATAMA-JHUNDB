import { useState, type FormEvent } from "react";

interface CirculationDeskPageProps {
  onLogout: () => void;
}

export default function CirculationDeskPage({ onLogout }: CirculationDeskPageProps) {
  const [activeTab, setActiveTab] = useState<"borrow" | "return">("borrow");

  // Borrow form state
  const [memberId, setMemberId] = useState("");
  const [bookId, setBookId] = useState("");
  const [showError, setShowError] = useState(false);

  // Return form state
  const [loanId, setLoanId] = useState("");
  const [showFine, setShowFine] = useState(false);

  /**
   * Handles the book borrowing process.
   * In production this will:
   *   1. Call MySQL stored procedure: CALL borrow(:member_id, :book_id, :librarian_id)
   *   2. On success, log a BORROW_CONFIRMED event document to MongoDB
   * Error 1644 from MySQL ("Member has reached the maximum of 5 active loans")
   * is caught and surfaced via the red alert banner below.
   */
  const handleBorrow = (e: FormEvent) => {
    e.preventDefault();
    // Demo: toggle error state to preview the MySQL 1644 error UI
    setShowError(true);
  };

  const dismissError = () => setShowError(false);

  /**
   * Handles the book return process.
   * In production this will:
   *   1. Call MySQL stored procedure: CALL return_item(:loan_id)
   *   2. The procedure automatically calculates and inserts any overdue fine
   * The fine amount is returned from the procedure and shown in the amber banner.
   */
  const handleReturn = (e: FormEvent) => {
    e.preventDefault();
    // Demo: toggle fine state to preview the late return fine UI
    setShowFine(true);
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

      <div className="relative flex min-h-screen flex-col px-4 sm:px-6 lg:px-8">
        {/* Navbar */}
        <header className="flex justify-center pt-6 sm:pt-8">
          <nav className="inline-flex w-full max-w-7xl items-center justify-between rounded-full border border-white/60 bg-white/70 px-4 py-2 shadow-2xl shadow-orange-200/60 ring-1 ring-white/50 backdrop-blur-2xl sm:px-6 sm:py-2.5">
            <div className="text-sm font-semibold tracking-tight text-slate-800 sm:text-base">
              City Archive{" "}
              <span className="font-normal text-slate-500">|</span>{" "}
              Librarian Workspace
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex transform items-center rounded-full border border-white/60 bg-white/60 px-4 py-1.5 text-sm font-medium text-slate-800 shadow-sm transition duration-200 ease-out hover:-translate-y-px hover:bg-white/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/80 focus-visible:ring-offset-0"
            >
              Logout
            </button>
          </nav>
        </header>

        {/* Main content */}
        <main className="flex flex-1 flex-col items-center justify-center py-12 pb-28 sm:pb-32">
          {/* Page heading */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Circulation Desk
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Process loans and returns for library members.
            </p>
          </div>

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

                  {/* Error alert — MySQL Error 1644 */}
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
                          Loan Limit Reached
                        </p>
                        <p className="mt-0.5 text-xs text-red-700">
                          MySQL Error 1644 — Member has reached the maximum of
                          5 active loans. Please advise the member to return an
                          item before borrowing again.
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
                        className="inline-flex flex-none items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white shadow-md transition duration-150 ease-out hover:bg-slate-800 hover:shadow-lg active:scale-[0.98]"
                      >
                        Process Loan
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
                          <span className="font-semibold">₱40.00</span> has
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
                        className="inline-flex flex-none items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white shadow-md transition duration-150 ease-out hover:bg-slate-800 hover:shadow-lg active:scale-[0.98]"
                      >
                        Process Return
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
