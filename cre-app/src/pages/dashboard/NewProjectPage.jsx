import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../../api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { Send, Cpu, Globe, Smartphone, Microscope } from 'lucide-react';

const projectTypes = [
  { value: 'machine_physique', label: 'Machine Physique', icon: Cpu, desc: 'Prototype, équipement ou dispositif physique' },
  { value: 'service_digital', label: 'Service Digital', icon: Globe, desc: 'Plateforme web, SaaS, service en ligne' },
  { value: 'application', label: 'Application', icon: Smartphone, desc: 'Application mobile ou desktop' },
  { value: 'recherche', label: 'Projet de Recherche', icon: Microscope, desc: 'Recherche scientifique ou académique' },
];

export default function NewProjectPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '', description: '', projectType: '',
    targetMarket: '', budgetEstimate: '', teamSize: 1,
    // Conditional
    technicalSpecs: { dimensions: '', materials: '', weight: '' },
    techStack: '',
    researchDomain: '', researchMethodology: '',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const updateSpecs = (field, value) => setForm(prev => ({
    ...prev, technicalSpecs: { ...prev.technicalSpecs, [field]: value },
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await projectsAPI.create({
        ...form,
        techStack: form.techStack ? form.techStack.split(',').map(s => s.trim()) : [],
        budgetEstimate: form.budgetEstimate || null,
      });
      toast.success('Projet soumis avec succès ! L\'équipe CRE a été notifiée. 🌿');
      navigate('/dashboard/projets');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Nouveau Projet</h1>
        <p>Remplissez le formulaire pour soumettre votre projet à l'incubateur CRE</p>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, maxWidth: 400 }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: s <= step ? 'var(--emerald)' : 'rgba(45,106,79,0.1)',
            transition: 'all 300ms ease',
          }} />
        ))}
      </div>

      <div className="card" style={{ maxWidth: 700 }}>
        {step === 1 && (
          <div>
            <h3 style={{ marginBottom: 4 }}>Type de Projet</h3>
            <p className="text-muted mb-lg" style={{ fontSize: 14 }}>Sélectionnez la catégorie de votre projet</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {projectTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  id={`type-${type.value}`}
                  onClick={() => update('projectType', type.value)}
                  style={{
                    padding: 20, textAlign: 'left',
                    border: `2px solid ${form.projectType === type.value ? 'var(--emerald)' : 'rgba(45,106,79,0.1)'}`,
                    borderRadius: 'var(--radius-md)',
                    background: form.projectType === type.value ? 'var(--emerald-glow)' : 'white',
                    cursor: 'pointer', transition: 'all 200ms ease', display: 'flex', gap: 14, alignItems: 'center',
                  }}
                >
                  <type.icon size={24} style={{
                    color: form.projectType === type.value ? 'var(--emerald)' : 'var(--text-muted)',
                    flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{type.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{type.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            <button className="btn btn-primary mt-lg" disabled={!form.projectType} onClick={() => setStep(2)}>
              Continuer
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ marginBottom: 4 }}>Informations Générales</h3>
            <p className="text-muted mb-lg" style={{ fontSize: 14 }}>Décrivez votre projet en détail</p>
            
            <div className="form-group">
              <label className="form-label">Titre du Projet *</label>
              <input className="form-input" placeholder="Ex: Station de recyclage autonome"
                value={form.title} onChange={e => update('title', e.target.value)} id="project-title" />
            </div>

            <div className="form-group">
              <label className="form-label">Description Détaillée *</label>
              <textarea className="form-textarea" placeholder="Décrivez votre projet, son objectif, son impact..."
                value={form.description} onChange={e => update('description', e.target.value)} id="project-desc" 
                style={{ minHeight: 160 }} />
            </div>

            {/* Conditional fields based on project type */}
            {(form.projectType === 'machine_physique') && (
              <>
                <h4 style={{ fontSize: 14, marginBottom: 12, marginTop: 8 }}>Spécifications Techniques</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Dimensions</label>
                    <input className="form-input" placeholder="ex: 50x30x20 cm"
                      value={form.technicalSpecs.dimensions} onChange={e => updateSpecs('dimensions', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Matériaux</label>
                    <input className="form-input" placeholder="ex: Aluminium, PLA"
                      value={form.technicalSpecs.materials} onChange={e => updateSpecs('materials', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Poids estimé</label>
                    <input className="form-input" placeholder="ex: 5 kg"
                      value={form.technicalSpecs.weight} onChange={e => updateSpecs('weight', e.target.value)} />
                  </div>
                </div>
              </>
            )}

            {(form.projectType === 'service_digital' || form.projectType === 'application') && (
              <div className="form-group">
                <label className="form-label">Technologies Utilisées</label>
                <input className="form-input" placeholder="React, Node.js, PostgreSQL (séparés par des virgules)"
                  value={form.techStack} onChange={e => update('techStack', e.target.value)} />
                <span className="form-hint">Séparez les technologies par des virgules</span>
              </div>
            )}

            {form.projectType === 'recherche' && (
              <>
                <div className="form-group">
                  <label className="form-label">Domaine de Recherche</label>
                  <input className="form-input" placeholder="ex: Traitement des eaux usées"
                    value={form.researchDomain} onChange={e => update('researchDomain', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Méthodologie</label>
                  <textarea className="form-textarea" placeholder="Décrivez votre approche méthodologique..."
                    value={form.researchMethodology} onChange={e => update('researchMethodology', e.target.value)} />
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>Retour</button>
              <button className="btn btn-primary" disabled={!form.title || !form.description} onClick={() => setStep(3)}>
                Continuer
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: 4 }}>Détails Supplémentaires</h3>
            <p className="text-muted mb-lg" style={{ fontSize: 14 }}>Informations complémentaires sur votre projet</p>

            <div className="form-group">
              <label className="form-label">Marché Cible</label>
              <input className="form-input" placeholder="ex: PME du secteur industriel en Algérie"
                value={form.targetMarket} onChange={e => update('targetMarket', e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Budget Estimé (DZD)</label>
                <input type="number" className="form-input" placeholder="ex: 500000"
                  value={form.budgetEstimate} onChange={e => update('budgetEstimate', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Taille de l'Équipe</label>
                <input type="number" className="form-input" min="1"
                  value={form.teamSize} onChange={e => update('teamSize', parseInt(e.target.value) || 1)} />
              </div>
            </div>

            {/* Summary card */}
            <div style={{
              marginTop: 16, padding: 16, background: 'var(--emerald-glow)',
              borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.2)',
            }}>
              <h4 style={{ fontSize: 14, color: 'var(--forest-green)', marginBottom: 8 }}>📋 Récapitulatif</h4>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'grid', gap: 4 }}>
                <div><strong>Type:</strong> {projectTypes.find(t => t.value === form.projectType)?.label}</div>
                <div><strong>Titre:</strong> {form.title}</div>
                <div><strong>Équipe:</strong> {form.teamSize} personne(s)</div>
                {form.budgetEstimate && <div><strong>Budget:</strong> {Number(form.budgetEstimate).toLocaleString()} DZD</div>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>Retour</button>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="submit-project" style={{ flex: 1 }}>
                {loading ? <div className="spinner" style={{ width: 20, height: 20 }}></div> : (
                  <><Send size={16} /> Soumettre le Projet</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
