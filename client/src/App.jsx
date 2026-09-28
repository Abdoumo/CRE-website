import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// Layout
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// Public pages
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ShowcasePage from './pages/ShowcasePage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import BlogsPage from './pages/BlogsPage.jsx';
import GenericPage from './pages/GenericPage.jsx';

// Dashboard pages
import DashboardLayout from './components/DashboardLayout.jsx';
import DashboardHome from './pages/dashboard/DashboardHome.jsx';
import ProjectsPage from './pages/dashboard/ProjectsPage.jsx';
import NewProjectPage from './pages/dashboard/NewProjectPage.jsx';
import BookingsPage from './pages/dashboard/BookingsPage.jsx';
import MembersPage from './pages/dashboard/MembersPage.jsx';
import WorkshopsPage from './pages/dashboard/WorkshopsPage.jsx';
import ProfilePage from './pages/dashboard/ProfilePage.jsx';
import KPIPage from './pages/dashboard/KPIPage.jsx';


// Investor
import InvestorPortal from './pages/investor/InvestorPortal.jsx';

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
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  
  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/connexion" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/inscription" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
        <Route path="/vitrine" element={<ShowcasePage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blog/:id" element={<BlogPage />} />
        <Route path="/page/:slug" element={<GenericPage />} />

        {/* Protected dashboard routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="projets" element={<ProjectsPage />} />
          <Route path="nouveau-projet" element={<NewProjectPage />} />
          <Route path="reservations" element={<BookingsPage />} />
          <Route path="reseau" element={<MembersPage />} />
          <Route path="ateliers" element={<WorkshopsPage />} />
          <Route path="profil" element={<ProfilePage />} />
          <Route path="kpi" element={<KPIPage />} />
        </Route>



        {/* Investor routes */}
        <Route path="/investisseur" element={
          <ProtectedRoute roles={['investor']}>
            <DashboardLayout isInvestor />
          </ProtectedRoute>
        }>
          <Route index element={<InvestorPortal />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
