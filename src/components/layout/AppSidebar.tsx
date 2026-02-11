import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Feather,
  Tags,
  ArrowLeftRight,
  DollarSign,
  UserCog,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const navItems = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  { title: "Members", path: "/members", icon: Users },
  { title: "Books", path: "/books", icon: BookOpen },
  { title: "Authors", path: "/authors", icon: Feather },
  { title: "Categories", path: "/categories", icon: Tags },
  { title: "Loans", path: "/loans", icon: ArrowLeftRight },
  { title: "Fines", path: "/fines", icon: DollarSign },
  { title: "Librarians", path: "/librarians", icon: UserCog },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      <button
        className="fixed top-4 left-4 z-50 rounded-lg bg-card p-2 shadow-md lg:hidden"
        onClick={() => setCollapsed((c) => !c)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop on mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar sidebar-transition",
          collapsed ? "w-0 -translate-x-full lg:w-16 lg:translate-x-0" : "w-64"
        )}
      >
        {/* Logo area */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <img src="/logo.svg" alt="JhunDB" className="h-8 w-8 shrink-0" />
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold text-sidebar-accent-foreground">
                JhunDB
              </h1>
              <p className="truncate text-xs text-sidebar-muted">Database Solutions</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) setCollapsed(true);
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium sidebar-transition",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4.5 w-4.5 shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Theme toggle & Collapse toggle (desktop) */}
        <div className="border-t border-sidebar-border">
          <div className="px-3 py-2">
            <ThemeToggle collapsed={collapsed} />
          </div>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden h-12 w-full items-center justify-center text-sidebar-muted hover:text-sidebar-foreground lg:flex"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 sidebar-transition",
                collapsed && "rotate-180"
              )}
            />
          </button>
        </div>
      </aside>

      {/* Spacer to push main content */}
      <div
        className={cn(
          "hidden shrink-0 sidebar-transition lg:block",
          collapsed ? "w-16" : "w-64"
        )}
      />
    </>
  );
}
