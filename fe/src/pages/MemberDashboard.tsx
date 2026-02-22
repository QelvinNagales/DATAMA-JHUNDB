import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, ArrowLeft } from "lucide-react";

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  available: boolean;
  coverColor: string;
  synopsis: string;
  year: number;
  pages: number;
}

const BOOKS: Book[] = [
  { id: 1, title: "Noli Me Tangere", author: "José Rizal", genre: "Historical Fiction", available: true, coverColor: "from-blue-400/80 to-indigo-500/80", synopsis: "A sweeping indictment of abuse and injustice during Spanish colonial rule in the Philippines.", year: 1887, pages: 468 },
  { id: 2, title: "El Filibusterismo", author: "José Rizal", genre: "Political Novel", available: false, coverColor: "from-slate-400/80 to-slate-600/80", synopsis: "The darker sequel to Noli Me Tangere, depicting a revolutionary plot against colonial oppressors.", year: 1891, pages: 290 },
  { id: 3, title: "Florante at Laura", author: "Francisco Balagtas", genre: "Epic Poetry", available: true, coverColor: "from-sky-400/80 to-blue-500/80", synopsis: "An allegorical Tagalog poem telling the story of Florante, a Christian nobleman, and his beloved Laura.", year: 1838, pages: 180 },
  { id: 4, title: "Ibong Adarna", author: "Anonymous", genre: "Folk Literature", available: true, coverColor: "from-cyan-400/80 to-teal-500/80", synopsis: "A classic Filipino folk epic about a magical bird whose song can cure any illness.", year: 1800, pages: 120 },
  { id: 5, title: "Po-on", author: "F. Sionil José", genre: "Historical Fiction", available: false, coverColor: "from-blue-300/80 to-blue-500/80", synopsis: "The first novel in the Rosales Saga, set during the Philippine Revolution against Spain.", year: 1984, pages: 272 },
  { id: 6, title: "Banaag at Sikat", author: "Lope K. Santos", genre: "Social Realism", available: true, coverColor: "from-indigo-400/80 to-violet-500/80", synopsis: "A landmark Filipino novel exploring the lives of workers and the struggle for social justice.", year: 1906, pages: 340 },
];

export default function MemberDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [view, setView] = useState<"list" | "detail">("list");

  const handleLogout = () => { logout(); navigate("/"); };
  const openBook = (book: Book) => { setSelectedBook(book); setView("detail"); };

  const filtered = BOOKS.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.genre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-screen overflow-hidden font-sans">

      {/* Blue background blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "#dbeafe" }}>
        <div className="absolute -top-32 left-1/2 h-[56rem] w-[56rem] -translate-x-1/2 rounded-full blur-3xl" style={{ background: "rgba(99,102,241,0.2)" }} />
        <div className="absolute -left-40 top-10 h-[48rem] w-[48rem] rounded-full blur-3xl" style={{ background: "rgba(59,130,246,0.2)" }} />
        <div className="absolute -right-40 top-32 h-[52rem] w-[52rem] rounded-full blur-3xl" style={{ background: "rgba(147,197,253,0.3)" }} />
        <div className="absolute bottom-0 right-0 h-[40rem] w-[40rem] rounded-full blur-3xl" style={{ background: "rgba(224,231,255,0.5)" }} />
      </div>

      <div className="relative flex min-h-screen flex-col px-4 pb-24 sm:px-6 lg:px-8">

        {/* Navbar */}
        <header className="flex justify-center pt-6 sm:pt-8">
          <nav className="inline-flex w-full max-w-7xl items-center justify-between rounded-full border border-white/70 bg-white/70 px-4 py-2 shadow-2xl shadow-blue-200/50 backdrop-blur-2xl sm:px-6 sm:py-2.5">
            {view === "detail" ? (
              <button onClick={() => setView("list")}
                className="flex items-center gap-2 text-sm font-semibold text-slate-800 transition hover:text-slate-600">
                <ArrowLeft className="h-4 w-4" />
                Back to Books
              </button>
            ) : (
              <button onClick={() => navigate("/")}
                className="flex items-center gap-2 text-sm font-semibold text-slate-800 transition hover:text-slate-600">
                <ArrowLeft className="h-4 w-4" />
                City Archive
              </button>
            )}

            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-xs text-slate-500">{user?.email}</span>
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-full border border-white/60 bg-white/60 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-white/80">
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          </nav>
        </header>

        {/* Book Detail View */}
        {view === "detail" && selectedBook && (
          <main className="mx-auto mt-8 flex w-full max-w-5xl flex-1 items-start justify-center sm:mt-10">
            <div className="w-full overflow-hidden rounded-3xl border border-white/60 bg-white/50 shadow-2xl shadow-blue-200/40 backdrop-blur-2xl">
              <div className="flex flex-col md:flex-row">
                {/* Cover */}
                <div className="flex flex-none flex-col items-center bg-white/20 p-6 md:w-72 md:p-8">
                  <div className={`flex w-full flex-col items-center justify-center rounded-2xl border border-white/40 bg-gradient-to-br ${selectedBook.coverColor} aspect-[2/3] shadow-inner`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-16 w-16 text-white/70">
                      <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM6 4h5v8l-2.5-1.5L6 12V4Z" fill="currentColor" />
                    </svg>
                    <span className="mt-3 text-xs font-medium uppercase tracking-widest text-white/60">Book Cover</span>
                  </div>
                  <div className="mt-5 w-full space-y-2 text-center">
                    <p className="text-xs text-slate-500"><span className="font-medium text-slate-700">Published</span> {selectedBook.year}</p>
                    <p className="text-xs text-slate-500"><span className="font-medium text-slate-700">Pages</span> {selectedBook.pages}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col gap-6 p-6 sm:p-8 md:p-10">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{selectedBook.title}</h1>
                    <p className="mt-1.5 text-lg text-slate-600">{selectedBook.author}</p>
                  </div>
                  <span className="w-fit rounded-full border border-white/60 bg-white/60 px-3 py-0.5 text-xs font-medium text-slate-700">
                    {selectedBook.genre}
                  </span>
                  <div>
                    <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">Synopsis</h2>
                    <p className="leading-relaxed text-slate-700">{selectedBook.synopsis}</p>
                  </div>
                  <div className="border-t border-white/40" />
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium ${selectedBook.available ? "border-blue-200 bg-blue-100/50 text-blue-800" : "border-slate-200 bg-slate-100/50 text-slate-500"}`}>
                      <span className={`h-2 w-2 rounded-full ${selectedBook.available ? "bg-blue-500" : "bg-slate-400"}`} />
                      {selectedBook.available ? "Available to Borrow" : "Currently Checked Out"}
                    </span>
                    <button
                      disabled={!selectedBook.available}
                      className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                      style={{ background: "hsl(220,85%,50%)" }}
                    >
                      {selectedBook.available ? "Reserve / Borrow" : "Join Waitlist"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* Book List View */}
        {view === "list" && (
          <main className="mx-auto mt-10 w-full max-w-7xl flex-1 sm:mt-12">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Browse Books</h2>
              <p className="mt-1 text-sm text-slate-500">Welcome, {user?.email}</p>
            </div>

            {/* Search */}
            <div className="mb-8 flex items-center gap-3 rounded-full border border-white/70 bg-white/60 px-4 py-2.5 shadow-xl shadow-blue-200/40 backdrop-blur-xl sm:px-5 sm:py-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-slate-400">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L19 20.5 20.5 19 15.5 14zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" fill="currentColor" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, author, or genre..."
                className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>

            {/* Book list */}
            <div className="flex flex-col gap-4">
              {filtered.length === 0 && (
                <div className="text-center py-16 text-slate-500">No books found.</div>
              )}
              {filtered.map((book) => (
                <button key={book.id} onClick={() => openBook(book)}
                  className="group flex w-full items-center gap-5 overflow-hidden rounded-2xl border border-white/60 bg-white/50 p-4 text-left shadow-xl shadow-blue-200/30 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl sm:gap-6 sm:p-5"
                >
                  <div className={`flex h-20 w-14 flex-none items-center justify-center rounded-xl bg-gradient-to-br ${book.coverColor} shadow-md sm:h-24 sm:w-16`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-7 w-7 text-white/80">
                      <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM6 4h5v8l-2.5-1.5L6 12V4Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <p className="truncate text-base font-bold text-slate-900 sm:text-lg">{book.title}</p>
                    <p className="text-sm text-slate-600">{book.author}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/60 bg-white/60 px-2.5 py-0.5 text-xs font-medium text-slate-700">{book.genre}</span>
                      <span className={`flex items-center gap-1.5 text-xs font-medium ${book.available ? "text-blue-700" : "text-slate-500"}`}>
                        <span className={`h-2 w-2 rounded-full ${book.available ? "bg-blue-500" : "bg-slate-400"}`} />
                        {book.available ? "Available" : "Checked Out"}
                      </span>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 flex-none text-slate-400 transition-transform group-hover:translate-x-0.5">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </button>
              ))}
            </div>
          </main>
        )}
      </div>

      {/* Footer */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 px-4 sm:px-6 lg:px-8">
        <footer className="pointer-events-auto mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs text-slate-500 shadow-2xl backdrop-blur-2xl sm:px-6">
          <span>JhunDB Database Solutions</span>
          <span className="text-slate-400">City Library Hub</span>
        </footer>
      </div>
    </div>
  );
}
