/**
 * Authentication Controller
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

const { pool } = require('../config/database');
const {
  hashPassword,
  verifyPassword,
  signToken,
  validateRegisterInput,
  validateLoginInput
} = require('../utils/validators');

/**
 * Strips password_hash from user record before responding.
 */
function sanitizeUser(user) {
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

/**
 * POST /api/auth/register
 * Registers a new student or faculty account.
 */
async function register(req, res, next) {
  try {
    const validation = validateRegisterInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid registration inputs.',
        details: validation.errors
      });
    }

    const { name, email, password, branch, academic_year, bio, skills, interests, github_url, portfolio_url } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate email
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [normalizedEmail]);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: `An account with email '${normalizedEmail}' already exists. Please log in or use a different email.`
      });
    }

    // Hash password with scrypt
    const passwordHash = hashPassword(password);

    // Default role is always 'student' for public registration (prevent privilege escalation)
    const role = 'student';

    const [result] = await pool.query(
      `INSERT INTO users (name, email, password_hash, branch, academic_year, role, bio, skills, interests, github_url, portfolio_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        normalizedEmail,
        passwordHash,
        branch.trim(),
        academic_year.trim(),
        role,
        bio ? bio.trim() : null,
        skills ? skills.trim() : null,
        interests ? interests.trim() : null,
        github_url ? github_url.trim() : null,
        portfolio_url ? portfolio_url.trim() : null
      ]
    );

    const [userRows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    const safeUser = sanitizeUser(userRows[0]);

    // Issue JWT
    const token = signToken({
      id: safeUser.id,
      email: safeUser.email,
      role: safeUser.role,
      name: safeUser.name,
      branch: safeUser.branch
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully. Welcome to KBTCOE Connect!',
      data: {
        token,
        user: safeUser
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Authenticates user credentials safely and returns signed JWT token.
 */
async function login(req, res, next) {
  try {
    const validation = validateLoginInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid login inputs.',
        details: validation.errors
      });
    }

    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [normalizedEmail]);

    if (rows.length === 0) {
      // Execute dummy verify to protect against timing enumeration attacks
      verifyPassword(password, 'scrypt$1a2b3c4d5e6f7a8b$0000000000000000000000000000000000000000000000000000000000000000');
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid email address or password.'
      });
    }

    const user = rows[0];
    const isPasswordValid = verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid email address or password.'
      });
    }

    const safeUser = sanitizeUser(user);
    const token = signToken({
      id: safeUser.id,
      email: safeUser.email,
      role: safeUser.role,
      name: safeUser.name,
      branch: safeUser.branch
    });

    res.status(200).json({
      success: true,
      message: 'Authentication successful. Welcome back!',
      data: {
        token,
        user: safeUser
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Retrieves current authenticated user profile.
 */
async function getMe(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User profile not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: sanitizeUser(rows[0])
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getMe,
  sanitizeUser
};
