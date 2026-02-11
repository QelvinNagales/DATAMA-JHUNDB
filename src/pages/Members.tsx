import { useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { members as initialMembers, loans, books, fines } from "@/data/mock-data";
import type { Member } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const emptyMember: Omit<Member, "member_id"> = { first_name: "", last_name: "", phone_number: "" };

const Members = () => {
  const [data, setData] = useState<Member[]>(initialMembers);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [form, setForm] = useState(emptyMember);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = data.filter(
    (m) =>
      `${m.first_name} ${m.last_name} ${m.phone_number}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(emptyMember); setEditId(null); setModalOpen(true); };
  const openEdit = (m: Member) => { setForm({ first_name: m.first_name, last_name: m.last_name, phone_number: m.phone_number }); setEditId(m.member_id); setModalOpen(true); };

  const handleSave = () => {
    if (!form.first_name.trim() || !form.last_name.trim()) { toast.error("First and last name are required"); return; }
    if (editId) {
      setData((d) => d.map((m) => (m.member_id === editId ? { ...m, ...form } : m)));
      toast.success("Member updated");
    } else {
      const newMember: Member = { member_id: `M${String(data.length + 1).padStart(3, "0")}`, ...form };
      setData((d) => [...d, newMember]);
      toast.success("Member added");
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) { setData((d) => d.filter((m) => m.member_id !== deleteId)); toast.success("Member deleted"); }
    setDeleteId(null);
  };

  const openProfile = (m: Member) => { setSelectedMember(m); setProfileOpen(true); };

  const memberLoans = selectedMember ? loans.filter((l) => l.member_id === selectedMember.member_id) : [];
  const memberFines = memberLoans.flatMap((l) => fines.filter((f) => f.loan_id === l.loan_id));

  return (
    <div>
      <PageHeader title="Members" description="Manage library members" actions={<Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />Add Member</Button>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search members..." />

      <div className="mt-4 overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((m) => (
              <TableRow key={m.member_id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{m.member_id}</TableCell>
                <TableCell className="font-medium">{m.first_name} {m.last_name}</TableCell>
                <TableCell>{m.phone_number}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openProfile(m)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(m)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(m.member_id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No members found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit Member" : "Add Member"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>First Name</Label><Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Last Name</Label><Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Phone Number</Label><Input value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} /></div>
          </div>
          <DialogFooter><Button onClick={handleSave}>{editId ? "Update" : "Add"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Member Profile</DialogTitle></DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                <div><p className="text-xs text-muted-foreground">Name</p><p className="font-medium">{selectedMember.first_name} {selectedMember.last_name}</p></div>
                <div><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium">{selectedMember.phone_number}</p></div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold">Borrowed Books</h3>
                {memberLoans.length === 0 ? <p className="text-sm text-muted-foreground">No loans</p> : (
                  <ul className="space-y-1">
                    {memberLoans.map((l) => (
                      <li key={l.loan_id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                        <span>{books.find((b) => b.book_id === l.book_id)?.title}</span>
                        <StatusBadge variant={l.return_date ? "returned" : new Date(l.due_date) < new Date() ? "overdue" : "active"}>
                          {l.return_date ? "Returned" : new Date(l.due_date) < new Date() ? "Overdue" : "Active"}
                        </StatusBadge>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {memberFines.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Fines</h3>
                  <ul className="space-y-1">
                    {memberFines.map((f) => (
                      <li key={f.fine_id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                        <span>${f.amount.toFixed(2)}</span>
                        <StatusBadge variant={f.is_paid ? "paid" : "unpaid"}>{f.is_paid ? "Paid" : "Unpaid"}</StatusBadge>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Member" description="Are you sure you want to delete this member? This action cannot be undone." onConfirm={handleDelete} confirmLabel="Delete" />
    </div>
  );
};

export default Members;
