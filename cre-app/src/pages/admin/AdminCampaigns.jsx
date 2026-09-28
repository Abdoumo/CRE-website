import { useState, useEffect } from 'react';
import { campaignsAPI } from '../../api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { Megaphone, X } from 'lucide-react';

const statusLabels = {
  brouillon: 'Brouillon', ouverte: 'Ouverte', fermee: 'Fermée', evaluee: 'Évaluée',
};

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: '', slug: '', description: '', theme: '', requirements: '', deadline: '',
  });
  const [creating, setCreating] = useState(false);
  const toast = useToast();

  useEffect(() => {
    campaignsAPI.list()
      .then(setCampaigns)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const campaign = await campaignsAPI.create(form);
      setCampaigns(prev => [campaign, ...prev]);
      toast.success('Appel à projets créé !');
      setShowCreate(false);
      setForm({ title: '', slug: '', description: '', theme: '', requirements: '', deadline: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" style={{ width: 40, height: 40 }}></div></div>;

  return (
    <div>
      <div className="dashboard-header flex-between">
        <div>
          <h1>Appels à Projets</h1>
          <p>Gérez les campagnes thématiques d'appel à projets</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <span className="icon-replacement icon-plus"></span> Nouvel Appel
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Megaphone size={32} /></div>
          <h3>Aucun appel à projets</h3>
          <p className="text-muted">Créez votre premier appel à projets thématique</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {campaigns.map(c => (
            <div key={c.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className={`badge status-${c.status === 'ouverte' ? 'accepte' : c.status === 'fermee' ? 'rejete' : 'soumis'}`}>
                  {statusLabels[c.status] || c.status}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  <span className="icon-replacement icon-calendar"></span>
                  Deadline: {new Date(c.deadline).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <h4 style={{ marginBottom: 4 }}>{c.title}</h4>
              {c.theme && <span className="badge badge-info" style={{ marginBottom: 8 }}>{c.theme}</span>}
              <p style={{ fontSize: 13 }}>{c.description?.substring(0, 150)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nouvel Appel à Projets</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowCreate(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Titre *</label>
                  <input className="form-input" placeholder="Ex: Challenge GreenTech 2026"
                    value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Slug (URL)</label>
                  <input className="form-input" placeholder="challenge-greentech-2026"
                    value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Thème</label>
                  <input className="form-input" placeholder="Ex: GreenTech 2026"
                    value={form.theme} onChange={e => setForm(p => ({ ...p, theme: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" placeholder="Décrivez l'appel à projets..."
                    value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Prérequis</label>
                  <textarea className="form-textarea" placeholder="Critères d'éligibilité..."
                    value={form.requirements} onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))}
                    style={{ minHeight: 80 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Date limite *</label>
                  <input type="datetime-local" className="form-input"
                    value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? <div className="spinner" style={{ width: 18, height: 18 }}></div> : 'Créer l\'Appel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
