/**
 * JWT Authentication & Authorization Middleware
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

const { verifyToken } = require('../utils/validators');

/**
 * Enforces mandatory JWT Bearer authentication.
 * Attaches decoded claims { id, email, role, name, branch } to req.user.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Access denied. Authorization header with Bearer token is required.'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: "Malformed Authorization header. Format must be 'Bearer <token>'."
    });
  }

  const token = parts[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Your session has expired. Please log in again to continue.'
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid or forged authentication token.'
    });
  }
}

/**
 * Optional authentication middleware.
 * If Bearer token is provided and valid, sets req.user. If absent or invalid, sets req.user = null.
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.user = null;
    return next();
  }

  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    try {
      req.user = verifyToken(parts[1]);
    } catch (e) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
}

/**
 * Role-based permission guard middleware factory.
 * Requires user to have a specific role (e.g., 'admin').
 *
 * @param {string} requiredRole
 */
function requireRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required.'
      });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: `Access forbidden. This action requires '${requiredRole}' privileges.`
      });
    }

    next();
  };
}

module.exports = {
  requireAuth,
  optionalAuth,
  requireRole
};
