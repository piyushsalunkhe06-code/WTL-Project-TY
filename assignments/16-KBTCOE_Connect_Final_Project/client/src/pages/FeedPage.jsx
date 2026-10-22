/**
 * Community Feed & Discussion Page
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

export default function FeedPage({ setActivePage, setSelectedPostId, setSelectedStudentId }) {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Post composer state
  const [composerOpen, setComposerOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState('general');
  const [submitting, setSubmitting] = useState(false);

  // Edit post state
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('general');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (searchQuery.trim() !== '') params.q = searchQuery.trim();

      const res = await api.getPosts(params);
      if (res.success && res.data) {
        setPosts(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch community posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const res = await api.createPost({
        title: postTitle,
        content: postContent,
        category: postCategory
      });
      if (res.success) {
        setSuccessMsg('Your post was published successfully to the campus community!');
        setPostTitle('');
        setPostContent('');
        setPostCategory('general');
        setComposerOpen(false);
        fetchPosts();
      }
    } catch (err) {
      setError(err.message || 'Failed to create post.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLike = async (postId) => {
    if (!isAuthenticated) {
      setError('Please sign in to like community posts.');
      return;
    }

    try {
      // Optimistic update
      setPosts((prevPosts) =>
        prevPosts.map((p) => {
          if (p.id === postId) {
            const willLike = !p.user_has_liked;
            return {
              ...p,
              user_has_liked: willLike ? 1 : 0,
              likes_count: willLike ? p.likes_count + 1 : Math.max(0, p.likes_count - 1)
            };
          }
          return p;
        })
      );

      const res = await api.toggleLike(postId);
      if (res.success && res.data) {
        // Sync with server state
        setPosts((prevPosts) =>
          prevPosts.map((p) => (p.id === postId ? { ...p, likes_count: res.data.likes_count, user_has_liked: res.data.liked ? 1 : 0 } : p))
        );
      }
    } catch (err) {
      setError(err.message || 'Error toggling like.');
      fetchPosts(); // Rollback on failure
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to permanently delete this post?')) return;
    try {
      const res = await api.deletePost(postId);
      if (res.success) {
        setSuccessMsg('Post deleted successfully.');
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      }
    } catch (err) {
      setError(err.message || 'Failed to delete post.');
    }
  };

  const handleStartEdit = (post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategory(post.category);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingPost) return;
    try {
      setSubmitting(true);
      const res = await api.updatePost(editingPost.id, {
        title: editTitle,
        content: editContent,
        category: editCategory
      });
      if (res.success) {
        setSuccessMsg('Post updated successfully.');
        setEditingPost(null);
        fetchPosts();
      }
    } catch (err) {
      setError(err.message || 'Failed to update post.');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'technical', label: 'Technical' },
    { id: 'achievement', label: 'Achievements' },
    { id: 'event', label: 'Events' },
    { id: 'general', label: 'General' }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Campus Community Feed</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Technical blogs, project showcases, announcements, and peer discussions.
          </p>
        </div>

        {isAuthenticated ? (
          <button className="btn btn-primary" onClick={() => setComposerOpen(true)}>
            ✏️ Create New Post
          </button>
        ) : (
          <button className="btn btn-outline" onClick={() => setActivePage('login')}>
            Sign in to Share Insights
          </button>
        )}
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}
      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg(null)} />}

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <form onSubmit={handleSearchSubmit} className="filter-bar" style={{ marginBottom: '0.75rem' }}>
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search posts by keywords, title, or author name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
          {searchQuery && (
            <button 
              type="button" 
              className="btn btn-outline btn-sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                fetchPosts();
              }}
            >
              Reset
            </button>
          )}
        </form>

        <div className="filter-pills">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading & Empty States */}
      {loading ? (
        <LoadingSpinner text="Loading campus discussions..." />
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3>No posts found</h3>
          <p>Try refining your search keyword or selecting a different category filter.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {posts.map((post) => {
            const isOwner = user && (user.id === post.user_id || isAdmin);
            return (
              <article key={post.id} className="card" style={{ position: 'relative' }}>
                <div className="card-header">
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
                      {post.category}
                    </span>
                    <h3 
                      style={{ cursor: 'pointer', fontSize: '1.25rem', marginTop: '0.25rem' }}
                      onClick={() => {
                        setSelectedPostId(post.id);
                        setActivePage('post-detail');
                      }}
                    >
                      {post.title}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                      Published by{' '}
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

                  {isOwner && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => handleStartEdit(post)}
                        title="Edit post"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeletePost(post.id)}
                        title="Delete post"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>

                <p style={{ whiteSpace: 'pre-line', color: 'var(--color-text-body)', margin: '1rem 0' }}>
                  {post.content}
                </p>

                {/* Footer Interactivity Row */}
                <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', alignItems: 'center' }}>
                  <button 
                    className={`btn btn-sm ${post.user_has_liked ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleToggleLike(post.id)}
                  >
                    {post.user_has_liked ? '❤️ Liked' : '🤍 Like'} ({post.likes_count})
                  </button>

                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setSelectedPostId(post.id);
                      setActivePage('post-detail');
                    }}
                  >
                    💬 Comments ({post.comments_count})
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Create Post Modal */}
      <Modal isOpen={composerOpen} title="Publish Community Post" onClose={() => setComposerOpen(false)}>
        <form onSubmit={handleCreatePost}>
          <div className="form-group">
            <label className="form-label">Post Title</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Building Scalable Web APIs with Express & MariaDB"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              required
              minLength={5}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select 
              className="form-control"
              value={postCategory}
              onChange={(e) => setPostCategory(e.target.value)}
            >
              <option value="technical">Technical Blog</option>
              <option value="achievement">Achievement Showcase</option>
              <option value="event">Campus Event</option>
              <option value="general">General Discussion</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Post Content</label>
            <textarea 
              className="form-control"
              rows={5}
              placeholder="Share code insights, project architecture, or announcements..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              required
              minLength={10}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setComposerOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Post Modal */}
      <Modal isOpen={Boolean(editingPost)} title="Edit Community Post" onClose={() => setEditingPost(null)}>
        <form onSubmit={handleSaveEdit}>
          <div className="form-group">
            <label className="form-label">Post Title</label>
            <input 
              type="text" 
              className="form-control" 
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              minLength={5}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select 
              className="form-control"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
            >
              <option value="technical">Technical Blog</option>
              <option value="achievement">Achievement Showcase</option>
              <option value="event">Campus Event</option>
              <option value="general">General Discussion</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Post Content</label>
            <textarea 
              className="form-control"
              rows={5}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              required
              minLength={10}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setEditingPost(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
