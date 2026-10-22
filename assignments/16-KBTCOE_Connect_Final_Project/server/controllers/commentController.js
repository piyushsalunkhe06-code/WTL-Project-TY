/**
 * Post Comments Controller
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

const { pool } = require('../config/database');
const { validateCommentInput } = require('../utils/validators');

/**
 * GET /api/posts/:postId/comments
 * Retrieves discussion comments for a specific post.
 */
async function getComments(req, res, next) {
  try {
    const postId = Number(req.params.postId);
    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid post ID parameter.'
      });
    }

    const [comments] = await pool.query(`
      SELECT 
        c.id,
        c.post_id,
        c.user_id,
        c.content,
        c.created_at,
        u.name AS author_name,
        u.branch AS author_branch
      FROM comments c
      INNER JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `, [postId]);

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/posts/:postId/comments
 * Adds a new comment to a post. Requires authentication.
 */
async function createComment(req, res, next) {
  try {
    const postId = Number(req.params.postId);
    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid post ID parameter.'
      });
    }

    const validation = validateCommentInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid comment input.',
        details: validation.errors
      });
    }

    // Verify post exists
    const [posts] = await pool.query('SELECT id FROM posts WHERE id = ?', [postId]);
    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Post with ID ${postId} was not found.`
      });
    }

    const { content } = req.body;
    const userId = req.user.id;

    const [result] = await pool.query(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [postId, userId, content.trim()]
    );

    const [rows] = await pool.query(`
      SELECT 
        c.id,
        c.post_id,
        c.user_id,
        c.content,
        c.created_at,
        u.name AS author_name,
        u.branch AS author_branch
      FROM comments c
      INNER JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Comment published successfully.',
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/comments/:id
 * Deletes a comment. Enforces ownership: user must be author (or admin).
 */
async function deleteComment(req, res, next) {
  try {
    const commentId = Number(req.params.id);
    if (!Number.isInteger(commentId) || commentId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid comment ID parameter.'
      });
    }

    const [existing] = await pool.query('SELECT user_id, post_id FROM comments WHERE id = ?', [commentId]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Comment with ID ${commentId} was not found.`
      });
    }

    // Ownership check
    if (existing[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Access forbidden. You do not have permission to delete comments authored by other users.'
      });
    }

    await pool.query('DELETE FROM comments WHERE id = ?', [commentId]);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully.',
      data: {
        id: commentId,
        post_id: existing[0].post_id
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getComments,
  createComment,
  deleteComment
};
