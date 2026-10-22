import React from 'react';

/**
 * Navbar Component
 * Demonstrates props passing, list mapping, and single-page navigation event handling.
 * 
 * @param {Object} props
 * @param {string} props.currentView - The identifier of the currently active view
 * @param {function} props.onNavigate - Callback function to update view state in parent App
 */
export default function Navbar({ currentView, onNavigate }) {
  const navItems = [
    { id: 'home', label: 'Home / Dashboard', icon: '🏠' },
    { id: 'students', label: 'Student Directory', icon: '👥' },
    { id: 'blogs', label: 'Technical Blogs', icon: '📝' },
    { id: 'opportunities', label: 'Opportunities', icon: '💼' }
  ];

  return (
    <nav className="site-navbar" aria-label="Main Application Navigation">
      <div className="container nav-flex">
        <ul className="nav-list" role="menubar">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <li key={item.id} className="nav-item" role="none">
                <button
                  type="button"
                  className={`nav-button ${isActive ? 'active' : ''}`}
                  onClick={() => onNavigate(item.id)}
                  role="menuitem"
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {isActive && <span className="active-dot" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
