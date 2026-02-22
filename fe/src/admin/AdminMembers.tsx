import { useEffect, useState, type FormEvent } from "react";
import { apiFetch } from "@/api/client";
import { Search, Plus, Pencil, X, UserPlus } from "lucide-react";

interface Member {
  member_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  created_at: string;
  total_loans: number;
  active_loans: number;
}

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const fetchMembers = (q = "") => {
    setLoading(true);
    const url = q ? `/api/members?q=${encodeURIComponent(q)}` : "/api/members";
    apiFetch(url)
      .then((data: Member[]) => setMembers(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setSearchQ(searchInput.trim());
    fetchMembers(searchInput.trim());
  };

  const openAdd = () => {
    setEditMember(null);
    setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setAddress(""); setPassword("");
    setFormError(""); setFormSuccess("");
    setShowModal(true);
  };

  const openEdit = (m: Member) => {
    setEditMember(m);
    setFirstName(m.first_name); setLastName(m.last_name); setEmail(m.email);
    setPhone(m.phone || ""); setAddress(m.address || ""); setPassword("");
    setFormError(""); setFormSuccess("");
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(""); setFormSuccess(""); setFormLoading(true);
    try {
      if (editMember) {
        await apiFetch(`/api/members/${editMember.member_id}`, {
          method: "PUT",
          body: JSON.stringify({ first_name: firstName, last_name: lastName, email, phone: phone || null, address: address || null }),
        });
        setFormSuccess("Member updated successfully.");
      } else {
        if (!password) { setFormError("Password is required for new members."); setFormLoading(false); return; }
        await apiFetch("/api/members/register", {
          method: "POST",
          body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password, phone: phone || null, address: address || null }),
        });
        setFormSuccess("Member registered successfully.");
      }
      fetchMembers(searchQ);
      setTimeout(() => setShowModal(false), 1200);
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Request failed.";
      setFormError(msg);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-slate-400">Librarian Portal</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Members</h1>
        <p className="mt-1 text-sm text-slate-500">Manage library member accounts and information.</p>
      </header>

      {/* Search + Add */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex flex-1 items-center gap-3 rounded-full border border-white/60 bg-white/50 px-4 py-2.5 shadow-xl backdrop-blur-xl transition-all focus-within:ring-2 focus-within:ring-sky-300/80 sm:max-w-md">
          <Search className="h-4 w-4 flex-none text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email…"
            className="flex-1 border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
          />
          <button type="submit" className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white shadow-md hover:bg-slate-800">Search</button>
        </form>
        <button type="button" onClick={openAdd} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-slate-800 hover:shadow-lg active:scale-[0.98]">
          <UserPlus className="h-4 w-4" /> Add Member
        </button>
      </div>

      {/* Members Table */}
      <div className="overflow-x-auto rounded-3xl border border-white/60 bg-white/50 shadow-2xl backdrop-blur-2xl">
        {loading ? (
          <div className="px-6 py-16 text-center text-slate-500">Loading members…</div>
        ) : members.length === 0 ? (
          <div className="px-6 py-16 text-center text-slate-400">No members found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/40 text-xs font-medium uppercase tracking-widest text-slate-400">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Active Loans</th>
                <th className="px-6 py-4">Total Loans</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.member_id} className="border-b border-white/30 transition hover:bg-white/20">
                  <td className="whitespace-nowrap px-6 py-3.5 font-mono text-xs text-slate-500">{m.member_id}</td>
                  <td className="whitespace-nowrap px-6 py-3.5 font-medium text-slate-900">{m.first_name} {m.last_name}</td>
                  <td className="whitespace-nowrap px-6 py-3.5 text-slate-600">{m.email}</td>
                  <td className="whitespace-nowrap px-6 py-3.5 text-slate-500">{m.phone || "—"}</td>
                  <td className="whitespace-nowrap px-6 py-3.5">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${Number(m.active_loans) > 0 ? "bg-amber-100/60 text-amber-700" : "bg-slate-100/60 text-slate-500"}`}>
                      {m.active_loans}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5 text-slate-500">{m.total_loans}</td>
                  <td className="whitespace-nowrap px-6 py-3.5 text-slate-400 text-xs">{new Date(m.created_at).toLocaleDateString()}</td>
                  <td className="whitespace-nowrap px-6 py-3.5">
                    <button type="button" onClick={() => openEdit(m)} className="inline-flex items-center gap-1 rounded-full bg-white/60 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-white/80 hover:shadow-md">
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-lg rounded-3xl border border-white/60 bg-white/80 p-8 shadow-2xl backdrop-blur-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">{editMember ? "Edit Member" : "Add New Member"}</h2>
              <button type="button" onClick={() => setShowModal(false)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>

            {formError && <div className="mb-4 rounded-2xl border border-rose-200/80 bg-rose-50/90 px-4 py-3 text-sm text-rose-800">{formError}</div>}
            {formSuccess && <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-800">{formSuccess}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-slate-500">First Name</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-300/80" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-slate-500">Last Name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-300/80" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-slate-500">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-300/80" />
              </div>
              {!editMember && (
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-slate-500">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-300/80" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-slate-500">Phone</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-300/80" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-slate-500">Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-300/80" />
                </div>
              </div>
              <div className="mt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-full border border-slate-200/60 bg-white/60 px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-white/80">Cancel</button>
                <button type="submit" disabled={formLoading} className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white shadow-md hover:bg-slate-800 disabled:opacity-70">
                  {formLoading ? "Saving…" : editMember ? "Update Member" : "Register Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
