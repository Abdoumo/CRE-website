import { useState, useEffect } from 'react';
import { membersAPI } from '../../api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { Search, Send, Mail, X } from 'lucide-react';

const roleLabels = {
  startup: 'Startup', chercheur: 'Chercheur', etudiant: 'Étudiant',
  partenaire: 'Partenaire', admin: 'Admin',
};

const roleColors = {
  startup: { bg: '#dcfce7', color: '#166534' },
  chercheur: { bg: '#dbeafe', color: '#1e40af' },
  etudiant: { bg: '#fef3c7', color: '#92400e' },
  partenaire: { bg: '#ede9fe', color: '#5b21b6' },
};

export default function MembersPage() {
  const [data, setData] = useState({ members: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [msgForm, setMsgForm] = useState({ subject: '', body: '' });
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    membersAPI.list({ search, role: roleFilter || undefined })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, roleFilter]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await membersAPI.sendMessage({
        receiverId: selectedMember.id,
        ...msgForm,
      });
      toast.success('Message envoyé ! 📬');
      setShowMessageModal(false);
      setMsgForm({ subject: '', body: '' });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Réseau CRE</h1>
        <p>Trouvez des collaborateurs, mentors et partenaires au sein de l'écosystème CRE</p>
      </div>

      <div className="flex gap-md mb-lg" style={{ flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input placeholder="Rechercher par nom, compétence, organisation..."
            value={search} onChange={e => setSearch(e.target.value)} id="member-search" />
        </div>
        <select className="form-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          style={{ width: 'auto', minWidth: 150 }}>
          <option value="">Tous les profils</option>
          {Object.entries(roleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner" style={{ width: 40, height: 40 }}></div></div>
      ) : data.members?.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Search size={32} /></div>
          <h3>Aucun membre trouvé</h3>
          <p className="text-muted">Essayez d'élargir vos critères de recherche</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {data.members.map(member => {
            const colors = roleColors[member.role] || roleColors.startup;
            return (
              <div key={member.id} className="card">
                <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
                  <div className="avatar avatar-lg">
                    {member.firstName?.[0]}{member.lastName?.[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 15, marginBottom: 2 }}>{member.firstName} {member.lastName}</h4>
                    <span className="badge" style={{ background: colors.bg, color: colors.color }}>
                      {roleLabels[member.role]}
                    </span>
                  </div>
                </div>
                {member.organization && (
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>{member.organization}</p>
                )}
                {member.bio && (
                  <p style={{ fontSize: 13, marginBottom: 8 }}>
                    {member.bio.substring(0, 100)}{member.bio.length > 100 ? '...' : ''}
                  </p>
                )}
                {member.skills?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                    {member.skills.slice(0, 4).map((skill, i) => (
                      <span key={i} className="badge badge-default" style={{ fontSize: 11 }}>{skill}</span>
                    ))}
                    {member.skills.length > 4 && (
                      <span className="badge badge-default" style={{ fontSize: 11 }}>+{member.skills.length - 4}</span>
                    )}
                  </div>
                )}
                <button
                  className="btn btn-secondary btn-sm w-full"
                  onClick={() => { setSelectedMember(member); setShowMessageModal(true); }}
                >
                  <Mail size={14} /> Contacter
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="modal-overlay" onClick={() => setShowMessageModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Contacter {selectedMember?.firstName} {selectedMember?.lastName}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowMessageModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSendMessage}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Objet</label>
                  <input className="form-input" placeholder="Objet du message"
                    value={msgForm.subject} onChange={e => setMsgForm(p => ({ ...p, subject: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea className="form-textarea" placeholder="Votre message..."
                    value={msgForm.body} onChange={e => setMsgForm(p => ({ ...p, body: e.target.value }))} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowMessageModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary"><Send size={14} /> Envoyer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
