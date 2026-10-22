import React from 'react';
import StudentCard from '../components/StudentCard';
import { studentsData } from '../data/mockData';

/**
 * StudentsView Component
 * Displays directory of fictional student profiles using reusable StudentCard components.
 */
export default function StudentsView() {
  return (
    <div className="view-container">
      {/* Page Header */}
      <section className="page-heading-block">
        <h1 className="page-title">Student Directory &amp; Peer Profiles</h1>
        <p className="page-description">
          Discover skilled peers across Computer, IT, AI &amp; Data Science, E&amp;TC, Mechanical, and Civil Engineering departments.
        </p>
        <span className="prototype-note">
          Demonstrating React list mapping with stable keys. Advanced search/filter will be introduced in subsequent practicals.
        </span>
      </section>

      {/* Student Cards Grid */}
      <section className="cards-grid" aria-label="Student Directory Grid">
        {studentsData.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </section>
    </div>
  );
}
