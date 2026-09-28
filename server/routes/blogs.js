import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a single blog
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Blog not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a blog
router.post('/', async (req, res) => {
  const { title, content, author, image_url } = req.body;
  if (!title || !content || !author) {
    return res.status(400).json({ message: 'Title, content and author are required' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO blogs (title, content, author, image_url) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, content, author, image_url || '']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a blog
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, author, image_url } = req.body;
  
  try {
    const { rows } = await pool.query(
      `UPDATE blogs 
       SET title = COALESCE($1, title), 
           content = COALESCE($2, content), 
           author = COALESCE($3, author), 
           image_url = $4,
           updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [title, content, author, image_url, id]
    );
    
    if (rows.length === 0) return res.status(404).json({ message: 'Blog not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a blog
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM blogs WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
