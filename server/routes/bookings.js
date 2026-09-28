import { Router } from 'express';
import pool from '../db/pool.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/bookings/resources
 * Liste des ressources disponibles
 */
router.get('/resources', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM resources WHERE is_available = true ORDER BY category, name'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /api/bookings
 * Créer une réservation (avec vérification de conflit)
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const { resourceId, startTime, endTime, purpose } = req.body;

    // Vérifier les conflits
    const conflicts = await pool.query(
      `SELECT id FROM bookings 
       WHERE resource_id = $1 AND status != 'annule'
       AND tstzrange(start_time, end_time) && tstzrange($2::timestamptz, $3::timestamptz)`,
      [resourceId, startTime, endTime]
    );

    if (conflicts.rows.length > 0) {
      return res.status(409).json({ 
        error: 'Conflit de réservation: cette ressource est déjà réservée pour ce créneau' 
      });
    }

    const result = await pool.query(
      `INSERT INTO bookings (resource_id, user_id, start_time, end_time, purpose, status)
       VALUES ($1, $2, $3, $4, $5, 'en_attente')
       RETURNING *`,
      [resourceId, req.user.id, startTime, endTime, purpose]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erreur réservation:', err);
    if (err.code === '23P01') { // exclusion_violation
      return res.status(409).json({ error: 'Conflit de réservation détecté' });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/bookings
 * Liste des réservations (par ressource et période)
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { resourceId, startDate, endDate } = req.query;
    let query = `
      SELECT b.*, r.name as resource_name, r.category,
             u.first_name, u.last_name
      FROM bookings b
      JOIN resources r ON b.resource_id = r.id
      JOIN users u ON b.user_id = u.id
      WHERE b.status != 'annule'
    `;
    const params = [];
    let idx = 1;

    if (resourceId) {
      query += ` AND b.resource_id = $${idx}`;
      params.push(resourceId);
      idx++;
    }
    if (startDate) {
      query += ` AND b.start_time >= $${idx}`;
      params.push(startDate);
      idx++;
    }
    if (endDate) {
      query += ` AND b.end_time <= $${idx}`;
      params.push(endDate);
      idx++;
    }

    query += ' ORDER BY b.start_time ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * DELETE /api/bookings/:id
 * Annuler une réservation
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE bookings SET status = 'annule' WHERE id = $1 AND (user_id = $2 OR $3 = 'admin') RETURNING *`,
      [req.params.id, req.user.id, req.user.role]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Réservation non trouvée ou non autorisée' });
    }

    res.json({ message: 'Réservation annulée' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * PUT /api/bookings/:id/status
 * Valider ou refuser une réservation (Admin only)
 */
router.put('/:id/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['confirme', 'annule'].includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const result = await pool.query(
      `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
