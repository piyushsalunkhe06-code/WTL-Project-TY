/**
 * ==============================================================================
 * KBTCOE Connect — 404 Not Found Middleware (notFound.js)
 * Assignment 14: Node.js and Express Server
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
      'GET /',
      'GET /api/health',
      'GET /api/opportunities',
      'GET /api/opportunities/:id',
      'POST /api/opportunities',
      'PUT /api/opportunities/:id',
      'DELETE /api/opportunities/:id'
    ]
  });
}

module.exports = notFound;
