import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LayoutDashboard, FolderPlus, FolderOpen, Calendar,
  Users, GraduationCap, User, BarChart3, Shield,
  Megaphone, TrendingUp, Briefcase
} from 'lucide-react';

const memberLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord', end: true },
  { to: '/dashboard/projets', icon: FolderOpen, label: 'Mes Projets' },
  { to: '/dashboard/nouveau-projet', icon: FolderPlus, label: 'Nouveau Projet' },
  { to: '/dashboard/reservations', icon: Calendar, label: 'Réservations' },
  { to: '/dashboard/reseau', icon: Users, label: 'Réseau CRE' },
  { to: '/dashboard/ateliers', icon: GraduationCap, label: 'Ateliers & Formations' },
  { to: '/dashboard/kpi', icon: TrendingUp, label: 'Suivi KPIs' },
  { to: '/dashboard/profil', icon: User, label: 'Mon Profil' },
];

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Vue d\'ensemble', end: true },
  { to: '/admin/projets', icon: FolderOpen, label: 'Gestion Projets' },
  { to: '/admin/campagnes', icon: Megaphone, label: 'Appels à Projets' },
  { to: '/admin/reservations', icon: Calendar, label: 'Réservations' },
];

const investorLinks = [
  { to: '/investisseur', icon: Briefcase, label: 'Portail Investisseur', end: true },
];

export default function DashboardLayout({ isAdmin, isInvestor }) {
  const { user } = useAuth();
  const location = useLocation();

  const links = isAdmin ? adminLinks : isInvestor ? investorLinks : memberLinks;
  const title = isAdmin ? 'Administration' : isInvestor ? 'Portail Investisseur' : 'Espace Membre';

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-title">{title}</div>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <link.icon size={18} className="sidebar-icon" />
            <span>{link.label}</span>
          </NavLink>
        ))}

        {/* Admin quick switch */}
        {user?.role === 'admin' && !isAdmin && (
          <>
            <div className="sidebar-title" style={{ marginTop: 'auto' }}>Administration</div>
            <NavLink to="/admin" className="sidebar-link" style={{ color: 'var(--ocean-blue)' }}>
              <Shield size={18} className="sidebar-icon" />
              <span>Panel Admin</span>
            </NavLink>
          </>
        )}
        {isAdmin && (
          <>
            <div className="sidebar-title" style={{ marginTop: 'auto' }}>Retour</div>
            <NavLink to="/dashboard" className="sidebar-link">
              <LayoutDashboard size={18} className="sidebar-icon" />
              <span>Espace Membre</span>
            </NavLink>
          </>
        )}
      </aside>

      <main className="dashboard-main">
        <div className="page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
