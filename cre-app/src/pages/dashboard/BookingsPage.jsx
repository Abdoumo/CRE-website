import { useState, useEffect } from 'react';
import { bookingsAPI } from '../../api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { Calendar, Clock, MapPin, Plus, X, Printer, Wrench, Users as UsersIcon, Monitor } from 'lucide-react';

const categoryIcons = {
  imprimante_3d: Printer,
  cnc: Wrench,
  salle_reunion: UsersIcon,
  espace_travail: Monitor,
};

const categoryLabels = {
  imprimante_3d: 'Imprimante 3D',
  cnc: 'Machine CNC',
  salle_reunion: 'Salle de Réunion',
  espace_travail: 'Espace de Travail',
};

export default function BookingsPage() {
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [bookForm, setBookForm] = useState({ startTime: '', endTime: '', purpose: '' });
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    Promise.all([
      bookingsAPI.getResources(),
      bookingsAPI.list(),
    ]).then(([res, bk]) => {
      setResources(res);
      setBookings(bk);
    }).catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await bookingsAPI.create({
        resourceId: selectedResource.id,
        ...bookForm,
      });
      toast.success('Réservation confirmée ! ✅');
      setShowModal(false);
      setBookForm({ startTime: '', endTime: '', purpose: '' });
      // Refresh
      const bk = await bookingsAPI.list();
      setBookings(bk);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await bookingsAPI.cancel(id);
      toast.success('Réservation annulée');
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" style={{ width: 40, height: 40 }}></div></div>;

  return (
    <div>
      <div className="dashboard-header">
        <h1>Réservation de Ressources</h1>
        <p>Réservez les équipements et espaces disponibles au CRE</p>
      </div>

      {/* Resources grid */}
      <div className="grid grid-3" style={{ marginBottom: 'var(--space-xl)' }}>
        {resources.map(resource => {
          const Icon = categoryIcons[resource.category] || Monitor;
          return (
            <div key={resource.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-md)',
                  background: '#dbeafe', color: '#1e40af',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={22} />
                </div>
                <span className="badge badge-success">Disponible</span>
              </div>
              <h4 style={{ marginBottom: 4 }}>{resource.name}</h4>
              <p style={{ fontSize: 13, marginBottom: 4 }}>{resource.description}</p>
              <div className="flex gap-sm mt-sm" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                <MapPin size={12} /> {resource.location}
                {resource.capacity && <><UsersIcon size={12} /> {resource.capacity} places</>}
              </div>
              <button
                className="btn btn-primary btn-sm w-full mt-md"
                onClick={() => { setSelectedResource(resource); setShowModal(true); }}
                id={`book-${resource.id}`}
              >
                <Plus size={14} /> Réserver
              </button>
            </div>
          );
        })}
      </div>

      {/* Current bookings */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid rgba(45,106,79,0.06)',
        }}>
          <h4 style={{ fontSize: 15 }}>Mes Réservations</h4>
        </div>
        {bookings.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px 20px' }}>
            <p className="text-muted">Aucune réservation active</p>
          </div>
        ) : (
          <table className="data-table" style={{ boxShadow: 'none' }}>
            <thead>
              <tr>
                <th>Ressource</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Objet</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 500 }}>{b.resource_name}</td>
                  <td className="text-sm">{new Date(b.start_time).toLocaleString('fr-FR')}</td>
                  <td className="text-sm">{new Date(b.end_time).toLocaleString('fr-FR')}</td>
                  <td className="text-muted">{b.purpose || '-'}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm text-danger" onClick={() => handleCancel(b.id)}>
                      <X size={14} /> Annuler
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Booking modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Réserver : {selectedResource?.name}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleBook}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Date & heure de début *</label>
                  <input type="datetime-local" className="form-input" required
                    value={bookForm.startTime} onChange={e => setBookForm(prev => ({ ...prev, startTime: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Date & heure de fin *</label>
                  <input type="datetime-local" className="form-input" required
                    value={bookForm.endTime} onChange={e => setBookForm(prev => ({ ...prev, endTime: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Objet de la réservation</label>
                  <input className="form-input" placeholder="Ex: Test prototype, réunion d'équipe..."
                    value={bookForm.purpose} onChange={e => setBookForm(prev => ({ ...prev, purpose: e.target.value }))} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? <div className="spinner" style={{ width: 18, height: 18 }}></div> : 'Confirmer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
