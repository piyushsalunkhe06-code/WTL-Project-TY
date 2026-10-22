import React from 'react';

/**
 * PostCard Component
 * Displays an individual community post.
 * Demonstrates:
 * - Props receiving (data and callback functions)
 * - Event handling for Like/Unlike and Deletion
 * - Conditional rendering for user-created actions vs protected sample badges
 * - Safe data presentation
 * 
 * @param {Object} props
 * @param {Object} props.post - Single post data object
 * @param {function} props.onToggleLike - Callback to toggle like state
 * @param {function} props.onDeletePost - Callback to delete user-created post
 */
export default function PostCard({ post, onToggleLike, onDeletePost }) {
  const {
    id,
    author,
    department,
    deptCode,
    timestamp,
    content,
    category,
    likes,
    isLiked,
    isUserCreated
  } = post;

  const categoryColorMap = {
    Technical: 'cat-technical',
    Achievements: 'cat-achievements',
    Events: 'cat-events',
    General: 'cat-general'
  };

  const catClass = categoryColorMap[category] || 'cat-general';

  const handleDeleteClick = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this post? This action will remove it from the feed and local storage.'
    );
    if (confirmed) {
      onDeletePost(id);
    }
  };

  return (
    <article className="post-card" data-post-id={id}>
      {/* Top Header Row */}
      <div className="post-top-row">
        <div className="author-meta-block">
          <div className="avatar-circle" aria-hidden="true">
            {author.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="author-name-line">
              <h4 className="post-author-name">{author}</h4>
              {isUserCreated && (
                <span className="user-author-tag">You</span>
              )}
            </div>
            <p className="post-dept-time">
              <span className={`dept-pill dept-pill-${deptCode}`}>{department}</span>
              <span className="dot-separator">•</span>
              <time className="post-timestamp">{timestamp}</time>
            </p>
          </div>
        </div>

        <span className={`post-category-tag ${catClass}`}>
          {category}
        </span>
      </div>

      {/* Post Text Content */}
      <p className="post-body-text">{content}</p>

      {/* Bottom Action Bar */}
      <div className="post-actions-bar">
        <div className="actions-left">
          {/* Like / Unlike Button */}
          <button
            type="button"
            className={`btn-like ${isLiked ? 'liked' : ''}`}
            onClick={() => onToggleLike(id)}
            aria-label={isLiked ? `Unlike post by ${author}` : `Like post by ${author}`}
            aria-pressed={isLiked}
          >
            <span className="heart-icon" aria-hidden="true">
              {isLiked ? '❤️' : '🤍'}
            </span>
            <span className="like-count">{likes}</span>
            <span className="like-label">{isLiked ? 'Liked' : 'Like'}</span>
          </button>
        </div>

        <div className="actions-right">
          {/* Conditional Rendering: User-Created Posts can be deleted; Sample posts are protected */}
          {isUserCreated ? (
            <button
              type="button"
              className="btn-delete-post"
              onClick={handleDeleteClick}
              title="Delete your post"
              aria-label="Delete this post"
            >
              🗑️ Delete
            </button>
          ) : (
            <span className="sample-post-badge" title="Protected initial demonstration post">
              🔒 Sample Post
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
