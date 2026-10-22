/**
 * Student Directory Page
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

export default function DirectoryPage({ setActivePage, setSelectedStudentId }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  const branches = [
    'Computer Engineering',
    'Information Technology',
    'Artificial Intelligence & Data Science',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electronics & Telecommunication',
    'Instrumentation Engineering'
  ];

  const years = ['FE', 'SE', 'TE', 'BE'];

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (branchFilter !== 'all') params.branch = branchFilter;
      if (yearFilter !== 'all') params.year = yearFilter;
      if (searchQuery.trim() !== '') params.q = searchQuery.trim();

      const res = await api.getUsers(params);
      if (res.success && res.data) {
        setStudents(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch student directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [branchFilter, yearFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>KBTCOE Student Directory</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Discover and connect with collegiate engineering peers across departments and academic years.
        </p>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

      {/* Filter and Search Box */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Search Query</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search by name, skills (e.g. React), bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Engineering Department</label>
            <select 
              className="form-control"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              {branches.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Academic Year</label>
            <select 
              className="form-control"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="all">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              Search
            </button>
            {(searchQuery || branchFilter !== 'all' || yearFilter !== 'all') && (
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={() => {
                  setSearchQuery('');
                  setBranchFilter('all');
                  setYearFilter('all');
                  fetchStudents();
                }}
              >
                Reset
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <LoadingSpinner text="Searching student database..." />
      ) : students.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>No students match your search criteria</h3>
          <p>Try clearing your branch or keyword filters to broaden results.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {students.map((student) => (
            <div key={student.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div 
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    fontWeight: 700
                  }}
                >
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{student.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {student.branch} • {student.academic_year}
                  </div>
                </div>
              </div>

              {student.bio && (
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-body)', marginBottom: '1rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {student.bio}
                </p>
              )}

              {student.skills && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  {student.skills.split(',').map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="badge badge-neutral"
                      style={{ fontSize: '0.75rem', textTransform: 'none' }}
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: 'auto' }}>
                <button 
                  className="btn btn-outline btn-sm btn-block"
                  onClick={() => {
                    setSelectedStudentId(student.id);
                    setActivePage('profile');
                  }}
                >
                  View Student Portfolio & Achievements →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
