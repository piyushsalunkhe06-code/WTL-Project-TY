/**
 * User & Student Directory Controller
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

const { pool } = require('../config/database');
const { BRANCHES, ACADEMIC_YEARS } = require('../utils/validators');

/**
 * GET /api/users
 * Returns list of students with optional search and branch filtering.
 */
async function getUsers(req, res, next) {
  try {
    const { q, branch, year } = req.query;

    let sql = `
      SELECT 
        id,
        name,
        email,
        branch,
        academic_year,
        role,
        bio,
        skills,
        interests,
        github_url,
        portfolio_url,
        created_at
      FROM users
      WHERE role = 'student'
    `;
    const params = [];

    if (branch && branch !== 'all') {
      sql += ' AND branch = ?';
      params.push(branch.trim());
    }

    if (year && year !== 'all') {
      sql += ' AND academic_year = ?';
      params.push(year.trim());
    }

    if (q) {
      const trimmed = q.trim();
      if (trimmed !== '') {
        sql += ' AND (name LIKE ? OR skills LIKE ? OR bio LIKE ? OR interests LIKE ?)';
        const wild = `%${trimmed}%`;
        params.push(wild, wild, wild, wild);
      }
    }

    sql += ' ORDER BY name ASC';

    const [rows] = await pool.query(sql, params);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/users/:id
 * Retrieves public profile of a student including their posts and achievements.
 */
async function getUserById(req, res, next) {
  try {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid user ID parameter. Must be a positive integer.'
      });
    }

    const [users] = await pool.query(`
      SELECT 
        id,
        name,
        email,
        branch,
        academic_year,
        role,
        bio,
        skills,
        interests,
        github_url,
        portfolio_url,
        created_at
      FROM users
      WHERE id = ?
    `, [userId]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Student profile with ID ${userId} was not found.`
      });
    }

    const student = users[0];

    // Fetch achievements
    const [achievements] = await pool.query(`
      SELECT id, title, category, description, date_achieved, external_url, created_at
      FROM achievements
      WHERE user_id = ?
      ORDER BY date_achieved DESC
    `, [userId]);

    // Fetch posts
    const [posts] = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.category,
        p.created_at,
        (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments_count
      FROM posts p
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `, [userId]);

    res.status(200).json({
      success: true,
      data: {
        ...student,
        achievements,
        posts
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/users/profile
 * Allows authenticated user to update their own profile details.
 * Enforces ownership boundary by strictly using req.user.id.
 */
async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, branch, academic_year, bio, skills, interests, github_url, portfolio_url } = req.body;

    const updates = [];
    const params = [];

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Full name must be at least 2 characters.'
        });
      }
      updates.push('name = ?');
      params.push(name.trim());
    }

    if (branch !== undefined) {
      if (!BRANCHES.includes(branch.trim())) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: `Branch must be one of: ${BRANCHES.join(', ')}.`
        });
      }
      updates.push('branch = ?');
      params.push(branch.trim());
    }

    if (academic_year !== undefined) {
      if (!ACADEMIC_YEARS.includes(academic_year.trim())) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: `Academic year must be one of: ${ACADEMIC_YEARS.join(', ')}.`
        });
      }
      updates.push('academic_year = ?');
      params.push(academic_year.trim());
    }

    if (bio !== undefined) {
      updates.push('bio = ?');
      params.push(bio ? bio.trim() : null);
    }

    if (skills !== undefined) {
      updates.push('skills = ?');
      params.push(skills ? skills.trim() : null);
    }

    if (interests !== undefined) {
      updates.push('interests = ?');
      params.push(interests ? interests.trim() : null);
    }

    if (github_url !== undefined) {
      updates.push('github_url = ?');
      params.push(github_url ? github_url.trim() : null);
    }

    if (portfolio_url !== undefined) {
      updates.push('portfolio_url = ?');
      params.push(portfolio_url ? portfolio_url.trim() : null);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'No updatable fields provided in request body.'
      });
    }

    params.push(userId);
    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

    await pool.query(sql, params);

    const [rows] = await pool.query(`
      SELECT 
        id, name, email, branch, academic_year, role, bio, skills, interests, github_url, portfolio_url, created_at, updated_at
      FROM users WHERE id = ?
    `, [userId]);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsers,
  getUserById,
  updateProfile
};
