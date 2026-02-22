import { useEffect, useState, useRef, type FormEvent } from "react";
import { apiFetch } from "@/api/client";
import { Search, Plus, Upload, X, BookOpen } from "lucide-react";

interface Book {
  book_id: number;
  title: string;
  isbn: string;
  status: string;
  author_name: string | null;
  category_name: string | null;
  available: boolean;
}

export default function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Manual add form
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [authorFirst, setAuthorFirst] = useState("");
  const [authorLast, setAuthorLast] = useState("");
  const [category, setCategory] = useState("");
  const [synopsis, setSynopsis] = useState("");

  // Bulk upload
  const [bulkResults, setBulkResults] = useState<{ success: number; failed: number; errors: string[] }>({ success: 0, failed: 0, errors: [] });
  const [bulkLoading, setBulkLoading] = useState(false);

  const fetchBooks = (q = "") => {
    setLoading(true);
    const url = q ? `/api/catalog?q=${encodeURIComponent(q)}` : "/api/catalog";
    apiFetch(url)
      .then((data: Book[]) => setBooks(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setSearchQ(searchInput.trim());
    fetchBooks(searchInput.trim());
  };

  const filtered = searchQ
    ? books.filter(b =>
        b.title.toLowerCase().includes(searchQ.toLowerCase()) ||
        (b.author_name || "").toLowerCase().includes(searchQ.toLowerCase()) ||
        (b.category_name || "").toLowerCase().includes(searchQ.toLowerCase()) ||
        b.isbn.toLowerCase().includes(searchQ.toLowerCase())
      )
    : books;

  const openAdd = () => {
    setIsbn(""); setTitle(""); setAuthorFirst(""); setAuthorLast(""); setCategory(""); setSynopsis("");
    setFormError(""); setFormSuccess("");
    setShowAddModal(true);
  };

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(""); setFormSuccess(""); setFormLoading(true);
    try {
      await apiFetch("/api/books/ingest", {
        method: "POST",
        body: JSON.stringify({
          isbn, title,
          author_first_name: authorFirst,
          author_last_name: authorLast,
          category: category || null,
          synopsis: synopsis || null,
        }),
      });
      setFormSuccess("Book added successfully.");
      fetchBooks(searchQ);
      setTimeout(() => setShowAddModal(false), 1200);
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Failed to add book.";
      setFormError(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const openBulk = () => {
    setBulkResults({ success: 0, failed: 0, errors: [] });
    setShowBulkModal(true);
  };

  const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/\s+/g, "_"));
    return lines.slice(1).map(line => {
      const values = line.split(",").map(v => v.trim());
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h] = values[i] || ""; });
      return obj;
    });
  };

  const handleBulkUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setBulkLoading(true);
    setBulkResults({ success: 0, failed: 0, errors: [] });

    const text = await file.text();
    const rows = parseCSV(text);
    if (rows.length === 0) {
      setBulkResults({ success: 0, failed: 0, errors: ["No data rows found in CSV."] });
      setBulkLoading(false);
      return;
    }

    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        await apiFetch("/api/books/ingest", {
          method: "POST",
          body: JSON.stringify({
            isbn: row.isbn || row.isbn_number || "",
            title: row.title || row.book_title || "",
            author_first_name: row.author_first_name || row.author_first || row.first_name || "",
            author_last_name: row.author_last_name || row.author_last || row.last_name || "",
            category: row.category || row.genre || null,
            synopsis: row.synopsis || row.description || null,
          }),
        });
        success++;
      } catch (err: unknown) {
        failed++;
        const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Unknown error";
        errors.push(`Row ${i + 2}: ${msg}`);
      }
    }

    setBulkResults({ success, failed, errors });
    setBulkLoading(false);
    fetchBooks(searchQ);
  };

  const getStatusBadge = (status: string) => {
    if (status === "Available") return "bg-emerald-100/60 text-emerald-700";
    if (status === "Borrowed" || status === "Checked Out") return "bg-amber-100/60 text-amber-700";
    return "bg-slate-100/60 text-slate-500";
  };

  return (
    <>
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-slate-400">Librarian Portal</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Books</h1>
        <p className="mt-1 text-sm text-slate-500">Manage catalog, add books manually or via CSV upload.</p>
      </header>

      {/* Search + Actions */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex flex-1 items-center gap-3 rounded-full border border-white/60 bg-white/50 px-4 py-2.5 shadow-xl backdrop-blur-xl transition-all focus-within:ring-2 focus-within:ring-sky-300/80 sm:max-w-md">
          <Search className="h-4 w-4 flex-none text-slate-400" />
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search books by title, author, ISBN…" className="flex-1 border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none" />
          <button type="submit" className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white shadow-md hover:bg-slate-800">Search</button>
        </form>
        <div className="flex gap-2">
          <button type="button" onClick={openBulk} className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-white/80 hover:shadow-md">
            <Upload className="h-4 w-4" /> CSV Upload
          </button>
          <button type="button" onClick={openAdd} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-slate-800 hover:shadow-lg active:scale-[0.98]">
            <Plus className="h-4 w-4" /> Add Book
          </button>
        </div>
      </div>

      {/* Books Table */}
      <div className="overflow-x-auto rounded-3xl border border-white/60 bg-white/50 shadow-2xl backdrop-blur-2xl">
        {loading ? (
          <div className="px-6 py-16 text-center text-slate-500">Loading catalog…</div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-slate-400">No books found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/40 text-xs font-medium uppercase tracking-widest text-slate-400">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">ISBN</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.book_id} className="border-b border-white/30 transition hover:bg-white/20">
                  <td className="whitespace-nowrap px-6 py-3.5 font-mono text-xs text-slate-500">{b.book_id}</td>
                  <td className="whitespace-nowrap px-6 py-3.5 font-medium text-slate-900">{b.title}</td>
                  <td className="whitespace-nowrap px-6 py-3.5 text-slate-600">{b.author_name || "—"}</td>
                  <td className="whitespace-nowrap px-6 py-3.5 font-mono text-xs text-slate-500">{b.isbn}</td>
                  <td className="whitespace-nowrap px-6 py-3.5">
                    <span className="rounded-full border border-white/60 bg-white/60 px-2.5 py-0.5 text-xs font-medium text-slate-700">{b.category_name || "—"}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(b.status)}`}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="w-full max-w-lg rounded-3xl border border-white/60 bg-white/80 p-8 shadow-2xl backdrop-blur-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100/60"><BookOpen className="h-5 w-5 text-amber-600" /></div>
                <h2 className="text-xl font-semibold text-slate-900">Add New Book</h2>
              </div>
              <button type="button" onClick={() => setShowAddModal(false)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>

            {formError && <div className="mb-4 rounded-2xl border border-rose-200/80 bg-rose-50/90 px-4 py-3 text-sm text-rose-800">{formError}</div>}
            {formSuccess && <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-800">{formSuccess}</div>}

            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-slate-500">Title *</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-300/80" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-slate-500">ISBN *</label>
                  <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} required className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-300/80" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-slate-500">Author First Name</label>
                  <input type="text" value={authorFirst} onChange={(e) => setAuthorFirst(e.target.value)} className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-300/80" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-slate-500">Author Last Name</label>
                  <input type="text" value={authorLast} onChange={(e) => setAuthorLast(e.target.value)} className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-300/80" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-slate-500">Category</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Fiction, Science, History" className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-300/80" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-slate-500">Synopsis</label>
                <textarea value={synopsis} onChange={(e) => setSynopsis(e.target.value)} rows={3} className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-300/80 resize-none" />
              </div>
              <div className="mt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="rounded-full border border-slate-200/60 bg-white/60 px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-white/80">Cancel</button>
                <button type="submit" disabled={formLoading} className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white shadow-md hover:bg-slate-800 disabled:opacity-70">
                  {formLoading ? "Adding…" : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => setShowBulkModal(false)}>
          <div className="w-full max-w-lg rounded-3xl border border-white/60 bg-white/80 p-8 shadow-2xl backdrop-blur-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100/60"><Upload className="h-5 w-5 text-sky-600" /></div>
                <h2 className="text-xl font-semibold text-slate-900">Bulk CSV Upload</h2>
              </div>
              <button type="button" onClick={() => setShowBulkModal(false)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>

            <div className="mb-4 rounded-2xl border border-sky-200/80 bg-sky-50/90 px-4 py-3 text-xs text-sky-800">
              <p className="font-semibold mb-1">CSV Format (columns):</p>
              <code className="text-xs">isbn, title, author_first_name, author_last_name, category, synopsis</code>
              <p className="mt-1">First row must be headers. One book per row.</p>
            </div>

            <input ref={fileRef} type="file" accept=".csv,.txt" className="mb-4 w-full rounded-xl border border-slate-200/60 bg-white/50 px-4 py-2.5 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-1.5 file:text-xs file:font-medium file:text-white" />

            {bulkResults.success > 0 || bulkResults.failed > 0 ? (
              <div className="mb-4 rounded-2xl border border-white/60 bg-white/40 px-4 py-3 text-sm">
                <p className="text-emerald-700">✓ {bulkResults.success} books imported successfully</p>
                {bulkResults.failed > 0 && <p className="text-rose-700">✗ {bulkResults.failed} failed</p>}
                {bulkResults.errors.length > 0 && (
                  <div className="mt-2 max-h-32 overflow-y-auto text-xs text-rose-600">
                    {bulkResults.errors.map((e, i) => <p key={i}>{e}</p>)}
                  </div>
                )}
              </div>
            ) : null}

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowBulkModal(false)} className="rounded-full border border-slate-200/60 bg-white/60 px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-white/80">Cancel</button>
              <button type="button" onClick={handleBulkUpload} disabled={bulkLoading} className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white shadow-md hover:bg-slate-800 disabled:opacity-70">
                {bulkLoading ? "Uploading…" : "Upload & Import"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
