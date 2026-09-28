import { Router } from 'express';
import pool from '../db/pool.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/members
 * Annuaire des membres (réseau interne / matchmaking)
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { skill, role, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let query = `SELECT id, first_name, last_name, role, organization, bio, skills, avatar_url, created_at
                 FROM users WHERE is_active = true`;
    const params = [];
    let idx = 1;

    if (role) {
      query += ` AND role = $${idx}`;
      params.push(role);
      idx++;
    }
    if (skill) {
      query += ` AND $${idx} = ANY(skills)`;
      params.push(skill);
      idx++;
    }
    if (search) {
      query += ` AND (first_name ILIKE $${idx} OR last_name ILIKE $${idx} OR organization ILIKE $${idx} OR bio ILIKE $${idx})`;
      params.push(`%${search}%`);
      idx++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);
    res.json({
      members: result.rows.map(m => ({
        id: m.id,
        firstName: m.first_name,
        lastName: m.last_name,
        role: m.role,
        organization: m.organization,
        bio: m.bio,
        skills: m.skills,
        avatarUrl: m.avatar_url,
        createdAt: m.created_at,
      })),
    });
  } catch (err) {
    console.error('Members GET Error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /api/members/message
 * Envoyer un message interne
 */
router.post('/message', authenticate, async (req, res) => {
  try {
    const { receiverId, subject, body } = req.body;

    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, subject, body)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, receiverId, subject, body]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/members/messages
 * Boîte de réception
 */
router.get('/messages', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*, u.first_name as sender_first_name, u.last_name as sender_last_name
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.receiver_id = $1
       ORDER BY m.created_at DESC
       LIMIT 50`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
