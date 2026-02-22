import { useEffect, useState } from "react";
import { apiFetch } from "@/api/client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { BookOpen, Users, ArrowLeftRight, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";

interface Stats {
  total_books: number;
  total_members: number;
  active_loans: number;
  unpaid_fines: number;
  overdue_loans: number;
  today_loans: number;
}

interface PopularBook {
  title: string;
  borrow_count: number;
}

interface LoanActivity {
  date: string;
  count: number;
}

interface CategoryDist {
  name: string;
  value: number;
}

const PIE_COLORS = ["#f59e0b", "#ef4444", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [popular, setPopular] = useState<PopularBook[]>([]);
  const [activity, setActivity] = useState<LoanActivity[]>([]);
  const [categories, setCategories] = useState<CategoryDist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      apiFetch("/api/dashboard/stats"),
      apiFetch("/api/dashboard/popular-books"),
      apiFetch("/api/dashboard/loan-activity"),
      apiFetch("/api/dashboard/category-distribution"),
    ])
      .then(([s, p, a, c]) => {
        if (cancelled) return;
        setStats(s);
        setPopular(p);
        setActivity(a);
        setCategories(c);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-slate-500">Loading dashboard…</p>
      </div>
    );
  }

  const kpis = [
    { label: "Total Books", value: stats?.total_books ?? 0, icon: BookOpen, color: "text-amber-600", bg: "bg-amber-100/60" },
    { label: "Total Members", value: stats?.total_members ?? 0, icon: Users, color: "text-sky-600", bg: "bg-sky-100/60" },
    { label: "Active Loans", value: stats?.active_loans ?? 0, icon: ArrowLeftRight, color: "text-emerald-600", bg: "bg-emerald-100/60" },
    { label: "Unpaid Fines", value: `₱${(stats?.unpaid_fines ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-rose-600", bg: "bg-rose-100/60" },
    { label: "Overdue Loans", value: stats?.overdue_loans ?? 0, icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-100/60" },
    { label: "Loans Today", value: stats?.today_loans ?? 0, icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-100/60" },
  ];

  return (
    <>
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-slate-400">Librarian Portal</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Library statistics and analytics overview.</p>
      </header>

      {/* KPI Cards */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl border border-white/60 bg-white/40 p-5 shadow-lg backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-widest text-slate-400">{label}</p>
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
          </div>
        ))}
      </section>

      {/* Charts Row */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Most Borrowed Books This Month - Bar Chart */}
        <div className="rounded-3xl border border-white/60 bg-white/50 p-6 shadow-2xl backdrop-blur-2xl">
          <h2 className="mb-1 text-lg font-semibold text-slate-900">Most Borrowed Books</h2>
          <p className="mb-5 text-xs text-slate-400">This month&apos;s popular titles</p>
          {popular.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400">No loan data for this month yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={popular} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis
                  type="category"
                  dataKey="title"
                  width={120}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickFormatter={(v: string) => v.length > 18 ? v.slice(0, 18) + "…" : v}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)" }}
                />
                <Bar dataKey="borrow_count" name="Borrows" fill="#f59e0b" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Loan Activity - Line Chart */}
        <div className="rounded-3xl border border-white/60 bg-white/50 p-6 shadow-2xl backdrop-blur-2xl">
          <h2 className="mb-1 text-lg font-semibold text-slate-900">Loan Activity</h2>
          <p className="mb-5 text-xs text-slate-400">Last 14 days</p>
          {activity.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400">No loan activity data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activity} margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickFormatter={(v: string) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)" }}
                  labelFormatter={(v: string) => new Date(v).toLocaleDateString()}
                />
                <Line type="monotone" dataKey="count" name="Loans" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: "#3b82f6" }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Category Distribution - Pie Chart */}
      <div className="rounded-3xl border border-white/60 bg-white/50 p-6 shadow-2xl backdrop-blur-2xl">
        <h2 className="mb-1 text-lg font-semibold text-slate-900">Books by Category</h2>
        <p className="mb-5 text-xs text-slate-400">Distribution of your catalog</p>
        {categories.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">No category data yet.</p>
        ) : (
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center">
            <ResponsiveContainer width={280} height={280}>
              <PieChart>
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={2}
                >
                  {categories.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2">
              {categories.map((c, i) => (
                <div key={c.name} className="flex items-center gap-2 text-sm">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-slate-700">{c.name}</span>
                  <span className="ml-auto font-medium text-slate-500">{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
