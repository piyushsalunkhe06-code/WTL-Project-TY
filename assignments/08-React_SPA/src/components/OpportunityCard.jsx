import React from 'react';

/**
 * OpportunityCard Component
 * Reusable card for internships, hackathons, and research grants.
 * 
 * @param {Object} props
 * @param {Object} props.opportunity - Opportunity data item
 */
export default function OpportunityCard({ opportunity }) {
  const { title, type, organization, eligibility, deadline, location, description } = opportunity;

  const typeClassMap = {
    Competition: 'badge-competition',
    Internship: 'badge-internship',
    'Project Grant': 'badge-grant'
  };

  const badgeClass = typeClassMap[type] || 'badge-default';

  return (
    <article className="opportunity-card">
      <div className="opp-header-row">
        <div>
          <span className={`opp-type-badge ${badgeClass}`}>{type}</span>
          <h3 className="opp-title">{title}</h3>
          <span className="opp-org">{organization}</span>
        </div>
      </div>

      <p className="opp-description">{description}</p>

      <div className="opp-details-grid">
        <div className="opp-detail-item">
          <span className="opp-detail-label">🎓 Eligibility</span>
          <span className="opp-detail-value">{eligibility}</span>
        </div>
        <div className="opp-detail-item">
          <span className="opp-detail-label">📍 Location</span>
          <span className="opp-detail-value">{location}</span>
        </div>
        <div className="opp-detail-item">
          <span className="opp-detail-label">⏰ Sample Deadline</span>
          <span className="opp-detail-value deadline-highlight">{deadline}</span>
        </div>
      </div>

      <div className="opp-footer">
        <button 
          type="button" 
          className="btn-apply-demo" 
          onClick={() => alert(`Demonstration Notice: '${title}' application link is a prototype placeholder.`)}
        >
          View Opportunity Details →
        </button>
      </div>
    </article>
  );
}
