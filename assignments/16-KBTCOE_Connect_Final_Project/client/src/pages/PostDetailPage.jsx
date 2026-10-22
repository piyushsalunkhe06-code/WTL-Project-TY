/**
 * Single Post Detail & Comments Page
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

export default function PostDetailPage({ postId, setActivePage, setSelectedStudentId }) {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getPostById(postId);
      if (res.success && res.data) {
        setPost(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load post details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPostDetails();
    }
  }, [postId]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      setError('Please sign in to like community posts.');
      return;
    }

    try {
      const willLike = !post.user_has_liked;
      setPost((prev) => ({
        ...prev,
        user_has_liked: willLike ? 1 : 0,
        likes_count: willLike ? prev.likes_count + 1 : Math.max(0, prev.likes_count - 1)
      }));

      const res = await api.toggleLike(postId);
      if (res.success && res.data) {
        setPost((prev) => ({
          ...prev,
          likes_count: res.data.likes_count,
          user_has_liked: res.data.liked ? 1 : 0
        }));
      }
    } catch (err) {
      setError(err.message || 'Error updating like.');
      fetchPostDetails();
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setSubmittingComment(true);
      setError(null);
      const res = await api.createComment(postId, { content: commentText.trim() });
      if (res.success && res.data) {
        setCommentText('');
        setPost((prev) => ({
          ...prev,
          comments_count: (prev.comments_count || 0) + 1,
          comments: [...(prev.comments || []), res.data]
        }));
      }
    } catch (err) {
      setError(err.message || 'Failed to submit comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      const res = await api.deleteComment(commentId);
      if (res.success) {
        setPost((prev) => ({
          ...prev,
          comments_count: Math.max(0, (prev.comments_count || 1) - 1),
          comments: prev.comments.filter((c) => c.id !== commentId)
        }));
      }
    } catch (err) {
      setError(err.message || 'Failed to delete comment.');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading discussion thread..." />;
  }

  if (error && !post) {
    return (
      <div>
        <Alert type="danger" message={error} />
        <button className="btn btn-outline" onClick={() => setActivePage('feed')}>
          ← Back to Community Feed
        </button>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <button 
        className="btn btn-outline btn-sm" 
        style={{ marginBottom: '1.25rem' }}
        onClick={() => setActivePage('feed')}
      >
        ← Back to Community Feed
      </button>

      {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

      {/* Main Post Article Card */}
      <article className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
              {post.category}
            </span>
            <h1 style={{ fontSize: '1.75rem', marginTop: '0.4rem' }}>{post.title}</h1>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              Authored by{' '}
              <span 
                style={{ fontWeight: 600, color: 'var(--color-primary)', cursor: 'pointer' }}
                onClick={() => {
                  setSelectedStudentId(post.user_id);
                  setActivePage('profile');
                }}
              >
                {post.author_name}
              </span>{' '}
              ({post.author_branch} • {post.author_year}) on {new Date(post.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '1.05rem', lineHeight: '1.7', whiteSpace: 'pre-line', margin: '1.5rem 0', color: 'var(--color-text-body)' }}>
          {post.content}
        </div>

        <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem', alignItems: 'center' }}>
          <button 
            className={`btn btn-sm ${post.user_has_liked ? 'btn-primary' : 'btn-outline'}`}
            onClick={handleToggleLike}
          >
            {post.user_has_liked ? '❤️ Liked' : '🤍 Like'} ({post.likes_count})
          </button>
          <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            💬 {post.comments ? post.comments.length : post.comments_count} Comments
          </span>
        </div>
      </article>

      {/* Discussion & Comments Thread */}
      <section className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Discussion Thread</h3>

        {/* Comment Composer */}
        {isAuthenticated ? (
          <form onSubmit={handleAddComment} style={{ marginBottom: '2rem' }}>
            <div className="form-group">
              <label className="form-label">Add a constructive comment</label>
              <textarea 
                className="form-control"
                rows={3}
                placeholder="Share your perspective, question, or technical feedback..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={submittingComment}>
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
            Please <a href="#login" onClick={(e) => { e.preventDefault(); setActivePage('login'); }}>sign in</a> to participate in the discussion thread.
          </div>
        )}

        {/* Comments List */}
        {!post.comments || post.comments.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <div className="empty-state-icon">💬</div>
            <p>No comments on this post yet. Be the first to start the discussion!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {post.comments.map((comment) => {
              const isCommentOwner = user && (user.id === comment.user_id || isAdmin);
              return (
                <div 
                  key={comment.id}
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 1.25rem',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div>
                      <span 
                        style={{ fontWeight: 600, color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.95rem' }}
                        onClick={() => {
                          setSelectedStudentId(comment.user_id);
                          setActivePage('profile');
                        }}
                      >
                        {comment.author_name}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>
                        ({comment.author_branch}) • {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {isCommentOwner && (
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--color-danger)',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                        title="Delete comment"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-text-body)', whiteSpace: 'pre-line' }}>
                    {comment.content}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
