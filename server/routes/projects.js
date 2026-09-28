import { Router } from 'express';
import pool from '../db/pool.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { sendProjectAlert } from '../services/email.js';

const router = Router();

/**
 * POST /api/projects
 * Soumettre un nouveau projet
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      title, description, projectType, technicalSpecs,
      techStack, researchDomain, researchMethodology,
      targetMarket, budgetEstimate, teamSize, attachments
    } = req.body;

    const result = await pool.query(
      `INSERT INTO projects (user_id, title, description, project_type, technical_specs, tech_stack, 
        research_domain, research_methodology, target_market, budget_estimate, team_size, attachments, status, submitted_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'soumis', NOW())
       RETURNING *`,
      [
        req.user.id, title, description, projectType,
        JSON.stringify(technicalSpecs || {}), techStack || [],
        researchDomain, researchMethodology,
        targetMarket, budgetEstimate, teamSize || 1,
        JSON.stringify(attachments || [])
      ]
    );

    const project = result.rows[0];

    // Fetch user info for email
    const userResult = await pool.query('SELECT first_name, last_name, email, organization FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    // Send email alerts to directors
    try {
      await sendProjectAlert(project, user);
    } catch (emailErr) {
      console.error('⚠️ Erreur envoi email (non bloquant):', emailErr.message);
    }

    res.status(201).json(formatProject(project));
  } catch (err) {
    console.error('Erreur soumission projet:', err);
    res.status(500).json({ error: 'Erreur lors de la soumission du projet' });
  }
});

/**
 * GET /api/projects
 * Liste des projets (filtrée par rôle)
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, type, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let query = '';
    let params = [];
    let paramIndex = 1;

    if (req.user.role === 'admin') {
      query = 'SELECT p.*, u.first_name, u.last_name, u.email, u.organization FROM projects p JOIN users u ON p.user_id = u.id WHERE 1=1';
    } else {
      query = 'SELECT p.*, u.first_name, u.last_name, u.email, u.organization FROM projects p JOIN users u ON p.user_id = u.id WHERE p.user_id = $1';
      params.push(req.user.id);
      paramIndex++;
    }

    if (status) {
      query += ` AND p.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    if (type) {
      query += ` AND p.project_type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }
    if (search) {
      query += ` AND (p.title ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);

    // Count total
    let countQuery = req.user.role === 'admin'
      ? 'SELECT COUNT(*) FROM projects'
      : 'SELECT COUNT(*) FROM projects WHERE user_id = $1';
    const countResult = await pool.query(countQuery, req.user.role === 'admin' ? [] : [req.user.id]);

    res.json({
      projects: result.rows.map(formatProjectWithUser),
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    console.error('Erreur liste projets:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/projects/public
 * Projets publics (vitrine) — acceptés uniquement
 */
router.get('/public', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.title, p.description, p.project_type, p.technical_specs, p.tech_stack, p.created_at,
              u.first_name, u.last_name, u.organization
       FROM projects p JOIN users u ON p.user_id = u.id
       WHERE p.status = 'accepte'
       ORDER BY p.created_at DESC
       LIMIT 50`
    );
    res.json(result.rows.map(formatProjectWithUser));
  } catch (err) {
    console.error('Erreur projets publics:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/projects/:id
 * Détail d'un projet
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.first_name, u.last_name, u.email, u.organization
       FROM projects p JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }

    const project = result.rows[0];

    // Authorization: owner or admin
    if (project.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    res.json(formatProjectWithUser(project));
  } catch (err) {
    console.error('Erreur détail projet:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * PUT /api/projects/:id/status
 * Mise à jour du statut (admin only)
 */
router.put('/:id/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status, reviewerNotes, encadrant } = req.body;
    const validStatuses = ['en_validation', 'accepte', 'rejete', 'archive'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const result = await pool.query(
      `UPDATE projects SET status = $1, reviewer_notes = $2, mentor_name = COALESCE($3, mentor_name), reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [status, reviewerNotes, encadrant || null, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }

    res.json(formatProject(result.rows[0]));
  } catch (err) {
    console.error('Erreur mise à jour statut:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/projects/stats/overview
 * Statistiques globales (admin)
 */
router.get('/stats/overview', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [totalProjects, statusBreakdown, typeBreakdown, monthlySubmissions] = await Promise.all([
      pool.query('SELECT COUNT(*) as total FROM projects'),
      pool.query('SELECT status, COUNT(*) as count FROM projects GROUP BY status'),
      pool.query('SELECT project_type, COUNT(*) as count FROM projects GROUP BY project_type'),
      pool.query(`SELECT DATE_TRUNC('month', created_at) as month, COUNT(*) as count 
                  FROM projects WHERE created_at > NOW() - INTERVAL '12 months'
                  GROUP BY month ORDER BY month`),
    ]);

    res.json({
      total: parseInt(totalProjects.rows[0].total),
      byStatus: statusBreakdown.rows,
      byType: typeBreakdown.rows,
      monthly: monthlySubmissions.rows,
    });
  } catch (err) {
    console.error('Erreur stats:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Helpers
function formatProject(p) {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    projectType: p.project_type,
    status: p.status,
    technicalSpecs: p.technical_specs,
    techStack: p.tech_stack,
    researchDomain: p.research_domain,
    researchMethodology: p.research_methodology,
    targetMarket: p.target_market,
    budgetEstimate: p.budget_estimate,
    teamSize: p.team_size,
    attachments: p.attachments,
    submittedAt: p.submitted_at,
    reviewedAt: p.reviewed_at,
    reviewerNotes: p.reviewer_notes,
    encadrant: p.mentor_name,
    createdAt: p.created_at,
  };
}

function formatProjectWithUser(p) {
  return {
    ...formatProject(p),
    user: {
      firstName: p.first_name,
      lastName: p.last_name,
      email: p.email,
      organization: p.organization,
    },
  };
}

export default router;
