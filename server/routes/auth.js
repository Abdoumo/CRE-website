import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/pool.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/auth/register
 * Inscription d'un nouvel utilisateur
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, phone, organization } = req.body;

    // Vérifier si l'email existe déjà
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Un compte avec cet email existe déjà' });
    }

    // Valider le rôle
    const validRoles = ['startup', 'chercheur', 'etudiant', 'partenaire'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Rôle invalide' });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role, first_name, last_name, phone, organization)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, role, first_name, last_name`,
      [email, passwordHash, role, firstName, lastName, phone, organization]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      token,
    });
  } catch (err) {
    console.error('Erreur inscription:', err);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
  }
});

/**
 * POST /api/auth/login
 * Connexion d'un utilisateur
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT id, email, password_hash, role, first_name, last_name, avatar_url, organization FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        avatarUrl: user.avatar_url,
        organization: user.organization,
      },
      token,
    });
  } catch (err) {
    console.error('Erreur connexion:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
});

/**
 * GET /api/auth/me
 * Récupérer le profil de l'utilisateur connecté
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, role, first_name, last_name, phone, organization, bio, skills, avatar_url, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const u = result.rows[0];
    res.json({
      id: u.id,
      email: u.email,
      role: u.role,
      firstName: u.first_name,
      lastName: u.last_name,
      phone: u.phone,
      organization: u.organization,
      bio: u.bio,
      skills: u.skills,
      avatarUrl: u.avatar_url,
      createdAt: u.created_at,
    });
  } catch (err) {
    console.error('Erreur profil:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * PUT /api/auth/profile
 * Mise à jour du profil
 */
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { firstName, lastName, phone, organization, bio, skills } = req.body;
    const result = await pool.query(
      `UPDATE users SET first_name = $1, last_name = $2, phone = $3, organization = $4, bio = $5, skills = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING id, email, role, first_name, last_name, phone, organization, bio, skills`,
      [firstName, lastName, phone, organization, bio, skills || [], req.user.id]
    );

    const u = result.rows[0];
    res.json({
      id: u.id,
      email: u.email,
      role: u.role,
      firstName: u.first_name,
      lastName: u.last_name,
      phone: u.phone,
      organization: u.organization,
      bio: u.bio,
      skills: u.skills,
    });
  } catch (err) {
    console.error('Erreur mise à jour profil:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
