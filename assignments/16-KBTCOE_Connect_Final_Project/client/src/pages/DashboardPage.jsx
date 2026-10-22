/**
 * Dashboard & Landing Page
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage({ setActivePage, setSelectedPostId, setSelectedStudentId }) {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await api.getDashboardStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div>
      {/* Hero Welcome Banner */}
      <section className="hero">
        <h1>Welcome to KBTCOE Connect</h1>
        <p>
          The official centralized platform for students of MVP Samaj's K.B.T. College of Engineering to discover campus opportunities, publish technical blogs, showcase verified achievements, and network across branches.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-secondary" onClick={() => setActivePage('feed')}>
            Explore Community Feed
          </button>
          <button 
            className="btn btn-outline" 
            style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.4)' }}
            onClick={() => setActivePage('opportunities')}
          >
            Find Opportunities
          </button>
          {!isAuthenticated && (
            <button 
              className="btn btn-outline" 
              style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.4)' }}
              onClick={() => setActivePage('register')}
            >
              Join KBTCOE Network
            </button>
          )}
        </div>
      </section>

      {error && <Alert type="danger" message={error} />}

      {loading ? (
        <LoadingSpinner text="Querying database metrics & campus activity..." />
      ) : stats ? (
        <>
          {/* Real-time Metric Cards from Database */}
          <div className="stats-grid">
            <StatCard icon="👥" value={stats.metrics.students} label="Registered Students" />
            <StatCard icon="💬" value={stats.metrics.posts} label="Community Posts" />
            <StatCard icon="💼" value={stats.metrics.opportunities} label="Campus Opportunities" />
            <StatCard icon="🏆" value={stats.metrics.achievements} label="Verified Achievements" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Recent Posts Column */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2>Recent Community Discussions</h2>
                <button className="btn btn-outline btn-sm" onClick={() => setActivePage('feed')}>
                  View Feed →
                </button>
              </div>

              {stats.recentPosts.length === 0 ? (
                <div className="empty-state">No discussions published yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {stats.recentPosts.map((post) => (
                    <div key={post.id} className="card">
                      <div className="card-header">
                        <div>
                          <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
                            {post.category}
                          </span>
                          <h3 
                            style={{ cursor: 'pointer', fontSize: '1.15rem' }}
                            onClick={() => {
                              setSelectedPostId(post.id);
                              setActivePage('post-detail');
                            }}
                          >
                            {post.title}
                          </h3>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', gap: '1rem' }}>
                        <span>By <strong>{post.author_name}</strong> ({post.author_branch})</span>
                        <span>❤️ {post.likes_count}</span>
                        <span>💬 {post.comments_count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Opportunities Column */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2>Latest Campus Opportunities</h2>
                <button className="btn btn-outline btn-sm" onClick={() => setActivePage('opportunities')}>
                  Explore All →
                </button>
              </div>

              {stats.recentOpportunities.length === 0 ? (
                <div className="empty-state">No opportunities active right now.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {stats.recentOpportunities.map((opp) => (
                    <div key={opp.id} className="card">
                      <div className="card-header">
                        <div>
                          <span className="badge badge-warning" style={{ marginBottom: '0.4rem' }}>
                            {opp.category}
                          </span>
                          <h3 style={{ fontSize: '1.15rem' }}>{opp.title}</h3>
                          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                            {opp.organization}
                          </div>
                        </div>
                        {opp.is_expired ? (
                          <span className="badge badge-danger">Expired</span>
                        ) : (
                          <span className="badge badge-success">Active</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Deadline: {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'Rolling Basis'}</span>
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => setActivePage('opportunities')}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
