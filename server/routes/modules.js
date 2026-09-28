import { Router } from 'express';
import pool from '../db/pool.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// ============================================
// WORKSHOPS
// ============================================

router.get('/workshops', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT w.*, 
        (SELECT COUNT(*) FROM workshop_enrollments we WHERE we.workshop_id = w.id) as enrolled_count
       FROM workshops w
       WHERE w.start_date >= NOW() - INTERVAL '7 days'
       ORDER BY w.start_date ASC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/workshops', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { title, description, category, instructor, maxParticipants, location, startDate, endDate, isOnline } = req.body;
    const result = await pool.query(
      `INSERT INTO workshops (title, description, category, instructor, max_participants, location, start_date, end_date, is_online)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [title, description, category, instructor, maxParticipants || 30, location, startDate, endDate, isOnline || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/workshops/:id/enroll', authenticate, async (req, res) => {
  try {
    // Check capacity
    const workshop = await pool.query('SELECT max_participants FROM workshops WHERE id = $1', [req.params.id]);
    if (workshop.rows.length === 0) return res.status(404).json({ error: 'Atelier non trouvé' });

    const enrolled = await pool.query('SELECT COUNT(*) FROM workshop_enrollments WHERE workshop_id = $1', [req.params.id]);
    if (parseInt(enrolled.rows[0].count) >= workshop.rows[0].max_participants) {
      return res.status(409).json({ error: 'Atelier complet' });
    }

    await pool.query(
      `INSERT INTO workshop_enrollments (workshop_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [req.params.id, req.user.id]
    );
    res.status(201).json({ message: 'Inscription confirmée' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ============================================
// CAMPAIGNS (Call for Projects)
// ============================================

router.get('/campaigns', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM campaigns ORDER BY deadline DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/campaigns', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { title, slug, description, theme, requirements, deadline, bannerUrl } = req.body;
    const result = await pool.query(
      `INSERT INTO campaigns (title, slug, description, theme, requirements, deadline, banner_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'ouverte')
       RETURNING *`,
      [title, slug, description, theme, requirements, deadline, bannerUrl]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/campaigns/:id/apply', authenticate, async (req, res) => {
  try {
    const { projectTitle, pitch, businessPlanUrl, attachments } = req.body;
    const result = await pool.query(
      `INSERT INTO campaign_applications (campaign_id, user_id, project_title, pitch, business_plan_url, attachments)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.params.id, req.user.id, projectTitle, pitch, businessPlanUrl, JSON.stringify(attachments || [])]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Vous avez déjà postulé à cet appel' });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.put('/campaigns/:campaignId/applications/:appId/score', authenticate, authorize('admin', 'jury'), async (req, res) => {
  try {
    const { score, juryNotes } = req.body;
    const result = await pool.query(
      `UPDATE campaign_applications SET score = $1, jury_notes = $2, scored_by = $3
       WHERE id = $4 AND campaign_id = $5
       RETURNING *`,
      [score, juryNotes, req.user.id, req.params.appId, req.params.campaignId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ============================================
// KPI TRACKING
// ============================================

router.post('/kpi', authenticate, async (req, res) => {
  try {
    const { projectId, reportMonth, revenue, expenses, hires, fundsRaised, clientsAcquired, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO kpi_reports (user_id, project_id, report_month, revenue, expenses, hires, funds_raised, clients_acquired, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (project_id, report_month) 
       DO UPDATE SET revenue = $4, expenses = $5, hires = $6, funds_raised = $7, clients_acquired = $8, notes = $9
       RETURNING *`,
      [req.user.id, projectId, reportMonth, revenue || 0, expenses || 0, hires || 0, fundsRaised || 0, clientsAcquired || 0, notes]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/kpi/:projectId', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM kpi_reports WHERE project_id = $1 ORDER BY report_month DESC`,
      [req.params.projectId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/kpi/report/impact', authenticate, authorize('admin'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        SUM(revenue) as total_revenue,
        SUM(expenses) as total_expenses,
        SUM(hires) as total_hires,
        SUM(funds_raised) as total_funds_raised,
        SUM(clients_acquired) as total_clients,
        COUNT(DISTINCT project_id) as projects_reporting
      FROM kpi_reports
    `);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ============================================
// INVESTOR PORTAL
// ============================================

router.get('/investor/startups', authenticate, authorize('investor'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.title, p.description, p.project_type, p.target_market, p.budget_estimate, p.team_size,
             u.first_name, u.last_name, u.organization, u.bio,
             (SELECT json_agg(json_build_object('month', report_month, 'revenue', revenue, 'hires', hires, 'funds_raised', funds_raised))
              FROM kpi_reports k WHERE k.project_id = p.id ORDER BY k.report_month DESC LIMIT 6) as kpis
      FROM projects p
      JOIN users u ON p.user_id = u.id
      WHERE p.status = 'accepte'
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/investor/request', authenticate, authorize('investor'), async (req, res) => {
  try {
    const { startupId, projectId, message } = req.body;
    const result = await pool.query(
      `INSERT INTO investor_requests (investor_id, startup_id, project_id, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, startupId, projectId, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ============================================
// ADMIN STATS
// ============================================

router.get('/admin/stats', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [users, projects, bookings, workshops] = await Promise.all([
      pool.query(`SELECT role, COUNT(*) as count FROM users GROUP BY role`),
      pool.query(`SELECT status, COUNT(*) as count FROM projects GROUP BY status`),
      pool.query(`SELECT COUNT(*) as total FROM bookings WHERE status = 'confirme' AND start_time >= NOW() - INTERVAL '30 days'`),
      pool.query(`SELECT COUNT(*) as total FROM workshops WHERE start_date >= NOW()`),
    ]);

    res.json({
      usersByRole: users.rows,
      projectsByStatus: projects.rows,
      recentBookings: parseInt(bookings.rows[0].total),
      upcomingWorkshops: parseInt(workshops.rows[0].total),
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
