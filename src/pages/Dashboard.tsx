import { useState, useMemo } from "react";
import { BookOpen, Users, ArrowLeftRight, AlertTriangle, DollarSign } from "lucide-react";
import { books, members, loans, fines, authors, librarians } from "@/data/mock-data";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { LoanStatus } from "@/types";

function getLoanStatus(loan: { due_date: string; return_date: string | null }): LoanStatus {
  if (loan.return_date) return "returned";
  if (new Date(loan.due_date) < new Date()) return "overdue";
  return "active";
}

const Dashboard = () => {
  const stats = useMemo(() => {
    const activeLoans = loans.filter((l) => !l.return_date);
    const overdueLoans = loans.filter((l) => getLoanStatus(l) === "overdue");
    const unpaidFines = fines.filter((f) => !f.is_paid);
    return {
      totalBooks: books.length,
      totalMembers: members.length,
      activeLoans: activeLoans.length,
      overdueBooks: overdueLoans.length,
      unpaidFines: unpaidFines.reduce((sum, f) => sum + f.amount, 0),
    };
  }, []);

  const recentLoans = loans.slice(-5).reverse();

  const getMemberName = (id: string) => {
    const m = members.find((m) => m.member_id === id);
    return m ? `${m.first_name} ${m.last_name}` : id;
  };
  const getBookTitle = (id: string) => books.find((b) => b.book_id === id)?.title ?? id;

  return (
    <div>
      <PageHeader title="Dashboard" description="JhunDB Library Management System Overview" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Books" value={stats.totalBooks} icon={BookOpen} variant="primary" />
        <StatCard title="Total Members" value={stats.totalMembers} icon={Users} variant="primary" />
        <StatCard title="Active Loans" value={stats.activeLoans} icon={ArrowLeftRight} variant="success" />
        <StatCard title="Overdue Books" value={stats.overdueBooks} icon={AlertTriangle} variant="destructive" />
        <StatCard
          title="Unpaid Fines"
          value={`$${stats.unpaidFines.toFixed(2)}`}
          icon={DollarSign}
          variant="warning"
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Recent Loans</h2>
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Checkout</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLoans.map((loan) => {
                const status = getLoanStatus(loan);
                return (
                  <TableRow key={loan.loan_id}>
                    <TableCell className="font-medium">{getMemberName(loan.member_id)}</TableCell>
                    <TableCell>{getBookTitle(loan.book_id)}</TableCell>
                    <TableCell>{loan.checkout_date}</TableCell>
                    <TableCell>{loan.due_date}</TableCell>
                    <TableCell>
                      <StatusBadge variant={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </StatusBadge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
