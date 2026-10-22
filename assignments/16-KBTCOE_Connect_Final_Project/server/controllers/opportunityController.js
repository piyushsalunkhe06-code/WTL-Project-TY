/**
 * Campus Opportunities Controller
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

const { pool } = require('../config/database');
const { validateOpportunityInput, OPPORTUNITY_CATEGORIES } = require('../utils/validators');

/**
 * GET /api/opportunities
 * Retrieves opportunities with search, category filtering, and deadline indicators.
 */
async function getOpportunities(req, res, next) {
  try {
    const { category, q, status } = req.query;

    let sql = `
      SELECT 
        o.id,
        o.title,
        o.organization,
        o.category,
        o.description,
        o.eligibility,
        o.application_url,
        o.deadline,
        o.created_by,
        o.created_at,
        u.name AS creator_name,
        (o.deadline IS NOT NULL AND o.deadline < CURDATE()) AS is_expired
      FROM opportunities o
      LEFT JOIN users u ON o.created_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (category && category !== 'all') {
      const normalizedCat = String(category).toLowerCase().trim();
      if (!OPPORTUNITY_CATEGORIES.includes(normalizedCat)) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: `Invalid category '${category}'. Allowed values: ${OPPORTUNITY_CATEGORIES.join(', ')}.`
        });
      }
      sql += ' AND o.category = ?';
      params.push(normalizedCat);
    }

    if (q) {
      const trimmed = q.trim();
      if (trimmed !== '') {
        sql += ' AND (o.title LIKE ? OR o.organization LIKE ? OR o.description LIKE ?)';
        const wild = `%${trimmed}%`;
        params.push(wild, wild, wild);
      }
    }

    if (status === 'upcoming') {
      sql += ' AND (o.deadline IS NULL OR o.deadline >= CURDATE())';
    } else if (status === 'expired') {
      sql += ' AND (o.deadline IS NOT NULL AND o.deadline < CURDATE())';
    }

    sql += ' ORDER BY CASE WHEN o.deadline IS NULL THEN 1 ELSE 0 END, o.deadline ASC, o.created_at DESC';

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
 * GET /api/opportunities/:id
 * Retrieves a single opportunity by ID.
 */
async function getOpportunityById(req, res, next) {
  try {
    const oppId = Number(req.params.id);
    if (!Number.isInteger(oppId) || oppId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid opportunity ID parameter.'
      });
    }

    const [rows] = await pool.query(`
      SELECT 
        o.id,
        o.title,
        o.organization,
        o.category,
        o.description,
        o.eligibility,
        o.application_url,
        o.deadline,
        o.created_by,
        o.created_at,
        u.name AS creator_name,
        (o.deadline IS NOT NULL AND o.deadline < CURDATE()) AS is_expired
      FROM opportunities o
      LEFT JOIN users u ON o.created_by = u.id
      WHERE o.id = ?
    `, [oppId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Opportunity with ID ${oppId} was not found.`
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
 * POST /api/opportunities
 * Publishes a new campus opportunity. Requires authentication.
 */
async function createOpportunity(req, res, next) {
  try {
    const validation = validateOpportunityInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid opportunity inputs.',
        details: validation.errors
      });
    }

    const { title, organization, category, description, eligibility, application_url, deadline } = req.body;
    const userId = req.user.id;

    const [result] = await pool.query(
      `INSERT INTO opportunities (title, organization, category, description, eligibility, application_url, deadline, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        organization.trim(),
        String(category).toLowerCase().trim(),
        description.trim(),
        eligibility.trim(),
        application_url.trim(),
        deadline || null,
        userId
      ]
    );

    const [rows] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Campus opportunity published successfully.',
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/opportunities/:id
 * Updates an opportunity. Requires creator or admin ownership.
 */
async function updateOpportunity(req, res, next) {
  try {
    const oppId = Number(req.params.id);
    if (!Number.isInteger(oppId) || oppId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid opportunity ID parameter.'
      });
    }

    const validation = validateOpportunityInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid opportunity inputs.',
        details: validation.errors
      });
    }

    const [existing] = await pool.query('SELECT created_by FROM opportunities WHERE id = ?', [oppId]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Opportunity with ID ${oppId} was not found.`
      });
    }

    // Ownership check (creator or admin)
    if (existing[0].created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Access forbidden. You do not have permission to modify this opportunity.'
      });
    }

    const { title, organization, category, description, eligibility, application_url, deadline } = req.body;

    await pool.query(
      `UPDATE opportunities
       SET title = ?, organization = ?, category = ?, description = ?, eligibility = ?, application_url = ?, deadline = ?
       WHERE id = ?`,
      [
        title.trim(),
        organization.trim(),
        String(category).toLowerCase().trim(),
        description.trim(),
        eligibility.trim(),
        application_url.trim(),
        deadline || null,
        oppId
      ]
    );

    const [rows] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [oppId]);

    res.status(200).json({
      success: true,
      message: 'Opportunity updated successfully.',
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/opportunities/:id
 * Deletes an opportunity. Requires creator or admin ownership.
 */
async function deleteOpportunity(req, res, next) {
  try {
    const oppId = Number(req.params.id);
    if (!Number.isInteger(oppId) || oppId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid opportunity ID parameter.'
      });
    }

    const [existing] = await pool.query('SELECT created_by FROM opportunities WHERE id = ?', [oppId]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Opportunity with ID ${oppId} was not found.`
      });
    }

    // Ownership check
    if (existing[0].created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Access forbidden. You do not have permission to delete this opportunity.'
      });
    }

    await pool.query('DELETE FROM opportunities WHERE id = ?', [oppId]);

    res.status(200).json({
      success: true,
      message: `Opportunity ${oppId} was deleted successfully.`
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity
};
