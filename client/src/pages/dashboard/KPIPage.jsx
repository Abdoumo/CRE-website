import { useState, useEffect } from 'react';
import { kpiAPI, projectsAPI } from '../../api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { Save } from 'lucide-react';

export default function KPIPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [kpiData, setKpiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const [form, setForm] = useState({
    reportMonth: new Date().toISOString().slice(0, 7) + '-01',
    revenue: '', expenses: '', hires: '', fundsRaised: '', clientsAcquired: '', notes: '',
  });

  useEffect(() => {
    projectsAPI.list({ limit: 100 })
      .then(data => {
        const accepted = data.projects?.filter(p => p.status === 'accepte') || data.projects || [];
        setProjects(accepted);
        if (accepted.length > 0) setSelectedProject(accepted[0].id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedProject) {
      kpiAPI.getForProject(selectedProject)
        .then(setKpiData)
        .catch(console.error);
    }
  }, [selectedProject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await kpiAPI.submit({ projectId: selectedProject, ...form });
      toast.success('KPIs enregistrés !');
      const updated = await kpiAPI.getForProject(selectedProject);
      setKpiData(updated);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" style={{ width: 40, height: 40 }}></div></div>;

  return (
    <div>
      <div className="dashboard-header">
        <h1>Suivi des KPIs</h1>
        <p>Rapportez vos métriques mensuelles pour suivre la progression de votre projet</p>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><span className="icon-replacement icon-trendingup"></span></div>
          <h3>Aucun projet accepté</h3>
          <p className="text-muted">Le suivi KPI est disponible pour les projets acceptés</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Input form */}
          <div className="card">
            <h3 style={{ marginBottom: 16, fontSize: 16 }}>📊 Saisie Mensuelle</h3>
            <div className="form-group">
              <label className="form-label">Projet</label>
              <select className="form-select" value={selectedProject}
                onChange={e => setSelectedProject(e.target.value)}>
                {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Mois de rapport</label>
                <input type="month" className="form-input"
                  value={form.reportMonth.slice(0, 7)}
                  onChange={e => setForm(p => ({ ...p, reportMonth: e.target.value + '-01' }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Chiffre d'affaires (DZD)</label>
                  <input type="number" className="form-input" placeholder="0"
                    value={form.revenue} onChange={e => setForm(p => ({ ...p, revenue: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Dépenses (DZD)</label>
                  <input type="number" className="form-input" placeholder="0"
                    value={form.expenses} onChange={e => setForm(p => ({ ...p, expenses: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Embauches</label>
                  <input type="number" className="form-input" placeholder="0"
                    value={form.hires} onChange={e => setForm(p => ({ ...p, hires: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Fonds levés (DZD)</label>
                  <input type="number" className="form-input" placeholder="0"
                    value={form.fundsRaised} onChange={e => setForm(p => ({ ...p, fundsRaised: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Clients acquis</label>
                <input type="number" className="form-input" placeholder="0"
                  value={form.clientsAcquired} onChange={e => setForm(p => ({ ...p, clientsAcquired: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-textarea" placeholder="Commentaires sur ce mois..."
                  value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  style={{ minHeight: 80 }} />
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={saving}>
                {saving ? <div className="spinner" style={{ width: 18, height: 18 }}></div> : <><Save size={14} /> Enregistrer</>}
              </button>
            </form>
          </div>

          {/* History */}
          <div className="card" style={{ padding: 0, alignSelf: 'start' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(45,106,79,0.06)' }}>
              <h4 style={{ fontSize: 15 }}>📈 Historique</h4>
            </div>
            {kpiData.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <p className="text-muted">Aucune donnée KPI pour ce projet</p>
              </div>
            ) : (
              <table className="data-table" style={{ boxShadow: 'none' }}>
                <thead>
                  <tr>
                    <th>Mois</th>
                    <th>CA</th>
                    <th>Embauches</th>
                    <th>Fonds</th>
                  </tr>
                </thead>
                <tbody>
                  {kpiData.map(k => (
                    <tr key={k.id}>
                      <td>{new Date(k.report_month).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</td>
                      <td>{Number(k.revenue).toLocaleString()} DZD</td>
                      <td>{k.hires}</td>
                      <td>{Number(k.funds_raised).toLocaleString()} DZD</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
