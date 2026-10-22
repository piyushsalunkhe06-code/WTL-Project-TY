import React from 'react';
import BlogCard from '../components/BlogCard';
import { blogsData } from '../data/mockData';

/**
 * BlogsView Component
 * Displays technical articles published by students using reusable BlogCard components.
 */
export default function BlogsView() {
  return (
    <div className="view-container">
      {/* Page Header */}
      <section className="page-heading-block">
        <h1 className="page-title">Technical Blogs &amp; Research Notes</h1>
        <p className="page-description">
          Read peer-authored engineering guides, architecture breakdowns, AI experiments, and automotive research notes.
        </p>
      </section>

      {/* Blogs Grid */}
      <section className="cards-grid-blogs" aria-label="Technical Blogs Feed">
        {blogsData.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </section>
    </div>
  );
}
