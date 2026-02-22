import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Users, BookOpen, Feather,
  Tags, ArrowLeftRight, DollarSign, UserCog,
  LogOut, Menu, ChevronRight,
} from "lucide-react";

const NAV = [
  { label: "Dashboard",  path: "/admin",            icon: LayoutDashboard },
  { label: "Members",    path: "/admin/members",     icon: Users },
  { label: "Books",      path: "/admin/books",       icon: BookOpen },
  { label: "Authors",    path: "/admin/authors",     icon: Feather },
  { label: "Categories", path: "/admin/categories",  icon: Tags },
  { label: "Loans",      path: "/admin/loans",       icon: ArrowLeftRight },
  { label: "Fines",      path: "/admin/fines",       icon: DollarSign },
  { label: "Librarians", path: "/admin/librarians",  icon: UserCog },
];

interface AdminLayoutProps { children: React.ReactNode; }

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };
  const isActive = (path: string) =>
    path === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(path);

  const Sidebar = () => (
    <aside style={{
      width: 240, minHeight: "100vh", display: "flex", flexDirection: "column",
      background: "linear-gradient(180deg, #f8bbd0 0%, #fff9c4 100%)",
      borderRight: "1px solid rgba(255,255,255,0.6)",
    }}>
      {/* Logo */}
      <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.5)" }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: "#b5548a", letterSpacing: "-0.02em" }}>
          JhunDB
        </div>
        <div style={{ fontSize: 11, color: "rgba(180,80,120,0.55)", marginTop: 2, letterSpacing: "0.05em" }}>
          Admin Console
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(180,80,120,0.45)", padding: "4px 12px 8px", textTransform: "uppercase" }}>
          Library Sections
        </div>
        {NAV.map(({ label, path, icon: Icon }) => {
          const active = isActive(path);
          return (
            <button key={path} onClick={() => { navigate(path); setSidebarOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                background: active ? "linear-gradient(135deg,#f48fb1,#ffd54f)" : "transparent",
                color: active ? "white" : "#822952",
                fontWeight: active ? 600 : 400, fontSize: 14,
                transition: "all 0.15s", width: "100%", textAlign: "left",
                boxShadow: active ? "0 2px 10px rgba(244,143,177,0.4)" : "none",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.55)"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <Icon size={16} />
              <span style={{ flex: 1 }}>{label}</span>
              {active && <ChevronRight size={13} style={{ opacity: 0.8 }} />}
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.5)" }}>
        <div style={{ padding: "8px 12px", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg,#f48fb1,#ffd54f)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "white",
          }}>
            {user?.email?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#9c4a70" }}>
              {user?.email?.split("@")[0] ?? "Admin"}
            </div>
            <div style={{ fontSize: 10, color: "rgba(166, 35, 87, 0.5)" }}>Administrator</div>
          </div>
        </div>

        <button onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            width: "100%", padding: "9px 12px", borderRadius: 10, border: "none",
            background: "rgba(255,100,100,0.12)", color: "#e57373",
            fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,100,100,0.22)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,100,100,0.12)"}
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg, #fce4ec 0%, #fff9c4 60%, #ffe0b2 100%)" }}>

      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }}
            onClick={() => setSidebarOpen(false)} />
          <div style={{ position: "relative", zIndex: 10 }}>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Mobile topbar */}
        <header className="flex md:hidden items-center gap-4 px-4 py-3"
          style={{ background: "linear-gradient(135deg,#f8bbd0,#fff9c4)", borderBottom: "1px solid rgba(255,255,255,0.6)" }}>
          <button onClick={() => setSidebarOpen(true)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#ac3a79" }}>
            <Menu size={20} />
          </button>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#952864" }}>JhunDB Admin</span>
        </header>

        <main style={{ flex: 1, padding: "32px 32px 40px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
