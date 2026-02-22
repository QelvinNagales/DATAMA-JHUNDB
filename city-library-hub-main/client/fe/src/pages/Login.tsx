import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login(email, role);

    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/member");
    }
  };

  return (
    <div className="container">
      <h2>City Library Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <select onChange={(e) => setRole(e.target.value as any)}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
