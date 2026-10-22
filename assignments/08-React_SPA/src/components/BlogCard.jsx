import React from 'react';

/**
 * BlogCard Component
 * Reusable card representing a technical article.
 * 
 * @param {Object} props
 * @param {Object} props.blog - Blog article data
 */
export default function BlogCard({ blog }) {
  const { title, author, department, category, readTime, date, excerpt } = blog;

  return (
    <article className="blog-card">
      <div className="blog-meta-top">
        <span className="blog-category-badge">{category}</span>
        <span className="blog-read-time">{readTime}</span>
      </div>

      <h3 className="blog-title">{title}</h3>

      <p className="blog-excerpt">{excerpt}</p>

      <div className="blog-footer-row">
        <div className="blog-author-info">
          <span className="author-name">By {author}</span>
          <span className="author-dept">{department}</span>
        </div>
        <time className="blog-date">{date}</time>
      </div>
    </article>
  );
}
