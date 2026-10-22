/**
 * ==============================================================================
 * KBTCOE Connect — Centralized Error Handling Middleware (errorHandler.js)
 * Assignment 14: Node.js and Express Server
 * ==============================================================================
 */

'use strict';

/**
 * Express centralized 4-parameter error handler.
 * Safely transforms uncaught exceptions and body-parser syntax errors
 * into structured JSON responses without leaking internal stack traces.
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function errorHandler(err, req, res, next) {
  // Log error securely on server console (not exposed to client)
  console.error(`[SERVER ERROR] ${new Date().toISOString()} - ${req.method} ${req.url}:`, err.message);

  // 1. Handle JSON parsing syntax errors thrown by express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON payload in request body. Please verify JSON syntax.',
      error: 'Invalid JSON syntax'
    });
  }

  // 2. Handle explicitly set HTTP status errors
  const statusCode = typeof err.status === 'number' && err.status >= 400 && err.status < 600
    ? err.status
    : 500;

  // 3. Return sanitized JSON without exposing stack traces
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'An unexpected internal server error occurred' : err.message,
    error: statusCode === 500 ? 'Internal Server Error' : err.message
  });
}

module.exports = errorHandler;
