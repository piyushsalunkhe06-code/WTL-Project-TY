/**
 * Loading Spinner Component
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

import React from 'react';

export default function LoadingSpinner({ text = 'Loading data from database...' }) {
  return (
    <div className="loading-container" role="status">
      <div className="spinner" aria-hidden="true"></div>
      <p style={{ margin: 0, fontSize: '0.95rem' }}>{text}</p>
    </div>
  );
}
