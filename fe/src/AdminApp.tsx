import { useState } from "react";
import AdminLayout, { type AdminPage } from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminMembers from "./admin/AdminMembers";
import AdminBooks from "./admin/AdminBooks";
import AdminAuthors from "./admin/AdminAuthors";
import AdminLoans from "./admin/AdminLoans";
import AdminFines from "./admin/AdminFines";

const PAGE_COMPONENT: Record<AdminPage, React.FC> = {
  dashboard: AdminDashboard,
  members: AdminMembers,
  books: AdminBooks,
  authors: AdminAuthors,
  loans: AdminLoans,
  fines: AdminFines,
};

export default function AdminApp() {
  const [adminPage, setAdminPage] = useState<AdminPage>("dashboard");

  const handleLogout = () => {
    window.location.href = "/";
  };

  const ActivePage = PAGE_COMPONENT[adminPage];

  return (
    <AdminLayout activePage={adminPage} onNavigate={setAdminPage} onLogout={handleLogout}>
      <ActivePage />
    </AdminLayout>
  );
}
