/**
 * ==============================================================================
 * KBTCOE Connect — JWT Authentication Middleware (middleware/authMiddleware.js)
 * Assignment 15: REST API and Database
 * ==============================================================================
 */

'use strict';

const { verifyToken } = require('../utils/validators');

/**
 * Authentication middleware that verifies the incoming Bearer JWT token in the Authorization header.
 * Attaches decoded user identity claims to req.user.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || typeof authHeader !== 'string') {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization header provided. Please provide a Bearer token.'
    });
  }

  const parts = authHeader.trim().split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Malformed authorization header. Expected format: Bearer <token>'
    });
  }

  const token = parts[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { id, email, name, branch, iat, exp }
    next();
  } catch (err) {
    const isExpired = err.name === 'TokenExpiredError';
    return res.status(401).json({
      success: false,
      message: isExpired ? 'Authorization token has expired. Please log in again.' : 'Invalid authorization token.'
    });
  }
}

module.exports = authMiddleware;
