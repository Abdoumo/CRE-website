import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// Layout
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// Public pages
import LoginPage from './pages/LoginPage.jsx';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProjects from './pages/admin/AdminProjects.jsx';
import AdminCampaigns from './pages/admin/AdminCampaigns.jsx';
import AdminBookings from './pages/admin/AdminBookings.jsx';
import AdminBlogs from './pages/admin/AdminBlogs.jsx';
import AdminBlogEditor from './pages/admin/AdminBlogEditor.jsx';

// Dashboard Layout used by admin
import DashboardLayout from './components/DashboardLayout.jsx';
function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" style={{ width: 40, height: 40 }}></div>
        <p className="text-muted">Chargement...</p>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/connexion" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/connexion" replace />;
  
  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        {/* Admin entry points */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/connexion" element={user ? <Navigate to="/admin" replace /> : <LoginPage />} />


        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}>
            <DashboardLayout isAdmin />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="projets" element={<AdminProjects />} />
          <Route path="campagnes" element={<AdminCampaigns />} />
          <Route path="reservations" element={<AdminBookings />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="blogs/create" element={<AdminBlogEditor />} />
          <Route path="blogs/edit/:id" element={<AdminBlogEditor />} />
        </Route>


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </>
  );
}
