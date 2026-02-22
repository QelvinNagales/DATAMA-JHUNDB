import { useState, ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Users, BookOpen, Feather,
  Tags, ArrowLeftRight, DollarSign, UserCog,
  ChevronLeft, Menu, LogOut, Library,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { title: "Members", path: "/admin/members", icon: Users },
  { title: "Books", path: "/admin/books", icon: BookOpen },
  { title: "Authors", path: "/admin/authors", icon: Feather },
  { title: "Categories", path: "/admin/categories", icon: Tags },
  { title: "Loans", path: "/admin/loans", icon: ArrowLeftRight },
  { title: "Fines", path: "/admin/fines", icon: DollarSign },
  { title: "Librarians", path: "/admin/librarians", icon: UserCog },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen w-full" style={{ background: "hsl(220,25%,97%)" }}>

      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 rounded-lg p-2 shadow-md lg:hidden"
        style={{ background: "white" }}
        onClick={() => setMobileOpen((o) => !o)}
      >
        <Menu className="h-5 w-5" style={{ color: "hsl(220,60%,15%)" }} />
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 backdrop-blur-sm lg:hidden"
          style={{ background: "rgba(0,0,0,0.3)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300"
        style={{
          background: "hsl(220,65%,18%)",
          width: collapsed ? "4rem" : "16rem",
          transform: mobileOpen || window.innerWidth >= 1024 ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-4"
          style={{ borderBottom: "1px solid hsl(220,50%,28%)" }}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "hsl(30,95%,55%)" }}>
            <Library className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">JhunDB</p>
              <p className="truncate text-xs" style={{ color: "hsl(220,25%,65%)" }}>
                Database Solutions
              </p>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/admin"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive ? "active-nav" : "inactive-nav"
                    }`
                  }
                  style={({ isActive }) => ({
                    background: isActive ? "hsl(220,55%,25%)" : "transparent",
                    color: isActive ? "hsl(220,25%,96%)" : "hsl(220,25%,72%)",
                  })}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div style={{ borderTop: "1px solid hsl(220,50%,28%)" }}>
          {/* User info */}
          {!collapsed && (
            <div className="px-4 py-3">
              <p className="text-xs font-semibold text-white truncate">{user?.email}</p>
              <p className="text-xs mt-0.5" style={{ color: "hsl(220,25%,60%)" }}>Administrator</p>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors"
            style={{ color: "hsl(220,25%,65%)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "hsl(0,72%,65%)";
              (e.currentTarget as HTMLElement).style.background = "hsl(0,50%,20%)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "hsl(220,25%,65%)";
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>

          {/* Collapse toggle desktop */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden h-10 w-full items-center justify-center lg:flex transition-colors"
            style={{ color: "hsl(220,25%,50%)" }}
          >
            <ChevronLeft
              className="h-4 w-4 transition-transform duration-300"
              style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>
        </div>
      </aside>

      {/* Spacer */}
      <div
        className="hidden shrink-0 transition-all duration-300 lg:block"
        style={{ width: collapsed ? "4rem" : "16rem" }}
      />

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
