/**
 * Student Achievements Showcase Page
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

export default function AchievementsPage({ setActivePage, setSelectedStudentId }) {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Creation modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('hackathon');
  const [description, setDescription] = useState('');
  const [dateAchieved, setDateAchieved] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit modal state
  const [editingAch, setEditingAch] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('hackathon');
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editUrl, setEditUrl] = useState('');

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (searchQuery.trim() !== '') params.q = searchQuery.trim();

      const res = await api.getAchievements(params);
      if (res.success && res.data) {
        setAchievements(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load achievements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAchievements();
  };

  const handleCreateAchievement = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const res = await api.createAchievement({
        title,
        category,
        description,
        date_achieved: dateAchieved,
        external_url: externalUrl
      });
      if (res.success) {
        setSuccessMsg('Achievement recorded and showcased successfully!');
        setTitle('');
        setCategory('hackathon');
        setDescription('');
        setDateAchieved('');
        setExternalUrl('');
        setModalOpen(false);
        fetchAchievements();
      }
    } catch (err) {
      setError(err.message || 'Failed to record achievement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this achievement?')) return;
    try {
      const res = await api.deleteAchievement(id);
      if (res.success) {
        setSuccessMsg('Achievement removed successfully.');
        setAchievements((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      setError(err.message || 'Failed to delete achievement.');
    }
  };

  const handleStartEdit = (ach) => {
    setEditingAch(ach);
    setEditTitle(ach.title);
    setEditCategory(ach.category);
    setEditDescription(ach.description);
    setEditDate(ach.date_achieved ? ach.date_achieved.substring(0, 10) : '');
    setEditUrl(ach.external_url || '');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingAch) return;
    try {
      setSubmitting(true);
      const res = await api.updateAchievement(editingAch.id, {
        title: editTitle,
        category: editCategory,
        description: editDescription,
        date_achieved: editDate,
        external_url: editUrl
      });
      if (res.success) {
        setSuccessMsg('Achievement updated successfully.');
        setEditingAch(null);
        fetchAchievements();
      }
    } catch (err) {
      setError(err.message || 'Failed to update achievement.');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Achievements' },
    { id: 'hackathon', label: 'Hackathons' },
    { id: 'competition', label: 'Competitions' },
    { id: 'certification', label: 'Certifications' },
    { id: 'project', label: 'Technical Projects' },
    { id: 'workshop', label: 'Bootcamps & Workshops' },
    { id: 'academic', label: 'Academic Honors' }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Student Achievements & Honors</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Showcase of hackathon wins, cloud certifications, and technical awards by KBTCOE engineers.
          </p>
        </div>

        {isAuthenticated ? (
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            🏆 Record New Achievement
          </button>
        ) : (
          <button className="btn btn-outline" onClick={() => setActivePage('login')}>
            Sign in to Record Achievements
          </button>
        )}
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}
      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg(null)} />}

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <form onSubmit={handleSearchSubmit} className="filter-bar" style={{ marginBottom: '0.75rem' }}>
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search achievements by title, student name, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
          {searchQuery && (
            <button 
              type="button" 
              className="btn btn-outline btn-sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                fetchAchievements();
              }}
            >
              Reset
            </button>
          )}
        </form>

        <div className="filter-pills">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      {loading ? (
        <LoadingSpinner text="Loading verified achievements..." />
      ) : achievements.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏅</div>
          <h3>No achievements found</h3>
          <p>Try selecting a different category or search term.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {achievements.map((ach) => {
            const isOwner = user && (user.id === ach.user_id || isAdmin);
            return (
              <div key={ach.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="card-header">
                  <div>
                    <span className="badge badge-warning" style={{ marginBottom: '0.4rem' }}>
                      {ach.category}
                    </span>
                    <h3 style={{ fontSize: '1.15rem' }}>{ach.title}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                      Earned by{' '}
                      <span 
                        style={{ fontWeight: 600, color: 'var(--color-primary)', cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedStudentId(ach.user_id);
                          setActivePage('profile');
                        }}
                      >
                        {ach.student_name}
                      </span>{' '}
                      ({ach.student_branch})
                    </div>
                  </div>

                  {isOwner && (
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => handleStartEdit(ach)}
                        title="Edit achievement"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(ach.id)}
                        title="Delete achievement"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-body)', margin: '0.75rem 0', flex: 1 }}>
                  {ach.description}
                </p>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    📅 {new Date(ach.date_achieved).toLocaleDateString()}
                  </span>
                  {ach.external_url && (
                    <a href={ach.external_url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
                      Certificate / Project Link ↗
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Record Achievement Modal */}
      <Modal isOpen={modalOpen} title="Record Student Achievement" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleCreateAchievement}>
          <div className="form-group">
            <label className="form-label">Achievement Title</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Smart India Hackathon (SIH 2025) 1st Runner-Up"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select 
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="hackathon">Hackathon</option>
              <option value="competition">Competition</option>
              <option value="certification">Professional Certification</option>
              <option value="project">Technical Project</option>
              <option value="workshop">Bootcamp / Workshop</option>
              <option value="academic">Academic Honor</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description & Impact</label>
            <textarea 
              className="form-control"
              rows={3}
              placeholder="Briefly describe the competition, team, prototype, or certificate credentials..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={10}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date Achieved</label>
            <input 
              type="date" 
              className="form-control" 
              value={dateAchieved}
              onChange={(e) => setDateAchieved(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Certificate or Project URL (Optional)</label>
            <input 
              type="url" 
              className="form-control" 
              placeholder="https://..."
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Recording...' : 'Record Achievement'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Achievement Modal */}
      <Modal isOpen={Boolean(editingAch)} title="Edit Achievement Record" onClose={() => setEditingAch(null)}>
        <form onSubmit={handleSaveEdit}>
          <div className="form-group">
            <label className="form-label">Achievement Title</label>
            <input 
              type="text" 
              className="form-control" 
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              minLength={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select 
              className="form-control"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
            >
              <option value="hackathon">Hackathon</option>
              <option value="competition">Competition</option>
              <option value="certification">Professional Certification</option>
              <option value="project">Technical Project</option>
              <option value="workshop">Bootcamp / Workshop</option>
              <option value="academic">Academic Honor</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description & Impact</label>
            <textarea 
              className="form-control"
              rows={3}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              required
              minLength={10}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date Achieved</label>
            <input 
              type="date" 
              className="form-control" 
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Certificate or Project URL</label>
            <input 
              type="url" 
              className="form-control" 
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setEditingAch(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
