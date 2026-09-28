import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import bookingRoutes from './routes/bookings.js';
import memberRoutes from './routes/members.js';
import moduleRoutes from './routes/modules.js';
import blogRoutes from './routes/blogs.js';
import uploadRoutes from './routes/upload.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// ============================================
// ROUTES
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', moduleRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'CRE Annaba API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('🔴 Erreur serveur:', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// ============================================
// START
// ============================================

app.listen(PORT, () => {
  console.log(`\n🌿 CRE Annaba API Server`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}/api/health\n`);
});
