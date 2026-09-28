import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Footer from '../components/Footer.jsx';
import pagesContent from '../data/pagesContent.json';

export default function GenericPage() {
  const { slug } = useParams();
  
  // Format slug to look like a title: "chercheurs-permanents" -> "Chercheurs Permanents"
  const title = slug 
    ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Page';

  return (
    <div>
      <div style={{ background: 'var(--bg-secondary)', padding: '60px 0 40px', borderBottom: '1px solid rgba(45,106,79,0.06)' }}>
        <div className="container">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 24, fontWeight: 500 }}>
            <ArrowLeft size={18} /> Retour à l'accueil
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--emerald)', marginBottom: 16, fontSize: 14, fontWeight: 600 }}>
            <BookOpen size={16} /> Information
          </div>
          <h1 style={{ fontSize: '2.5rem', lineHeight: 1.3, marginBottom: 24, maxWidth: 900 }}>
            {title}
          </h1>
        </div>
      </div>
      
      <div className="container" style={{ padding: '80px 0 120px' }}>
        {pagesContent[slug] ? (
          <div style={{ 
            maxWidth: 900, 
            margin: '0 auto', 
            background: 'var(--bg-card)', 
            padding: '48px', 
            borderRadius: 'var(--radius-lg)', 
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid rgba(45, 106, 79, 0.06)'
          }}>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              {pagesContent[slug]}
            </div>
          </div>
        ) : (
          <div style={{ 
            maxWidth: 800, 
            margin: '0 auto', 
            background: 'var(--bg-card)', 
            padding: '48px', 
            borderRadius: 'var(--radius-lg)', 
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid rgba(45, 106, 79, 0.06)',
            textAlign: 'center'
          }}>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: 16 }}>En construction</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Le contenu de la page <strong>{title}</strong> est en cours de migration depuis l'ancien site. 
              Il sera disponible très prochainement avec notre nouvelle interface.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
