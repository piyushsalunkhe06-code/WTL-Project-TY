/**
 * Navigation Bar Component
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activePage, setActivePage }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <a href="#dashboard" className="nav-brand" onClick={(e) => { e.preventDefault(); handleNavClick('dashboard'); }}>
          <img src="/kbtcoe-logo.svg" alt="KBTCOE Emblem" className="nav-logo" />
          <span>KBTCOE Connect</span>
        </a>

        <button 
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <button 
            className={`nav-link ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-link ${activePage === 'feed' ? 'active' : ''}`}
            onClick={() => handleNavClick('feed')}
          >
            Community Feed
          </button>
          <button 
            className={`nav-link ${activePage === 'directory' ? 'active' : ''}`}
            onClick={() => handleNavClick('directory')}
          >
            Students
          </button>
          <button 
            className={`nav-link ${activePage === 'opportunities' ? 'active' : ''}`}
            onClick={() => handleNavClick('opportunities')}
          >
            Opportunities
          </button>
          <button 
            className={`nav-link ${activePage === 'achievements' ? 'active' : ''}`}
            onClick={() => handleNavClick('achievements')}
          >
            Achievements
          </button>

          {isAuthenticated ? (
            <button 
              className={`nav-link ${activePage === 'settings' ? 'active' : ''}`}
              onClick={() => handleNavClick('settings')}
            >
              My Profile
            </button>
          ) : null}
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {user.branch} {isAdmin ? '• Admin' : ''}
                </div>
              </div>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => {
                  logout();
                  handleNavClick('dashboard');
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => handleNavClick('login')}
              >
                Sign In
              </button>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => handleNavClick('register')}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
