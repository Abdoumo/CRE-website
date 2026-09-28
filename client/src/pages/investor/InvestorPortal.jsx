import { useState, useEffect } from 'react';
import { investorAPI } from '../../api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { X } from 'lucide-react';

const typeLabels = {
  machine_physique: 'Machine Physique', service_digital: 'Service Digital',
  application: 'Application', recherche: 'Recherche',
};

export default function InvestorPortal() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [message, setMessage] = useState('');
  const [requesting, setRequesting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    investorAPI.getStartups()
      .then(setStartups)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRequest = async () => {
    setRequesting(true);
    try {
      await investorAPI.requestMeeting({
        startupId: selectedStartup.user_id || selectedStartup.id,
        projectId: selectedStartup.id,
        message,
      });
      toast.success('Demande de rencontre envoyée !');
      setSelectedStartup(null);
      setMessage('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" style={{ width: 40, height: 40 }}></div></div>;

  return (
    <div>
      <div className="dashboard-header">
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 14px', background: '#fef3c7', color: '#92400e',
          borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 600, marginBottom: 12,
        }}>
          <Shield size={14} /> Portail Investisseur - Accès Restreint
        </div>
        <h1>Projets Qualifiés</h1>
        <p>Découvrez les startups incubées au CRE Annaba et leurs performances</p>
      </div>

      {startups.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><span className="icon-replacement icon-briefcase"></span></div>
          <h3>Aucun projet disponible</h3>
          <p className="text-muted">Les projets qualifiés apparaîtront ici</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {startups.map(s => (
            <div key={s.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                <div className="avatar avatar-lg">
                  {s.first_name?.[0]}{s.last_name?.[0]}
                </div>
                <div>
                  <h4 style={{ fontSize: 16, marginBottom: 2 }}>{s.title}</h4>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {s.first_name} {s.last_name} • {s.organization}
                  </div>
                  <span className="badge badge-default" style={{ marginTop: 4 }}>
                    {typeLabels[s.project_type] || s.project_type}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: 13, flex: 1, marginBottom: 16 }}>
                {s.description?.substring(0, 200)}{s.description?.length > 200 ? '...' : ''}
              </p>

              <div className="grid grid-3 mb-md" style={{ gap: 8 }}>
                <div style={{
                  padding: 12, background: 'var(--emerald-glow)', borderRadius: 'var(--radius-sm)', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Marché</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{s.target_market || '-'}</div>
                </div>
                <div style={{
                  padding: 12, background: '#dbeafe', borderRadius: 'var(--radius-sm)', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Budget</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {s.budget_estimate ? `${Number(s.budget_estimate).toLocaleString()} DZD` : '-'}
                  </div>
                </div>
                <div style={{
                  padding: 12, background: '#fef3c7', borderRadius: 'var(--radius-sm)', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Équipe</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{s.team_size} pers.</div>
                </div>
              </div>

              {/* KPI preview if available */}
              {s.kpis && s.kpis.length > 0 && (
                <div style={{ marginBottom: 16, padding: 12, background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--text-muted)' }}>
                    📊 Derniers KPIs
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                    <div><span className="icon-replacement icon-trendingup"></span> CA: {Number(s.kpis[0].revenue || 0).toLocaleString()} DZD</div>
                    <div><span className="icon-replacement icon-users"></span> Embauches: {s.kpis[0].hires || 0}</div>
                  </div>
                </div>
              )}

              <button className="btn btn-primary btn-sm w-full" onClick={() => setSelectedStartup(s)}>
                <span className="icon-replacement icon-mail"></span> Demander une Rencontre
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Request Meeting Modal */}
      {selectedStartup && (
        <div className="modal-overlay" onClick={() => setSelectedStartup(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Demande de Rencontre</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelectedStartup(null)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div style={{
                padding: 16, background: 'var(--emerald-glow)', borderRadius: 'var(--radius-md)', marginBottom: 16,
              }}>
                <div style={{ fontWeight: 600 }}>{selectedStartup.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  {selectedStartup.first_name} {selectedStartup.last_name} • {selectedStartup.organization}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Message (optionnel)</label>
                <textarea className="form-textarea"
                  placeholder="Présentez-vous brièvement et décrivez votre intérêt pour ce projet..."
                  value={message} onChange={e => setMessage(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedStartup(null)}>Annuler</button>
              <button className="btn btn-primary" disabled={requesting} onClick={handleRequest}>
                {requesting ? <div className="spinner" style={{ width: 18, height: 18 }}></div> : 'Envoyer la Demande'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
