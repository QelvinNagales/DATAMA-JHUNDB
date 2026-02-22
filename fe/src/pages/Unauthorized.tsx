import { useNavigate } from "react-router-dom";
import { ShieldOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "hsl(220,25%,97%)" }}>
      <div className="text-center max-w-md">
        <div className="flex h-20 w-20 items-center justify-center rounded-full mx-auto mb-6"
          style={{ background: "hsl(0,72%,51%,0.1)" }}>
          <ShieldOff className="h-10 w-10" style={{ color: "hsl(0,72%,51%)" }} />
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: "hsl(220,60%,15%)" }}>
          Access Denied
        </h1>
        <p className="text-sm mb-8" style={{ color: "hsl(220,15%,46%)" }}>
          You don't have permission to view this page.
        </p>
        <button
          onClick={() => navigate(user?.role === "admin" ? "/admin" : "/member")}
          className="rounded-lg px-6 py-2.5 text-sm font-bold text-white"
          style={{ background: "hsl(220,85%,50%)" }}
        >
          Go to my Dashboard
        </button>
      </div>
    </div>
  );
}
