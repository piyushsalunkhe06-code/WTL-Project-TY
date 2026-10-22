/**
 * Post Likes Controller
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

const { pool } = require('../config/database');

/**
 * POST /api/posts/:postId/like
 * Toggles like / unlike status for the authenticated student on a specific post.
 * Returns updated status and current aggregate like count.
 */
async function toggleLike(req, res, next) {
  try {
    const postId = Number(req.params.postId);
    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid post ID parameter.'
      });
    }

    const userId = req.user.id;

    // Verify post exists
    const [posts] = await pool.query('SELECT id FROM posts WHERE id = ?', [postId]);
    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Post with ID ${postId} was not found.`
      });
    }

    // Check if like exists
    const [existing] = await pool.query('SELECT id FROM likes WHERE post_id = ? AND user_id = ?', [postId, userId]);

    let liked = false;
    if (existing.length > 0) {
      // User has already liked -> Remove like (Unlike)
      await pool.query('DELETE FROM likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
      liked = false;
    } else {
      // User has not liked -> Add like
      await pool.query('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
      liked = true;
    }

    // Get updated total likes count
    const [[countRow]] = await pool.query('SELECT COUNT(*) AS total FROM likes WHERE post_id = ?', [postId]);

    res.status(200).json({
      success: true,
      message: liked ? 'Post liked successfully.' : 'Post unliked successfully.',
      data: {
        postId,
        liked,
        likes_count: countRow.total
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  toggleLike
};
