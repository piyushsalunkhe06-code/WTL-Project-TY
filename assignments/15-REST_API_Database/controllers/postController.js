/**
 * ==============================================================================
 * KBTCOE Connect — Post Controller (controllers/postController.js)
 * Assignment 15: REST API and Database
 * ==============================================================================
 */

'use strict';

const { pool } = require('../config/database');
const { validatePostInput, POST_CATEGORIES } = require('../utils/validators');

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
 * GET /api/posts
 * Retrieves all community posts joined with author information.
 */
async function getAllPosts(req, res, next) {
  try {
    const { category } = req.query;
    let sql = `
      SELECT 
        p.id,
        p.user_id,
        p.title,
        p.content,
        p.category,
        p.created_at,
        p.updated_at,
        u.name AS author_name,
        u.branch AS author_branch
      FROM posts p
      INNER JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      const normalizedCat = String(category).toLowerCase().trim();
      if (!POST_CATEGORIES.includes(normalizedCat)) {
        return res.status(400).json({
          success: false,
          message: `Invalid post category '${category}'. Allowed values: ${POST_CATEGORIES.join(', ')}`
        });
      }
      sql += ' AND p.category = ?';
      params.push(normalizedCat);
    }

    sql += ' ORDER BY p.created_at DESC';

    const [rows] = await pool.query(sql, params);

    res.status(200).json({
      success: true,
      message: 'Posts retrieved successfully from database',
      count: rows.length,
      data: rows
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/posts/:id
 * Retrieves a single post by ID joined with author information.
 */
async function getPostById(req, res, next) {
  try {
    const id = parsePositiveInt(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: `Invalid post ID '${req.params.id}'. Must be a positive integer.`
      });
    }

    const sql = `
      SELECT 
        p.id,
        p.user_id,
        p.title,
        p.content,
        p.category,
        p.created_at,
        p.updated_at,
        u.name AS author_name,
        u.branch AS author_branch
      FROM posts p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
      LIMIT 1
    `;

    const [rows] = await pool.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Post with ID ${id} was not found.`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Post retrieved successfully',
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/posts
 * Creates a new community post. Requires authentication.
 * Author identity is derived strictly from the verified JWT (req.user.id).
 */
async function createPost(req, res, next) {
  try {
    const validation = validatePostInput(req.body, true);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please correct input errors.',
        errors: validation.errors
      });
    }

    const userId = req.user.id;
    const { title, content, category } = req.body;

    const sql = `
      INSERT INTO posts (user_id, title, content, category)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      userId,
      title.trim(),
      content.trim(),
      category ? category.toLowerCase().trim() : 'general'
    ]);

    const newPostId = result.insertId;

    // Fetch the newly created post with author details
    const [rows] = await pool.query(
      `
        SELECT 
          p.id,
          p.user_id,
          p.title,
          p.content,
          p.category,
          p.created_at,
          p.updated_at,
          u.name AS author_name,
          u.branch AS author_branch
        FROM posts p
        INNER JOIN users u ON p.user_id = u.id
        WHERE p.id = ?
      `,
      [newPostId]
    );

    res.status(201).json({
      success: true,
      message: 'Post published successfully',
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/posts/:id
 * Updates an existing post. Requires authentication and author ownership.
 */
async function updatePost(req, res, next) {
  try {
    const id = parsePositiveInt(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: `Invalid post ID '${req.params.id}'. Must be a positive integer.`
      });
    }

    // Verify post exists
    const [existingRows] = await pool.query('SELECT * FROM `posts` WHERE `id` = ? LIMIT 1', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Cannot update: Post with ID ${id} was not found.`
      });
    }

    const post = existingRows[0];

    // Ownership Authorization Check
    if (post.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden. You do not have permission to modify posts authored by other users.'
      });
    }

    const validation = validatePostInput(req.body, false);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please correct input errors.',
        errors: validation.errors
      });
    }

    const updatedTitle = req.body.title !== undefined ? req.body.title.trim() : post.title;
    const updatedContent = req.body.content !== undefined ? req.body.content.trim() : post.content;
    const updatedCat = req.body.category !== undefined ? req.body.category.toLowerCase().trim() : post.category;

    await pool.query(
      'UPDATE `posts` SET `title` = ?, `content` = ?, `category` = ? WHERE `id` = ?',
      [updatedTitle, updatedContent, updatedCat, id]
    );

    // Fetch updated record with author details
    const [updatedRows] = await pool.query(
      `
        SELECT 
          p.id,
          p.user_id,
          p.title,
          p.content,
          p.category,
          p.created_at,
          p.updated_at,
          u.name AS author_name,
          u.branch AS author_branch
        FROM posts p
        INNER JOIN users u ON p.user_id = u.id
        WHERE p.id = ?
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updatedRows[0]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/posts/:id
 * Deletes an existing post. Requires authentication and author ownership.
 */
async function deletePost(req, res, next) {
  try {
    const id = parsePositiveInt(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: `Invalid post ID '${req.params.id}'. Must be a positive integer.`
      });
    }

    // Verify post exists
    const [existingRows] = await pool.query('SELECT * FROM `posts` WHERE `id` = ? LIMIT 1', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Cannot delete: Post with ID ${id} was not found.`
      });
    }

    const post = existingRows[0];

    // Ownership Authorization Check
    if (post.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden. You do not have permission to delete posts authored by other users.'
      });
    }

    await pool.query('DELETE FROM `posts` WHERE `id` = ?', [id]);

    res.status(200).json({
      success: true,
      message: `Post with ID ${id} ('${post.title}') was permanently deleted`,
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
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};
