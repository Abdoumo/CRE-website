import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Leaf, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Bienvenue, ${user.firstName} !`);
      navigate(user.role === 'admin' ? '/admin' : user.role === 'investor' ? '/investisseur' : '/dashboard');
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
      <div className="card page-enter" style={{ maxWidth: 440, width: '100%', padding: 40 }}>
        <div className="flex-center flex-col" style={{ marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--forest-green), var(--emerald))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', marginBottom: 16,
          }}>
            <Leaf size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Connexion</h2>
          <p className="text-muted" style={{ fontSize: 14 }}>Accédez à votre espace CRE Annaba</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }} />
              <input
                type="email"
                className="form-input"
                placeholder="votre@email.dz"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                id="login-email"
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                id="login-password"
                style={{ paddingLeft: 42, paddingRight: 42 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full btn-lg"
            disabled={loading}
            id="login-submit"
            style={{ marginTop: 8 }}
          >
            {loading ? <div className="spinner" style={{ width: 20, height: 20 }}></div> : 'Se Connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-muted)' }}>
          Pas encore de compte ?{' '}
          <Link to="/inscription" style={{ fontWeight: 600 }}>S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}
