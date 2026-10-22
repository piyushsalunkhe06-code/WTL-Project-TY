/**
 * Sanitized HTTP Request Logger Middleware
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

function requestLogger(req, res, next) {
  const start = Date.now();
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  res.on('finish', () => {
    const duration = Date.now() - start;
    // Strictly sanitize: NEVER log passwords, body payloads, or authorization tokens
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });

  next();
}

module.exports = requestLogger;
