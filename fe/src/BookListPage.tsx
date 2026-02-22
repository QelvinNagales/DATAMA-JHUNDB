import { useState, useEffect, type FormEvent } from "react";
import { apiFetch } from "@/api/client";

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  available: boolean;
  coverColor: string;
}

const COVER_COLORS = [
  "from-amber-300/80 to-orange-400/80",
  "from-rose-300/80 to-pink-400/80",
  "from-sky-300/80 to-blue-400/80",
  "from-emerald-300/80 to-teal-400/80",
  "from-violet-300/80 to-purple-400/80",
  "from-yellow-300/80 to-amber-400/80",
];

interface CatalogItem {
  book_id: number;
  title: string;
  author_name: string | null;
  category_name: string | null;
  categories?: string[];
  available: boolean;
  cover_image_url?: string | null;
}

interface BookListPageProps {
  searchQuery: string;
  onBack: () => void;
  onSearch: (query: string) => void;
  onSelectBook: (id: number) => void;
  onLogin: () => void;
}

export default function BookListPage({
  searchQuery,
  onBack,
  onSearch,
  onSelectBook,
  onLogin,
}: BookListPageProps) {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    apiFetch("/api/catalog")
      .then((data: CatalogItem[]) => {
        if (cancelled) return;
        const mapped: Book[] = (data || []).map((row, i) => ({
          id: row.book_id,
          title: row.title || "Untitled",
          author: row.author_name || "Unknown",
          genre: row.category_name || row.categories?.[0] || "General",
          available: row.available,
          coverColor: COVER_COLORS[i % COVER_COLORS.length],
        }));
        setBooks(mapped);
      })
      .catch((err: { message?: string }) => {
        if (!cancelled) setError(err?.message || "Failed to load catalog.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filteredBooks = searchQuery.trim()
    ? books.filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.genre.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : books;

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
              onClick={onLogin}
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

          {error && (
            <div className="mb-4 rounded-2xl border border-rose-200/80 bg-rose-50/90 px-4 py-3 text-sm text-rose-800">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-slate-500">Loading catalog…</p>
          ) : (
          <div className="flex flex-col gap-4">
            {filteredBooks.map((book) => (
              <button
                key={book.id}
                type="button"
                onClick={() => onSelectBook(book.id)}
                className="group flex w-full items-center gap-5 overflow-hidden rounded-2xl border border-white/60 bg-white/40 p-4 text-left shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/80 sm:gap-6 sm:p-5"
              >
                {/* Cover thumbnail */}
                <div
                  className={`flex h-20 w-14 flex-none items-center justify-center rounded-xl bg-gradient-to-br ${book.coverColor} shadow-md sm:h-24 sm:w-16`}
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
                  <p className="text-sm text-slate-600">{book.author}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {/* Genre pill */}
                    <span className="rounded-full border border-white/60 bg-white/60 px-2.5 py-0.5 text-xs font-medium text-slate-700 backdrop-blur-sm">
                      {book.genre}
                    </span>

                    {/* Availability badge */}
                    <span
                      className={`flex items-center gap-1.5 text-xs font-medium ${
                        book.available ? "text-emerald-700" : "text-slate-500"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          book.available
                            ? "bg-emerald-400 shadow-[0_0_6px_1px_rgba(52,211,153,0.6)]"
                            : "bg-slate-400"
                        }`}
                      />
                      {book.available ? "Available" : "Checked Out"}
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
            ))}
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
