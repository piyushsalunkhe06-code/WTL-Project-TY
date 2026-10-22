/**
 * ==============================================================================
 * KBTCOE Connect — Opportunity Controller (controllers/opportunityController.js)
 * Assignment 15: REST API and Database
 * ==============================================================================
 */

'use strict';

const { pool } = require('../config/database');
const { validateOpportunityInput, OPPORTUNITY_CATEGORIES } = require('../utils/validators');

/**
 * Validates that an ID is a strictly positive integer.
 *
 * @param {any} id
 * @returns {number|null}
 */
function parsePositiveInt(id) {
  const num = Number(id);
  return Number.isInteger(num) && num > 0 ? num : null;
}

/**
 * GET /api/opportunities
 * Retrieves all opportunities with optional keyword search and category filtering.
 */
async function getAllOpportunities(req, res, next) {
  try {
    const { q, category } = req.query;
    let sql = 'SELECT * FROM `opportunities` WHERE 1=1';
    const params = [];

    if (category) {
      const normalizedCat = String(category).toLowerCase().trim();
      if (!OPPORTUNITY_CATEGORIES.includes(normalizedCat)) {
        return res.status(400).json({
          success: false,
          message: `Invalid category filter '${category}'. Allowed values: ${OPPORTUNITY_CATEGORIES.join(', ')}`
        });
      }
      sql += ' AND `category` = ?';
      params.push(normalizedCat);
    }

    if (q) {
      const trimmedQuery = String(q).trim();
      if (trimmedQuery !== '') {
        sql += ' AND (`title` LIKE ? OR `organization` LIKE ? OR `description` LIKE ?)';
        const wild = `%${trimmedQuery}%`;
        params.push(wild, wild, wild);
      }
    }

    sql += ' ORDER BY CASE WHEN `deadline` IS NULL THEN 1 ELSE 0 END, `deadline` ASC, `created_at` DESC';

    const [rows] = await pool.query(sql, params);

    res.status(200).json({
      success: true,
      message: 'Opportunities retrieved successfully from database',
      count: rows.length,
      data: rows
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/opportunities/:id
 * Retrieves a single opportunity by its numeric identifier.
 */
async function getOpportunityById(req, res, next) {
  try {
    const id = parsePositiveInt(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: `Invalid opportunity ID '${req.params.id}'. Must be a positive integer.`
      });
    }

    const [rows] = await pool.query('SELECT * FROM `opportunities` WHERE `id` = ? LIMIT 1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Opportunity with ID ${id} was not found.`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Opportunity retrieved successfully',
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/opportunities
 * Creates a new opportunity record in the database using a parameterized query.
 */
async function createOpportunity(req, res, next) {
  try {
    const validation = validateOpportunityInput(req.body, true);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please correct input errors.',
        errors: validation.errors
      });
    }

    const {
      title,
      organization,
      category,
      description,
      eligibility,
      application_url,
      deadline
    } = req.body;

    const sql = `
      INSERT INTO opportunities 
      (title, organization, category, description, eligibility, application_url, deadline)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      title.trim(),
      organization.trim(),
      category.toLowerCase().trim(),
      description.trim(),
      eligibility.trim(),
      application_url && application_url.trim() !== '' ? application_url.trim() : null,
      deadline && deadline.trim() !== '' ? deadline.trim() : null
    ];

    const [result] = await pool.query(sql, params);

    // Retrieve freshly inserted record
    const [inserted] = await pool.query('SELECT * FROM `opportunities` WHERE `id` = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Opportunity created successfully in persistent database',
      data: inserted[0]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/opportunities/:id
 * Updates an existing opportunity in the database using a parameterized query.
 */
async function updateOpportunity(req, res, next) {
  try {
    const id = parsePositiveInt(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: `Invalid opportunity ID '${req.params.id}'. Must be a positive integer.`
      });
    }

    // Verify record exists
    const [existingRows] = await pool.query('SELECT * FROM `opportunities` WHERE `id` = ? LIMIT 1', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Cannot update: Opportunity with ID ${id} was not found.`
      });
    }

    const validation = validateOpportunityInput(req.body, false);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please correct input errors.',
        errors: validation.errors
      });
    }

    const existing = existingRows[0];
    const updatedTitle = req.body.title !== undefined ? req.body.title.trim() : existing.title;
    const updatedOrg = req.body.organization !== undefined ? req.body.organization.trim() : existing.organization;
    const updatedCat = req.body.category !== undefined ? req.body.category.toLowerCase().trim() : existing.category;
    const updatedDesc = req.body.description !== undefined ? req.body.description.trim() : existing.description;
    const updatedElig = req.body.eligibility !== undefined ? req.body.eligibility.trim() : existing.eligibility;
    const updatedUrl = req.body.application_url !== undefined
      ? (req.body.application_url ? req.body.application_url.trim() : null)
      : existing.application_url;
    const updatedDeadline = req.body.deadline !== undefined
      ? (req.body.deadline ? req.body.deadline.trim() : null)
      : existing.deadline;

    const sql = `
      UPDATE opportunities SET
        title = ?,
        organization = ?,
        category = ?,
        description = ?,
        eligibility = ?,
        application_url = ?,
        deadline = ?
      WHERE id = ?
    `;

    await pool.query(sql, [
      updatedTitle,
      updatedOrg,
      updatedCat,
      updatedDesc,
      updatedElig,
      updatedUrl,
      updatedDeadline,
      id
    ]);

    const [updatedRows] = await pool.query('SELECT * FROM `opportunities` WHERE `id` = ?', [id]);

    res.status(200).json({
      success: true,
      message: `Opportunity with ID ${id} updated successfully`,
      data: updatedRows[0]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/opportunities/:id
 * Deletes an opportunity from the database.
 */
async function deleteOpportunity(req, res, next) {
  try {
    const id = parsePositiveInt(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: `Invalid opportunity ID '${req.params.id}'. Must be a positive integer.`
      });
    }

    const [existingRows] = await pool.query('SELECT * FROM `opportunities` WHERE `id` = ? LIMIT 1', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Cannot delete: Opportunity with ID ${id} was not found.`
      });
    }

    await pool.query('DELETE FROM `opportunities` WHERE `id` = ?', [id]);

    res.status(200).json({
      success: true,
      message: `Opportunity with ID ${id} ('${existingRows[0].title}') was permanently deleted`,
      data: {
        id,
        deletedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity
};
