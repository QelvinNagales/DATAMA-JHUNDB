import CirculationDeskPage from "./CirculationDeskPage";

// Extend this union as new librarian pages are added: | "members" | "reports"
type AdminPage = "circulation";

export default function AdminApp() {
  // Currently only one admin page; state is here for future expansion
  const adminPage: AdminPage = "circulation";

  const handleLogout = () => {
    window.location.href = "/";
  };

  if (adminPage === "circulation") {
    return <CirculationDeskPage onLogout={handleLogout} />;
  }

  return null;
}
