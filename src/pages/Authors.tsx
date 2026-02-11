import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { authors as initialAuthors } from "@/data/mock-data";
import type { Author } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const Authors = () => {
  const [data, setData] = useState<Author[]>(initialAuthors);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = data.filter((a) => `${a.first_name} ${a.last_name}`.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm({ first_name: "", last_name: "" }); setEditId(null); setModalOpen(true); };
  const openEdit = (a: Author) => { setForm({ first_name: a.first_name, last_name: a.last_name }); setEditId(a.author_id); setModalOpen(true); };

  const handleSave = () => {
    if (!form.first_name.trim() || !form.last_name.trim()) { toast.error("Both names are required"); return; }
    if (editId) {
      setData((d) => d.map((a) => (a.author_id === editId ? { ...a, ...form } : a)));
      toast.success("Author updated");
    } else {
      setData((d) => [...d, { author_id: `A${String(d.length + 1).padStart(3, "0")}`, ...form }]);
      toast.success("Author added");
    }
    setModalOpen(false);
  };

  const handleDelete = () => { if (deleteId) { setData((d) => d.filter((a) => a.author_id !== deleteId)); toast.success("Author deleted"); } setDeleteId(null); };

  return (
    <div>
      <PageHeader title="Authors" description="Manage book authors" actions={<Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />Add Author</Button>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search authors..." />
      <div className="mt-4 overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((a) => (
              <TableRow key={a.author_id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{a.author_id}</TableCell>
                <TableCell className="font-medium">{a.first_name} {a.last_name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(a.author_id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <TableRow><TableCell colSpan={3} className="py-8 text-center text-muted-foreground">No authors found</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit Author" : "Add Author"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>First Name</Label><Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Last Name</Label><Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} /></div>
          </div>
          <DialogFooter><Button onClick={handleSave}>{editId ? "Update" : "Add"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Author" description="Are you sure you want to delete this author?" onConfirm={handleDelete} confirmLabel="Delete" />
    </div>
  );
};

export default Authors;
