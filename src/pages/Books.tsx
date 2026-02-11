import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { books as initialBooks, authors, categories } from "@/data/mock-data";
import type { Book } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const emptyBook: Omit<Book, "book_id"> = { title: "", isbn: "", author_id: "", category_id: "" };

const Books = () => {
  const [data, setData] = useState<Book[]>(initialBooks);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyBook);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = data.filter((b) => {
    const matchesSearch = `${b.title} ${b.isbn}`.toLowerCase().includes(search.toLowerCase());
    const matchesCat = catFilter === "all" || b.category_id === catFilter;
    return matchesSearch && matchesCat;
  });

  const openAdd = () => { setForm(emptyBook); setEditId(null); setModalOpen(true); };
  const openEdit = (b: Book) => { setForm({ title: b.title, isbn: b.isbn, author_id: b.author_id, category_id: b.category_id }); setEditId(b.book_id); setModalOpen(true); };

  const handleSave = () => {
    if (!form.title.trim() || !form.isbn.trim() || !form.author_id || !form.category_id) { toast.error("All fields are required"); return; }
    if (editId) {
      setData((d) => d.map((b) => (b.book_id === editId ? { ...b, ...form } : b)));
      toast.success("Book updated");
    } else {
      setData((d) => [...d, { book_id: `B${String(d.length + 1).padStart(3, "0")}`, ...form }]);
      toast.success("Book added");
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) { setData((d) => d.filter((b) => b.book_id !== deleteId)); toast.success("Book deleted"); }
    setDeleteId(null);
  };

  const getAuthorName = (id: string) => { const a = authors.find((a) => a.author_id === id); return a ? `${a.first_name} ${a.last_name}` : id; };
  const getCategoryName = (id: string) => categories.find((c) => c.category_id === id)?.category ?? id;

  return (
    <div>
      <PageHeader title="Books" description="Manage the book catalog" actions={<Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />Add Book</Button>} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by title or ISBN..." />
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => <SelectItem key={c.category_id} value={c.category_id}>{c.category}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((b) => (
              <TableRow key={b.book_id}>
                <TableCell className="font-medium">{b.title}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{b.isbn}</TableCell>
                <TableCell>{getAuthorName(b.author_id)}</TableCell>
                <TableCell>
                  <span className="inline-flex rounded-full border bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {getCategoryName(b.category_id)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(b.book_id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No books found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit Book" : "Add Book"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="grid gap-2"><Label>ISBN</Label><Input value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} /></div>
            <div className="grid gap-2">
              <Label>Author</Label>
              <Select value={form.author_id} onValueChange={(v) => setForm({ ...form, author_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select author" /></SelectTrigger>
                <SelectContent>{authors.map((a) => <SelectItem key={a.author_id} value={a.author_id}>{a.first_name} {a.last_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c.category_id} value={c.category_id}>{c.category}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button onClick={handleSave}>{editId ? "Update" : "Add"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Book" description="Are you sure you want to delete this book?" onConfirm={handleDelete} confirmLabel="Delete" />
    </div>
  );
};

export default Books;
