import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import {
  Leaf, Rocket, Microscope, GraduationCap, Handshake,
  Cpu, Calendar, Users, Award, ArrowRight, Shield,
  Globe, Zap, ChevronRight
} from 'lucide-react';

const services = [
  {
    icon: Rocket,
    title: 'Incubation de Startups',
    description: 'Accompagnement complet pour transformer votre idée en entreprise viable avec mentorat personnalisé.',
    color: '#10b981',
    bg: '#dcfce7',
  },
  {
    icon: Microscope,
    title: 'Recherche Environnementale',
    description: 'Accès aux laboratoires et équipements de pointe pour vos projets de recherche en environnement.',
    color: '#023e8a',
    bg: '#dbeafe',
  },
  {
    icon: Cpu,
    title: 'Prototypage & Fabrication',
    description: 'Imprimantes 3D, machines CNC et atelier équipé pour créer vos prototypes physiques.',
    color: '#7c3aed',
    bg: '#ede9fe',
  },
  {
    icon: Calendar,
    title: 'Espaces & Ressources',
    description: 'Réservez salles de réunion, espaces co-working et équipements via notre plateforme en ligne.',
    color: '#f59e0b',
    bg: '#fef3c7',
  },
  {
    icon: GraduationCap,
    title: 'Bootcamps & Formations',
    description: 'Ateliers techniques en lancement MVP, SEO, Cloud, et entrepreneuriat pour accélérer votre croissance.',
    color: '#ef4444',
    bg: '#fee2e2',
  },
  {
    icon: Handshake,
    title: 'Réseau & Investisseurs',
    description: 'Connectez-vous avec des partenaires industriels, Business Angels et fonds d\'investissement.',
    color: '#0891b2',
    bg: '#cffafe',
  },
];

const stats = [
  { value: '50+', label: 'Projets Incubés' },
  { value: '120+', label: 'Membres Actifs' },
  { value: '15', label: 'Partenaires Industriels' },
  { value: '98%', label: 'Taux de Satisfaction' },
];

export default function HomePage() {
  return (
    <div>
      {/* ---- HERO ---- */}
      <section className="hero" id="accueil">
        <div className="hero-shapes">
          <div className="hero-shape"></div>
          <div className="hero-shape"></div>
          <div className="hero-shape"></div>
          <div className="hero-shape"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', background: 'rgba(16,185,129,0.2)',
              borderRadius: 'var(--radius-full)', marginBottom: 24,
              color: 'var(--emerald-light)', fontSize: 14, fontWeight: 600,
              backdropFilter: 'blur(10px)',
            }}>
              <Leaf size={16} /> Centre de Recherche en Environnement
            </div>
            <h1>
              Innover pour un{' '}
              <span className="text-gradient">Avenir Durable</span>
            </h1>
            <p>
              CRE Annaba accompagne startups, chercheurs et étudiants entrepreneurs 
              dans la création de solutions innovantes pour l'environnement. 
              Rejoignez notre écosystème d'incubation.
            </p>
            <div className="hero-actions">
              <Link to="/inscription" className="btn btn-accent btn-lg">
                <Rocket size={18} />
                Soumettre un Projet
              </Link>
              <Link to="/vitrine" className="btn btn-lg" style={{
                background: 'rgba(255,255,255,0.12)', color: 'white',
                backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)',
              }}>
                Découvrir nos Projets
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Trust badges */}
            <div style={{
              marginTop: 48, display: 'flex', gap: 32, flexWrap: 'wrap',
            }}>
              
            </div>
          </div>
        </div>
      </section>

      {/* ---- STATS BAND ---- */}
      <section style={{
        background: 'var(--bg-secondary)', padding: '48px 0',
        borderBottom: '1px solid rgba(45,106,79,0.06)',
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32 }}>
            {stats.map((stat, i) => (
              <div key={i} className="flex-center flex-col" style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: '2.5rem',
                  fontWeight: 800, color: 'var(--forest-green)', lineHeight: 1,
                }}>
                  {stat.value}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- SERVICES ---- */}
      <section className="section" id="services">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">
              <Leaf size={14} /> Nos Services
            </div>
            <h2>Un Écosystème Complet pour l'Innovation</h2>
            <p>
              CRE Annaba met à votre disposition toutes les ressources nécessaires 
              pour concrétiser vos projets environnementaux.
            </p>
          </div>

          <div className="grid grid-3">
            {services.map((service, i) => (
              <div key={i} className="card" style={{ cursor: 'default' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 'var(--radius-md)',
                  background: service.bg, color: service.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <service.icon size={26} />
                </div>
                <h4 style={{ marginBottom: 8 }}>{service.title}</h4>
                <p style={{ fontSize: 14 }}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- ABOUT / CTA ---- */}
      <section className="section" id="apropos" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div className="section-tag" style={{ marginBottom: 16 }}>
                <Award size={14} /> À Propos
              </div>
              <h2 style={{ marginBottom: 16 }}>Le CRE Annaba : Votre Partenaire Innovation</h2>
              <p style={{ marginBottom: 24 }}>
                Dirigé par <strong>Bouslama Zahida</strong>, le Centre de Recherche en Environnement 
                d'Annaba est un pôle d'excellence qui réunit chercheurs, entrepreneurs et industriels 
                autour d'un objectif commun : développer des solutions durables pour notre planète.
              </p>
              <p style={{ marginBottom: 24 }}>
                Notre incubateur offre un accompagnement de A à Z, de l'idéation au marché, 
                avec un accès privilégié à nos laboratoires, ateliers de prototypage, 
                et un réseau de partenaires nationaux et internationaux.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Hébergement web & mailing professionnel à vie',
                  'Accès aux équipements de prototypage (3D, CNC)',
                  'Mentorat et bootcamps personnalisés',
                  'Connexion directe avec les investisseurs',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                    <ChevronRight size={16} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 32 }}>
                <Link to="/inscription" className="btn btn-primary btn-lg">
                  Rejoindre l'Incubateur
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, var(--forest-green), var(--emerald))',
              borderRadius: 'var(--radius-xl)', padding: 48,
              color: 'white', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: -50, right: -50,
                width: 200, height: 200, borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
              }}></div>
              <div style={{
                position: 'absolute', bottom: -30, left: -30,
                width: 150, height: 150, borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
              }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ color: 'white', marginBottom: 24, fontSize: '1.5rem' }}>
                  Pourquoi CRE Annaba ?
                </h3>
                {[
                  { num: '01', title: 'Accompagnement Expert', desc: 'Mentorat par des chercheurs et professionnels de l\'industrie' },
                  { num: '02', title: 'Infrastructure de Pointe', desc: 'Laboratoires, ateliers et espaces de co-working équipés' },
                  { num: '03', title: 'Réseau Puissant', desc: 'Accès à un écosystème de partenaires et investisseurs' },
                  { num: '04', title: 'Impact Environnemental', desc: 'Contribuez activement à la protection de l\'environnement' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 16, marginBottom: 20,
                    padding: 16, background: 'rgba(255,255,255,0.08)',
                    borderRadius: 'var(--radius-md)',
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontWeight: 800,
                      fontSize: '1.2rem', color: 'var(--accent-sun-warm)', minWidth: 30,
                    }}>
                      {item.num}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>{item.title}</div>
                      <div style={{ fontSize: 13, opacity: 0.8 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- CTA BAND ---- */}
      <section style={{
        background: 'linear-gradient(135deg, var(--forest-dark), var(--forest-green))',
        padding: '64px 0', textAlign: 'center',
      }}>
        <div className="container">
          <h2 style={{ color: 'white', marginBottom: 16 }}>
            Prêt à Lancer Votre Projet ?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 500, margin: '0 auto 32px', fontSize: '1.05rem' }}>
            Rejoignez CRE Annaba et bénéficiez de tout notre écosystème pour réussir votre aventure entrepreneuriale.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/inscription" className="btn btn-accent btn-lg">
              <Rocket size={18} /> Créer Mon Compte
            </Link>
            <Link to="/vitrine" className="btn btn-lg" style={{
              background: 'rgba(255,255,255,0.12)', color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              Explorer la Vitrine
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
