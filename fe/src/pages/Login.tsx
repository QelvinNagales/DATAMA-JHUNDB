import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Library, Eye, EyeOff, ShieldCheck, User, BookOpen } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const success = login(email, password, role);
    setIsLoading(false);

    if (!success) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/member");
    }
  };

  return (
    <div className="min-h-screen w-full flex" style={{ fontFamily: "'Georgia', serif" }}>

      {/* ── Left decorative panel ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "hsl(220, 65%, 18%)" }}
      >
        {/* Glow blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, hsl(30,95%,55%), transparent)" }} />
          <div className="absolute bottom-10 right-0 w-96 h-96 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, hsl(220,85%,60%), transparent)" }} />
        </div>

        {/* Decorative book grid */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <BookOpen style={{ width: "28rem", height: "28rem" }} />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ background: "hsl(30,95%,55%)" }}>
            <Library className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">JhunDB</p>
            <p className="text-xs mt-0.5" style={{ color: "hsl(220,25%,65%)" }}>Database Solutions</p>
          </div>
        </div>

        {/* Quote */}
        <div className="relative z-10">
          <div className="text-5xl mb-4 opacity-40" style={{ color: "hsl(30,95%,55%)" }}>"</div>
          <blockquote className="text-2xl font-bold text-white leading-snug mb-4">
            A library is the delivery room for the birth of ideas.
          </blockquote>
          <p className="text-sm" style={{ color: "hsl(220,25%,60%)" }}>— Norman Cousins</p>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-3">
          {[
            { label: "Books", value: "10,000+" },
            { label: "Members", value: "2,400+" },
            { label: "Authors", value: "850+" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-4"
              style={{ background: "hsl(220,55%,25%)" }}>
              <p className="text-white font-bold text-xl">{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: "hsl(220,25%,60%)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12"
        style={{ background: "hsl(220,25%,97%)" }}>

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "hsl(220,65%,18%)" }}>
            <Library className="h-5 w-5 text-white" />
          </div>
          <p className="font-bold text-xl" style={{ color: "hsl(220,60%,15%)" }}>JhunDB</p>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold" style={{ color: "hsl(220,60%,15%)" }}>
              Welcome back
            </h1>
            <p className="mt-2 text-sm" style={{ color: "hsl(220,15%,46%)" }}>
              Sign in to City Library Hub
            </p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(["member", "admin"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => { setRole(r); setError(""); }}
                className="flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all duration-200"
                style={{
                  borderColor: role === r ? "hsl(220,85%,50%)" : "hsl(220,20%,88%)",
                  background: role === r ? "hsl(220,85%,50%,0.05)" : "white",
                  color: role === r ? "hsl(220,85%,50%)" : "hsl(220,15%,46%)",
                }}
              >
                {r === "member"
                  ? <User className="h-4 w-4" />
                  : <ShieldCheck className="h-4 w-4" />}
                {r === "member" ? "Member" : "Admin"}
              </button>
            ))}
          </div>

          {/* Demo credentials hint */}
          <div className="mb-5 rounded-lg px-4 py-3 text-xs"
            style={{ background: "hsl(220,20%,94%)", color: "hsl(220,15%,46%)" }}>
            {role === "admin"
              ? <>Admin: <strong>admin@jhundb.com</strong> / <strong>admin123</strong></>
              : <>Member: <strong>member@jhundb.com</strong> / <strong>member123</strong></>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold" style={{ color: "hsl(220,60%,15%)" }}>
                Email address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
                style={{
                  border: "1.5px solid hsl(220,20%,88%)",
                  background: "white",
                  color: "hsl(220,60%,15%)",
                }}
                onFocus={(e) => e.target.style.borderColor = "hsl(220,85%,50%)"}
                onBlur={(e) => e.target.style.borderColor = "hsl(220,20%,88%)"}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold" style={{ color: "hsl(220,60%,15%)" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg px-4 py-2.5 pr-11 text-sm outline-none transition-all"
                  style={{
                    border: "1.5px solid hsl(220,20%,88%)",
                    background: "white",
                    color: "hsl(220,60%,15%)",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "hsl(220,85%,50%)"}
                  onBlur={(e) => e.target.style.borderColor = "hsl(220,20%,88%)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "hsl(220,15%,46%)" }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border px-4 py-3 text-sm"
                style={{
                  borderColor: "hsl(0,72%,51%,0.3)",
                  background: "hsl(0,72%,51%,0.08)",
                  color: "hsl(0,72%,51%)",
                }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-bold text-white transition-all duration-200 mt-2 disabled:opacity-60"
              style={{ background: "hsl(220,85%,50%)" }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                `Sign in as ${role === "admin" ? "Admin" : "Member"}`
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "hsl(220,15%,46%)" }}>
            Don't have an account?{" "}
            <Link to="/register"
              className="font-semibold transition-colors"
              style={{ color: "hsl(220,85%,50%)" }}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
