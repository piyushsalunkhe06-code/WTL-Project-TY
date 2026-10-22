/**
 * Dashboard Controller
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

const { pool } = require('../config/database');

/**
 * GET /api/dashboard/stats
 * Returns live aggregated counts and latest previews directly from MariaDB.
 */
async function getStats(req, res, next) {
  try {
    // 1. Metric Counts
    const [[studentCount]] = await pool.query("SELECT COUNT(*) AS total FROM users WHERE role = 'student'");
    const [[postCount]] = await pool.query('SELECT COUNT(*) AS total FROM posts');
    const [[opportunityCount]] = await pool.query('SELECT COUNT(*) AS total FROM opportunities');
    const [[achievementCount]] = await pool.query('SELECT COUNT(*) AS total FROM achievements');

    // 2. Recent Community Posts (joined with author)
    const [recentPosts] = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.category,
        p.created_at,
        u.name AS author_name,
        u.branch AS author_branch,
        (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments_count
      FROM posts p
      INNER JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 3
    `);

    // 3. Latest Opportunities
    const [recentOpportunities] = await pool.query(`
      SELECT 
        id,
        title,
        organization,
        category,
        deadline,
        (deadline IS NOT NULL AND deadline < CURDATE()) AS is_expired
      FROM opportunities
      ORDER BY created_at DESC
      LIMIT 3
    `);

    res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved successfully.',
      data: {
        metrics: {
          students: studentCount.total,
          posts: postCount.total,
          opportunities: opportunityCount.total,
          achievements: achievementCount.total
        },
        recentPosts,
        recentOpportunities
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStats
};
