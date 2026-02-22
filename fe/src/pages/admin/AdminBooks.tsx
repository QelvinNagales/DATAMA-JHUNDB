import { useState } from "react";
import { BookOpen } from "lucide-react";

const mockBooks = [
  { id: "B001", title: "To Kill a Mockingbird", isbn: "978-0-06-112008-4", author: "Harper Lee", category: "Fiction" },
  { id: "B002", title: "1984", isbn: "978-0-45-152493-5", author: "George Orwell", category: "Science Fiction" },
  { id: "B003", title: "Pride and Prejudice", isbn: "978-0-14-143951-8", author: "Jane Austen", category: "Romance" },
  { id: "B004", title: "Adventures of Huckleberry Finn", isbn: "978-0-14-243717-8", author: "Mark Twain", category: "Adventure" },
  { id: "B005", title: "The Great Gatsby", isbn: "978-0-74-327356-5", author: "F. Scott Fitzgerald", category: "Fiction" },
  { id: "B006", title: "The Old Man and the Sea", isbn: "978-0-68-480122-3", author: "Ernest Hemingway", category: "Fiction" },
  { id: "B007", title: "Animal Farm", isbn: "978-0-45-152036-2", author: "George Orwell", category: "Science Fiction" },
  { id: "B008", title: "Sense and Sensibility", isbn: "978-0-14-143966-2", author: "Jane Austen", category: "Romance" },
  { id: "B009", title: "A Farewell to Arms", isbn: "978-0-68-480071-1", author: "Ernest Hemingway", category: "Fiction" },
  { id: "B010", title: "The Sun Also Rises", isbn: "978-0-74-334780-2", author: "Ernest Hemingway", category: "Fiction" },
];

const categoryColors: Record<string, { color: string; bg: string }> = {
  Fiction: { color: "hsl(220,85%,50%)", bg: "hsl(220,85%,50%,0.1)" },
  "Science Fiction": { color: "hsl(255,70%,60%)", bg: "hsl(255,70%,60%,0.1)" },
  Romance: { color: "hsl(340,75%,55%)", bg: "hsl(340,75%,55%,0.1)" },
  Adventure: { color: "linear-gradient(135deg,#f48fb1,#ffd54f)", bg: "hsl(30,95%,50%,0.1)" },
  History: { color: "hsl(152,60%,40%)", bg: "hsl(152,60%,40%,0.1)" },
};

export default function AdminBooks() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const categories = ["All Categories", ...Array.from(new Set(mockBooks.map((b) => b.category)))];

  const filtered = mockBooks.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All Categories" || b.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "hsl(220,60%,15%)" }}>Books</h1>
          <p className="mt-1 text-sm" style={{ color: "hsl(220,15%,46%)" }}>Manage the book catalog</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ background: "hsl(220,85%,50%)" }}>
          <BookOpen className="h-4 w-4" /> + Add Book
        </button>
      </div>

      {/* Search and filter */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "hsl(220,15%,65%)" }}>
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L19 20.5 20.5 19 15.5 14zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" fill="currentColor" />
          </svg>
          <input
            type="text"
            placeholder="Search by title or ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border pl-9 pr-4 py-2 text-sm outline-none transition"
            style={{ borderColor: "hsl(220,20%,88%)", background: "white", color: "hsl(220,60%,15%)" }}
            onFocus={(e) => e.target.style.borderColor = "hsl(220,85%,50%)"}
            onBlur={(e) => e.target.style.borderColor = "hsl(220,20%,88%)"}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "hsl(220,20%,88%)", background: "white", color: "hsl(220,60%,15%)" }}
        >
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden"
        style={{ background: "white", borderColor: "hsl(220,20%,88%)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "hsl(220,20%,97%)" }}>
                {["Title", "ISBN", "Author", "Category", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "hsl(220,15%,46%)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((book) => (
                <tr key={book.id} style={{ borderTop: "1px solid hsl(220,20%,94%)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(220,20%,98%)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td className="px-6 py-4 font-medium" style={{ color: "hsl(220,60%,15%)" }}>{book.title}</td>
                  <td className="px-6 py-4 font-mono text-xs" style={{ color: "hsl(220,15%,46%)" }}>{book.isbn}</td>
                  <td className="px-6 py-4" style={{ color: "hsl(220,15%,46%)" }}>{book.author}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={{
                        color: categoryColors[book.category]?.color ?? "hsl(220,85%,50%)",
                        background: categoryColors[book.category]?.bg ?? "hsl(220,85%,50%,0.1)",
                      }}>
                      {book.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="rounded p-1.5 transition hover:bg-slate-100" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" style={{ color: "hsl(220,15%,55%)" }}>
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
                        </svg>
                      </button>
                      <button className="rounded p-1.5 transition hover:bg-red-50" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" style={{ color: "hsl(0,72%,51%)" }}>
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
