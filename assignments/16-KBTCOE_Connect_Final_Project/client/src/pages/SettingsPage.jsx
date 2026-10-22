/**
 * Profile Settings Page
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

import React, { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

export default function SettingsPage({ setActivePage, setSelectedStudentId }) {
  const { user, updateCurrentUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [branch, setBranch] = useState(user?.branch || 'Computer Engineering');
  const [academicYear, setAcademicYear] = useState(user?.academic_year || 'TE');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState(user?.skills || '');
  const [interests, setInterests] = useState(user?.interests || '');
  const [githubUrl, setGithubUrl] = useState(user?.github_url || '');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolio_url || '');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const branches = [
    'Computer Engineering',
    'Information Technology',
    'Artificial Intelligence & Data Science',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electronics & Telecommunication',
    'Instrumentation Engineering'
  ];

  const years = ['FE', 'SE', 'TE', 'BE', 'Faculty', 'Alumni'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const res = await api.updateProfile({
        name,
        branch,
        academic_year: academicYear,
        bio,
        skills,
        interests,
        github_url: githubUrl,
        portfolio_url: portfolioUrl
      });

      if (res.success && res.data) {
        updateCurrentUser(res.data);
        setSuccess('Your profile settings were successfully updated in the database!');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile settings.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2>My Profile Settings</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Manage your personal profile, skills, and portfolio links visible across KBTCOE Connect.
          </p>
        </div>

        {user && (
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => {
              setSelectedStudentId(user.id);
              setActivePage('profile');
            }}
          >
            View Public Profile →
          </button>
        )}
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input 
            type="text" 
            className="form-control" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
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
          <label className="form-label">Professional Biography</label>
          <textarea 
            className="form-control" 
            rows={4}
            placeholder="Share your background, passions, and collegiate career aspirations..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Technical Skills (Comma separated)</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="e.g. JavaScript, React, Node.js, Express, MySQL, Docker"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Engineering Interests</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="e.g. Full-Stack Web, Cloud Native, IoT, Hackathons"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">GitHub URL</label>
            <input 
              type="url" 
              className="form-control" 
              placeholder="https://github.com/..."
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Portfolio / Website URL</label>
            <input 
              type="url" 
              className="form-control" 
              placeholder="https://..."
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
