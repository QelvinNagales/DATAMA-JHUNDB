import { useState } from "react";
import { BookOpen } from "lucide-react";

const mockBooks = [
  { id: "B001", title: "To Kill a Mockingbird", isbn: "978-0-06-112008-4", author: "Harper Lee", category: "Fiction" },
  { id: "B002", title: "1984", isbn: "978-0-45-152493-5", author: "George Orwell", category: "Science Fiction" },
  { id: "B003", title: "Pride and Prejudice", isbn: "978-0-14-143951-8", author: "Jane Austen", category: "Romance" },
  { id: "B004", title: "Adventures of Huckleberry Finn", isbn: "978-0-14-243717-8", author: "Mark Twain", category: "Adventure" },
  { id: "B005", title: "The Great Gatsby", isbn: "978-0-74-327356-5", author: "F. Scott Fitzgerald", category: "Fiction" },
  { id: "B006", title: "The Old Man and the Sea", isbn: "978-0-68-480122-3", author: "Ernest Hemingway", category: "Fiction" },
];

const TH: React.CSSProperties = { color: "#9c4a70", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "12px 20px", textAlign: "left" };
const TD: React.CSSProperties = { padding: "13px 20px" };

const catColor: Record<string, { color: string; bg: string }> = {
  Fiction:         { color: "#c2185b", bg: "#fce4ec" },
  "Science Fiction":{ color: "#7b1fa2", bg: "#f3e5f5" },
  Romance:         { color: "#e91e8c", bg: "#fce4f0" },
  Adventure:       { color: "#e65100", bg: "#fff3e0" },
};

export default function AdminBooks() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const cats = ["All", ...Array.from(new Set(mockBooks.map((b) => b.category)))];
  const filtered = mockBooks.filter((b) => {
    const q = search.toLowerCase();
    return (b.title.toLowerCase().includes(q) || b.isbn.includes(q)) &&
      (catFilter === "All" || b.category === catFilter);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#5d2f3a", margin: 0 }}>Books</h1>
          <p style={{ fontSize: 13, color: "#9e7a7a", marginTop: 4 }}>Manage the book catalog</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,#f48fb1,#ffd54f)", color: "white", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <BookOpen size={14} /> + Add Book
        </button>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ position: "relative", maxWidth: 320, flex: 1 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "#c8a0a0" }}>
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L19 20.5 20.5 19 15.5 14zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" fill="currentColor" />
          </svg>
          <input type="text" placeholder="Search by title or ISBN..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", boxSizing: "border-box", paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, border: "1.5px solid #ffd6e0", borderRadius: 8, fontSize: 13, color: "#5d2f3a", background: "white", outline: "none" }}
            onFocus={(e) => e.target.style.borderColor = "#f48fb1"} onBlur={(e) => e.target.style.borderColor = "#ffd6e0"} />
        </div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
          style={{ border: "1.5px solid #ffd6e0", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#5d2f3a", background: "white", outline: "none" }}>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div style={{ background: "white", borderRadius: 16, overflow: "hidden", border: "1px solid #ffd6e0", boxShadow: "0 2px 16px rgba(244,143,177,0.1)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "linear-gradient(135deg, #fce4ec, #fff9c4)" }}>
                {["Title", "ISBN", "Author", "Category", "Actions"].map((h) => <th key={h} style={TH}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b.id} style={{ borderTop: i === 0 ? "none" : "1px solid #ffe0e8", transition: "background 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fff8f8")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ ...TD, fontWeight: 600, fontSize: 14, color: "#5d2f3a" }}>{b.title}</td>
                  <td style={{ ...TD, fontFamily: "monospace", fontSize: 12, color: "#9e7a7a" }}>{b.isbn}</td>
                  <td style={{ ...TD, fontSize: 13, color: "#9e7a7a" }}>{b.author}</td>
                  <td style={TD}>
                    <span style={{ display: "inline-block", borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600, color: catColor[b.category]?.color ?? "#c2185b", background: catColor[b.category]?.bg ?? "#fce4ec" }}>{b.category}</span>
                  </td>
                  <td style={TD}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button style={{ background: "#fff0f5", border: "none", borderRadius: 6, padding: "6px 8px", cursor: "pointer" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: 14, height: 14, color: "#f48fb1" }}><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" /></svg>
                      </button>
                      <button style={{ background: "#fff0f0", border: "none", borderRadius: 6, padding: "6px 8px", cursor: "pointer" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: 14, height: 14, color: "#e57373" }}><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "10px 20px", borderTop: "1px solid #ffe0e8", background: "#fff8f8", fontSize: 12, color: "#b89090" }}>Showing {filtered.length} of {mockBooks.length} books</div>
      </div>
    </div>
  );
}
