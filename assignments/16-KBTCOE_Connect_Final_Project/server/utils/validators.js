/**
 * Cryptographic & Input Validation Utilities
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'kbtcoe_connect_capstone_2026_jwt_secret_key_te_be_comp_it';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

const OPPORTUNITY_CATEGORIES = ['internship', 'hackathon', 'competition', 'workshop'];
const POST_CATEGORIES = ['technical', 'achievement', 'event', 'general'];
const ACHIEVEMENT_CATEGORIES = ['hackathon', 'competition', 'certification', 'project', 'workshop', 'academic'];
const BRANCHES = [
  'Computer Engineering',
  'Information Technology',
  'Artificial Intelligence & Data Science',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electronics & Telecommunication',
  'Instrumentation Engineering'
];
const ACADEMIC_YEARS = ['FE', 'SE', 'TE', 'BE', 'Faculty', 'Alumni'];

// ==============================================================================
// 1. Cryptographic Password Hashing (scrypt + timingSafeEqual)
// ==============================================================================

/**
 * Hashes a plain password using Node.js native crypto.scrypt with a random 16-byte salt.
 * Formatted as: `scrypt$<saltHex>$<hashHex>`
 *
 * @param {string} password
 * @returns {string} Salted scrypt digest string
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

/**
 * Validates a plain password against an scrypt digest string using constant-time comparison.
 *
 * @param {string} password
 * @param {string} storedHash
 * @returns {boolean} True if password matches hash
 */
function verifyPassword(password, storedHash) {
  try {
    if (!storedHash || !storedHash.startsWith('scrypt$')) {
      return false;
    }

    const parts = storedHash.split('$');
    if (parts.length !== 3) {
      return false;
    }

    const salt = parts[1];
    const key = parts[2];
    const keyBuffer = Buffer.from(key, 'hex');

    const derivedKey = crypto.scryptSync(password, salt, keyBuffer.length);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch (err) {
    return false;
  }
}

// ==============================================================================
// 2. Stateless JWT Management
// ==============================================================================

/**
 * Issues a signed JSON Web Token carrying user identification claims.
 *
 * @param {Object} payload Claims: { id, email, role, name, branch }
 * @returns {string} Signed JWT token string
 */
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verifies and decodes a JSON Web Token.
 *
 * @param {string} token
 * @returns {Object} Decoded token claims
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// ==============================================================================
// 3. Request Input Validation
// ==============================================================================

/**
 * Checks for a standard valid email format.
 *
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(email.trim());
}

/**
 * Validates user registration payload.
 *
 * @param {Object} data
 * @returns {{ isValid: boolean, errors: string[] }}
 */
function validateRegisterInput(data) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Request body must be a JSON object.'] };
  }

  const { name, email, password, branch, academic_year } = data;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Full name must be at least 2 characters.');
  }

  if (!email || !isValidEmail(email)) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }

  if (!branch || typeof branch !== 'string' || !BRANCHES.includes(branch.trim())) {
    errors.push(`Branch must be one of: ${BRANCHES.join(', ')}.`);
  }

  if (!academic_year || typeof academic_year !== 'string' || !ACADEMIC_YEARS.includes(academic_year.trim())) {
    errors.push(`Academic year must be one of: ${ACADEMIC_YEARS.join(', ')}.`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates user login payload.
 *
 * @param {Object} data
 * @returns {{ isValid: boolean, errors: string[] }}
 */
function validateLoginInput(data) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Request body must be a JSON object.'] };
  }

  const { email, password } = data;

  if (!email || !isValidEmail(email)) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push('Password is required.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates post creation/update payload.
 *
 * @param {Object} data
 * @returns {{ isValid: boolean, errors: string[] }}
 */
function validatePostInput(data) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Request body must be a JSON object.'] };
  }

  const { title, content, category } = data;

  if (!title || typeof title !== 'string' || title.trim().length < 5) {
    errors.push('Post title must be at least 5 characters long.');
  }

  if (!content || typeof content !== 'string' || content.trim().length < 10) {
    errors.push('Post content must be at least 10 characters long.');
  }

  if (category && !POST_CATEGORIES.includes(String(category).toLowerCase().trim())) {
    errors.push(`Category must be one of: ${POST_CATEGORIES.join(', ')}.`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates comment payload.
 *
 * @param {Object} data
 * @returns {{ isValid: boolean, errors: string[] }}
 */
function validateCommentInput(data) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Request body must be a JSON object.'] };
  }

  const { content } = data;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    errors.push('Comment content cannot be empty.');
  } else if (content.trim().length > 500) {
    errors.push('Comment cannot exceed 500 characters.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates achievement payload.
 *
 * @param {Object} data
 * @returns {{ isValid: boolean, errors: string[] }}
 */
function validateAchievementInput(data) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Request body must be a JSON object.'] };
  }

  const { title, category, description, date_achieved } = data;

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push('Achievement title must be at least 3 characters.');
  }

  if (!category || !ACHIEVEMENT_CATEGORIES.includes(String(category).toLowerCase().trim())) {
    errors.push(`Category must be one of: ${ACHIEVEMENT_CATEGORIES.join(', ')}.`);
  }

  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters.');
  }

  if (!date_achieved || isNaN(Date.parse(date_achieved))) {
    errors.push('A valid achievement date is required (YYYY-MM-DD).');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates opportunity creation/update payload.
 *
 * @param {Object} data
 * @returns {{ isValid: boolean, errors: string[] }}
 */
function validateOpportunityInput(data) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Request body must be a JSON object.'] };
  }

  const { title, organization, category, description, eligibility, application_url, deadline } = data;

  if (!title || typeof title !== 'string' || title.trim().length < 5) {
    errors.push('Opportunity title must be at least 5 characters.');
  }

  if (!organization || typeof organization !== 'string' || organization.trim().length < 2) {
    errors.push('Organization name must be at least 2 characters.');
  }

  if (!category || !OPPORTUNITY_CATEGORIES.includes(String(category).toLowerCase().trim())) {
    errors.push(`Category must be one of: ${OPPORTUNITY_CATEGORIES.join(', ')}.`);
  }

  if (!description || typeof description !== 'string' || description.trim().length < 15) {
    errors.push('Description must be at least 15 characters.');
  }

  if (!eligibility || typeof eligibility !== 'string' || eligibility.trim().length < 3) {
    errors.push('Eligibility criteria must be specified.');
  }

  if (!application_url || typeof application_url !== 'string' || !application_url.startsWith('http')) {
    errors.push('Application URL must be a valid web address starting with http:// or https://.');
  }

  if (deadline && isNaN(Date.parse(deadline))) {
    errors.push('Deadline must be a valid date (YYYY-MM-DD).');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  OPPORTUNITY_CATEGORIES,
  POST_CATEGORIES,
  ACHIEVEMENT_CATEGORIES,
  BRANCHES,
  ACADEMIC_YEARS,
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  isValidEmail,
  validateRegisterInput,
  validateLoginInput,
  validatePostInput,
  validateCommentInput,
  validateAchievementInput,
  validateOpportunityInput
};
