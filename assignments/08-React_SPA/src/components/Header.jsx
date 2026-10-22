import React from 'react';

/**
 * Header Component
 * Displays KBTCOE Connect branding, college logo, and assignment badge.
 */
export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-flex">
        <div className="brand-group">
          <img 
            src="./kbtcoe-logo.svg" 
            alt="KBTCOE Connect Logo" 
            className="brand-logo"
            width="240"
            height="42" 
          />
        </div>
        <div className="badge-group">
          <span className="lab-badge">Assignment 08 — React SPA</span>
        </div>
      </div>
    </header>
  );
}
