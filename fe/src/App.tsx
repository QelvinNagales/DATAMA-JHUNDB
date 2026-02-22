import { useState, type FormEvent } from "react";
import BookListPage from "./BookListPage";
import BookDetailsPage from "./BookDetailsPage";

type Page = "home" | "booklist" | "bookdetails";

function App() {
  const [page, setPage] = useState<Page>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

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

  if (page === "bookdetails") {
    return (
      <BookDetailsPage
        bookId={selectedBookId!}
        onBack={() => setPage("booklist")}
        onLogin={() => { window.location.href = "/login"; }}
      />
    );
  }

  if (page === "booklist") {
    return (
      <BookListPage
        searchQuery={searchQuery}
        onBack={() => setPage("home")}
        onSearch={(query) => navigateToBookList(query)}
        onSelectBook={navigateToBookDetails}
        onLogin={() => { window.location.href = "/login"; }}
      />
    );
  }

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

      <div className="relative flex min-h-screen flex-col px-4 sm:px-6 lg:px-8">
        {/* Navbar */}
        <header className="flex justify-center pt-6 sm:pt-8">
          <nav className="inline-flex w-full max-w-7xl items-center justify-between rounded-full border border-white/60 bg-white/70 px-4 py-2 shadow-2xl shadow-orange-200/60 ring-1 ring-white/50 backdrop-blur-2xl sm:px-6 sm:py-2.5">
            <div className="text-sm font-semibold tracking-tight text-slate-800 sm:text-base">
              <span>City Archive</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => navigateToBookList("")}
                className="inline-flex transform items-center rounded-full px-4 py-1.5 text-sm font-medium text-slate-700 transition duration-200 ease-out hover:-translate-y-px hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/80 focus-visible:ring-offset-0"
              >
                Browse All
              </button>
              <a
                href="/login"
                className="inline-flex transform items-center rounded-full border border-white/60 bg-white/60 px-4 py-1.5 text-sm font-medium text-slate-800 shadow-sm transition duration-200 ease-out hover:-translate-y-px hover:bg-white/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/80 focus-visible:ring-offset-0"
              >
                Login
              </a>
            </div>
          </nav>
        </header>

        {/* Main hero */}
        <main className="flex flex-1 flex-col items-center justify-center pb-28 pt-10 sm:pb-32 sm:pt-12">
          <h1 className="text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            City Archive Library
          </h1>

          {/* Search */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex w-full max-w-2xl flex-col items-stretch gap-3"
          >
            <div className="flex items-center gap-3 rounded-full border border-white/60 bg-white/50 px-4 py-2.5 shadow-2xl shadow-gray-200/60 backdrop-blur-xl transition-all duration-200 ease-out focus-within:border-white/70 focus-within:ring-2 focus-within:ring-sky-300/80 focus-within:ring-offset-0 sm:px-5 sm:py-3">
              {/* Icon */}
              <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white/70 text-slate-400 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4"
                >
                  <path
                    d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L19 20.5 20.5 19 15.5 14zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search authors, books, and more..."
                className="flex-1 border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none sm:text-base"
              />

              <button
                type="submit"
                className="hidden transform items-center rounded-full bg-slate-900 px-4 py-1.5 text-sm font-medium text-white shadow-md transition duration-150 ease-out hover:bg-slate-800 hover:shadow-lg active:scale-[0.98] sm:inline-flex"
              >
                Search
              </button>
            </div>

            {/* Mobile submit button */}
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-md transition duration-150 ease-out hover:bg-slate-800 hover:shadow-lg active:scale-[0.98] sm:hidden"
            >
              Search
            </button>
          </form>
        </main>

        {/* Footer */}
        <div className="pointer-events-none fixed inset-x-0 bottom-4 px-4 sm:px-6 lg:px-8">
          <footer className="pointer-events-auto mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs text-slate-600 shadow-2xl shadow-orange-200/60 ring-1 ring-white/50 backdrop-blur-2xl sm:px-6 sm:text-sm">
            <span className="truncate">
              Created by JhunDB Database Solutions
            </span>
            <a
              href="#"
              className="ml-4 text-slate-500 underline-offset-4 transition hover:text-slate-800 hover:underline"
            >
              Privacy
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
