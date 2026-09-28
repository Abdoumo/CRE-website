import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { projectsAPI, bookingsAPI } from '../../api.js';
import {
  FolderOpen, FolderPlus, Calendar, TrendingUp,
  ArrowRight, Clock, CheckCircle
} from 'lucide-react';

const roleLabels = {
  startup: 'Startup',
  chercheur: 'Chercheur',
  etudiant: 'Étudiant Entrepreneur',
  partenaire: 'Partenaire Industriel',
  admin: 'Administrateur',
};

export default function DashboardHome() {
  const { user } = useAuth();
  const [projects, setProjects] = useState({ projects: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsAPI.list({ limit: 5 })
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusLabels = {
    brouillon: 'Brouillon',
    soumis: 'Soumis',
    en_validation: 'En validation',
    accepte: 'Accepté',
    rejete: 'Rejeté',
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Bonjour, {user?.firstName} 👋</h1>
        <p>Bienvenue sur votre espace {roleLabels[user?.role] || 'membre'} CRE Annaba</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="stat-card">
          <div className="stat-icon green"><FolderOpen size={22} /></div>
          <div>
            <div className="stat-value">{projects.total}</div>
            <div className="stat-label">Projets</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><Clock size={22} /></div>
          <div>
            <div className="stat-value">
              {projects.projects?.filter(p => p.status === 'en_validation').length || 0}
            </div>
            <div className="stat-label">En validation</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><CheckCircle size={22} /></div>
          <div>
            <div className="stat-value">
              {projects.projects?.filter(p => p.status === 'accepte').length || 0}
            </div>
            <div className="stat-label">Acceptés</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><TrendingUp size={22} /></div>
          <div>
            <div className="stat-value">--</div>
            <div className="stat-label">KPIs ce mois</div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        <Link to="/dashboard/nouveau-projet" className="card card-highlight" style={{
          display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 'var(--radius-md)',
            background: '#dcfce7', color: '#166534',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <FolderPlus size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: 15, marginBottom: 2 }}>Soumettre un Nouveau Projet</h4>
            <p style={{ fontSize: 13, margin: 0 }}>Remplissez le formulaire pour soumettre votre projet</p>
          </div>
          <ArrowRight size={18} style={{ color: 'var(--text-muted)' }} />
        </Link>

        <Link to="/dashboard/reservations" className="card card-highlight" style={{
          display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none',
          borderLeftColor: 'var(--ocean-light)',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 'var(--radius-md)',
            background: '#dbeafe', color: '#1e40af',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Calendar size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: 15, marginBottom: 2 }}>Réserver une Ressource</h4>
            <p style={{ fontSize: 13, margin: 0 }}>Imprimante 3D, CNC, salles de réunion...</p>
          </div>
          <ArrowRight size={18} style={{ color: 'var(--text-muted)' }} />
        </Link>
      </div>

      {/* Recent projects */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid rgba(45,106,79,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <h4 style={{ fontSize: 15 }}>Projets Récents</h4>
          <Link to="/dashboard/projets" className="btn btn-ghost btn-sm">
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="flex-center" style={{ padding: 40 }}>
            <div className="spinner"></div>
          </div>
        ) : projects.projects?.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px 20px' }}>
            <p className="text-muted">Aucun projet pour le moment</p>
            <Link to="/dashboard/nouveau-projet" className="btn btn-primary btn-sm mt-md">
              <FolderPlus size={14} /> Créer un projet
            </Link>
          </div>
        ) : (
          <table className="data-table" style={{ boxShadow: 'none' }}>
            <thead>
              <tr>
                <th>Projet</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {projects.projects.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{p.title}</td>
                  <td><span className="badge badge-default">{p.projectType?.replace('_', ' ')}</span></td>
                  <td><span className={`badge status-${p.status}`}>{statusLabels[p.status] || p.status}</span></td>
                  <td className="text-muted text-sm">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString('fr-FR') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
