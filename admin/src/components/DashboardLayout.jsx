import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LayoutDashboard, FolderPlus, FolderOpen, Calendar,
  Users, GraduationCap, User, BarChart3, Shield,
  Megaphone, TrendingUp, Briefcase, Newspaper
} from 'lucide-react';


const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Vue d\'ensemble', end: true },
  { to: '/admin/projets', icon: FolderOpen, label: 'Gestion Projets' },
  { to: '/admin/campagnes', icon: Megaphone, label: 'Appels à Projets' },
  { to: '/admin/reservations', icon: Calendar, label: 'Réservations' },
  { to: '/admin/blogs', icon: Newspaper, label: 'Blogs & Actualités' },
];


export default function DashboardLayout() {
  const { user } = useAuth();
  const location = useLocation();

  const links = adminLinks;
  const title = 'Administration';

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


      </aside>

      <main className="dashboard-main">
        <div className="page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
