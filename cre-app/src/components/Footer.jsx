import { Leaf, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <Leaf size={24} style={{ color: 'var(--emerald-light)' }} />
              CRE Annaba
            </div>
            <p>
              Centre de Recherche en Environnement d'Annaba. 
              Nous accompagnons les startups, chercheurs et étudiants entrepreneurs 
              dans le développement de solutions innovantes pour l'environnement.
            </p>
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
                <MapPin size={14} /> Annaba, Algérie
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
                <Mail size={14} /> contact@cre-annaba.dz
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
                <Phone size={14} /> +213 38 XX XX XX
              </div>
            </div>
          </div>

          <div>
            <h4>Plateforme</h4>
            <ul className="footer-links">
              <li><Link to="/vitrine">Vitrine Projets</Link></li>
              <li><Link to="/inscription">Rejoindre CRE</Link></li>
              <li><Link to="/connexion">Espace Membre</Link></li>
              <li><a href="/#services">Nos Services</a></li>
            </ul>
          </div>

          <div>
            <h4>Ressources</h4>
            <ul className="footer-links">
              <li><a href="#">Guide Incubation</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Appels à Projets</a></li>
              <li><a href="#">Bootcamps</a></li>
            </ul>
          </div>

          <div>
            <h4>Légal</h4>
            <ul className="footer-links">
              <li><a href="#">Mentions Légales</a></li>
              <li><a href="#">Politique de Confidentialité</a></li>
              <li><a href="#">CGU</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} CRE Annaba. Tous droits réservés.</span>
        </div>
      </div>
    </footer>
  );
}
