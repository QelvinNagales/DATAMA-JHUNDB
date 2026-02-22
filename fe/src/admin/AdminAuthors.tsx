import { useEffect, useState, type FormEvent } from "react";
import { apiFetch } from "@/api/client";
import { Search, Plus, Pencil, X, Pen } from "lucide-react";

interface Author {
  author_id: number;
  first_name: string;
  last_name: string;
  book_count: number;
}

export default function AdminAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editAuthor, setEditAuthor] = useState<Author | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [authorBooks, setAuthorBooks] = useState<{ book_id: number; title: string; isbn: string; status: string; category_name: string | null }[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);

  const fetchAuthors = (q = "") => {
    setLoading(true);
    const url = q ? `/api/authors?q=${encodeURIComponent(q)}` : "/api/authors";
    apiFetch(url)
      .then((data: Author[]) => setAuthors(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAuthors(); }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    fetchAuthors(searchInput.trim());
  };

  const openAdd = () => {
    setEditAuthor(null); setFirstName(""); setLastName("");
    setFormError(""); setFormSuccess("");
    setShowModal(true);
  };

  const openEdit = (a: Author) => {
    setEditAuthor(a); setFirstName(a.first_name); setLastName(a.last_name);
    setFormError(""); setFormSuccess("");
    setShowModal(true);
  };

  const toggleExpand = async (authorId: number) => {
    if (expandedId === authorId) { setExpandedId(null); return; }
    setExpandedId(authorId);
    setBooksLoading(true);
    try {
      const data = await apiFetch(`/api/authors/${authorId}`);
      setAuthorBooks(data.books || []);
    } catch { setAuthorBooks([]); }
    finally { setBooksLoading(false); }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(""); setFormSuccess(""); setFormLoading(true);
    try {
      if (editAuthor) {
        await apiFetch(`/api/authors/${editAuthor.author_id}`, {
          method: "PUT",
          body: JSON.stringify({ first_name: firstName, last_name: lastName }),
        });
        setFormSuccess("Author updated.");
      } else {
        await apiFetch("/api/authors", {
          method: "POST",
          body: JSON.stringify({ first_name: firstName, last_name: lastName }),
        });
        setFormSuccess("Author created.");
      }
      fetchAuthors();
      setTimeout(() => setShowModal(false), 1000);
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Request failed.";
      setFormError(msg);
    } finally { setFormLoading(false); }
  };

  return (
    <>
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-slate-400">Librarian Portal</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Authors</h1>
        <p className="mt-1 text-sm text-slate-500">Browse author profiles and their published works.</p>
      </header>

      {/* Search + Add */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex flex-1 items-center gap-3 rounded-full border border-white/60 bg-white/50 px-4 py-2.5 shadow-xl backdrop-blur-xl transition-all focus-within:ring-2 focus-within:ring-sky-300/80 sm:max-w-md">
          <Search className="h-4 w-4 flex-none text-slate-400" />
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search authors…" className="flex-1 border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none" />
          <button type="submit" className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white shadow-md hover:bg-slate-800">Search</button>
        </form>
        <button type="button" onClick={openAdd} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-slate-800 hover:shadow-lg active:scale-[0.98]">
          <Plus className="h-4 w-4" /> Add Author
        </button>
      </div>

      {/* Authors Cards */}
      {loading ? (
        <div className="py-16 text-center text-slate-500">Loading authors…</div>
      ) : authors.length === 0 ? (
        <div className="py-16 text-center text-slate-400">No authors found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {authors.map((a) => (
            <div key={a.author_id} className="rounded-2xl border border-white/60 bg-white/40 p-5 shadow-lg backdrop-blur-xl transition hover:shadow-xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300/80 to-orange-400/80 text-white shadow-md">
                    <Pen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900">{a.first_name} {a.last_name}</p>
                    <p className="text-xs text-slate-500">{a.book_count} book{a.book_count !== 1 ? "s" : ""} in catalog</p>
                  </div>
                </div>
                <button type="button" onClick={() => openEdit(a)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60 shadow-sm hover:bg-white/80">
                  <Pencil className="h-3.5 w-3.5 text-slate-500" />
                </button>
              </div>

              {/* Expand to show books */}
              <button type="button" onClick={() => toggleExpand(a.author_id)} className="mt-3 w-full text-left text-xs font-medium text-sky-600 hover:text-sky-800">
                {expandedId === a.author_id ? "Hide books ▲" : "View books ▼"}
              </button>
              {expandedId === a.author_id && (
                <div className="mt-2 rounded-xl border border-white/40 bg-white/30 p-3">
                  {booksLoading ? <p className="text-xs text-slate-400">Loading…</p> : authorBooks.length === 0 ? <p className="text-xs text-slate-400">No books found.</p> : (
                    <ul className="space-y-1.5">
                      {authorBooks.map(b => (
                        <li key={b.book_id} className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-700">{b.title}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${b.status === "Available" ? "bg-emerald-100/60 text-emerald-700" : "bg-amber-100/60 text-amber-700"}`}>{b.status}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/80 p-8 shadow-2xl backdrop-blur-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">{editAuthor ? "Edit Author" : "Add New Author"}</h2>
              <button type="button" onClick={() => setShowModal(false)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            {formError && <div className="mb-4 rounded-2xl border border-rose-200/80 bg-rose-50/90 px-4 py-3 text-sm text-rose-800">{formError}</div>}
            {formSuccess && <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-800">{formSuccess}</div>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-slate-500">First Name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-300/80" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-slate-500">Last Name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-300/80" />
              </div>
              <div className="mt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-full border border-slate-200/60 bg-white/60 px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-white/80">Cancel</button>
                <button type="submit" disabled={formLoading} className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white shadow-md hover:bg-slate-800 disabled:opacity-70">
                  {formLoading ? "Saving…" : editAuthor ? "Update Author" : "Add Author"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
