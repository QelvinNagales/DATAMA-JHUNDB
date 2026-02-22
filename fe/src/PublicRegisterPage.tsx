import { useState, type FormEvent } from "react";
import { apiFetch } from "@/api/client";

export default function PublicRegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setShowError(false);
    setErrorMessage("");
    setSuccess(false);
    setLoading(true);
    try {
      await apiFetch("/api/members/register", {
        method: "POST",
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          phone: phone || undefined,
          address: undefined,
        }),
      });
      setSuccess(true);
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setPassword("");
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Registration failed.";
      setErrorMessage(msg);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const dismissError = () => {
    setShowError(false);
    setErrorMessage("");
  };

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

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/40 p-8 shadow-2xl shadow-orange-200/60 backdrop-blur-2xl ring-1 ring-white/50">

          {/* Header */}
          <div className="mb-6 flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 bg-white/60 shadow-md shadow-orange-100/60 backdrop-blur-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-6 w-6 text-slate-700"
                fill="currentColor"
              >
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">
              City Archive Library | Member Registration
            </h1>
            <p className="text-sm text-slate-500">
              Create your account to access the catalog
            </p>
          </div>

          {showError && (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-rose-200/80 bg-rose-50/90 px-4 py-3 shadow-sm backdrop-blur-sm">
              <p className="text-sm text-rose-800">
                {errorMessage || "Member already exists or email already registered. Please try again or log in."}
              </p>
              <button
                type="button"
                onClick={dismissError}
                className="flex-none rounded-full p-1.5 text-rose-600 transition hover:bg-rose-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/80"
                aria-label="Dismiss"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-100/50 px-4 py-3 text-sm text-emerald-800">
              Account created successfully. You can now log in.
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="group rounded-full border border-white/60 bg-white/40 px-4 py-2.5 shadow-sm backdrop-blur-sm transition-all duration-200 ease-out focus-within:border-white/80 focus-within:bg-white/55 focus-within:ring-2 focus-within:ring-sky-300/80">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  autoComplete="given-name"
                  required
                  className="w-full border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>
              <div className="group rounded-full border border-white/60 bg-white/40 px-4 py-2.5 shadow-sm backdrop-blur-sm transition-all duration-200 ease-out focus-within:border-white/80 focus-within:bg-white/55 focus-within:ring-2 focus-within:ring-sky-300/80">
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  autoComplete="family-name"
                  required
                  className="w-full border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>
            </div>

            <div className="group flex items-center gap-3 rounded-full border border-white/60 bg-white/40 px-4 py-3 shadow-sm backdrop-blur-sm transition-all duration-200 ease-out focus-within:border-white/80 focus-within:bg-white/55 focus-within:ring-2 focus-within:ring-sky-300/80">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                autoComplete="tel"
                required
                className="flex-1 border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>

            <div className="group flex items-center gap-3 rounded-full border border-white/60 bg-white/40 px-4 py-3 shadow-sm backdrop-blur-sm transition-all duration-200 ease-out focus-within:border-white/80 focus-within:bg-white/55 focus-within:ring-2 focus-within:ring-sky-300/80">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                autoComplete="email"
                required
                className="flex-1 border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>

            <div className="group flex items-center gap-3 rounded-full border border-white/60 bg-white/40 px-4 py-3 shadow-sm backdrop-blur-sm transition-all duration-200 ease-out focus-within:border-white/80 focus-within:bg-white/55 focus-within:ring-2 focus-within:ring-sky-300/80">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 8 characters)"
                autoComplete="new-password"
                minLength={8}
                required
                className="flex-1 border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full transform rounded-full bg-slate-900 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 ease-out hover:bg-slate-800 hover:shadow-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/80 focus-visible:ring-offset-0 disabled:opacity-70"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-600">
            <a
              href="/login"
              className="text-slate-700 underline-offset-4 transition-colors hover:text-slate-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/80 focus-visible:ring-offset-2 rounded"
            >
              Already have an account? Log in.
            </a>
          </p>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-slate-500 transition-colors duration-150 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/80 rounded"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
