/**
 * Metric Stat Card Component
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

import React from 'react';

export default function StatCard({ icon, value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" aria-hidden="true">
        {icon}
      </div>
      <div>
        <div className="stat-number">{value !== undefined ? value : '—'}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}
