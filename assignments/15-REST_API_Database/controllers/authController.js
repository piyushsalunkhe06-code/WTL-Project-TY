/**
 * ==============================================================================
 * KBTCOE Connect — Authentication Controller (controllers/authController.js)
 * Assignment 15: REST API and Database
 * ==============================================================================
 */

'use strict';

const { pool } = require('../config/database');
const {
  validateRegisterInput,
  validateLoginInput,
  hashPassword,
  verifyPassword,
  signToken
} = require('../utils/validators');

/**
 * Strips sensitive fields (like password_hash) from a user database record.
 *
 * @param {Object} userRow
 * @returns {Object} Safe user representation
 */
function sanitizeUser(userRow) {
  const { password_hash, ...safeUser } = userRow;
  return safeUser;
}

/**
 * POST /api/auth/register
 * Registers a new collegiate user account with a hashed password and issues a signed JWT.
 */
async function register(req, res, next) {
  try {
    const validation = validateRegisterInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please correct registration inputs.',
        errors: validation.errors
      });
    }

    const { name, email, password, branch, academic_year } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check for duplicate email
    const [existing] = await pool.query('SELECT `id` FROM `users` WHERE `email` = ? LIMIT 1', [normalizedEmail]);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: `An account with email '${normalizedEmail}' already exists. Please log in or use a different email.`,
        error: 'Duplicate email address'
      });
    }

    // Hash password with scrypt
    const passwordHash = hashPassword(password);

    const sql = `
      INSERT INTO users (name, email, password_hash, branch, academic_year)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      name.trim(),
      normalizedEmail,
      passwordHash,
      branch.trim(),
      academic_year.toUpperCase().trim()
    ]);

    const newUserId = result.insertId;

    // Fetch newly created user profile (excluding password_hash)
    const [userRows] = await pool.query(
      'SELECT `id`, `name`, `email`, `branch`, `academic_year`, `created_at` FROM `users` WHERE `id` = ?',
      [newUserId]
    );

    const safeUser = userRows[0];

    // Generate JWT token
    const token = signToken({
      id: safeUser.id,
      email: safeUser.email,
      name: safeUser.name,
      branch: safeUser.branch
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: safeUser,
        token
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Authenticates user credentials safely and issues a signed JWT token.
 */
async function login(req, res, next) {
  try {
    const validation = validateLoginInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Email and password are required.',
        errors: validation.errors
      });
    }

    const { email, password } = req.body;
    const normalizedEmail = String(email).toLowerCase().trim();

    // Query user by email
    const [rows] = await pool.query('SELECT * FROM `users` WHERE `email` = ? LIMIT 1', [normalizedEmail]);

    // Constant-time check: if user doesn't exist, execute dummy verify to prevent timing attacks
    if (rows.length === 0) {
      // Dummy verification
      verifyPassword(password, 'scrypt$dummy$0000000000000000000000000000000000000000000000000000000000000000');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const user = rows[0];
    const isPasswordValid = verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const safeUser = sanitizeUser(user);

    // Generate JWT token
    const token = signToken({
      id: safeUser.id,
      email: safeUser.email,
      name: safeUser.name,
      branch: safeUser.branch
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: safeUser,
        token
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Retrieves current authenticated user's profile using token identity.
 */
async function getMe(req, res, next) {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      'SELECT `id`, `name`, `email`, `branch`, `academic_year`, `created_at` FROM `users` WHERE `id` = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Current user profile retrieved successfully',
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getMe
};
