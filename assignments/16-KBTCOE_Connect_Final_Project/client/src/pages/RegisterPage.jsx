/**
 * Student Registration Page
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

export default function RegisterPage({ setActivePage }) {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState('Computer Engineering');
  const [academicYear, setAcademicYear] = useState('TE');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      setErrorDetails([]);

      await register({
        name,
        email,
        password,
        branch,
        academic_year: academicYear,
        bio,
        skills
      });

      setActivePage('dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
      if (err.details && Array.isArray(err.details)) {
        setErrorDetails(err.details);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '580px', margin: '2rem auto' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/kbtcoe-logo.svg" alt="KBTCOE Logo" style={{ width: '48px', height: '48px', marginBottom: '0.75rem', objectFit: 'contain' }} />
          <h2>Create KBTCOE Student Account</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Join the collegiate student network, discover opportunities & publish blogs.
          </p>
        </div>

        {error && <Alert type="danger" message={error} details={errorDetails} onClose={() => setError(null)} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Aarav Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="e.g. aarav.sharma@kbtcoe.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password (Min. 8 characters)</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Engineering Department</label>
              <select 
                className="form-control"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              >
                {branches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Academic Year</label>
              <select 
                className="form-control"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Short Biography (Optional)</label>
            <textarea 
              className="form-control"
              rows={2}
              placeholder="Introduce your engineering interests and passions..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Technical Skills (Optional, comma-separated)</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. React, Python, Cloud, C++"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting} style={{ marginTop: '1.25rem' }}>
            {submitting ? 'Creating Student Account...' : 'Complete Registration'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Already registered?{' '}
          <a href="#login" onClick={(e) => { e.preventDefault(); setActivePage('login'); }} style={{ fontWeight: 600 }}>
            Sign In Here
          </a>
        </div>
      </div>
    </div>
  );
}
