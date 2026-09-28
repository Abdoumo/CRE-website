import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const schema = `
-- ============================================
-- CRE ANNABA - Complete Database Schema
-- ============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUMS
-- ============================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('startup', 'chercheur', 'etudiant', 'partenaire', 'admin', 'investor', 'jury');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE project_status AS ENUM ('brouillon', 'soumis', 'en_validation', 'accepte', 'rejete', 'archive');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE project_type AS ENUM ('machine_physique', 'service_digital', 'application', 'recherche');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('en_attente', 'confirme', 'annule');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE campaign_status AS ENUM ('brouillon', 'ouverte', 'fermee', 'evaluee');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'startup',
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  organization VARCHAR(255),
  bio TEXT,
  skills TEXT[], -- array of skills for matchmaking
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- BLOGS
-- ============================================

CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  image_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PROJECTS
-- ============================================

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  project_type project_type NOT NULL,
  status project_status DEFAULT 'brouillon',
  
  -- Conditional fields based on type
  technical_specs JSONB DEFAULT '{}',      -- For machines: dimensions, materials, etc.
  tech_stack TEXT[],                         -- For digital/app: technologies used
  research_domain VARCHAR(255),             -- For research: field of study
  research_methodology TEXT,                -- For research: methodology
  
  target_market TEXT,
  budget_estimate DECIMAL(12,2),
  team_size INTEGER DEFAULT 1,
  attachments JSONB DEFAULT '[]',           -- file URLs
  
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RESOURCES & BOOKINGS
-- ============================================

CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL, -- 'imprimante_3d', 'cnc', 'salle_reunion', etc.
  description TEXT,
  location VARCHAR(255),
  capacity INTEGER,
  is_available BOOLEAN DEFAULT true,
  image_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status booking_status DEFAULT 'en_attente',
  purpose TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Conflict prevention: no overlapping bookings for same resource
  CONSTRAINT no_overlap EXCLUDE USING gist (
    resource_id WITH =,
    tstzrange(start_time, end_time) WITH &&
  ) WHERE (status != 'annule')
);

-- ============================================
-- WORKSHOPS & BOOTCAMPS
-- ============================================

CREATE TABLE IF NOT EXISTS workshops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- 'bootcamp', 'mentoring', 'webinar'
  instructor VARCHAR(255),
  max_participants INTEGER DEFAULT 30,
  location VARCHAR(255),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  is_online BOOLEAN DEFAULT false,
  image_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workshop_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workshop_id, user_id)
);

-- ============================================
-- CALL FOR PROJECTS (CAMPAIGNS)
-- ============================================

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  theme VARCHAR(255), -- e.g., 'GreenTech 2026'
  requirements TEXT,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  status campaign_status DEFAULT 'brouillon',
  banner_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_title VARCHAR(255) NOT NULL,
  pitch TEXT NOT NULL,
  business_plan_url VARCHAR(500),
  attachments JSONB DEFAULT '[]',
  score DECIMAL(5,2), -- Jury score (0-100)
  jury_notes TEXT,
  scored_by UUID REFERENCES users(id),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(campaign_id, user_id)
);

-- ============================================
-- KPI TRACKING
-- ============================================

CREATE TABLE IF NOT EXISTS kpi_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  report_month DATE NOT NULL, -- first day of the month
  revenue DECIMAL(12,2) DEFAULT 0,
  expenses DECIMAL(12,2) DEFAULT 0,
  hires INTEGER DEFAULT 0,
  funds_raised DECIMAL(12,2) DEFAULT 0,
  clients_acquired INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, report_month)
);

-- ============================================
-- INTERNAL MESSAGING (MATCHMAKING)
-- ============================================

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255),
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INVESTOR PORTAL
-- ============================================

CREATE TABLE IF NOT EXISTS investor_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  startup_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id),
  message TEXT,
  status VARCHAR(50) DEFAULT 'en_attente', -- 'en_attente', 'accepte', 'refuse'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  body TEXT,
  link VARCHAR(500),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_bookings_resource ON bookings(resource_id);
CREATE INDEX IF NOT EXISTS idx_bookings_time ON bookings(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_kpi_project ON kpi_reports(project_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================
-- SEED DATA
-- ============================================

-- Admin user (password: admin123)
INSERT INTO users (email, password_hash, role, first_name, last_name, organization)
VALUES (
  'admin@cre-annaba.dz',
  '$2a$12$LJ3hGzKQF5sK5mJ3rQMXxOq8KqYQ5Z2Z0V0cJ5Z5Z5Z5Z5Z5Z5Z5',
  'admin',
  'Admin',
  'CRE',
  'CRE Annaba'
) ON CONFLICT (email) DO NOTHING;

-- Sample resources
INSERT INTO resources (name, category, description, location, capacity) VALUES
  ('Imprimante 3D Ultimaker S5', 'imprimante_3d', 'Imprimante 3D haute précision pour prototypage', 'Salle 101 - Atelier', 1),
  ('Machine CNC 3 axes', 'cnc', 'Machine CNC pour usinage de pièces métalliques et plastiques', 'Salle 102 - Atelier', 1),
  ('Salle de Réunion A', 'salle_reunion', 'Salle de réunion équipée (vidéoprojecteur, tableau blanc)', 'Étage 2 - Salle A', 12),
  ('Salle de Réunion B', 'salle_reunion', 'Grande salle pour conférences et présentations', 'Étage 2 - Salle B', 30),
  ('Espace Co-working', 'espace_travail', 'Espace de travail partagé avec postes informatiques', 'Étage 1', 20)
ON CONFLICT DO NOTHING;
`;

async function initDB() {
  const client = await pool.connect();
  try {
    console.log('🌿 Initialisation de la base de données CRE Annaba...');
    
    // Need btree_gist for exclusion constraints
    await client.query('CREATE EXTENSION IF NOT EXISTS btree_gist;');
    
    await client.query(schema);
    console.log('✅ Schéma créé avec succès !');
    console.log('✅ Données de base insérées.');
    console.log('🌱 Base de données CRE Annaba prête.');
  } catch (err) {
    console.error('❌ Erreur lors de l\'initialisation:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

initDB();
