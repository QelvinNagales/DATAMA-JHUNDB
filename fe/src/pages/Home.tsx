import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, ShieldCheck, User, X } from "lucide-react";

type Modal = "none" | "login";

export default function Home() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [modal, setModal] = useState<Modal>("none");
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setEmail(""); setPassword(""); setError("");
    setShowPassword(false); setRole("member");
  };

  const openLogin = () => { resetForm(); setModal("login"); };
  const closeModal = () => { setModal("none"); resetForm(); };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const success = login(email, password, role);
    setIsLoading(false);
    if (!success) { setError("Invalid email or password."); return; }
    closeModal();
    navigate(role === "admin" ? "/admin" : "/member");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/member");
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-sans">

      {/* Blue background blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "#dbeafe" }}>
        <div className="absolute -top-32 left-1/2 h-[56rem] w-[56rem] -translate-x-1/2 rounded-full blur-3xl" style={{ background: "rgba(99,102,241,0.2)" }} />
        <div className="absolute -left-40 top-10 h-[48rem] w-[48rem] rounded-full blur-3xl" style={{ background: "rgba(59,130,246,0.2)" }} />
        <div className="absolute -right-40 top-32 h-[52rem] w-[52rem] rounded-full blur-3xl" style={{ background: "rgba(147,197,253,0.3)" }} />
        <div className="absolute -bottom-40 left-1/3 h-[52rem] w-[52rem] -translate-x-1/2 rounded-full blur-3xl" style={{ background: "rgba(191,219,254,0.35)" }} />
        <div className="absolute bottom-0 right-0 h-[40rem] w-[40rem] rounded-full blur-3xl" style={{ background: "rgba(224,231,255,0.5)" }} />
      </div>

      <div className="relative flex min-h-screen flex-col px-4 sm:px-6 lg:px-8">

        {/* Navbar */}
        <header className="flex justify-center pt-6 sm:pt-8">
          <nav className="inline-flex w-full max-w-7xl items-center justify-between rounded-full border border-white/70 bg-white/70 px-4 py-2 shadow-2xl shadow-blue-200/50 backdrop-blur-2xl sm:px-6 sm:py-2.5">
            <span className="text-sm font-semibold tracking-tight text-slate-800 sm:text-base">
              City Archive
            </span>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => navigate("/member")}
                className="hidden sm:inline-flex rounded-full px-4 py-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                Browse All
              </button>
              {user ? (
                <button
                  type="button"
                  onClick={() => navigate(user.role === "admin" ? "/admin" : "/member")}
                  className="inline-flex items-center rounded-full border border-white/60 bg-white/60 px-4 py-1.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-px hover:bg-white/80"
                >
                  Dashboard
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openLogin}
                  className="inline-flex items-center rounded-full border border-white/60 bg-white/60 px-4 py-1.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-px hover:bg-white/80"
                >
                  Login
                </button>
              )}
            </div>
          </nav>
        </header>

        {/* Hero */}
        <main className="flex flex-1 flex-col items-center justify-center pb-28 pt-10 sm:pb-32 sm:pt-12">
          <h1 className="text-center text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            City Archive Library
          </h1>

          {/* Quote */}
          <p className="mt-4 max-w-xl text-center text-sm italic text-slate-500 sm:text-base">
            "A library is the delivery room for the birth of ideas, a place where history comes to life."
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mt-8 flex w-full max-w-2xl items-center gap-3 rounded-full border border-white/70 bg-white/60 px-4 py-2.5 shadow-2xl shadow-blue-200/50 backdrop-blur-xl sm:px-5 sm:py-3"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search authors, books, and more..."
              className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none sm:text-base"
            />
            <button
              type="submit"
              className="rounded-full px-5 py-1.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
              style={{ background: "hsl(220,85%,50%)" }}
            >
              Search
            </button>
          </form>
        </main>
      </div>

      {/* Footer */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 px-4 sm:px-6 lg:px-8">
        <footer className="pointer-events-auto mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs text-slate-500 shadow-2xl backdrop-blur-2xl sm:px-6">
          <span>Created by JhunDB Database Solutions</span>
          <span className="text-slate-400">City Library Hub</span>
        </footer>
      </div>

      {/* Login Modal */}
      {modal === "login" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,0.3)", backdropFilter: "blur(8px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-3xl border border-white/60 shadow-2xl"
            style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)", animation: "modalIn 0.25s ease-out" }}
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-4"
              style={{ borderBottom: "1px solid rgba(226,232,240,0.8)" }}>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Sign in</h2>
                <p className="text-xs text-slate-500 mt-0.5">City Archive Library</p>
              </div>
              <button onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-5">
              {/* Role selector */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {(["member", "admin"] as const).map((r) => (
                  <button key={r} type="button"
                    onClick={() => { setRole(r); setError(""); }}
                    className="flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all duration-200"
                    style={{
                      borderColor: role === r ? "hsl(220,85%,50%)" : "hsl(220,20%,88%)",
                      background: role === r ? "hsl(220,85%,50%)" : "rgba(255,255,255,0.6)",
                      color: role === r ? "white" : "#64748b",
                    }}
                  >
                    {r === "member" ? <User className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                    {r === "member" ? "Member" : "Admin"}
                  </button>
                ))}
              </div>

              {/* Hint */}
              <div className="mb-4 rounded-xl px-4 py-2.5 text-xs text-slate-500" style={{ background: "rgba(241,245,249,0.9)" }}>
                {role === "admin"
                  ? <><strong>admin@jhundb.com</strong> / <strong>admin123</strong></>
                  : <><strong>member@jhundb.com</strong> / <strong>member123</strong></>}
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Email address</label>
                  <input type="email" required placeholder="you@example.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border bg-white/70 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition"
                    style={{ borderColor: "hsl(220,20%,88%)" }}
                    onFocus={(e) => e.target.style.borderColor = "hsl(220,85%,50%)"}
                    onBlur={(e) => e.target.style.borderColor = "hsl(220,20%,88%)"}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} required placeholder="••••••••"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border bg-white/70 px-4 py-2.5 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition"
                      style={{ borderColor: "hsl(220,20%,88%)" }}
                      onFocus={(e) => e.target.style.borderColor = "hsl(220,85%,50%)"}
                      onBlur={(e) => e.target.style.borderColor = "hsl(220,20%,88%)"}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-600">{error}</div>
                )}

                <button type="submit" disabled={isLoading}
                  className="w-full rounded-xl px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                  style={{ background: "hsl(220,85%,50%)" }}>
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : `Sign in as ${role === "admin" ? "Admin" : "Member"}`}
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-slate-500">
                Don't have an account?{" "}
                <a href="/register" className="font-semibold underline underline-offset-2" style={{ color: "hsl(220,85%,50%)" }}>
                  Register here
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
