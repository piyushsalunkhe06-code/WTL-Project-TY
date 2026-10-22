import React, { useState } from 'react';
import { AVAILABLE_CATEGORIES, AVAILABLE_DEPARTMENTS } from '../data/mockPosts';

/**
 * PostComposer Component
 * Controlled form allowing students to author new community posts.
 * Demonstrates:
 * - Controlled input state with useState
 * - Form event handling (onSubmit, onChange)
 * - Input validation & whitespace trimming
 * - Immutable data construction and callback dispatch
 * 
 * @param {Object} props
 * @param {function} props.onAddPost - Callback dispatched with new post object
 */
export default function PostComposer({ onAddPost }) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Technical');
  const [author, setAuthor] = useState('Student Contributor (You)');
  const [department, setDepartment] = useState('Computer Engineering');
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const MAX_CHARS = 500;
  const filteredCategories = AVAILABLE_CATEGORIES.filter((c) => c !== 'All');

  const deptCodeMap = {
    'Computer Engineering': 'comp',
    'Information Technology': 'it',
    'Artificial Intelligence & Data Science': 'aids',
    'Electronics & Telecommunication': 'entc',
    'Mechanical Engineering': 'mech',
    'Civil Engineering': 'civil',
    'Instrumentation Engineering': 'instru'
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (errorMessage) setErrorMessage('');
    if (successNotice) setSuccessNotice('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setErrorMessage('Post content cannot be empty or contain only whitespace.');
      return;
    }

    if (trimmedContent.length < 5) {
      setErrorMessage('Post must be at least 5 characters long.');
      return;
    }

    const newPost = {
      id: `user-post-${Date.now()}`,
      author: author.trim() || 'Student Contributor',
      department,
      deptCode: deptCodeMap[department] || 'comp',
      timestamp: 'Just now',
      content: trimmedContent,
      category,
      likes: 0,
      isLiked: false,
      isUserCreated: true
    };

    // Dispatch new post to parent state
    onAddPost(newPost);

    // Reset form fields
    setContent('');
    setErrorMessage('');
    setSuccessNotice('Post published successfully to the community feed!');

    // Automatically clear success notice after 3 seconds
    setTimeout(() => {
      setSuccessNotice('');
    }, 3000);
  };

  return (
    <section className="composer-card" aria-label="Create Community Post">
      <div className="composer-header">
        <h3 className="composer-title">✍️ Share an Update with the Community</h3>
        <span className="composer-badge">Live React Controlled Form</span>
      </div>

      {errorMessage && (
        <div className="composer-alert composer-alert-error" role="alert">
          ⚠️ {errorMessage}
        </div>
      )}

      {successNotice && (
        <div className="composer-alert composer-alert-success" role="status">
          ✓ {successNotice}
        </div>
      )}

      <form onSubmit={handleSubmit} className="composer-form">
        <div className="composer-inputs-row">
          <div className="form-field-group">
            <label htmlFor="composerAuthor" className="field-label">Author Name</label>
            <input
              type="text"
              id="composerAuthor"
              className="field-input"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name or handle"
              maxLength={40}
            />
          </div>

          <div className="form-field-group">
            <label htmlFor="composerDept" className="field-label">Department / Branch</label>
            <select
              id="composerDept"
              className="field-select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {AVAILABLE_DEPARTMENTS.map((dept) => (
                <option key={dept.code} value={dept.label}>
                  {dept.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field-group">
            <label htmlFor="composerCategory" className="field-label">Category Tag</label>
            <select
              id="composerCategory"
              className="field-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {filteredCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="composer-textarea-group">
          <label htmlFor="composerContent" className="field-label">
            Post Content <span className="required-star">*</span>
          </label>
          <textarea
            id="composerContent"
            className="field-textarea"
            rows="3"
            value={content}
            onChange={handleContentChange}
            placeholder="Share your hackathon updates, technical findings, project achievements, or campus discussions..."
            maxLength={MAX_CHARS}
            aria-required="true"
          />
          <div className="composer-footer-row">
            <span className="char-counter">
              {content.length} / {MAX_CHARS} characters
            </span>
            <button type="submit" className="btn-publish-post">
              Publish Post 🚀
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
