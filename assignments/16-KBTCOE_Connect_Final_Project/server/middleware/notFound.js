/**
 * 404 Route Not Found Middleware
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `The requested endpoint '${req.method} ${req.originalUrl}' does not exist on this server.`,
    availableEndpoints: [
      'GET    /api/health',
      'GET    /api/dashboard/stats',
      'POST   /api/auth/register',
      'POST   /api/auth/login',
      'GET    /api/auth/me',
      'GET    /api/users',
      'GET    /api/users/:id',
      'PUT    /api/users/profile',
      'GET    /api/posts',
      'GET    /api/posts/:id',
      'POST   /api/posts',
      'PUT    /api/posts/:id',
      'DELETE /api/posts/:id',
      'GET    /api/posts/:id/comments',
      'POST   /api/posts/:id/comments',
      'DELETE /api/comments/:id',
      'POST   /api/posts/:id/like',
      'GET    /api/achievements',
      'GET    /api/achievements/:id',
      'POST   /api/achievements',
      'PUT    /api/achievements/:id',
      'DELETE /api/achievements/:id',
      'GET    /api/opportunities',
      'GET    /api/opportunities/:id',
      'POST   /api/opportunities',
      'PUT    /api/opportunities/:id',
      'DELETE /api/opportunities/:id'
    ]
  });
}

module.exports = notFound;
