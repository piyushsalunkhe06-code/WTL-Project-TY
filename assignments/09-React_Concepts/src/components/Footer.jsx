import React from 'react';

/**
 * Footer Component
 * Displays institutional copyright, student network tagline, and React concepts metadata.
 */
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-flex">
        <div className="footer-left">
          <p className="copyright-text">
            &copy; 2026 KBTCOE Connect — MVPS's KBT College of Engineering, Nashik.
          </p>
          <p className="sub-text">
            Assignment 09: Stateful Community Feed demonstrating useState, useEffect, and Controlled Forms.
          </p>
        </div>
        <div className="footer-right">
          <span className="tech-badge">React Hooks &amp; LocalStorage</span>
        </div>
      </div>
    </footer>
  );
}
