import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { categories as initialCategories } from "@/data/mock-data";
import type { Category } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const Categories = () => {
  const [data, setData] = useState<Category[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ category: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = data.filter((c) => c.category.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm({ category: "" }); setEditId(null); setModalOpen(true); };
  const openEdit = (c: Category) => { setForm({ category: c.category }); setEditId(c.category_id); setModalOpen(true); };

  const handleSave = () => {
    if (!form.category.trim()) { toast.error("Category name is required"); return; }
    const duplicate = data.some((c) => c.category.toLowerCase() === form.category.trim().toLowerCase() && c.category_id !== editId);
    if (duplicate) { toast.error("Category already exists"); return; }

    if (editId) {
      setData((d) => d.map((c) => (c.category_id === editId ? { ...c, ...form } : c)));
      toast.success("Category updated");
    } else {
      setData((d) => [...d, { category_id: `C${String(d.length + 1).padStart(3, "0")}`, ...form }]);
      toast.success("Category added");
    }
    setModalOpen(false);
  };

  const handleDelete = () => { if (deleteId) { setData((d) => d.filter((c) => c.category_id !== deleteId)); toast.success("Category deleted"); } setDeleteId(null); };

  return (
    <div>
      <PageHeader title="Categories" description="Manage book categories" actions={<Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />Add Category</Button>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search categories..." />
      <div className="mt-4 overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.category_id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{c.category_id}</TableCell>
                <TableCell className="font-medium">{c.category}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(c.category_id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <TableRow><TableCell colSpan={3} className="py-8 text-center text-muted-foreground">No categories found</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit Category" : "Add Category"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Category Name</Label><Input value={form.category} onChange={(e) => setForm({ category: e.target.value })} /></div>
          </div>
          <DialogFooter><Button onClick={handleSave}>{editId ? "Update" : "Add"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Category" description="Are you sure you want to delete this category?" onConfirm={handleDelete} confirmLabel="Delete" />
    </div>
  );
};

export default Categories;
