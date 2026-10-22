/**
 * ==============================================================================
 * KBTCOE Connect — 404 Not Found Middleware (middleware/notFound.js)
 * Assignment 15: REST API and Database
 * ==============================================================================
 */

'use strict';

/**
 * Handles incoming requests that do not match any defined application routes.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Resource not found: Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      'GET /api/health',
      'GET /api/opportunities',
      'GET /api/opportunities/:id',
      'POST /api/opportunities',
      'PUT /api/opportunities/:id',
      'DELETE /api/opportunities/:id',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'GET /api/posts',
      'GET /api/posts/:id',
      'POST /api/posts',
      'PUT /api/posts/:id',
      'DELETE /api/posts/:id'
    ]
  });
}

module.exports = notFound;
