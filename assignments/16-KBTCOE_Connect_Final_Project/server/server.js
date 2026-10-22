/**
 * KBTCOE Connect — Final Capstone REST API Server
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { checkConnection } = require('./config/database');
const requestLogger = require('./middleware/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// Route modules
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const achievementRoutes = require('./routes/achievements');
const opportunityRoutes = require('./routes/opportunities');

const app = express();
const PORT = process.env.PORT || 5000;

// ==============================================================================
// 1. Core Middleware
// ==============================================================================

// Enable Cross-Origin Resource Sharing (CORS) for client React SPA
app.use(cors({
  origin: true, // Allow frontend dev server and preview origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(requestLogger);

// ==============================================================================
// 2. Health & Root Greeting
// ==============================================================================

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'KBTCOE Connect Final Capstone REST API',
    institution: "MVP's K.B.T. College of Engineering, Nashik",
    department: 'Department of Computer Engineering',
    version: '1.0.0',
    status: 'operational',
    documentation: 'See README.md for endpoint specifications.'
  });
});

app.get('/api/health', async (req, res) => {
  const dbHealth = await checkConnection();
  const uptimeSeconds = Math.floor(process.uptime());

  res.status(dbHealth.isConnected ? 200 : 503).json({
    success: dbHealth.isConnected,
    message: dbHealth.isConnected
      ? 'KBTCOE Connect backend service and MariaDB are healthy and operational.'
      : 'API is running but relational database is unreachable.',
    data: {
      status: dbHealth.isConnected ? 'UP' : 'DEGRADED',
      service: 'KBTCOE Connect Final Capstone REST API',
      version: '1.0.0',
      database: {
        connected: dbHealth.isConnected,
        engine: 'MySQL / MariaDB',
        version: dbHealth.version || 'Unknown',
        schema: dbHealth.database || 'kbtcoe_connect_final'
      },
      uptimeSeconds,
      timestamp: new Date().toISOString()
    }
  });
});

// ==============================================================================
// 3. Mount Resource Routes
// ==============================================================================

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/opportunities', opportunityRoutes);

// ==============================================================================
// 4. Error Handling & 404
// ==============================================================================

app.use(notFound);
app.use(errorHandler);

// ==============================================================================
// 5. Server Lifecycle
// ==============================================================================

let server = null;

if (require.main === module) {
  server = app.listen(PORT, async () => {
    console.log('================================================================');
    console.log('  KBTCOE Connect - Final Capstone Backend REST API Server');
    console.log('  Department of Computer Engineering, MVP\'s KBTCOE Nashik');
    console.log('================================================================');
    console.log(`📡 Base URL:          http://localhost:${PORT}`);
    console.log(`🏥 Health Check:      http://localhost:${PORT}/api/health`);
    console.log(`📊 Dashboard API:     http://localhost:${PORT}/api/dashboard/stats`);
    console.log(`🔐 Auth API:          http://localhost:${PORT}/api/auth`);
    console.log(`👥 Students API:      http://localhost:${PORT}/api/users`);
    console.log(`💬 Posts API:         http://localhost:${PORT}/api/posts`);
    console.log(`🏆 Achievements API:  http://localhost:${PORT}/api/achievements`);
    console.log(`💼 Opportunities API: http://localhost:${PORT}/api/opportunities`);

    const dbHealth = await checkConnection();
    if (dbHealth.isConnected) {
      console.log(`🟢 Database:          Connected to '${dbHealth.database}' (${dbHealth.version})`);
    } else {
      console.log(`🔴 Database:          Connection failed (${dbHealth.error})`);
    }
    console.log('================================================================\n');
  });

  const shutdown = (signal) => {
    console.log(`\n[SHUTDOWN] Received ${signal}. Closing server gracefully...`);
    if (server) {
      server.close(() => {
        console.log('[SHUTDOWN] HTTP server closed gracefully. Exiting process.');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

module.exports = {
  app,
  server,
  PORT
};
