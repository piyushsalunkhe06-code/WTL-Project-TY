/**
 * Alert Banner Component
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

import React from 'react';

export default function Alert({ type = 'info', message, details, onClose }) {
  if (!message) return null;

  const alertClass = `alert alert-${type}`;

  return (
    <div className={alertClass} role="alert">
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600 }}>{message}</div>
        {details && Array.isArray(details) && details.length > 0 && (
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', fontSize: '0.85rem' }}>
            {details.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '1.1rem',
            lineHeight: 1,
            cursor: 'pointer',
            color: 'inherit',
            opacity: 0.7
          }}
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      )}
    </div>
  );
}
