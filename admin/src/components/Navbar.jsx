import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Leaf, Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isDashboard = true;

  return (
    <nav className="navbar" id="main-nav">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <img src="/logomobile.png" alt="CRE Annaba Logo" style={{ height: 40, width: 'auto' }} />
        </Link>


        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/admin" className="btn btn-ghost btn-sm">
                <LayoutDashboard size={16} />
                <span>Panel Admin</span>
              </Link>
              <div className="avatar avatar-sm" title={`${user.firstName} ${user.lastName}`}>
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <button className="btn btn-ghost btn-icon" onClick={logout} title="Déconnexion">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link to="/connexion" className="btn btn-ghost btn-sm">Connexion</Link>
          )}
          <button className="navbar-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
