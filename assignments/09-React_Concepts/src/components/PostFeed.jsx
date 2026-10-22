import React from 'react';
import PostCard from './PostCard';

/**
 * PostFeed Component
 * Renders list of community posts or an empty state when no posts match.
 * Demonstrates:
 * - List rendering with stable keys
 * - Conditional rendering for empty state vs card list
 * - Passing props down to PostCard
 * 
 * @param {Object} props
 * @param {Array<Object>} props.posts - Array of visible post items
 * @param {function} props.onToggleLike - Callback passed to PostCard
 * @param {function} props.onDeletePost - Callback passed to PostCard
 * @param {string} props.selectedCategory - Current filter category
 * @param {function} props.onResetFilter - Handler to reset category filter to 'All'
 */
export default function PostFeed({
  posts,
  onToggleLike,
  onDeletePost,
  selectedCategory,
  onResetFilter
}) {
  if (!posts || posts.length === 0) {
    return (
      <div className="feed-empty-state" role="status">
        <span className="empty-icon" aria-hidden="true">📭</span>
        <h4 className="empty-title">No Posts Found in "{selectedCategory}"</h4>
        <p className="empty-desc">
          There are currently no community posts matching the selected category.
          Use the composer above to publish a new post, or reset the filter to view all updates.
        </p>
        <button
          type="button"
          className="btn-reset-filter"
          onClick={onResetFilter}
        >
          View All Community Posts
        </button>
      </div>
    );
  }

  return (
    <div className="posts-stream" aria-label="Community Posts Stream">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onToggleLike={onToggleLike}
          onDeletePost={onDeletePost}
        />
      ))}
    </div>
  );
}
