import { createContext, useContext, useState, ReactNode } from "react";

type Role = "admin" | "member";

interface User {
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: Role) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock credentials
const ADMIN_CREDENTIALS = { email: "admin@jhundb.com", password: "admin123" };
const MEMBER_CREDENTIALS = { email: "member@jhundb.com", password: "member123" };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("library_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string, password: string, role: Role): boolean => {
    if (role === "admin") {
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        const u = { email, role };
        setUser(u);
        localStorage.setItem("library_user", JSON.stringify(u));
        return true;
      }
    } else {
      if (email === MEMBER_CREDENTIALS.email && password === MEMBER_CREDENTIALS.password) {
        const u = { email, role };
        setUser(u);
        localStorage.setItem("library_user", JSON.stringify(u));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("library_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
