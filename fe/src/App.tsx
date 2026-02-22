import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

import Home from "./pages/Home";
import Unauthorized from "./pages/Unauthorized";
import MemberDashboard from "./pages/MemberDashboard";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMembers from "./pages/admin/AdminMembers";
import AdminLoans from "./pages/admin/AdminLoans";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Member */}
          <Route path="/member" element={
            <ProtectedRoute role="member">
              <MemberDashboard />
            </ProtectedRoute>
          } />

          {/* Admin — all wrapped in AdminLayout */}
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminLayout><AdminDashboard /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/members" element={
            <ProtectedRoute role="admin">
              <AdminLayout><AdminMembers /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/loans" element={
            <ProtectedRoute role="admin">
              <AdminLayout><AdminLoans /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/books" element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold" style={{ color: "hsl(220,60%,15%)" }}>Books</h1>
                  <p style={{ color: "hsl(220,15%,46%)" }}>Book management coming soon.</p>
                </div>
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/authors" element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold" style={{ color: "hsl(220,60%,15%)" }}>Authors</h1>
                  <p style={{ color: "hsl(220,15%,46%)" }}>Author management coming soon.</p>
                </div>
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/categories" element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold" style={{ color: "hsl(220,60%,15%)" }}>Categories</h1>
                  <p style={{ color: "hsl(220,15%,46%)" }}>Category management coming soon.</p>
                </div>
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/fines" element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold" style={{ color: "hsl(220,60%,15%)" }}>Fines</h1>
                  <p style={{ color: "hsl(220,15%,46%)" }}>Fines management coming soon.</p>
                </div>
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/librarians" element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold" style={{ color: "hsl(220,60%,15%)" }}>Librarians</h1>
                  <p style={{ color: "hsl(220,15%,46%)" }}>Librarian management coming soon.</p>
                </div>
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
