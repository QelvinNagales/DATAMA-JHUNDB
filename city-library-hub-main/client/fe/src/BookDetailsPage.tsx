import { useEffect } from "react";

// Merged MongoDB (content/metadata) + MySQL (transactional) mock record
const MOCK_BOOK_DETAIL = {
  // --- MySQL fields ---
  id: 1,
  isbn: "978-971-8958-90-1",
  available: true,
  // --- MongoDB fields ---
  title: "Noli Me Tangere",
  author: "José Rizal",
  categories: ["Historical Fiction", "Philippine Literature", "Classic"],
  synopsis:
    "Set in the Philippines during Spanish colonial rule, Noli Me Tangere follows Crisostomo Ibarra, a young Filipino who returns home after years of study in Europe. He is eager to fulfill his father's dream of building a school, but finds himself entangled in the corrupt grip of the Spanish friars and the colonial government. A sweeping indictment of abuse and injustice, the novel illuminates the suffering of the Filipino people and laid the intellectual groundwork for the Philippine Revolution. Rizal's masterpiece remains the most celebrated literary work in Philippine history.",
  coverColor: "from-amber-300/80 to-orange-400/80",
  publishedYear: 1887,
  pages: 468,
};

interface BookDetailsPageProps {
  bookId: number;
  onBack: () => void;
}

export default function BookDetailsPage({ bookId, onBack }: BookDetailsPageProps) {
  const book = MOCK_BOOK_DETAIL;

  useEffect(() => {
    console.log(
      `[Telemetry] VIEW_DETAILS logged to MongoDB for Book ID: ${bookId}`
    );
  }, [bookId]);

  const handleActionClick = () => {
    console.log("[Transaction] Initiating MySQL CALL borrow() process...");
  };

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

      <div className="relative flex min-h-screen flex-col px-4 pb-28 sm:px-6 lg:px-8">
        {/* Navbar */}
        <header className="flex justify-center pt-6 sm:pt-8">
          <nav className="inline-flex w-full max-w-7xl items-center justify-between rounded-full border border-white/60 bg-white/70 px-4 py-2 shadow-2xl shadow-orange-200/60 ring-1 ring-white/50 backdrop-blur-2xl sm:px-6 sm:py-2.5">
            <button
              type="button"
              onClick={onBack}
              className="text-sm font-semibold tracking-tight text-slate-800 transition duration-150 hover:text-slate-600 sm:text-base"
            >
              City Archive
            </button>

            <button
              type="button"
              className="inline-flex transform items-center rounded-full border border-white/60 bg-white/60 px-4 py-1.5 text-sm font-medium text-slate-800 shadow-sm transition duration-200 ease-out hover:-translate-y-px hover:bg-white/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/80"
            >
              Login
            </button>
          </nav>
        </header>

        {/* Main content */}
        <main className="mx-auto mt-8 flex w-full max-w-5xl flex-1 items-start justify-center sm:mt-10 sm:items-center">
          {/* Glass card */}
          <div className="w-full overflow-hidden rounded-3xl border border-white/60 bg-white/40 shadow-2xl backdrop-blur-2xl">
            <div className="flex flex-col md:flex-row">

              {/* Left column — Cover visual */}
              <div className="flex flex-none flex-col items-center justify-start bg-white/20 p-6 md:w-72 md:p-8">
                <div
                  className={`flex w-full flex-col items-center justify-center rounded-2xl border border-white/40 bg-gradient-to-br ${book.coverColor} aspect-[2/3] shadow-inner`}
                >
                  {/* Book icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-16 w-16 text-white/70"
                  >
                    <path
                      d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM6 4h5v8l-2.5-1.5L6 12V4Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="mt-3 text-xs font-medium tracking-widest text-white/60 uppercase">
                    Book Cover
                  </span>
                </div>

                {/* Extra metadata below cover */}
                <div className="mt-5 w-full space-y-2 text-center">
                  <p className="text-xs text-slate-500">
                    <span className="font-medium text-slate-700">Published</span>{" "}
                    {book.publishedYear}
                  </p>
                  <p className="text-xs text-slate-500">
                    <span className="font-medium text-slate-700">Pages</span>{" "}
                    {book.pages}
                  </p>
                </div>
              </div>

              {/* Right column — Information & action */}
              <div className="flex flex-1 flex-col gap-6 p-6 sm:p-8 md:p-10">

                {/* Header */}
                <div>
                  <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                    {book.title}
                  </h1>
                  <p className="mt-1.5 text-lg text-slate-600">{book.author}</p>
                </div>

                {/* Category pills */}
                <div className="flex flex-wrap gap-2">
                  {book.categories.map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full border border-white/60 bg-white/60 px-3 py-0.5 text-xs font-medium text-slate-700 backdrop-blur-sm"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Synopsis */}
                <div>
                  <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Synopsis
                  </h2>
                  <p className="leading-relaxed text-slate-700">{book.synopsis}</p>
                </div>

                {/* ISBN */}
                <div>
                  <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    ISBN
                  </h2>
                  <p className="font-mono text-sm text-slate-500">{book.isbn}</p>
                </div>

                {/* Divider */}
                <div className="border-t border-white/40" />

                {/* Transaction zone */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Availability badge */}
                  <span
                    className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium backdrop-blur-sm ${
                      book.available
                        ? "border-emerald-200 bg-emerald-100/50 text-emerald-800"
                        : "border-slate-200 bg-slate-100/50 text-slate-500"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        book.available
                          ? "bg-emerald-400 shadow-[0_0_6px_1px_rgba(52,211,153,0.6)]"
                          : "bg-slate-400"
                      }`}
                    />
                    {book.available ? "Available to Borrow" : "Currently Checked Out"}
                  </span>

                  {/* Action button */}
                  <button
                    type="button"
                    onClick={handleActionClick}
                    disabled={!book.available}
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-md transition duration-200 ease-out hover:scale-[1.03] hover:bg-slate-800 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/80"
                  >
                    {book.available ? "Reserve / Borrow" : "Join Waitlist"}
                  </button>
                </div>

              </div>
            </div>
          </div>
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
