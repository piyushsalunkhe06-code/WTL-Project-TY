import React from 'react';
import StatCard from '../components/StatCard';
import { statsData, recentActivityData } from '../data/mockData';

/**
 * HomeView Component
 * Dashboard view featuring platform summary stats, quick actions, and recent activity feed.
 * 
 * @param {Object} props
 * @param {function} props.onNavigate - Navigation callback to switch views
 */
export default function HomeView({ onNavigate }) {
  return (
    <div className="view-container">
      {/* Hero Welcome Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-tag">Official Student Network</span>
          <h1 className="hero-heading">Welcome to KBTCOE Connect</h1>
          <p className="hero-subtext">
            The unified professional networking and opportunity-sharing platform for students of 
            MVPS's KBT College of Engineering. Showcase projects, read peer technical blogs, 
            discover hackathons, and expand your engineering network.
          </p>
          <div className="hero-actions">
            <button 
              type="button" 
              className="btn-hero-primary" 
              onClick={() => onNavigate('students')}
            >
              Explore Student Directory →
            </button>
            <button 
              type="button" 
              className="btn-hero-secondary" 
              onClick={() => onNavigate('opportunities')}
            >
              Browse Opportunities
            </button>
          </div>
        </div>
      </section>

      {/* Summary Metrics Section (Component Mapping) */}
      <section className="stats-section" aria-label="Platform Statistics Overview">
        <div className="section-header">
          <h2 className="section-title">Platform At A Glance</h2>
          <p className="section-subtitle">Real-time indicators across campus networking modules</p>
        </div>

        <div className="stats-grid">
          {statsData.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>
      </section>

      {/* Recent Activity Feed */}
      <section className="activity-section" aria-label="Recent Campus Activity">
        <div className="section-header">
          <h2 className="section-title">Recent Campus Highlights</h2>
          <p className="section-subtitle">Latest student updates, published technical blogs, and project awards</p>
        </div>

        <div className="activity-list">
          {recentActivityData.map((act) => (
            <div key={act.id} className="activity-item">
              <span className={`activity-icon-badge badge-type-${act.type}`}>
                {act.type === 'achievement' && '🏆'}
                {act.type === 'blog' && '📄'}
                {act.type === 'opportunity' && '💼'}
                {act.type === 'project' && '🚀'}
              </span>
              <div className="activity-details">
                <h4 className="activity-title">{act.title}</h4>
                <p className="activity-meta">
                  <strong>{act.student}</strong> • {act.dept} • <span className="time-ago">{act.timeAgo}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
