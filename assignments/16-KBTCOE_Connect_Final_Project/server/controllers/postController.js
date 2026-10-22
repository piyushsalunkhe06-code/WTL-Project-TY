/**
 * Community Posts Controller
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

const { pool } = require('../config/database');
const { validatePostInput, POST_CATEGORIES } = require('../utils/validators');

/**
 * GET /api/posts
 * Retrieves community posts with author join, like/comment counts, and category filters.
 */
async function getPosts(req, res, next) {
  try {
    const { category, q } = req.query;
    const currentUserId = req.user ? req.user.id : 0;

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
        u.branch AS author_branch,
        u.academic_year AS author_year,
        (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments_count,
        EXISTS(SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = ?) AS user_has_liked
      FROM posts p
      INNER JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;
    const params = [currentUserId];

    if (category && category !== 'all') {
      const normalizedCat = String(category).toLowerCase().trim();
      if (!POST_CATEGORIES.includes(normalizedCat)) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: `Invalid category '${category}'. Allowed values: ${POST_CATEGORIES.join(', ')}.`
        });
      }
      sql += ' AND p.category = ?';
      params.push(normalizedCat);
    }

    if (q) {
      const trimmed = q.trim();
      if (trimmed !== '') {
        sql += ' AND (p.title LIKE ? OR p.content LIKE ? OR u.name LIKE ?)';
        const wild = `%${trimmed}%`;
        params.push(wild, wild, wild);
      }
    }

    sql += ' ORDER BY p.created_at DESC';

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
 * GET /api/posts/:id
 * Retrieves a single post with author details, counts, and discussion thread.
 */
async function getPostById(req, res, next) {
  try {
    const postId = Number(req.params.id);
    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid post ID parameter. Must be a positive integer.'
      });
    }

    const currentUserId = req.user ? req.user.id : 0;

    const [posts] = await pool.query(`
      SELECT 
        p.id,
        p.user_id,
        p.title,
        p.content,
        p.category,
        p.created_at,
        p.updated_at,
        u.name AS author_name,
        u.branch AS author_branch,
        u.academic_year AS author_year,
        (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments_count,
        EXISTS(SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = ?) AS user_has_liked
      FROM posts p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [currentUserId, postId]);

    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Post with ID ${postId} was not found.`
      });
    }

    // Fetch comments for this post
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
      data: {
        ...posts[0],
        comments
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/posts
 * Publishes a new community post. Requires Bearer JWT authentication.
 */
async function createPost(req, res, next) {
  try {
    const validation = validatePostInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid post inputs.',
        details: validation.errors
      });
    }

    const { title, content, category } = req.body;
    const userId = req.user.id;
    const postCategory = category ? String(category).toLowerCase().trim() : 'general';

    const [result] = await pool.query(
      'INSERT INTO posts (user_id, title, content, category) VALUES (?, ?, ?, ?)',
      [userId, title.trim(), content.trim(), postCategory]
    );

    const [rows] = await pool.query(`
      SELECT 
        p.id,
        p.user_id,
        p.title,
        p.content,
        p.category,
        p.created_at,
        u.name AS author_name,
        u.branch AS author_branch
      FROM posts p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Post published successfully to the campus community feed.',
      data: {
        ...rows[0],
        likes_count: 0,
        comments_count: 0,
        user_has_liked: 0
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/posts/:id
 * Updates an existing community post.
 * Enforces ownership boundary: user must be the post author (or admin).
 */
async function updatePost(req, res, next) {
  try {
    const postId = Number(req.params.id);
    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid post ID parameter.'
      });
    }

    const validation = validatePostInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid post inputs.',
        details: validation.errors
      });
    }

    const [existing] = await pool.query('SELECT user_id FROM posts WHERE id = ?', [postId]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Post with ID ${postId} was not found.`
      });
    }

    // Ownership check
    if (existing[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Access forbidden. You do not have permission to modify posts authored by other users.'
      });
    }

    const { title, content, category } = req.body;
    const postCategory = category ? String(category).toLowerCase().trim() : 'general';

    await pool.query(
      'UPDATE posts SET title = ?, content = ?, category = ? WHERE id = ?',
      [title.trim(), content.trim(), postCategory, postId]
    );

    const [rows] = await pool.query(`
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
    `, [postId]);

    res.status(200).json({
      success: true,
      message: 'Post updated successfully.',
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/posts/:id
 * Deletes an existing community post.
 * Enforces ownership boundary: user must be the post author (or admin).
 */
async function deletePost(req, res, next) {
  try {
    const postId = Number(req.params.id);
    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid post ID parameter.'
      });
    }

    const [existing] = await pool.query('SELECT user_id FROM posts WHERE id = ?', [postId]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Post with ID ${postId} was not found.`
      });
    }

    // Ownership check
    if (existing[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Access forbidden. You do not have permission to delete posts authored by other users.'
      });
    }

    await pool.query('DELETE FROM posts WHERE id = ?', [postId]);

    res.status(200).json({
      success: true,
      message: `Post ${postId} and associated comments and likes were deleted successfully.`
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};
