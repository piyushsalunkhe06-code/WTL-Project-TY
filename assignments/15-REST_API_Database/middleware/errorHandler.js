/**
 * ==============================================================================
 * KBTCOE Connect — Centralized Error Handling Middleware (middleware/errorHandler.js)
 * Assignment 15: REST API and Database
 * ==============================================================================
 */

'use strict';

/**
 * Centralized error handler that sanitizes technical database errors and runtime
 * exceptions into consistent, safe JSON responses without exposing stack traces.
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function errorHandler(err, req, res, next) {
  // Log error securely on server console (not exposed to client)
  console.error(`[SERVER ERROR] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}:`, err.message);

  // 1. Handle JSON parsing syntax errors thrown by express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON payload in request body. Please verify JSON syntax.',
      error: 'Invalid JSON syntax'
    });
  }

  // 2. Handle MySQL / MariaDB database errors
  if (err.code && (err.code.startsWith('ER_') || err.code === 'ECONNREFUSED')) {
    // Unique constraint violation (e.g. duplicate email)
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'A record with the specified unique field already exists.',
        error: 'Duplicate entry conflict'
      });
    }

    // Foreign key violation
    if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({
        success: false,
        message: 'Foreign key constraint violation. Referenced entity does not exist.',
        error: 'Integrity constraint failure'
      });
    }

    // Database connection failure
    if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST') {
      return res.status(503).json({
        success: false,
        message: 'Database service is temporarily unavailable. Please try again shortly.',
        error: 'Database connection failure'
      });
    }

    // Generic safe DB failure
    return res.status(500).json({
      success: false,
      message: 'A database query operation failed to execute.',
      error: 'Database execution error'
    });
  }

  // 3. Handle explicit HTTP status errors
  const statusCode = typeof err.status === 'number' && err.status >= 400 && err.status < 600
    ? err.status
    : 500;

  // 4. Return sanitized JSON without exposing stack traces
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'An unexpected internal server error occurred.' : err.message,
    error: statusCode === 500 ? 'Internal Server Error' : err.message
  });
}

module.exports = errorHandler;
