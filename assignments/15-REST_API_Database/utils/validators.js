/**
 * ==============================================================================
 * KBTCOE Connect — Validation & Cryptography Utilities (utils/validators.js)
 * Assignment 15: REST API and Database
 * ==============================================================================
 */

'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Category Whitelists
const OPPORTUNITY_CATEGORIES = ['internship', 'hackathon', 'competition', 'workshop'];
const POST_CATEGORIES = ['technical', 'achievement', 'event', 'general'];
const ALLOWED_BRANCHES = [
  'Information Technology',
  'Computer Engineering',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Instrumentation & Control',
  'AI & Data Science'
];
const ALLOWED_ACADEMIC_YEARS = ['FE', 'SE', 'TE', 'BE'];

/**
 * Validates email address format.
 *
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return regex.test(email.trim());
}

/**
 * Validates calendar date formatted as YYYY-MM-DD.
 *
 * @param {string} dateString
 * @returns {boolean}
 */
function isValidDate(dateString) {
  if (typeof dateString !== 'string') return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  const d = new Date(dateString);
  return d instanceof Date && !isNaN(d.getTime()) && d.toISOString().startsWith(dateString);
}

/**
 * Validates web URL format (http / https).
 *
 * @param {string} urlString
 * @returns {boolean}
 */
function isValidUrl(urlString) {
  if (typeof urlString !== 'string') return false;
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// ==============================================================================
// Cryptographic Password Hashing via Node.js crypto.scrypt
// ==============================================================================

/**
 * Hashes a plaintext password using Node.js crypto.scrypt with a random salt.
 * Produces format: scrypt$salt$hash
 *
 * @param {string} password
 * @returns {string}
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

/**
 * Verifies a plaintext password against a stored scrypt hash using constant-time comparison.
 *
 * @param {string} password
 * @param {string} storedHash
 * @returns {boolean}
 */
function verifyPassword(password, storedHash) {
  if (typeof storedHash !== 'string' || !storedHash.startsWith('scrypt$')) {
    return false;
  }

  const parts = storedHash.split('$');
  if (parts.length !== 3) {
    return false;
  }

  const salt = parts[1];
  const originalHash = parts[2];
  const derivedKey = crypto.scryptSync(password, salt, 64);

  const keyBuffer = Buffer.from(derivedKey.toString('hex'), 'hex');
  const originalBuffer = Buffer.from(originalHash, 'hex');

  if (keyBuffer.length !== originalBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(keyBuffer, originalBuffer);
}

// ==============================================================================
// JSON Web Token (JWT) Operations
// ==============================================================================

const JWT_SECRET = process.env.JWT_SECRET || 'kbtcoe_default_development_secret_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generates and signs a JSON Web Token with user identity claims.
 *
 * @param {Object} payload - User claims (id, email, name, branch)
 * @returns {string} Signed JWT token string
 */
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verifies and decodes a JSON Web Token.
 *
 * @param {string} token
 * @returns {Object} Decoded payload
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// ==============================================================================
// Domain Input Validators
// ==============================================================================

/**
 * Validates registration input payload.
 *
 * @param {Object} body
 * @returns {{ isValid: boolean, errors: Array<{ field: string, message: string }> }}
 */
function validateRegisterInput(body) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return { isValid: false, errors: [{ field: 'body', message: 'Request body must be a JSON object' }] };
  }

  // Name
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name is required and must be at least 2 characters' });
  } else if (body.name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Name must not exceed 100 characters' });
  }

  // Email
  if (!body.email || !isValidEmail(body.email)) {
    errors.push({ field: 'email', message: 'A valid email address is required' });
  } else if (body.email.trim().length > 150) {
    errors.push({ field: 'email', message: 'Email must not exceed 150 characters' });
  }

  // Password
  if (!body.password || typeof body.password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (body.password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
  }

  // Branch
  if (!body.branch || typeof body.branch !== 'string' || body.branch.trim() === '') {
    errors.push({ field: 'branch', message: 'Engineering branch is required' });
  }

  // Academic Year
  if (!body.academic_year || typeof body.academic_year !== 'string') {
    errors.push({ field: 'academic_year', message: 'Academic year is required (FE, SE, TE, or BE)' });
  } else if (!ALLOWED_ACADEMIC_YEARS.includes(body.academic_year.toUpperCase().trim())) {
    errors.push({ field: 'academic_year', message: 'Academic year must be one of: FE, SE, TE, BE' });
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validates login input payload.
 *
 * @param {Object} body
 * @returns {{ isValid: boolean, errors: Array<{ field: string, message: string }> }}
 */
function validateLoginInput(body) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return { isValid: false, errors: [{ field: 'body', message: 'Request body must be a JSON object' }] };
  }

  if (!body.email || typeof body.email !== 'string' || body.email.trim() === '') {
    errors.push({ field: 'email', message: 'Email address is required' });
  }

  if (!body.password || typeof body.password !== 'string' || body.password === '') {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validates opportunity input for create (POST) or update (PUT).
 *
 * @param {Object} body
 * @param {boolean} isCreate
 * @returns {{ isValid: boolean, errors: Array<{ field: string, message: string }> }}
 */
function validateOpportunityInput(body, isCreate = true) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return { isValid: false, errors: [{ field: 'body', message: 'Request body must be a JSON object' }] };
  }

  if (isCreate || body.title !== undefined) {
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 3) {
      errors.push({ field: 'title', message: 'Title is required and must be at least 3 characters' });
    } else if (body.title.trim().length > 200) {
      errors.push({ field: 'title', message: 'Title must not exceed 200 characters' });
    }
  }

  if (isCreate || body.organization !== undefined) {
    if (!body.organization || typeof body.organization !== 'string' || body.organization.trim().length < 2) {
      errors.push({ field: 'organization', message: 'Organization is required and must be at least 2 characters' });
    } else if (body.organization.trim().length > 150) {
      errors.push({ field: 'organization', message: 'Organization must not exceed 150 characters' });
    }
  }

  if (isCreate || body.category !== undefined) {
    if (!body.category || typeof body.category !== 'string') {
      errors.push({ field: 'category', message: `Category is required: ${OPPORTUNITY_CATEGORIES.join(', ')}` });
    } else if (!OPPORTUNITY_CATEGORIES.includes(body.category.toLowerCase().trim())) {
      errors.push({ field: 'category', message: `Invalid category. Allowed values: ${OPPORTUNITY_CATEGORIES.join(', ')}` });
    }
  }

  if (isCreate || body.description !== undefined) {
    if (!body.description || typeof body.description !== 'string' || body.description.trim().length < 10) {
      errors.push({ field: 'description', message: 'Description is required and must be at least 10 characters' });
    }
  }

  if (isCreate || body.eligibility !== undefined) {
    if (!body.eligibility || typeof body.eligibility !== 'string' || body.eligibility.trim().length < 3) {
      errors.push({ field: 'eligibility', message: 'Eligibility criteria is required' });
    } else if (body.eligibility.trim().length > 255) {
      errors.push({ field: 'eligibility', message: 'Eligibility must not exceed 255 characters' });
    }
  }

  if (body.application_url !== undefined && body.application_url !== null && body.application_url !== '') {
    if (!isValidUrl(body.application_url)) {
      errors.push({ field: 'application_url', message: 'Application URL must be a valid http or https address' });
    }
  }

  if (body.deadline !== undefined && body.deadline !== null && body.deadline !== '') {
    if (!isValidDate(body.deadline)) {
      errors.push({ field: 'deadline', message: 'Deadline must be formatted as YYYY-MM-DD' });
    }
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validates community post input for create (POST) or update (PUT).
 *
 * @param {Object} body
 * @param {boolean} isCreate
 * @returns {{ isValid: boolean, errors: Array<{ field: string, message: string }> }}
 */
function validatePostInput(body, isCreate = true) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return { isValid: false, errors: [{ field: 'body', message: 'Request body must be a JSON object' }] };
  }

  if (isCreate || body.title !== undefined) {
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 3) {
      errors.push({ field: 'title', message: 'Post title is required and must be at least 3 characters' });
    } else if (body.title.trim().length > 200) {
      errors.push({ field: 'title', message: 'Post title must not exceed 200 characters' });
    }
  }

  if (isCreate || body.content !== undefined) {
    if (!body.content || typeof body.content !== 'string' || body.content.trim().length < 5) {
      errors.push({ field: 'content', message: 'Post content is required and must be at least 5 characters' });
    }
  }

  if (isCreate || body.category !== undefined) {
    if (!body.category || typeof body.category !== 'string') {
      errors.push({ field: 'category', message: `Category is required: ${POST_CATEGORIES.join(', ')}` });
    } else if (!POST_CATEGORIES.includes(body.category.toLowerCase().trim())) {
      errors.push({ field: 'category', message: `Invalid category. Allowed values: ${POST_CATEGORIES.join(', ')}` });
    }
  }

  return { isValid: errors.length === 0, errors };
}

module.exports = {
  OPPORTUNITY_CATEGORIES,
  POST_CATEGORIES,
  ALLOWED_BRANCHES,
  ALLOWED_ACADEMIC_YEARS,
  isValidEmail,
  isValidDate,
  isValidUrl,
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  validateRegisterInput,
  validateLoginInput,
  validateOpportunityInput,
  validatePostInput
};
