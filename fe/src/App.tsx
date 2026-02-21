import { useState, type FormEvent } from "react";
import BookListPage from "./BookListPage";
import BookDetailsPage from "./BookDetailsPage";

type Page =
  | "home"
  | "booklist"
  | "bookdetails"
  | "login"
  | "admin"
  | "member";

function App() {
  const [page, setPage] = useState<Page>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<"admin" | "member" | null>(null);

  const navigateToBookList = (query: string) => {
    setSearchQuery(query);
    setPage("booklist");
  };

  const navigateToBookDetails = (id: number) => {
    setSelectedBookId(id);
    setPage("bookdetails");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    navigateToBookList(searchQuery);
  };

  const handleLogin = (role: "admin" | "member") => {
    setUserRole(role);
    setPage(role);
  };

  const handleLogout = () => {
    setUserRole(null);
    setPage("home");
  };

  /* ===========================
     BOOK DETAILS PAGE
  =========================== */
  if (page === "bookdetails") {
    return (
      <BookDetailsPage
        bookId={selectedBookId!}
        onBack={() => setPage("booklist")}
      />
    );
  }

  /* ===========================
     BOOK LIST PAGE
  =========================== */
  if (page === "booklist") {
    return (
      <BookListPage
        searchQuery={searchQuery}
        onBack={() => setPage("home")}
        onSearch={(query) => navigateToBookList(query)}
        onSelectBook={navigateToBookDetails}
      />
    );
  }

  /* ===========================
     LOGIN PAGE
  =========================== */
  if (page === "login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-amber-100">
        <div className="rounded-2xl bg-white p-10 shadow-2xl">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900">
            City Archive Login
          </h2>

          <button
            onClick={() => handleLogin("member")}
            className="mb-3 w-full rounded-lg bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800"
          >
            Login as Member
          </button>

          <button
            onClick={() => handleLogin("admin")}
            className="w-full rounded-lg bg-slate-700 px-4 py-2 text-white transition hover:bg-slate-600"
          >
            Login as Admin
          </button>

          <button
            onClick={() => setPage("home")}
            className="mt-6 text-sm text-slate-500 underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  /* ===========================
     MEMBER DASHBOARD
  =========================== */
  if (page === "member" && userRole === "member") {
    return (
      <div className="min-h-screen bg-amber-100 p-10">
        <h1 className="text-4xl font-semibold text-slate-900">
          Member Dashboard
        </h1>
        <p className="mt-2 text-slate-600">
          Welcome to City Archive Library.
        </p>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => setPage("booklist")}
            className="rounded-lg bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800"
          >
            Browse Books
          </button>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  /* ===========================
     ADMIN DASHBOARD
  =========================== */
  if (page === "admin" && userRole === "admin") {
    return (
      <div className="min-h-screen bg-amber-100 p-10">
        <h1 className="text-4xl font-semibold text-slate-900">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-slate-600">
          Manage books, members, and system settings.
        </p>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => setPage("booklist")}
            className="rounded-lg bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800"
          >
            Manage Books
          </button>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  /* ===========================
     HOME PAGE
  =========================== */
  return (
    <div className="relative min-h-screen overflow-hidden bg-amber-100 font-sans text-slate-900">
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
          <nav className="inline-flex w-full max-w-7xl items-center justify-between rounded-full border border-white/60 bg-white/70 px-4 py-2 shadow-2xl backdrop-blur-2xl sm:px-6 sm:py-2.5">
            <div className="text-sm font-semibold tracking-tight text-slate-800 sm:text-base">
              <span>City Archive</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => navigateToBookList("")}
                className="inline-flex rounded-full px-4 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Browse All
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!userRole) {
                    setPage("login");
                  } else {
                    setPage(userRole);
                  }
                }}
                className="inline-flex rounded-full border border-white/60 bg-white/60 px-4 py-1.5 text-sm font-medium text-slate-800 shadow-sm hover:bg-white/80"
              >
                {userRole ? "Dashboard" : "Login"}
              </button>
            </div>
          </nav>
        </header>

        {/* Hero */}
        <main className="flex flex-1 flex-col items-center justify-center pb-28 pt-10 sm:pb-32 sm:pt-12">
          <h1 className="text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            City Archive Library
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-6 flex w-full max-w-2xl flex-col items-stretch gap-3"
          >
            <div className="flex items-center gap-3 rounded-full border border-white/60 bg-white/50 px-4 py-2.5 shadow-2xl backdrop-blur-xl sm:px-5 sm:py-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search authors, books, and more..."
                className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none sm:text-base"
              />

              <button
                type="submit"
                className="hidden rounded-full bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-800 sm:inline-flex"
              >
                Search
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default App;
