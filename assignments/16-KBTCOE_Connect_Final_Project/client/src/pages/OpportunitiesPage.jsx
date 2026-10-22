/**
 * Campus Opportunities Board Page
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

export default function OpportunitiesPage({ setActivePage }) {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Creation modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [category, setCategory] = useState('internship');
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit modal state
  const [editingOpp, setEditingOpp] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editOrg, setEditOrg] = useState('');
  const [editCategory, setEditCategory] = useState('internship');
  const [editDescription, setEditDescription] = useState('');
  const [editEligibility, setEditEligibility] = useState('');
  const [editApplyUrl, setEditApplyUrl] = useState('');
  const [editDeadline, setEditDeadline] = useState('');

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchQuery.trim() !== '') params.q = searchQuery.trim();

      const res = await api.getOpportunities(params);
      if (res.success && res.data) {
        setOpportunities(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load opportunities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [selectedCategory, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOpportunities();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const res = await api.createOpportunity({
        title,
        organization,
        category,
        description,
        eligibility,
        application_url: applyUrl,
        deadline: deadline || null
      });
      if (res.success) {
        setSuccessMsg('Opportunity published successfully!');
        setTitle('');
        setOrganization('');
        setCategory('internship');
        setDescription('');
        setEligibility('');
        setApplyUrl('');
        setDeadline('');
        setModalOpen(false);
        fetchOpportunities();
      }
    } catch (err) {
      setError(err.message || 'Failed to post opportunity.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this opportunity?')) return;
    try {
      const res = await api.deleteOpportunity(id);
      if (res.success) {
        setSuccessMsg('Opportunity deleted successfully.');
        setOpportunities((prev) => prev.filter((o) => o.id !== id));
      }
    } catch (err) {
      setError(err.message || 'Failed to delete opportunity.');
    }
  };

  const handleStartEdit = (opp) => {
    setEditingOpp(opp);
    setEditTitle(opp.title);
    setEditOrg(opp.organization);
    setEditCategory(opp.category);
    setEditDescription(opp.description);
    setEditEligibility(opp.eligibility);
    setEditApplyUrl(opp.application_url);
    setEditDeadline(opp.deadline ? opp.deadline.substring(0, 10) : '');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingOpp) return;
    try {
      setSubmitting(true);
      const res = await api.updateOpportunity(editingOpp.id, {
        title: editTitle,
        organization: editOrg,
        category: editCategory,
        description: editDescription,
        eligibility: editEligibility,
        application_url: editApplyUrl,
        deadline: editDeadline || null
      });
      if (res.success) {
        setSuccessMsg('Opportunity updated successfully.');
        setEditingOpp(null);
        fetchOpportunities();
      }
    } catch (err) {
      setError(err.message || 'Failed to update opportunity.');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'internship', label: 'Internships' },
    { id: 'hackathon', label: 'Hackathons' },
    { id: 'competition', label: 'Competitions' },
    { id: 'workshop', label: 'Workshops' }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Campus Opportunities Explorer</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Verified internships, hackathons, technical symposiums, and industrial bootcamps.
          </p>
        </div>

        {isAuthenticated ? (
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            📢 Post Opportunity
          </button>
        ) : (
          <button className="btn btn-outline" onClick={() => setActivePage('login')}>
            Sign in to Publish Listings
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
              placeholder="Search by role, company (e.g. Siemens), keywords..."
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
                setStatusFilter('all');
                fetchOpportunities();
              }}
            >
              Reset
            </button>
          )}
        </form>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
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

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button 
              className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All Status
            </button>
            <button 
              className={`filter-pill ${statusFilter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setStatusFilter('upcoming')}
            >
              Active
            </button>
            <button 
              className={`filter-pill ${statusFilter === 'expired' ? 'active' : ''}`}
              onClick={() => setStatusFilter('expired')}
            >
              Expired
            </button>
          </div>
        </div>
      </div>

      {/* Opportunities Grid */}
      {loading ? (
        <LoadingSpinner text="Fetching opportunities database..." />
      ) : opportunities.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💼</div>
          <h3>No opportunities match your search</h3>
          <p>Try clearing your status or category filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {opportunities.map((opp) => {
            const isOwner = user && (user.id === opp.created_by || isAdmin);
            return (
              <div key={opp.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="card-header">
                  <div>
                    <span className="badge badge-warning" style={{ marginBottom: '0.4rem' }}>
                      {opp.category}
                    </span>
                    <h3 style={{ fontSize: '1.2rem' }}>{opp.title}</h3>
                    <div style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
                      {opp.organization}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                    {opp.is_expired ? (
                      <span className="badge badge-danger">Expired</span>
                    ) : (
                      <span className="badge badge-success">Active</span>
                    )}

                    {isOwner && (
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => handleStartEdit(opp)}
                          title="Edit opportunity"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(opp.id)}
                          title="Delete opportunity"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-body)', margin: '0.75rem 0' }}>
                  {opp.description}
                </p>

                <div style={{ backgroundColor: 'var(--color-bg)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  <strong>Eligibility:</strong> {opp.eligibility}
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    Deadline: {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'Rolling'}
                  </span>
                  <a 
                    href={opp.application_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary btn-sm"
                  >
                    Apply Now ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Post Opportunity Modal */}
      <Modal isOpen={modalOpen} title="Post Campus Opportunity" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Opportunity Title</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Siemens Summer Research Internship 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={5}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Organization / Sponsoring Cell</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Siemens Technology India / KBTCOE IEDC"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              required
              minLength={2}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select 
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="internship">Internship</option>
              <option value="hackathon">Hackathon</option>
              <option value="competition">Competition</option>
              <option value="workshop">Workshop / Bootcamp</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-control"
              rows={3}
              placeholder="Outline project duties, technological stack, learning outcomes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={15}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Eligibility Criteria</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. TE & BE Computer and IT students with min 60% aggregate"
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              required
              minLength={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Application / Registration URL</label>
            <input 
              type="url" 
              className="form-control" 
              placeholder="https://..."
              value={applyUrl}
              onChange={(e) => setApplyUrl(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Deadline (Optional)</label>
            <input 
              type="date" 
              className="form-control" 
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish Opportunity'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Opportunity Modal */}
      <Modal isOpen={Boolean(editingOpp)} title="Edit Opportunity Details" onClose={() => setEditingOpp(null)}>
        <form onSubmit={handleSaveEdit}>
          <div className="form-group">
            <label className="form-label">Opportunity Title</label>
            <input 
              type="text" 
              className="form-control" 
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              minLength={5}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Organization</label>
            <input 
              type="text" 
              className="form-control" 
              value={editOrg}
              onChange={(e) => setEditOrg(e.target.value)}
              required
              minLength={2}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select 
              className="form-control"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
            >
              <option value="internship">Internship</option>
              <option value="hackathon">Hackathon</option>
              <option value="competition">Competition</option>
              <option value="workshop">Workshop / Bootcamp</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-control"
              rows={3}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              required
              minLength={15}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Eligibility</label>
            <input 
              type="text" 
              className="form-control" 
              value={editEligibility}
              onChange={(e) => setEditEligibility(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Application URL</label>
            <input 
              type="url" 
              className="form-control" 
              value={editApplyUrl}
              onChange={(e) => setEditApplyUrl(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Deadline</label>
            <input 
              type="date" 
              className="form-control" 
              value={editDeadline}
              onChange={(e) => setEditDeadline(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setEditingOpp(null)}>
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
