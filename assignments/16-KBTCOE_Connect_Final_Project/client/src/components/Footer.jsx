/**
 * Footer Component
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

import React from 'react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <img src="/kbtcoe-logo.svg" alt="KBTCOE Emblem" style={{ width: '36px', height: '36px', objectFit: 'contain', background: '#FFFFFF', borderRadius: '4px', padding: '2px' }} />
              <h3 style={{ margin: 0 }}>KBTCOE Connect</h3>
            </div>
            <p style={{ color: '#94A3B8', maxWidth: '380px', fontSize: '0.9rem' }}>
              The unified professional networking, opportunity-sharing, and student portfolio hub for MVP Samaj's K.B.T. College of Engineering, Nashik.
            </p>
          </div>

          <div className="footer-col">
            <h4>Quick Navigation</h4>
            <ul>
              <li><a href="#dashboard" onClick={(e) => { e.preventDefault(); setActivePage('dashboard'); }}>Dashboard</a></li>
              <li><a href="#feed" onClick={(e) => { e.preventDefault(); setActivePage('feed'); }}>Community Feed</a></li>
              <li><a href="#directory" onClick={(e) => { e.preventDefault(); setActivePage('directory'); }}>Student Directory</a></li>
              <li><a href="#opportunities" onClick={(e) => { e.preventDefault(); setActivePage('opportunities'); }}>Opportunities Board</a></li>
              <li><a href="#achievements" onClick={(e) => { e.preventDefault(); setActivePage('achievements'); }}>Student Achievements</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Institution & Department</h4>
            <ul>
              <li>MVP Samaj's K.B.T. College of Engineering</li>
              <li>Udoji Maratha Boarding Campus, Gangapur Road</li>
              <li>Nashik, Maharashtra — 422013</li>
              <li>Affiliated to SPPU, Pune</li>
              <li>Department of Computer Engineering</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © 2026 KBTCOE Connect. All Rights Reserved. Final Capstone Laboratory Project.
          </div>
          <div>
            Built with React 18, Node.js, Express, and MariaDB.
          </div>
        </div>
      </div>
    </footer>
  );
}
