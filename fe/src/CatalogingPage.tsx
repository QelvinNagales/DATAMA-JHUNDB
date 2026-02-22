import { useState, type FormEvent } from "react";
import { apiFetch } from "@/api/client";

type AdminPage = "cto" | "circulation" | "cataloging" | "member-registration" | "financial-settlement";

interface CatalogingPageProps {
  onLogout: () => void;
  onNavigate: (page: AdminPage) => void;
}

export default function CatalogingPage({ onLogout, onNavigate }: CatalogingPageProps) {
  // MySQL fields
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [authorFirst, setAuthorFirst] = useState("");
  const [authorLast, setAuthorLast] = useState("");
  const [category, setCategory] = useState("");

  // MongoDB fields
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [genreTags, setGenreTags] = useState("");
  const [synopsis, setSynopsis] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleIngest = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      await apiFetch("/api/books/ingest", {
        method: "POST",
        body: JSON.stringify({
          isbn,
          title,
          author_first_name: authorFirst,
          author_last_name: authorLast,
          category: category || undefined,
          cover_image_url: coverImageUrl || undefined,
          genre_tags: genreTags || undefined,
          synopsis: synopsis || undefined,
        }),
      });
      setSuccess(true);
      setIsbn("");
      setTitle("");
      setAuthorFirst("");
      setAuthorLast("");
      setCategory("");
      setCoverImageUrl("");
      setGenreTags("");
      setSynopsis("");
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Ingest failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-full border border-white/60 bg-white/50 px-5 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm backdrop-blur-xl outline-none transition-all duration-200 focus:border-white/70 focus:ring-2 focus:ring-sky-300/80";

  const labelBase =
    "pl-1 text-xs font-medium uppercase tracking-widest text-slate-500";

  const categories = [
    "Fiction",
    "Non-Fiction",
    "Fantasy",
    "Science Fiction",
    "Biography",
    "History",
    "Mystery",
    "Romance",
    "Self-Help",
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-amber-100 font-sans text-slate-900">
      {/* Warm matte acrylic mesh background — identical to all other pages */}
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

          {/* Cataloging — active */}
          <button
            type="button"
            onClick={() => onNavigate("cataloging")}
            className="flex w-full items-center gap-3 rounded-2xl bg-white/70 px-3 py-2.5 text-left text-sm font-semibold text-slate-900 shadow-sm transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 flex-none text-slate-700" aria-hidden="true">
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
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Inventory Ingestion</h1>
          <p className="mt-1 text-sm text-slate-500">Hybrid Polyglot Routing</p>
        </header>

        <main className="flex flex-col items-start">

          {/* Outer glassmorphism container */}
          <form
            onSubmit={handleIngest}
            className="w-full max-w-6xl rounded-3xl border border-white/60 bg-white/50 p-6 shadow-2xl backdrop-blur-2xl sm:p-8"
          >
            {error && (
              <div className="mb-6 rounded-2xl border border-rose-200/80 bg-rose-50/90 px-4 py-3 text-sm text-rose-800">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-100/50 px-4 py-3 text-sm text-emerald-800">
                Book ingested successfully.
              </div>
            )}
            {/* Two-column grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

              {/* ── Column 1: Core Inventory (MySQL) ── */}
              <div className="rounded-2xl border border-blue-300/50 bg-blue-50/10 p-6 ring-1 ring-blue-200/30 backdrop-blur-sm">
                {/* Column header */}
                <div className="mb-6 flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full border border-sky-200/60 bg-sky-100/50 px-3 py-1 text-xs font-semibold text-sky-700 backdrop-blur-sm">
                    MySQL
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Core Inventory
                    </h2>
                    <p className="text-xs text-slate-500">
                      Transactional skeleton data
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {/* ISBN */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="isbn" className={labelBase}>
                      ISBN{" "}
                      <span className="text-red-400 normal-case font-normal tracking-normal">
                        *
                      </span>
                    </label>
                    <input
                      id="isbn"
                      type="text"
                      value={isbn}
                      onChange={(e) => setIsbn(e.target.value)}
                      placeholder="e.g. 978-3-16-148410-0"
                      required
                      className={inputBase}
                    />
                  </div>

                  {/* Title */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="title" className={labelBase}>
                      Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. The Great Gatsby"
                      className={inputBase}
                    />
                  </div>

                  {/* Author First Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="author-first" className={labelBase}>
                      Author First Name
                    </label>
                    <input
                      id="author-first"
                      type="text"
                      value={authorFirst}
                      onChange={(e) => setAuthorFirst(e.target.value)}
                      placeholder="e.g. F. Scott"
                      className={inputBase}
                    />
                  </div>

                  {/* Author Last Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="author-last" className={labelBase}>
                      Author Last Name
                    </label>
                    <input
                      id="author-last"
                      type="text"
                      value={authorLast}
                      onChange={(e) => setAuthorLast(e.target.value)}
                      placeholder="e.g. Fitzgerald"
                      className={inputBase}
                    />
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="category" className={labelBase}>
                      Category
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full appearance-none rounded-full border border-white/60 bg-white/50 px-5 py-3 pr-10 text-sm text-slate-900 shadow-sm backdrop-blur-xl outline-none transition-all duration-200 focus:border-white/70 focus:ring-2 focus:ring-sky-300/80"
                      >
                        <option value="" disabled className="text-slate-400">
                          Select a category…
                        </option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      {/* Custom chevron */}
                      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="h-4 w-4 text-slate-400"
                          fill="currentColor"
                        >
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Column 2: Digital Catalog (MongoDB) ── */}
              <div className="rounded-2xl border border-amber-300/50 bg-amber-50/10 p-6 ring-1 ring-amber-200/30 backdrop-blur-sm">
                {/* Column header */}
                <div className="mb-6 flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full border border-amber-200/60 bg-amber-100/50 px-3 py-1 text-xs font-semibold text-amber-700 backdrop-blur-sm">
                    MongoDB
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Digital Catalog
                    </h2>
                    <p className="text-xs text-slate-500">
                      Rich metadata document
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Cover Image URL */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cover-image-url" className={labelBase}>
                      Cover Image URL
                    </label>
                    <input
                      id="cover-image-url"
                      type="url"
                      value={coverImageUrl}
                      onChange={(e) => setCoverImageUrl(e.target.value)}
                      placeholder="https://example.com/cover.jpg"
                      className={inputBase}
                    />
                  </div>

                  {/* Genre Tags */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="genre-tags" className={labelBase}>
                      Genre Tags
                    </label>
                    <input
                      id="genre-tags"
                      type="text"
                      value={genreTags}
                      onChange={(e) => setGenreTags(e.target.value)}
                      placeholder="e.g. classic, jazz-age, tragedy"
                      className={inputBase}
                    />
                    <p className="pl-1 text-[11px] text-slate-400">
                      Comma-separated values
                    </p>
                  </div>

                  {/* Synopsis */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="synopsis" className={labelBase}>
                      Synopsis
                    </label>
                    <textarea
                      id="synopsis"
                      value={synopsis}
                      onChange={(e) => setSynopsis(e.target.value)}
                      placeholder="Enter a detailed synopsis of the book…"
                      rows={7}
                      className="w-full rounded-2xl border border-white/60 bg-white/50 px-5 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm backdrop-blur-xl outline-none transition-all duration-200 focus:border-white/70 focus:ring-2 focus:ring-sky-300/80 resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Action Area ── */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <button
                type="submit"
                className="inline-flex w-full max-w-md transform items-center justify-center rounded-full bg-slate-900 px-10 py-4 text-base font-semibold text-white shadow-lg transition duration-150 ease-out hover:bg-slate-800 hover:shadow-xl active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/80 focus-visible:ring-offset-0 sm:w-auto disabled:opacity-70"
                disabled={loading}
              >
                {loading ? "Ingesting…" : "Ingest to Hybrid Database"}
              </button>
              <p className="text-xs text-slate-400">
                Routes transactional data to MySQL and rich metadata to MongoDB
              </p>
            </div>
          </form>
        </main>
      </div>

      {/* Floating glassmorphism footer — identical to all other pages */}
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
