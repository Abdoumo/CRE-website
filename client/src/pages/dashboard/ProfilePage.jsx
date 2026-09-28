import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { authAPI } from '../../api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { X, Save } from 'lucide-react';

const roleLabels = {
  startup: 'Startup', chercheur: 'Chercheur', etudiant: 'Étudiant Entrepreneur',
  partenaire: 'Partenaire Industriel', admin: 'Administrateur',
};

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    organization: user?.organization || '',
    bio: user?.bio || '',
    skills: user?.skills || [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const addSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await authAPI.updateProfile(form);
      updateUser(updated);
      toast.success('Profil mis à jour !');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Mon Profil</h1>
        <p>Gérez vos informations personnelles et compétences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
        {/* Profile card */}
        <div className="card" style={{ textAlign: 'center', alignSelf: 'start' }}>
          <div className="avatar avatar-lg" style={{ width: 80, height: 80, fontSize: 28, margin: '0 auto 16px' }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <h3 style={{ fontSize: 18 }}>{user?.firstName} {user?.lastName}</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>{user?.email}</p>
          <span className="badge badge-success">{roleLabels[user?.role]}</span>
          <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
            Membre depuis {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '-'}
          </div>
        </div>

        {/* Edit form */}
        <div className="card">
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Prénom</label>
                <input className="form-input" value={form.firstName}
                  onChange={e => update('firstName', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Nom</label>
                <input className="form-input" value={form.lastName}
                  onChange={e => update('lastName', e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input className="form-input" value={form.phone}
                onChange={e => update('phone', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Organisation / Université</label>
              <input className="form-input" value={form.organization}
                onChange={e => update('organization', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-textarea" placeholder="Décrivez votre parcours et expertise..."
                value={form.bio} onChange={e => update('bio', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Compétences</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {form.skills.map((skill, i) => (
                  <span key={i} className="badge badge-default" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="form-input" placeholder="Ajouter une compétence..."
                  value={newSkill} onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} />
                <button type="button" className="btn btn-secondary" onClick={addSkill}>
                  <span className="icon-replacement icon-plus"></span>
                </button>
              </div>
              <span className="form-hint">Ces compétences apparaissent dans le réseau CRE pour le matchmaking</span>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
              {saving ? <div className="spinner" style={{ width: 20, height: 20 }}></div> : (
                <><Save size={16} /> Enregistrer les Modifications</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
