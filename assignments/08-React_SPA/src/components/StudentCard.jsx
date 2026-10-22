import React from 'react';

/**
 * StudentCard Component
 * Reusable card representing a student profile.
 * 
 * @param {Object} props
 * @param {Object} props.student - Student record data
 */
export default function StudentCard({ student }) {
  const { name, studentId, department, deptCode, year, cgpa, skills, bio } = student;

  return (
    <article className="student-card">
      <div className="card-header-row">
        <div>
          <h3 className="student-name">{name}</h3>
          <span className="student-id-pill">{studentId}</span>
        </div>
        <span className={`dept-badge badge-${deptCode}`}>
          {department}
        </span>
      </div>

      <p className="student-meta">
        <strong>{year}</strong> • CGPA: <span className="cgpa-highlight">{cgpa}</span>
      </p>

      <p className="student-bio">{bio}</p>

      <div className="skills-block">
        <span className="skills-heading">Skills &amp; Expertise</span>
        <div className="skills-tags-wrap">
          {skills.map((skill, index) => (
            <span key={`${studentId}-skill-${index}`} className="skill-pill">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
