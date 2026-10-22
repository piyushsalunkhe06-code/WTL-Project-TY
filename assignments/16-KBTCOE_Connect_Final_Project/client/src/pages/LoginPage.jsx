/**
 * User Login Page
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

export default function LoginPage({ setActivePage }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      await login(email, password);
      setActivePage('dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoFill = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/kbtcoe-logo.svg" alt="KBTCOE Logo" style={{ width: '48px', height: '48px', marginBottom: '0.75rem', objectFit: 'contain' }} />
          <h2>Sign in to KBTCOE Connect</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Access student networking, campus opportunities & discussions.
          </p>
        </div>

        {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="e.g. sanket.patil@kbtcoe.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting} style={{ marginTop: '1.25rem' }}>
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Student Credentials */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.75rem', textAlign: 'center' }}>
            ⚡ One-Click Demo Credentials (Lab Evaluation):
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
            <button 
              type="button" 
              className="btn btn-outline btn-sm"
              onClick={() => handleDemoFill('sanket.patil@kbtcoe.org')}
            >
              Fill: <strong>Sanket Patil</strong> (TE IT Student)
            </button>
            <button 
              type="button" 
              className="btn btn-outline btn-sm"
              onClick={() => handleDemoFill('tanvi.kulkarni@kbtcoe.org')}
            >
              Fill: <strong>Tanvi Kulkarni</strong> (BE Comp Student)
            </button>
            <button 
              type="button" 
              className="btn btn-outline btn-sm"
              onClick={() => handleDemoFill('admin@kbtcoe.org')}
            >
              Fill: <strong>Prof. Nitin Sonawane</strong> (Faculty Admin)
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Don't have an account yet?{' '}
          <a href="#register" onClick={(e) => { e.preventDefault(); setActivePage('register'); }} style={{ fontWeight: 600 }}>
            Register as a Student
          </a>
        </div>
      </div>
    </div>
  );
}
