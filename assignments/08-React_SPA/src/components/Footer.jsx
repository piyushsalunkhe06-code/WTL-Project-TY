import React from 'react';

/**
 * Footer Component
 * Application footer with institutional information and SPA metadata.
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
            Assignment 08: React Single-Page Application (SPA) Architectural Prototype.
          </p>
        </div>
        <div className="footer-right">
          <span className="tech-badge">Powered by React 18 &amp; Vite</span>
        </div>
      </div>
    </footer>
  );
}
