import { useState, useEffect } from 'react';
import { bookingsAPI } from '../../api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';

const statusLabels = {
  en_attente: 'En attente',
  confirme: 'Confirmé',
  annule: 'Annulé',
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const toast = useToast();

  const fetchBookings = () => {
    setLoading(true);
    // Passing empty params gets all active (not cancelled) or we can tweak API if needed
    // The current GET /api/bookings returns all except annule
    bookingsAPI.list()
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    setUpdating(true);
    try {
      await bookingsAPI.updateStatus(id, status);
      toast.success(`Réservation ${statusLabels[status].toLowerCase()} !`);
      fetchBookings();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" style={{ width: 40, height: 40 }}></div></div>;

  return (
    <div>
      <div className="dashboard-header">
        <h1>Gestion des Réservations</h1>
        <p>Validez ou refusez les demandes de réservation de ressources</p>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Calendar size={32} /></div>
          <h3>Aucune réservation</h3>
          <p className="text-muted">Il n'y a aucune demande de réservation pour le moment</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <table className="data-table" style={{ boxShadow: 'none' }}>
            <thead>
              <tr>
                <th>Ressource</th>
                <th>Membre</th>
                <th>Période</th>
                <th>Objet</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{b.resource_name}</div>
                    <div className="text-sm text-muted">{b.category}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13 }}>{b.first_name} {b.last_name}</div>
                  </td>
                  <td className="text-sm">
                    {new Date(b.start_time).toLocaleString('fr-FR')} <br/>
                    <span className="text-muted">à</span> <br/>
                    {new Date(b.end_time).toLocaleString('fr-FR')}
                  </td>
                  <td className="text-muted text-sm">{b.purpose || '-'}</td>
                  <td>
                    <span className={`badge status-${b.status === 'confirme' ? 'accepte' : b.status === 'en_attente' ? 'soumis' : 'rejete'}`}>
                      {statusLabels[b.status] || b.status}
                    </span>
                  </td>
                  <td>
                    {b.status === 'en_attente' && (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm text-success" disabled={updating}
                          onClick={() => handleStatusUpdate(b.id, 'confirme')} title="Valider">
                          <CheckCircle size={14} />
                        </button>
                        <button className="btn btn-ghost btn-sm text-danger" disabled={updating}
                          onClick={() => handleStatusUpdate(b.id, 'annule')} title="Refuser">
                          <XCircle size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
