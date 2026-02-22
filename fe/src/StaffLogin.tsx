import { useState, type FormEvent } from "react";
import { apiFetch } from "@/api/client";

export default function StaffLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiFetch("/api/auth/login/staff", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      window.location.href = "/admin";
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Invalid email or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 font-sans text-slate-900">
      {/* Cooler matte acrylic mesh background — internal system */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[56rem] w-[56rem] -translate-x-1/2 rounded-full bg-slate-300/70 blur-3xl" />
        <div className="absolute -left-40 top-10 h-[48rem] w-[48rem] rounded-full bg-sky-200/60 blur-3xl" />
        <div className="absolute -right-40 top-32 h-[52rem] w-[52rem] rounded-full bg-indigo-200/50 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-[52rem] w-[52rem] -translate-x-1/2 rounded-full bg-slate-200/60 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[40rem] w-[40rem] rounded-full bg-sky-100/50 blur-3xl" />
      </div>

      {/* Centered layout */}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-200/60 bg-white/50 p-8 shadow-2xl shadow-slate-200/60 backdrop-blur-2xl ring-1 ring-slate-300/40">

          {/* Branding header */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200/60 bg-white/60 shadow-md shadow-slate-100/60 backdrop-blur-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-7 w-7 text-slate-700"
                fill="currentColor"
              >
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                City Archive Library | Restricted Librarian Access
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">
                Internal staff workspace
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-rose-200/80 bg-rose-50/90 px-4 py-3 text-sm text-rose-800">
              {error}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Staff Email */}
            <div className="group flex items-center gap-3 rounded-full border border-slate-200/60 bg-white/50 px-4 py-3 shadow-sm backdrop-blur-sm transition-all duration-200 ease-out focus-within:border-slate-300/80 focus-within:bg-white/60 focus-within:ring-2 focus-within:ring-slate-400/60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 flex-none text-slate-400 transition-colors duration-200 group-focus-within:text-slate-600"
                fill="currentColor"
              >
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Staff Email Address"
                autoComplete="email"
                required
                className="flex-1 border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>

            {/* Password */}
            <div className="group flex items-center gap-3 rounded-full border border-slate-200/60 bg-white/50 px-4 py-3 shadow-sm backdrop-blur-sm transition-all duration-200 ease-out focus-within:border-slate-300/80 focus-within:bg-white/60 focus-within:ring-2 focus-within:ring-slate-400/60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 flex-none text-slate-400 transition-colors duration-200 group-focus-within:text-slate-600"
                fill="currentColor"
              >
                <path d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z" />
              </svg>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                required
                className="flex-1 border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>

            {/* Submit button — dark slate-900 */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full transform rounded-full bg-slate-900 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 ease-out hover:bg-slate-800 hover:shadow-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/80 focus-visible:ring-offset-0 disabled:opacity-70"
            >
              {loading ? "Signing in…" : "Authenticate Secure Session"}
            </button>
          </form>

          {/* No registration link — staff provisioned by DB Admin only */}
        </div>
      </div>
    </div>
  );
}
