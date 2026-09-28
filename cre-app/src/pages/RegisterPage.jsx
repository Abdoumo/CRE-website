import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Leaf, Rocket, Microscope, GraduationCap, Handshake } from 'lucide-react';

const roles = [
  { value: 'startup', label: 'Startup', icon: Rocket, desc: 'Je porte un projet entrepreneurial' },
  { value: 'chercheur', label: 'Chercheur', icon: Microscope, desc: 'Je mène des travaux de recherche' },
  { value: 'etudiant', label: 'Étudiant Entrepreneur', icon: GraduationCap, desc: 'Je suis étudiant avec un projet' },
  { value: 'partenaire', label: 'Partenaire Industriel', icon: Handshake, desc: 'Je représente une entreprise partenaire' },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: '', firstName: '', lastName: '', email: '', password: '', phone: '', organization: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    setLoading(true);
    try {
      await register(formData);
      toast.success('Bienvenue chez CRE Annaba ! 🌿');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-xl)',
      background: 'linear-gradient(135deg, #f8faf8 0%, #ecfdf5 50%, #f0fdf4 100%)',
    }}>
      <div className="card page-enter" style={{ maxWidth: 540, width: '100%', padding: 40 }}>
        <div className="flex-center flex-col" style={{ marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--forest-green), var(--emerald))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', marginBottom: 16,
          }}>
            <Leaf size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Rejoindre CRE Annaba</h2>
          <p className="text-muted" style={{ fontSize: 14 }}>
            Étape {step}/2 — {step === 1 ? 'Choisissez votre profil' : 'Complétez vos informations'}
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {[1, 2].map(s => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: s <= step ? 'var(--emerald)' : 'rgba(45,106,79,0.1)',
              transition: 'all 300ms ease',
            }} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {roles.map(role => (
                <button
                  key={role.value}
                  type="button"
                  id={`role-${role.value}`}
                  onClick={() => update('role', role.value)}
                  style={{
                    padding: 20, textAlign: 'center',
                    border: `2px solid ${formData.role === role.value ? 'var(--emerald)' : 'rgba(45,106,79,0.1)'}`,
                    borderRadius: 'var(--radius-md)',
                    background: formData.role === role.value ? 'var(--emerald-glow)' : 'white',
                    cursor: 'pointer', transition: 'all 200ms ease',
                  }}
                >
                  <role.icon size={28} style={{
                    color: formData.role === role.value ? 'var(--emerald)' : 'var(--text-muted)',
                    margin: '0 auto 8px',
                  }} />
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{role.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{role.desc}</div>
                </button>
              ))}
            </div>
            <button
              className="btn btn-primary w-full btn-lg mt-lg"
              disabled={!formData.role}
              onClick={() => setStep(2)}
              id="register-next"
            >
              Continuer
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Prénom *</label>
                <input className="form-input" value={formData.firstName}
                  onChange={e => update('firstName', e.target.value)} required id="reg-firstname" />
              </div>
              <div className="form-group">
                <label className="form-label">Nom *</label>
                <input className="form-input" value={formData.lastName}
                  onChange={e => update('lastName', e.target.value)} required id="reg-lastname" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input type="email" className="form-input" placeholder="votre@email.dz"
                value={formData.email} onChange={e => update('email', e.target.value)} required id="reg-email" />
            </div>
            <div className="form-group">
              <label className="form-label">Mot de passe *</label>
              <input type="password" className="form-input" placeholder="Minimum 6 caractères"
                value={formData.password} onChange={e => update('password', e.target.value)} required id="reg-password" />
            </div>
            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input type="tel" className="form-input" placeholder="+213 XX XX XX XX"
                value={formData.phone} onChange={e => update('phone', e.target.value)} id="reg-phone" />
            </div>
            <div className="form-group">
              <label className="form-label">Organisation / Université</label>
              <input className="form-input" placeholder="Nom de votre structure"
                value={formData.organization} onChange={e => update('organization', e.target.value)} id="reg-org" />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>
                Retour
              </button>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="register-submit" style={{ flex: 2 }}>
                {loading ? <div className="spinner" style={{ width: 20, height: 20 }}></div> : "Créer Mon Compte 🌿"}
              </button>
            </div>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-muted)' }}>
          Déjà inscrit ?{' '}
          <Link to="/connexion" style={{ fontWeight: 600 }}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
