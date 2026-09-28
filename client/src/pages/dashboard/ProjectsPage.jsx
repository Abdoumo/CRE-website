import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../../api.js';
import { FolderPlus, Search, Eye } from 'lucide-react';

const statusLabels = {
  brouillon: 'Brouillon', soumis: 'Soumis', en_validation: 'En validation',
  accepte: 'Accepté', rejete: 'Rejeté', archive: 'Archivé',
};

const typeLabels = {
  machine_physique: 'Machine Physique', service_digital: 'Service Digital',
  application: 'Application', recherche: 'Recherche',
};

export default function ProjectsPage() {
  const [data, setData] = useState({ projects: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    projectsAPI.list({ search, status: statusFilter || undefined, limit: 50 })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, statusFilter]);

  return (
    <div>
      <div className="dashboard-header flex-between">
        <div>
          <h1>Mes Projets</h1>
          <p>{data.total} projet(s) au total</p>
        </div>
        <Link to="/dashboard/nouveau-projet" className="btn btn-primary">
          <FolderPlus size={16} /> Nouveau Projet
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-md mb-lg" style={{ flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} id="project-search" />
        </div>
        <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ width: 'auto', minWidth: 160 }} id="project-filter-status">
          <option value="">Tous les statuts</option>
          {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner" style={{ width: 40, height: 40 }}></div></div>
      ) : data.projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><FolderPlus size={32} /></div>
          <h3>Aucun projet</h3>
          <p className="text-muted mb-md">Commencez par soumettre votre premier projet</p>
          <Link to="/dashboard/nouveau-projet" className="btn btn-primary">
            <FolderPlus size={16} /> Créer un projet
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <table className="data-table" style={{ boxShadow: 'none' }}>
            <thead>
              <tr>
                <th>Titre</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Budget</th>
                <th>Soumis le</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.projects.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)', maxWidth: 250 }} className="truncate">{p.title}</td>
                  <td><span className="badge badge-default">{typeLabels[p.projectType] || p.projectType}</span></td>
                  <td><span className={`badge status-${p.status}`}>{statusLabels[p.status]}</span></td>
                  <td className="text-muted">{p.budgetEstimate ? `${Number(p.budgetEstimate).toLocaleString()} DZD` : '-'}</td>
                  <td className="text-muted text-sm">{p.submittedAt ? new Date(p.submittedAt).toLocaleDateString('fr-FR') : '-'}</td>
                  <td><button className="btn btn-ghost btn-sm"><Eye size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
