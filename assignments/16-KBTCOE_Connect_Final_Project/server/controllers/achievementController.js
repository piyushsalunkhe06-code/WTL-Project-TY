/**
 * Student Achievements Controller
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

const { pool } = require('../config/database');
const { validateAchievementInput, ACHIEVEMENT_CATEGORIES } = require('../utils/validators');

/**
 * GET /api/achievements
 * Retrieves student achievements with optional category and user_id filters.
 */
async function getAchievements(req, res, next) {
  try {
    const { category, user_id, q } = req.query;

    let sql = `
      SELECT 
        a.id,
        a.user_id,
        a.title,
        a.category,
        a.description,
        a.date_achieved,
        a.external_url,
        a.created_at,
        u.name AS student_name,
        u.branch AS student_branch,
        u.academic_year AS student_year
      FROM achievements a
      INNER JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (category && category !== 'all') {
      const normalizedCat = String(category).toLowerCase().trim();
      if (!ACHIEVEMENT_CATEGORIES.includes(normalizedCat)) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: `Invalid achievement category '${category}'. Allowed values: ${ACHIEVEMENT_CATEGORIES.join(', ')}.`
        });
      }
      sql += ' AND a.category = ?';
      params.push(normalizedCat);
    }

    if (user_id) {
      const numUserId = Number(user_id);
      if (Number.isInteger(numUserId) && numUserId > 0) {
        sql += ' AND a.user_id = ?';
        params.push(numUserId);
      }
    }

    if (q) {
      const trimmed = q.trim();
      if (trimmed !== '') {
        sql += ' AND (a.title LIKE ? OR a.description LIKE ? OR u.name LIKE ?)';
        const wild = `%${trimmed}%`;
        params.push(wild, wild, wild);
      }
    }

    sql += ' ORDER BY a.date_achieved DESC, a.created_at DESC';

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
 * GET /api/achievements/:id
 * Retrieves a single achievement by ID.
 */
async function getAchievementById(req, res, next) {
  try {
    const achievementId = Number(req.params.id);
    if (!Number.isInteger(achievementId) || achievementId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid achievement ID parameter.'
      });
    }

    const [rows] = await pool.query(`
      SELECT 
        a.id,
        a.user_id,
        a.title,
        a.category,
        a.description,
        a.date_achieved,
        a.external_url,
        a.created_at,
        u.name AS student_name,
        u.branch AS student_branch,
        u.academic_year AS student_year
      FROM achievements a
      INNER JOIN users u ON a.user_id = u.id
      WHERE a.id = ?
    `, [achievementId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Achievement with ID ${achievementId} was not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/achievements
 * Records a new achievement for the authenticated student.
 */
async function createAchievement(req, res, next) {
  try {
    const validation = validateAchievementInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid achievement inputs.',
        details: validation.errors
      });
    }

    const { title, category, description, date_achieved, external_url } = req.body;
    const userId = req.user.id;

    const [result] = await pool.query(
      `INSERT INTO achievements (user_id, title, category, description, date_achieved, external_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        title.trim(),
        String(category).toLowerCase().trim(),
        description.trim(),
        date_achieved,
        external_url ? external_url.trim() : null
      ]
    );

    const [rows] = await pool.query(`
      SELECT 
        a.id,
        a.user_id,
        a.title,
        a.category,
        a.description,
        a.date_achieved,
        a.external_url,
        a.created_at,
        u.name AS student_name,
        u.branch AS student_branch
      FROM achievements a
      INNER JOIN users u ON a.user_id = u.id
      WHERE a.id = ?
    `, [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Achievement recorded successfully.',
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/achievements/:id
 * Updates an achievement record. Enforces author ownership boundary.
 */
async function updateAchievement(req, res, next) {
  try {
    const achievementId = Number(req.params.id);
    if (!Number.isInteger(achievementId) || achievementId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid achievement ID parameter.'
      });
    }

    const validation = validateAchievementInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid achievement inputs.',
        details: validation.errors
      });
    }

    const [existing] = await pool.query('SELECT user_id FROM achievements WHERE id = ?', [achievementId]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Achievement with ID ${achievementId} was not found.`
      });
    }

    // Ownership check
    if (existing[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Access forbidden. You do not have permission to modify achievements recorded by other students.'
      });
    }

    const { title, category, description, date_achieved, external_url } = req.body;

    await pool.query(
      `UPDATE achievements 
       SET title = ?, category = ?, description = ?, date_achieved = ?, external_url = ?
       WHERE id = ?`,
      [
        title.trim(),
        String(category).toLowerCase().trim(),
        description.trim(),
        date_achieved,
        external_url ? external_url.trim() : null,
        achievementId
      ]
    );

    const [rows] = await pool.query('SELECT * FROM achievements WHERE id = ?', [achievementId]);

    res.status(200).json({
      success: true,
      message: 'Achievement updated successfully.',
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/achievements/:id
 * Removes an achievement record. Enforces author ownership boundary.
 */
async function deleteAchievement(req, res, next) {
  try {
    const achievementId = Number(req.params.id);
    if (!Number.isInteger(achievementId) || achievementId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid achievement ID parameter.'
      });
    }

    const [existing] = await pool.query('SELECT user_id FROM achievements WHERE id = ?', [achievementId]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Achievement with ID ${achievementId} was not found.`
      });
    }

    // Ownership check
    if (existing[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Access forbidden. You do not have permission to delete achievements recorded by other students.'
      });
    }

    await pool.query('DELETE FROM achievements WHERE id = ?', [achievementId]);

    res.status(200).json({
      success: true,
      message: `Achievement ${achievementId} was deleted successfully.`
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement
};
