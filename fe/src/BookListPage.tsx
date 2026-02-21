import { useState, type FormEvent } from "react";
import { useBooks } from "./hooks/useLibraryData";

// Color palette for book covers based on category
const getCoverColor = (category: string): string => {
  const colors: Record<string, string> = {
    "Historical Fiction": "from-amber-300/80 to-orange-400/80",
    "Political Novel": "from-rose-300/80 to-pink-400/80",
    "Epic Poetry": "from-sky-300/80 to-blue-400/80",
    "Folk Literature": "from-emerald-300/80 to-teal-400/80",
    "Social Realism": "from-violet-300/80 to-purple-400/80",
    "Classic": "from-yellow-300/80 to-amber-400/80",
    "Fiction": "from-indigo-300/80 to-blue-400/80",
    "Non-Fiction": "from-slate-300/80 to-gray-400/80",
  };
  return colors[category] || "from-slate-300/80 to-slate-400/80";
};

interface BookListPageProps {
  searchQuery: string;
  onBack: () => void;
  onSearch: (query: string) => void;
  onSelectBook: (id: number) => void;
}

export default function BookListPage({
  searchQuery,
  onBack,
  onSearch,
  onSelectBook,
}: BookListPageProps) {
  const [inputValue, setInputValue] = useState(searchQuery);
  const { books, loading, error } = useBooks(searchQuery || undefined);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(inputValue.trim());
  };

  const pageTitle = searchQuery
    ? `Search Results for "${searchQuery}"`
    : "All Books";

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

      <div className="relative flex min-h-screen flex-col px-4 pb-24 sm:px-6 lg:px-8">
        {/* Navbar */}
        <header className="flex justify-center pt-6 sm:pt-8">
          <nav className="inline-flex w-full max-w-7xl items-center justify-between rounded-full border border-white/60 bg-white/70 px-4 py-2 shadow-2xl shadow-orange-200/60 ring-1 ring-white/50 backdrop-blur-2xl sm:px-6 sm:py-2.5">
            {/* Logo — acts as back/home button */}
            <button
              type="button"
              onClick={onBack}
              className="text-sm font-semibold tracking-tight text-slate-800 transition duration-150 hover:text-slate-600 sm:text-base"
            >
              City Archive
            </button>

            {/* Login */}
            <button
              type="button"
              className="inline-flex transform items-center rounded-full border border-white/60 bg-white/60 px-4 py-1.5 text-sm font-medium text-slate-800 shadow-sm transition duration-200 ease-out hover:-translate-y-px hover:bg-white/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/80"
            >
              Login
            </button>
          </nav>
        </header>

        {/* Main content */}
        <main className="mx-auto mt-10 w-full max-w-7xl flex-1 sm:mt-12">
          <h2 className="mb-5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {pageTitle}
          </h2>

          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mb-8 flex items-center gap-3 rounded-full border border-white/60 bg-white/50 px-4 py-2.5 shadow-xl shadow-gray-200/60 backdrop-blur-xl transition-all duration-200 focus-within:border-white/70 focus-within:ring-2 focus-within:ring-sky-300/80 sm:px-5 sm:py-3"
          >
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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search authors, books, and more..."
              className="flex-1 border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none sm:text-base"
            />
            <button
              type="submit"
              className="hidden transform items-center rounded-full bg-slate-900 px-4 py-1.5 text-sm font-medium text-white shadow-md transition duration-150 ease-out hover:bg-slate-800 hover:shadow-lg active:scale-[0.98] sm:inline-flex"
            >
              Search
            </button>
          </form>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
              <span className="ml-3 text-slate-600">Loading books...</span>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 text-center backdrop-blur-xl">
              <p className="text-red-700">Failed to load books: {error}</p>
              <p className="mt-2 text-sm text-slate-600">Make sure the backend server is running on port 5000</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && books.length === 0 && (
            <div className="rounded-2xl border border-white/60 bg-white/40 p-8 text-center backdrop-blur-xl">
              <p className="text-lg text-slate-600">No books found</p>
              {searchQuery && (
                <p className="mt-2 text-sm text-slate-500">
                  Try a different search term
                </p>
              )}
            </div>
          )}

          {/* Book list */}
          {!loading && !error && books.length > 0 && (
            <div className="flex flex-col gap-4">
              {books.map((book) => {
                const isAvailable = book.available_copies > 0;
                const coverColor = getCoverColor(book.category_name);
                
                return (
                  <button
                    key={book.book_id}
                    type="button"
                    onClick={() => onSelectBook(book.book_id)}
                    className="group flex w-full items-center gap-5 overflow-hidden rounded-2xl border border-white/60 bg-white/40 p-4 text-left shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/80 sm:gap-6 sm:p-5"
                  >
                    {/* Cover thumbnail */}
                    <div
                      className={`flex h-20 w-14 flex-none items-center justify-center rounded-xl bg-gradient-to-br ${coverColor} shadow-md sm:h-24 sm:w-16`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-7 w-7 text-white/80"
                      >
                        <path
                          d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM6 4h5v8l-2.5-1.5L6 12V4Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>

                    {/* Metadata */}
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <p className="truncate text-base font-bold leading-snug text-slate-900 sm:text-lg">
                        {book.title}
                      </p>
                      <p className="text-sm text-slate-600">{book.author_name}</p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {/* Genre pill */}
                        <span className="rounded-full border border-white/60 bg-white/60 px-2.5 py-0.5 text-xs font-medium text-slate-700 backdrop-blur-sm">
                          {book.category_name || "Uncategorized"}
                        </span>

                        {/* Copies info */}
                        <span className="text-xs text-slate-500">
                          {book.available_copies}/{book.total_copies} copies
                        </span>

                        {/* Availability badge */}
                        <span
                          className={`flex items-center gap-1.5 text-xs font-medium ${
                            isAvailable ? "text-emerald-700" : "text-slate-500"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              isAvailable
                                ? "bg-emerald-400 shadow-[0_0_6px_1px_rgba(52,211,153,0.6)]"
                                : "bg-slate-400"
                            }`}
                          />
                          {isAvailable ? "Available" : "Checked Out"}
                        </span>
                      </div>
                    </div>

                    {/* Chevron */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-5 w-5 flex-none text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      <path
                        d="M9 18l6-6-6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </button>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
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
