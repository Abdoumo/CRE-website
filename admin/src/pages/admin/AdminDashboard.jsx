import { useState, useEffect } from 'react';
import { adminAPI, kpiAPI } from '../../api.js';
import { FolderOpen, GraduationCap, TrendingUp, Banknote, Users, Briefcase, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminAPI.getStats(),
      kpiAPI.getImpactReport().catch(() => null),
    ]).then(([s, i]) => {
      setStats(s);
      setImpact(i);
    }).catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" style={{ width: 40, height: 40 }}></div></div>;

  const totalUsers = stats?.usersByRole?.reduce((sum, r) => sum + parseInt(r.count), 0) || 0;
  const totalProjects = stats?.projectsByStatus?.reduce((sum, s) => sum + parseInt(s.count), 0) || 0;
  const acceptedProjects = stats?.projectsByStatus?.find(s => s.status === 'accepte')?.count || 0;
  const pendingProjects = stats?.projectsByStatus?.find(s => s.status === 'soumis')?.count || 
                          stats?.projectsByStatus?.find(s => s.status === 'en_validation')?.count || 0;

  return (
    <div>
      <div className="dashboard-header">
        <h1>Administration CRE</h1>
        <p>Vue d'ensemble de l'activité du centre et de l'incubateur</p>
      </div>

      {/* Main stats */}
      <div className="grid grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="stat-card">
          <div className="stat-icon green"><span className="icon-replacement icon-users"></span></div>
          <div>
            <div className="stat-value">{totalUsers}</div>
            <div className="stat-label">Membres Inscrits</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><FolderOpen size={22} /></div>
          <div>
            <div className="stat-value">{totalProjects}</div>
            <div className="stat-label">Projets Total</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><span className="icon-replacement icon-calendar"></span></div>
          <div>
            <div className="stat-value">{stats?.recentBookings || 0}</div>
            <div className="stat-label">Réservations (30j)</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><GraduationCap size={22} /></div>
          <div>
            <div className="stat-value">{stats?.upcomingWorkshops || 0}</div>
            <div className="stat-label">Ateliers à venir</div>
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        {/* Users by role */}
        <div className="card">
          <h4 style={{ marginBottom: 16, fontSize: 15 }}>👥 Répartition des Membres</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(stats?.usersByRole || []).map(r => {
              const percent = totalUsers > 0 ? (parseInt(r.count) / totalUsers * 100) : 0;
              const colors = { startup: '#10b981', chercheur: '#3b82f6', etudiant: '#f59e0b', partenaire: '#8b5cf6', admin: '#ef4444' };
              const labels = { startup: 'Startups', chercheur: 'Chercheurs', etudiant: 'Étudiants', partenaire: 'Partenaires', admin: 'Admins' };
              return (
                <div key={r.role}>
                  <div className="flex-between mb-sm">
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{labels[r.role] || r.role}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{r.count}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: 'rgba(45,106,79,0.06)' }}>
                    <div style={{
                      height: '100%', borderRadius: 4,
                      background: colors[r.role] || '#10b981',
                      width: `${percent}%`, transition: 'width 600ms ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Projects by status */}
        <div className="card">
          <h4 style={{ marginBottom: 16, fontSize: 15 }}>📁 Statut des Projets</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(stats?.projectsByStatus || []).map(s => {
              const percent = totalProjects > 0 ? (parseInt(s.count) / totalProjects * 100) : 0;
              const colors = { brouillon: '#94a3b8', soumis: '#3b82f6', en_validation: '#f59e0b', accepte: '#10b981', rejete: '#ef4444', archive: '#64748b' };
              const labels = { brouillon: 'Brouillon', soumis: 'Soumis', en_validation: 'En validation', accepte: 'Accepté', rejete: 'Rejeté', archive: 'Archivé' };
              return (
                <div key={s.status}>
                  <div className="flex-between mb-sm">
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{labels[s.status] || s.status}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.count}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: 'rgba(45,106,79,0.06)' }}>
                    <div style={{
                      height: '100%', borderRadius: 4,
                      background: colors[s.status] || '#10b981',
                      width: `${percent}%`, transition: 'width 600ms ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Impact Report */}
      {impact && (
        <div className="card" style={{
          background: 'linear-gradient(135deg, var(--forest-green), var(--emerald))',
          color: 'white',
        }}>
          <h4 style={{ color: 'white', marginBottom: 20, fontSize: 16 }}>
            <span className="icon-replacement icon-award"></span>
            Rapport d'Impact Global
          </h4>
          <div className="grid grid-4">
            {[
              { label: 'Chiffre d\'affaires total', value: `${Number(impact.total_revenue || 0).toLocaleString()} DZD`, icon: DollarSign },
              { label: 'Emplois créés', value: impact.total_hires || 0, icon: Users },
              { label: 'Fonds levés', value: `${Number(impact.total_funds_raised || 0).toLocaleString()} DZD`, icon: TrendingUp },
              { label: 'Projets actifs', value: impact.projects_reporting || 0, icon: Briefcase },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <item.icon size={24} style={{ opacity: 0.7, marginBottom: 8 }} />
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>
                  {item.value}
                </div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
