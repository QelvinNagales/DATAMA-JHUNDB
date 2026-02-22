import { type ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Pen,
  ArrowLeftRight,
  DollarSign,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export type AdminPage = "dashboard" | "members" | "books" | "authors" | "loans" | "fines";

const NAV: { label: string; page: AdminPage; icon: typeof LayoutDashboard }[] = [
  { label: "Dashboard", page: "dashboard", icon: LayoutDashboard },
  { label: "Members", page: "members", icon: Users },
  { label: "Books", page: "books", icon: BookOpen },
  { label: "Authors", page: "authors", icon: Pen },
  { label: "Loans", page: "loans", icon: ArrowLeftRight },
  { label: "Fines", page: "fines", icon: DollarSign },
];

interface AdminLayoutProps {
  activePage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  onLogout: () => void;
  children: ReactNode;
}

export default function AdminLayout({ activePage, onNavigate, onLogout, children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-amber-100 font-sans text-slate-900">
      {/* Warm matte acrylic mesh background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[56rem] w-[56rem] -translate-x-1/2 rounded-full bg-amber-300/80 blur-3xl" />
        <div className="absolute -left-40 top-10 h-[48rem] w-[48rem] rounded-full bg-rose-300/75 blur-3xl" />
        <div className="absolute -right-40 top-32 h-[52rem] w-[52rem] rounded-full bg-orange-300/70 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-[52rem] w-[52rem] -translate-x-1/2 rounded-full bg-pink-300/70 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[40rem] w-[40rem] rounded-full bg-yellow-200/60 blur-3xl" />
      </div>

      {/* Mobile menu toggle */}
      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/60 bg-white/70 shadow-lg backdrop-blur-xl lg:hidden"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Glassmorphism sidebar */}
      <aside
        className={`fixed left-4 top-4 bottom-4 z-20 flex w-56 flex-col rounded-3xl border border-white/60 bg-white/50 p-4 shadow-2xl shadow-orange-200/40 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-[calc(100%+2rem)]"
        }`}
      >
        {/* Brand */}
        <div className="mb-8 px-2 pt-2">
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400">City Archive</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800">Librarian Portal</p>
        </div>

        {/* Nav links */}
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map(({ label, page, icon: Icon }) => {
            const isActive = activePage === page;
            return (
              <button
                key={page}
                type="button"
                onClick={() => {
                  onNavigate(page);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  isActive
                    ? "bg-white/70 font-semibold text-slate-900 shadow-sm"
                    : "text-slate-500 hover:bg-white/40 hover:text-slate-800"
                }`}
              >
                <Icon className={`h-4 w-4 flex-none ${isActive ? "text-slate-700" : ""}`} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-2xl border border-white/60 bg-white/60 px-3 py-2.5 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:bg-white/80 hover:shadow-md"
        >
          <LogOut className="h-4 w-4 flex-none text-slate-500" />
          Logout
        </button>
      </aside>

      {/* Main content */}
      <div className="relative min-h-screen px-4 py-6 lg:ml-64 lg:px-8 lg:py-10 lg:pb-16">
        {children}
      </div>
    </div>
  );
}
