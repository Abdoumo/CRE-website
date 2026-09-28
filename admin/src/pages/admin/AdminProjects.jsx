import { useState, useEffect } from 'react';
import { projectsAPI, membersAPI } from '../../api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { X, Eye, CheckCircle, XCircle, Clock, Search } from 'lucide-react';

const statusLabels = {
  brouillon: 'Brouillon', soumis: 'Soumis', en_validation: 'En validation',
  accepte: 'Accepté', rejete: 'Rejeté', archive: 'Archivé',
};

const typeLabels = {
  machine_physique: 'Machine Physique', service_digital: 'Service Digital',
  application: 'Application', recherche: 'Recherche',
};

export default function AdminProjects() {
  const [data, setData] = useState({ projects: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [encadrant, setEncadrant] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [updating, setUpdating] = useState(false);
  const toast = useToast();

  const fetchProjects = () => {
    setLoading(true);
    projectsAPI.list({ search, status: statusFilter || undefined, limit: 100 })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
    membersAPI.list({ limit: 200 }).then(res => {
      // Filter for potential mentors: chercheurs, admin, partenaires
      const staff = (res.members || []).filter(m => ['chercheur', 'admin', 'partenaire'].includes(m.role));
      setStaffList(staff);
    }).catch(console.error);
  }, [search, statusFilter]);

  const handleStatusUpdate = async (projectId, newStatus) => {
    setUpdating(true);
    try {
      await projectsAPI.updateStatus(projectId, newStatus, reviewNotes, encadrant);
      toast.success(`Projet ${statusLabels[newStatus].toLowerCase()} !`);
      setSelectedProject(null);
      setReviewNotes('');
      setEncadrant('');
      fetchProjects();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Gestion des Projets</h1>
        <p>{data.total} projet(s) au total</p>
      </div>

      <div className="flex gap-md mb-lg" style={{ flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input placeholder="Rechercher un projet..." value={search}
            onChange={e => setSearch(e.target.value)} id="admin-project-search" />
        </div>
        <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ width: 'auto', minWidth: 160 }}>
          <option value="">Tous les statuts</option>
          {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner" style={{ width: 40, height: 40 }}></div></div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <table className="data-table" style={{ boxShadow: 'none' }}>
            <thead>
              <tr>
                <th>Titre</th>
                <th>Porteur</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.projects.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)', maxWidth: 200 }} className="truncate">{p.title}</td>
                  <td>
                    <div style={{ fontSize: 13 }}>{p.user?.firstName} {p.user?.lastName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.user?.email}</div>
                  </td>
                  <td><span className="badge badge-default">{typeLabels[p.projectType] || p.projectType}</span></td>
                  <td><span className={`badge status-${p.status}`}>{statusLabels[p.status]}</span></td>
                  <td className="text-muted text-sm">
                    {p.submittedAt ? new Date(p.submittedAt).toLocaleDateString('fr-FR') : '-'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelectedProject(p)} title="Examiner">
                        <Eye size={14} />
                      </button>
                      {(p.status === 'soumis' || p.status === 'en_validation') && (
                        <>
                          <button className="btn btn-ghost btn-sm text-success"
                            onClick={() => handleStatusUpdate(p.id, 'accepte')} title="Accepter">
                            <CheckCircle size={14} />
                          </button>
                          <button className="btn btn-ghost btn-sm text-danger"
                            onClick={() => handleStatusUpdate(p.id, 'rejete')} title="Rejeter">
                            <XCircle size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Project detail modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
            <div className="modal-header">
              <h3>{selectedProject.title}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelectedProject(null)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="grid grid-2 mb-md">
                <div>
                  <div className="text-sm text-muted">Porteur</div>
                  <div style={{ fontWeight: 500 }}>{selectedProject.user?.firstName} {selectedProject.user?.lastName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted">Organisation</div>
                  <div>{selectedProject.user?.organization || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted">Type</div>
                  <div>{typeLabels[selectedProject.projectType]}</div>
                </div>
                <div>
                  <div className="text-sm text-muted">Budget</div>
                  <div>{selectedProject.budgetEstimate ? `${Number(selectedProject.budgetEstimate).toLocaleString()} DZD` : '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted">Encadrant actuel</div>
                  <div>{selectedProject.encadrant || 'Aucun'}</div>
                </div>
              </div>

              <div className="mb-md">
                <div className="text-sm text-muted mb-sm">Description</div>
                <p style={{ fontSize: 14, whiteSpace: 'pre-line' }}>{selectedProject.description}</p>
              </div>

              <div className="form-group">
                <label className="form-label">Notes de l'évaluateur</label>
                <textarea className="form-textarea" placeholder="Commentaires sur ce projet..."
                  value={reviewNotes} onChange={e => setReviewNotes(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Encadrant (Optionnel)</label>
                <select className="form-select" value={encadrant} onChange={e => setEncadrant(e.target.value)}>
                  <option value="">-- Aucun encadrant --</option>
                  {staffList.map(s => (
                    <option key={s.id} value={`${s.firstName} ${s.lastName}`}>
                      {s.firstName} {s.lastName} ({s.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger btn-sm" disabled={updating}
                onClick={() => handleStatusUpdate(selectedProject.id, 'rejete')}>
                <XCircle size={14} /> Rejeter
              </button>
              <button className="btn btn-ghost btn-sm" disabled={updating}
                onClick={() => handleStatusUpdate(selectedProject.id, 'en_validation')}>
                <Clock size={14} /> En validation
              </button>
              <button className="btn btn-primary btn-sm" disabled={updating}
                onClick={() => handleStatusUpdate(selectedProject.id, 'accepte')}>
                {updating ? <div className="spinner" style={{ width: 16, height: 16 }}></div> : <><CheckCircle size={14} /> Accepter</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
