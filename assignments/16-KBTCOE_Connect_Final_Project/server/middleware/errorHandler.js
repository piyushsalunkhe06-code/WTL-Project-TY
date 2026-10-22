/**
 * Centralized Error-Handling Middleware
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

function errorHandler(err, req, res, next) {
  // Capture BodyParser malformed JSON errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Malformed JSON payload in request body. Please verify syntax.'
    });
  }

  // Safe internal server logging (scrubs stack traces from client response)
  console.error(`[SERVER ERROR] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}:`, err.message);

  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.isOperational ? err.message : 'An unexpected internal server error occurred.'
  });
}

module.exports = errorHandler;
