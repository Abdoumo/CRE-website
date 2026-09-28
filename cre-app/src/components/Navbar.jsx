import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Leaf, Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isDashboard = location.pathname.startsWith('/dashboard') || 
                      location.pathname.startsWith('/admin') ||
                      location.pathname.startsWith('/investisseur');

  return (
    <nav className="navbar" id="main-nav">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <Leaf size={22} />
          </div>
          <div>
            <span>CRE</span>
            <span style={{ color: 'var(--emerald)', marginLeft: 4 }}>Annaba</span>
          </div>
        </Link>

        {!isDashboard && (
          <ul className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Accueil</Link></li>
            <li><Link to="/vitrine" className={location.pathname === '/vitrine' ? 'active' : ''}>Vitrine</Link></li>
            <li><a href="/#services">Services</a></li>
            <li><a href="/#apropos">À propos</a></li>
            <li><a href="/#contact">Contact</a></li>
          </ul>
        )}

        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost btn-sm">
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
              <div className="avatar avatar-sm" title={`${user.firstName} ${user.lastName}`}>
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <button className="btn btn-ghost btn-icon" onClick={logout} title="Déconnexion">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/connexion" className="btn btn-ghost btn-sm">Connexion</Link>
              <Link to="/inscription" className="btn btn-primary btn-sm">
                <span>S'inscrire</span>
              </Link>
            </>
          )}
          <button className="navbar-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
