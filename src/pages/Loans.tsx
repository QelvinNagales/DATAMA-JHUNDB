import { useState } from "react";
import { Plus, RotateCcw } from "lucide-react";
import { loans as initialLoans, members, books, librarians } from "@/data/mock-data";
import type { Loan, LoanStatus } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

function getLoanStatus(loan: Loan): LoanStatus {
  if (loan.return_date) return "returned";
  if (new Date(loan.due_date) < new Date()) return "overdue";
  return "active";
}

const Loans = () => {
  const [data, setData] = useState<Loan[]>(initialLoans);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ member_id: "", book_id: "", librarian_id: "", checkout_date: "", due_date: "" });

  const filtered = data.filter((l) => {
    const m = members.find((m) => m.member_id === l.member_id);
    const b = books.find((b) => b.book_id === l.book_id);
    return `${m?.first_name} ${m?.last_name} ${b?.title}`.toLowerCase().includes(search.toLowerCase());
  });

  const handleCreate = () => {
    if (!form.member_id || !form.book_id || !form.librarian_id || !form.checkout_date || !form.due_date) { toast.error("All fields are required"); return; }
    const newLoan: Loan = { loan_id: `LN${String(data.length + 1).padStart(3, "0")}`, ...form, return_date: null };
    setData((d) => [...d, newLoan]);
    toast.success("Loan created");
    setModalOpen(false);
    setForm({ member_id: "", book_id: "", librarian_id: "", checkout_date: "", due_date: "" });
  };

  const handleReturn = (id: string) => {
    setData((d) => d.map((l) => (l.loan_id === id ? { ...l, return_date: new Date().toISOString().split("T")[0] } : l)));
    toast.success("Book returned");
  };

  const getMemberName = (id: string) => { const m = members.find((m) => m.member_id === id); return m ? `${m.first_name} ${m.last_name}` : id; };
  const getBookTitle = (id: string) => books.find((b) => b.book_id === id)?.title ?? id;
  const getLibrarianName = (id: string) => { const l = librarians.find((l) => l.librarian_id === id); return l ? `${l.first_name} ${l.last_name}` : id; };

  return (
    <div>
      <PageHeader title="Loans" description="Manage book loans" actions={<Button onClick={() => setModalOpen(true)}><Plus className="mr-2 h-4 w-4" />Create Loan</Button>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search loans..." />

      <div className="mt-4 overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Book</TableHead>
              <TableHead>Librarian</TableHead>
              <TableHead>Checkout</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((l) => {
              const status = getLoanStatus(l);
              return (
                <TableRow key={l.loan_id}>
                  <TableCell className="font-medium">{getMemberName(l.member_id)}</TableCell>
                  <TableCell>{getBookTitle(l.book_id)}</TableCell>
                  <TableCell>{getLibrarianName(l.librarian_id)}</TableCell>
                  <TableCell>{l.checkout_date}</TableCell>
                  <TableCell>{l.due_date}</TableCell>
                  <TableCell><StatusBadge variant={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</StatusBadge></TableCell>
                  <TableCell className="text-right">
                    {!l.return_date && (
                      <Button variant="outline" size="sm" onClick={() => handleReturn(l.loan_id)}>
                        <RotateCcw className="mr-1 h-3 w-3" />Return
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No loans found</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Loan</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Member</Label>
              <Select value={form.member_id} onValueChange={(v) => setForm({ ...form, member_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
                <SelectContent>{members.map((m) => <SelectItem key={m.member_id} value={m.member_id}>{m.first_name} {m.last_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Book</Label>
              <Select value={form.book_id} onValueChange={(v) => setForm({ ...form, book_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select book" /></SelectTrigger>
                <SelectContent>{books.map((b) => <SelectItem key={b.book_id} value={b.book_id}>{b.title}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Librarian</Label>
              <Select value={form.librarian_id} onValueChange={(v) => setForm({ ...form, librarian_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select librarian" /></SelectTrigger>
                <SelectContent>{librarians.map((l) => <SelectItem key={l.librarian_id} value={l.librarian_id}>{l.first_name} {l.last_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Checkout Date</Label><Input type="date" value={form.checkout_date} onChange={(e) => setForm({ ...form, checkout_date: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Due Date</Label><Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter><Button onClick={handleCreate}>Create Loan</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Loans;
