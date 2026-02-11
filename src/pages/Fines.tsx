import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { fines as initialFines, loans, members, books } from "@/data/mock-data";
import type { Fine } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const Fines = () => {
  const [data, setData] = useState<Fine[]>(initialFines);

  const markPaid = (id: string) => {
    setData((d) => d.map((f) => (f.fine_id === id ? { ...f, is_paid: true } : f)));
    toast.success("Fine marked as paid");
  };

  const getMemberName = (loanId: string) => {
    const loan = loans.find((l) => l.loan_id === loanId);
    if (!loan) return "Unknown";
    const m = members.find((m) => m.member_id === loan.member_id);
    return m ? `${m.first_name} ${m.last_name}` : "Unknown";
  };

  const getBookTitle = (loanId: string) => {
    const loan = loans.find((l) => l.loan_id === loanId);
    if (!loan) return "Unknown";
    return books.find((b) => b.book_id === loan.book_id)?.title ?? "Unknown";
  };

  return (
    <div>
      <PageHeader title="Fines" description="Manage outstanding and paid fines" />
      <div className="mt-4 overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fine ID</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Book</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((f) => (
              <TableRow key={f.fine_id} className={!f.is_paid ? "bg-warning/5" : ""}>
                <TableCell className="font-mono text-xs text-muted-foreground">{f.fine_id}</TableCell>
                <TableCell className="font-medium">{getMemberName(f.loan_id)}</TableCell>
                <TableCell>{getBookTitle(f.loan_id)}</TableCell>
                <TableCell className="font-semibold">${f.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <StatusBadge variant={f.is_paid ? "paid" : "unpaid"}>
                    {f.is_paid ? "Paid" : "Unpaid"}
                  </StatusBadge>
                </TableCell>
                <TableCell className="text-right">
                  {!f.is_paid && (
                    <Button variant="outline" size="sm" onClick={() => markPaid(f.fine_id)}>
                      <CheckCircle className="mr-1 h-3 w-3" />Mark Paid
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No fines found</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Fines;
