import React from 'react';
import OpportunityCard from '../components/OpportunityCard';
import { opportunitiesData } from '../data/mockData';

/**
 * OpportunitiesView Component
 * Displays internships, hackathons, and research grants using reusable OpportunityCard components.
 */
export default function OpportunitiesView() {
  return (
    <div className="view-container">
      {/* Page Header */}
      <section className="page-heading-block">
        <h1 className="page-title">Opportunities &amp; Campus Hackathons</h1>
        <p className="page-description">
          Discover verified engineering internships, national competitions, innovation challenges, and student research grants.
        </p>
      </section>

      {/* Opportunities Grid */}
      <section className="cards-grid-opportunities" aria-label="Campus Opportunities Grid">
        {opportunitiesData.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </section>
    </div>
  );
}
