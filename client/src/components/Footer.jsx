import { Mail, Phone, MapPin, GraduationCap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand" style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/logomobile.png" alt="CRE Annaba Logo" style={{ height: 48, width: 'auto', filter: 'brightness(0) invert(1)' }} />
            </div>
            <p style={{ lineHeight: 1.6 }}>
              Siège : Alzone 23000, Annaba<br/>
              Adresse Postale : BP 72A Menadia Annaba
            </p>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                <MapPin size={16} style={{ marginTop: 2, flexShrink: 0 }} /> 
                <span>Alzone 23000, Annaba</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                <Phone size={16} style={{ marginTop: 2, flexShrink: 0 }} /> 
                <span>038 59 04 44 / 038 45 10 44</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                <Mail size={16} style={{ marginTop: 2, flexShrink: 0 }} /> 
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <a href="mailto:z.bouslama@cre.dz" style={{ color: 'inherit' }}>z.bouslama@cre.dz (Directrice)</a>
                  <a href="mailto:secretariat@cre.dz" style={{ color: 'inherit' }}>secretariat@cre.dz (Secrétariat)</a>
                  <a href="mailto:secretairegeneral@cre.dz" style={{ color: 'inherit' }}>secretairegeneral@cre.dz (SG)</a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: 20 }}>Liens Utiles</h4>
            <ul className="footer-links">
              <li><Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ChevronRight size={14}/> Accueil</Link></li>
              <li><a href="http://www.mesrs.dz/index.php/fr/accueil/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ChevronRight size={14}/> Ministère (MESRS)</a></li>
              <li><a href="http://www.dgrsdt.dz/fr" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ChevronRight size={14}/> DGRSDT</a></li>
              <li><a href="https://www.anvredet.org.dz/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ChevronRight size={14}/> ANVREDET</a></li>
              <li><a href="https://www.sndl.cerist.dz/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ChevronRight size={14}/> SNDL: Documentation</a></li>
              <li><a href="http://e-services.inapi.org/SITE/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ChevronRight size={14}/> INAPI</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: 20 }}>Rejoignez Nous</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <a href="https://www.facebook.com/CentreDeRechercheEnEnvironnement" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> Facebook
              </a>
              <a href="https://www.youtube.com/channel/UC3F5wJMrcKdzuHPJIBvYFnw?app=desktop" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg> Youtube
              </a>
              <a href="https://www.linkedin.com/company/centre-de-recherche-en-environnement/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> Linkedin
              </a>
              <a href="https://twitter.com/cre_center" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg> Twitter
              </a>
              <a href="https://scholar.google.com/citations?user=1x3AFfUAAAAJ" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14 }}>
                <GraduationCap size={18} /> Google Scholar
              </a>
              <a href="https://instagram.com/centre_recherche_environnement?igshid=ZDdkNTZiNTM=" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom" style={{ textAlign: 'center', marginTop: 60, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
          <span>COPYRIGHT © {new Date().getFullYear()} CRE - TOUS DROITS RÉSERVÉS</span>
        </div>
      </div>
    </footer>
  );
}
