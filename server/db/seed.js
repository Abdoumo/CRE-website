import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const salt = await bcrypt.genSalt(12);
  const adminHash = await bcrypt.hash('admin123', salt);
  const userHash = await bcrypt.hash('test123', salt);

  // Admin
  await pool.query(
    `INSERT INTO users (email, password_hash, role, first_name, last_name, organization)
     VALUES ($1, $2, 'admin', 'Bouslama', 'Zahida', 'CRE Annaba')
     ON CONFLICT (email) DO UPDATE SET password_hash = $2`,
    ['admin@cre-annaba.dz', adminHash]
  );

  // Test startup
  await pool.query(
    `INSERT INTO users (email, password_hash, role, first_name, last_name, organization, bio, skills)
     VALUES ($1, $2, 'startup', 'Karim', 'Benali', 'EcoTech DZ', 'Fondateur de EcoTech DZ, startup spécialisée dans les solutions de recyclage intelligent.', ARRAY['IoT', 'Recyclage', 'Machine Learning'])
     ON CONFLICT (email) DO UPDATE SET password_hash = $2`,
    ['karim@ecotech.dz', userHash]
  );

  // Test researcher
  await pool.query(
    `INSERT INTO users (email, password_hash, role, first_name, last_name, organization, bio, skills)
     VALUES ($1, $2, 'chercheur', 'Amina', 'Hadji', 'Université Annaba', 'Chercheuse en sciences environnementales, spécialisée dans le traitement des eaux usées.', ARRAY['Chimie environnementale', 'Traitement des eaux', 'Microbiologie'])
     ON CONFLICT (email) DO UPDATE SET password_hash = $2`,
    ['amina@univ-annaba.dz', userHash]
  );

  // Test investor
  await pool.query(
    `INSERT INTO users (email, password_hash, role, first_name, last_name, organization, bio)
     VALUES ($1, $2, 'investor', 'Omar', 'Mansouri', 'Green Capital Fund', 'Business Angel spécialisé dans les startups GreenTech en Afrique du Nord.')
     ON CONFLICT (email) DO UPDATE SET password_hash = $2`,
    ['omar@greencapital.dz', userHash]
  );

  // Sample projects
  const karimResult = await pool.query(`SELECT id FROM users WHERE email = 'karim@ecotech.dz'`);
  const aminaResult = await pool.query(`SELECT id FROM users WHERE email = 'amina@univ-annaba.dz'`);
  
  if (karimResult.rows.length > 0) {
    const karimId = karimResult.rows[0].id;
    await pool.query(
      `INSERT INTO projects (user_id, title, description, project_type, status, target_market, budget_estimate, team_size, submitted_at, tech_stack)
       VALUES ($1, 'SmartBin - Poubelle Intelligente', 'Système de tri des déchets automatisé utilisant l''IA et des capteurs IoT pour identifier et séparer les matériaux recyclables. La poubelle communique en temps réel avec une plateforme cloud.', 'machine_physique', 'accepte', 'Municipalités et collectivités locales', 2500000, 4, NOW(), ARRAY['Arduino', 'TensorFlow Lite', 'Node.js'])
       ON CONFLICT DO NOTHING`,
      [karimId]
    );
    await pool.query(
      `INSERT INTO projects (user_id, title, description, project_type, status, target_market, budget_estimate, team_size, submitted_at, tech_stack)
       VALUES ($1, 'GreenTrack - Suivi Carbone', 'Application mobile permettant aux entreprises de suivre et réduire leur empreinte carbone avec des tableaux de bord interactifs et des recommandations personnalisées.', 'application', 'soumis', 'PME industrielles', 1500000, 3, NOW(), ARRAY['React Native', 'Firebase', 'Python'])
       ON CONFLICT DO NOTHING`,
      [karimId]
    );
  }

  if (aminaResult.rows.length > 0) {
    const aminaId = aminaResult.rows[0].id;
    await pool.query(
      `INSERT INTO projects (user_id, title, description, project_type, status, research_domain, research_methodology, budget_estimate, team_size, submitted_at)
       VALUES ($1, 'BioFiltre - Filtration Biologique', 'Développement d''un système de filtration biologique innovant pour le traitement des eaux usées industrielles utilisant des micro-organismes endémiques.', 'recherche', 'accepte', 'Sciences environnementales', 'Recherche expérimentale en laboratoire avec tests pilotes sur site industriel', 3000000, 5, NOW())
       ON CONFLICT DO NOTHING`,
      [aminaId]
    );
  }

  // Sample workshop
  await pool.query(
    `INSERT INTO workshops (title, description, category, instructor, max_participants, location, start_date, end_date, is_online)
     VALUES 
       ('Bootcamp MVP en 48h', 'Apprenez à concevoir et lancer votre produit minimum viable en seulement 48 heures.', 'bootcamp', 'Dr. Yacine Meziane', 25, 'Salle B - CRE Annaba', NOW() + INTERVAL '14 days', NOW() + INTERVAL '16 days', false),
       ('SEO & Marketing Digital', 'Maîtrisez les fondamentaux du référencement et du marketing digital pour votre startup.', 'webinar', 'Sarah Benmoussa', 50, NULL, NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days', true),
       ('Cloud Computing pour Startups', 'Introduction aux services cloud (AWS, GCP) et déploiement d''applications scalables.', 'bootcamp', 'Mehdi Cherif', 20, 'Lab Informatique - CRE', NOW() + INTERVAL '21 days', NOW() + INTERVAL '23 days', false)
     ON CONFLICT DO NOTHING`
  );

  console.log('✅ Données de test insérées avec succès !');
  console.log('');
  console.log('📧 Comptes de test:');
  console.log('  Admin:       admin@cre-annaba.dz / admin123');
  console.log('  Startup:     karim@ecotech.dz / test123');
  console.log('  Chercheur:   amina@univ-annaba.dz / test123');
  console.log('  Investisseur: omar@greencapital.dz / test123');

  await pool.end();
}

seed().catch(console.error);
