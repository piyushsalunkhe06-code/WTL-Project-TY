import React from 'react';

/**
 * FeedStats Component
 * Renders live aggregate statistics across community posts.
 * Demonstrates calculated values derived from React state props.
 * 
 * @param {Object} props
 * @param {number} props.totalPosts - Total count of all stored posts
 * @param {number} props.visibleCount - Count of posts currently matching active filter
 * @param {number} props.totalLikes - Aggregate likes across all posts
 * @param {number} props.userPostsCount - Number of posts created by the current user
 * @param {string} props.activeCategory - Currently selected category filter
 * @param {function} props.onResetSeed - Handler to restore default seed data
 */
export default function FeedStats({
  totalPosts,
  visibleCount,
  totalLikes,
  userPostsCount,
  activeCategory,
  onResetSeed
}) {
  return (
    <section className="feed-stats-card" aria-label="Community Feed Live Statistics">
      <div className="stats-header-row">
        <h3 className="stats-card-title">Feed Live Activity</h3>
        <button
          type="button"
          className="btn-seed-reset"
          onClick={onResetSeed}
          title="Restore initial 6 demonstration sample posts"
          aria-label="Restore initial sample posts"
        >
          🔄 Reset Default Posts
        </button>
      </div>

      <div className="stats-metrics-grid">
        <div className="metric-box">
          <span className="metric-label">Visible Posts</span>
          <span className="metric-value">{visibleCount}</span>
          <span className="metric-subtext">Filter: {activeCategory}</span>
        </div>

        <div className="metric-box">
          <span className="metric-label">Total Posts</span>
          <span className="metric-value">{totalPosts}</span>
          <span className="metric-subtext">In-Memory &amp; LocalStorage</span>
        </div>

        <div className="metric-box">
          <span className="metric-label">Total Community Likes</span>
          <span className="metric-value" style={{ color: '#E11D48' }}>❤️ {totalLikes}</span>
          <span className="metric-subtext">Across All Posts</span>
        </div>

        <div className="metric-box">
          <span className="metric-label">Your Created Posts</span>
          <span className="metric-value" style={{ color: '#059669' }}>{userPostsCount}</span>
          <span className="metric-subtext">Deletable User Content</span>
        </div>
      </div>
    </section>
  );
}
