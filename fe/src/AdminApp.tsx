import { useState } from "react";
import CirculationDeskPage from "./CirculationDeskPage";
import CTODashboardPage from "./CTODashboardPage";
import CatalogingPage from "./CatalogingPage";
import MemberRegistrationPage from "./MemberRegistrationPage";
import FinancialSettlementPage from "./FinancialSettlementPage";

type AdminPage = "cto" | "circulation" | "cataloging" | "member-registration" | "financial-settlement";

export default function AdminApp() {
  const [adminPage, setAdminPage] = useState<AdminPage>("cto");

  const handleLogout = () => {
    window.location.href = "/";
  };

  if (adminPage === "cto") {
    return (
      <CTODashboardPage
        onNavigate={setAdminPage}
        onLogout={handleLogout}
      />
    );
  }

  if (adminPage === "cataloging") {
    return (
      <CatalogingPage
        onLogout={handleLogout}
        onNavigate={setAdminPage}
      />
    );
  }

  if (adminPage === "circulation") {
    return (
      <CirculationDeskPage
        onLogout={handleLogout}
        onNavigate={setAdminPage}
      />
    );
  }

  if (adminPage === "member-registration") {
    return (
      <MemberRegistrationPage
        onNavigate={setAdminPage}
        onLogout={handleLogout}
      />
    );
  }

  if (adminPage === "financial-settlement") {
    return (
      <FinancialSettlementPage
        onNavigate={setAdminPage}
        onLogout={handleLogout}
      />
    );
  }

  return null;
}
