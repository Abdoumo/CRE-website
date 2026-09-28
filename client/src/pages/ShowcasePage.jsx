import { useState, useEffect } from 'react';
import { projectsAPI } from '../api.js';
import Footer from '../components/Footer.jsx';
import { Search, Filter, ExternalLink, Cpu, Globe, Smartphone, Microscope } from 'lucide-react';

const typeIcons = {
  machine_physique: Cpu,
  service_digital: Globe,
  application: Smartphone,
  recherche: Microscope,
};

const typeLabels = {
  machine_physique: 'Machine Physique',
  service_digital: 'Service Digital',
  application: 'Application',
  recherche: 'Recherche',
};

const typeColors = {
  machine_physique: { bg: '#ede9fe', color: '#7c3aed' },
  service_digital: { bg: '#dbeafe', color: '#1e40af' },
  application: { bg: '#dcfce7', color: '#166534' },
  recherche: { bg: '#fef3c7', color: '#92400e' },
};

export default function ShowcasePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    projectsAPI.getPublic()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter(p => {
    if (filter !== 'all' && p.projectType !== filter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && 
        !p.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <section style={{
        background: 'linear-gradient(135deg, var(--forest-dark), var(--forest-green))',
        padding: '80px 0 60px', textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{ color: 'white', marginBottom: 12 }}>Vitrine des Projets</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 500, margin: '0 auto 32px' }}>
            Découvrez les projets innovants incubés au CRE Annaba
          </p>

          <div style={{
            maxWidth: 500, margin: '0 auto',
            display: 'flex', background: 'rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-md)', padding: '4px',
            backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <Search size={18} style={{ color: 'rgba(255,255,255,0.5)', margin: '10px 12px', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              id="showcase-search"
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                color: 'white', fontSize: 14, fontFamily: 'var(--font-body)',
              }}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Filter tabs */}
          <div className="tabs" style={{ maxWidth: 600, margin: '0 auto var(--space-xl)' }}>
            {[
              { key: 'all', label: 'Tous' },
              { key: 'machine_physique', label: 'Machines' },
              { key: 'service_digital', label: 'Digital' },
              { key: 'application', label: 'Apps' },
              { key: 'recherche', label: 'Recherche' },
            ].map(t => (
              <button
                key={t.key}
                className={`tab ${filter === t.key ? 'active' : ''}`}
                onClick={() => setFilter(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-screen">
              <div className="spinner" style={{ width: 40, height: 40 }}></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><Filter size={32} /></div>
              <h3>Aucun projet trouvé</h3>
              <p className="text-muted">Modifiez vos critères de recherche</p>
            </div>
          ) : (
            <div className="grid grid-3">
              {filtered.map(project => {
                const Icon = typeIcons[project.projectType] || Cpu;
                const colors = typeColors[project.projectType] || typeColors.machine_physique;
                return (
                  <div key={project.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16,
                    }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 'var(--radius-md)',
                        background: colors.bg, color: colors.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={22} />
                      </div>
                      <span className="badge" style={{ background: colors.bg, color: colors.color }}>
                        {typeLabels[project.projectType]}
                      </span>
                    </div>
                    <h4 style={{ marginBottom: 8 }}>{project.title}</h4>
                    <p style={{ fontSize: 14, flex: 1 }}>
                      {project.description?.substring(0, 150)}{project.description?.length > 150 ? '...' : ''}
                    </p>
                    <div style={{
                      marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(45,106,79,0.06)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        {project.user?.firstName} {project.user?.lastName}
                        {project.user?.organization && (
                          <span style={{ display: 'block', fontSize: 12 }}>{project.user.organization}</span>
                        )}
                      </div>
                      <button className="btn btn-ghost btn-sm">
                        <ExternalLink size={14} /> Détails
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
