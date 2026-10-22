/**
 * Student Public Portfolio & Profile Page
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

export default function ProfilePage({ studentId, setActivePage, setSelectedPostId }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getUserById(studentId);
        if (res.success && res.data) {
          setProfile(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load student profile.');
      } finally {
        setLoading(false);
      }
    }

    if (studentId) {
      fetchProfile();
    }
  }, [studentId]);

  if (loading) {
    return <LoadingSpinner text="Loading student portfolio & achievements..." />;
  }

  if (error || !profile) {
    return (
      <div>
        <Alert type="danger" message={error || 'Profile not found.'} />
        <button className="btn btn-outline" onClick={() => setActivePage('directory')}>
          ← Back to Student Directory
        </button>
      </div>
    );
  }

  const isOwnProfile = user && user.id === profile.id;

  return (
    <div>
      <button 
        className="btn btn-outline btn-sm" 
        style={{ marginBottom: '1.25rem' }}
        onClick={() => setActivePage('directory')}
      >
        ← Back to Student Directory
      </button>

      {/* Profile Header Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div 
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 700
              }}
            >
              {profile.name.charAt(0)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h1 style={{ fontSize: '1.85rem', margin: 0 }}>{profile.name}</h1>
                <span className="badge badge-primary">{profile.role}</span>
              </div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
                {profile.branch} • {profile.academic_year}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginTop: '0.25rem' }}>
                Member since {new Date(profile.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {isOwnProfile && (
            <button className="btn btn-primary" onClick={() => setActivePage('settings')}>
              ✏️ Edit Profile Settings
            </button>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>About</h4>
            <p style={{ color: 'var(--color-text-body)', fontSize: '1rem', lineHeight: '1.6' }}>
              {profile.bio}
            </p>
          </div>
        )}

        {/* Skills & Interests */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          {profile.skills && (
            <div>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}>Technical Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {profile.skills.split(',').map((skill, idx) => (
                  <span key={idx} className="badge badge-neutral" style={{ textTransform: 'none' }}>
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.interests && (
            <div>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}>Engineering Interests</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-body)' }}>
                {profile.interests}
              </p>
            </div>
          )}
        </div>

        {/* Links */}
        {(profile.github_url || profile.portfolio_url) && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '1rem' }}>
            {profile.github_url && (
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                🐙 GitHub Profile ↗
              </a>
            )}
            {profile.portfolio_url && (
              <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                🌐 Personal Website ↗
              </a>
            )}
          </div>
        )}
      </div>

      {/* Two-Column Grid: Achievements and Posts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Achievements Section */}
        <div>
          <h3 style={{ marginBottom: '1rem' }}>
            Verified Achievements ({profile.achievements ? profile.achievements.length : 0})
          </h3>

          {!profile.achievements || profile.achievements.length === 0 ? (
            <div className="empty-state">No achievements recorded yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {profile.achievements.map((ach) => (
                <div key={ach.id} className="card">
                  <span className="badge badge-warning" style={{ marginBottom: '0.4rem' }}>
                    {ach.category}
                  </span>
                  <h4>{ach.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-body)', margin: '0.5rem 0' }}>
                    {ach.description}
                  </p>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Date: {new Date(ach.date_achieved).toLocaleDateString()}</span>
                    {ach.external_url && (
                      <a href={ach.external_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem' }}>
                        View Certificate ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Community Posts Section */}
        <div>
          <h3 style={{ marginBottom: '1rem' }}>
            Published Insights & Blogs ({profile.posts ? profile.posts.length : 0})
          </h3>

          {!profile.posts || profile.posts.length === 0 ? (
            <div className="empty-state">No discussions published yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {profile.posts.map((post) => (
                <div key={post.id} className="card">
                  <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
                    {post.category}
                  </span>
                  <h4 
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedPostId(post.id);
                      setActivePage('post-detail');
                    }}
                  >
                    {post.title}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
                    <span>Published: {new Date(post.created_at).toLocaleDateString()}</span>
                    <span>❤️ {post.likes_count}</span>
                    <span>💬 {post.comments_count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
