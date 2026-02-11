import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { librarians as initialLibrarians } from "@/data/mock-data";
import type { Librarian } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const Librarians = () => {
  const [data, setData] = useState<Librarian[]>(initialLibrarians);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = data.filter((l) => `${l.first_name} ${l.last_name}`.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm({ first_name: "", last_name: "" }); setEditId(null); setModalOpen(true); };
  const openEdit = (l: Librarian) => { setForm({ first_name: l.first_name, last_name: l.last_name }); setEditId(l.librarian_id); setModalOpen(true); };

  const handleSave = () => {
    if (!form.first_name.trim() || !form.last_name.trim()) { toast.error("Both names are required"); return; }
    if (editId) {
      setData((d) => d.map((l) => (l.librarian_id === editId ? { ...l, ...form } : l)));
      toast.success("Librarian updated");
    } else {
      setData((d) => [...d, { librarian_id: `L${String(d.length + 1).padStart(3, "0")}`, ...form }]);
      toast.success("Librarian added");
    }
    setModalOpen(false);
  };

  const handleDelete = () => { if (deleteId) { setData((d) => d.filter((l) => l.librarian_id !== deleteId)); toast.success("Librarian deleted"); } setDeleteId(null); };

  return (
    <div>
      <PageHeader title="Librarians" description="Manage library staff" actions={<Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />Add Librarian</Button>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search librarians..." />
      <div className="mt-4 overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((l) => (
              <TableRow key={l.librarian_id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{l.librarian_id}</TableCell>
                <TableCell className="font-medium">{l.first_name} {l.last_name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(l)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(l.librarian_id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <TableRow><TableCell colSpan={3} className="py-8 text-center text-muted-foreground">No librarians found</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit Librarian" : "Add Librarian"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>First Name</Label><Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Last Name</Label><Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} /></div>
          </div>
          <DialogFooter><Button onClick={handleSave}>{editId ? "Update" : "Add"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Librarian" description="Are you sure you want to delete this librarian?" onConfirm={handleDelete} confirmLabel="Delete" />
    </div>
  );
};

export default Librarians;
