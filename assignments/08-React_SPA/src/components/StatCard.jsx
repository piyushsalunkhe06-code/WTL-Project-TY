import React from 'react';

/**
 * StatCard Component
 * Reusable dashboard metric card.
 * 
 * @param {Object} props
 * @param {Object} props.stat - Metric item containing label, value, desc, icon, color
 */
export default function StatCard({ stat }) {
  const { label, value, desc, icon, color } = stat;

  return (
    <article className="stat-card">
      <div className="stat-top">
        <span className="stat-icon-wrapper" style={{ backgroundColor: `${color}15`, color }}>
          {icon}
        </span>
        <span className="stat-label">{label}</span>
      </div>
      <div className="stat-value" style={{ color }}>{value}</div>
      <div className="stat-desc">{desc}</div>
    </article>
  );
}
