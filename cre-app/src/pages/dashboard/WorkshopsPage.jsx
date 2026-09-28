import { useState, useEffect } from 'react';
import { workshopsAPI } from '../../api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { GraduationCap, Monitor } from 'lucide-react';

const categoryLabels = {
  bootcamp: 'Bootcamp',
  mentoring: 'Mentorat',
  webinar: 'Webinaire',
};

const categoryColors = {
  bootcamp: { bg: '#dcfce7', color: '#166534' },
  mentoring: { bg: '#dbeafe', color: '#1e40af' },
  webinar: { bg: '#fef3c7', color: '#92400e' },
};

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const toast = useToast();

  useEffect(() => {
    workshopsAPI.list()
      .then(setWorkshops)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (id) => {
    setEnrolling(id);
    try {
      await workshopsAPI.enroll(id);
      toast.success('Inscription confirmée ! 🎓');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setEnrolling(null);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" style={{ width: 40, height: 40 }}></div></div>;

  return (
    <div>
      <div className="dashboard-header">
        <h1>Ateliers & Formations</h1>
        <p>Bootcamps, mentorat et webinaires pour accélérer votre développement</p>
      </div>

      {workshops.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><GraduationCap size={32} /></div>
          <h3>Aucun atelier programmé</h3>
          <p className="text-muted">De nouveaux ateliers seront bientôt annoncés</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {workshops.map(w => {
            const colors = categoryColors[w.category] || categoryColors.bootcamp;
            const isFull = w.enrolled_count >= w.max_participants;
            return (
              <div key={w.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 'var(--radius-md)',
                    background: colors.bg, color: colors.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <GraduationCap size={22} />
                  </div>
                  <span className="badge" style={{ background: colors.bg, color: colors.color }}>
                    {categoryLabels[w.category] || w.category}
                  </span>
                </div>
                <h4 style={{ marginBottom: 4 }}>{w.title}</h4>
                <p style={{ fontSize: 13, marginBottom: 12 }}>{w.description}</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                  {w.instructor && <div>🎤 {w.instructor}</div>}
                  <div className="flex gap-sm">
                    <span className="icon-replacement icon-calendar"></span>
                    {new Date(w.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="flex gap-sm">
                    {w.is_online ? <Monitor size={13} /> : <span className="icon-replacement icon-mappin"></span>}
                    {w.is_online ? 'En ligne' : w.location}
                  </div>
                  <div className="flex gap-sm">
                    <span className="icon-replacement icon-users"></span>
                    {w.enrolled_count || 0}/{w.max_participants} inscrits
                  </div>
                </div>

                <button
                  className={`btn ${isFull ? 'btn-ghost' : 'btn-primary'} btn-sm w-full`}
                  disabled={isFull || enrolling === w.id}
                  onClick={() => handleEnroll(w.id)}
                >
                  {enrolling === w.id ? <div className="spinner" style={{ width: 16, height: 16 }}></div> :
                    isFull ? 'Complet' : <><span className="icon-replacement icon-checkcircle"></span> S'inscrire</>}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
