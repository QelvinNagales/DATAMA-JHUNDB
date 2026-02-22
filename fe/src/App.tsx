import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

import Home from "./pages/Home";
import Unauthorized from "./pages/Unauthorized";
import MemberDashboard from "./pages/MemberDashboard";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMembers from "./pages/admin/AdminMembers";
import AdminBooks from "./pages/admin/AdminBooks";
import AdminAuthors from "./pages/admin/AdminAuthors";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminLoans from "./pages/admin/AdminLoans";
import AdminFines from "./pages/admin/AdminFines";
import AdminLibrarians from "./pages/admin/AdminLibrarians";

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

          {/* Admin */}
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
          <Route path="/admin/books" element={
            <ProtectedRoute role="admin">
              <AdminLayout><AdminBooks /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/authors" element={
            <ProtectedRoute role="admin">
              <AdminLayout><AdminAuthors /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/categories" element={
            <ProtectedRoute role="admin">
              <AdminLayout><AdminCategories /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/loans" element={
            <ProtectedRoute role="admin">
              <AdminLayout><AdminLoans /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/fines" element={
            <ProtectedRoute role="admin">
              <AdminLayout><AdminFines /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/librarians" element={
            <ProtectedRoute role="admin">
              <AdminLayout><AdminLibrarians /></AdminLayout>
            </ProtectedRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
