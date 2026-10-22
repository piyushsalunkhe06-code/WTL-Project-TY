import React, { useState } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './pages/HomeView';
import StudentsView from './pages/StudentsView';
import BlogsView from './pages/BlogsView';
import OpportunitiesView from './pages/OpportunitiesView';

/**
 * App Component (Root Shell)
 * Demonstrates:
 * - Functional component composition
 * - React state management with useState for client-side view navigation
 * - Conditional rendering without browser full-page reload
 * - Reusable UI components (Header, Navbar, Footer)
 */
export default function App() {
  // Navigation state: 'home' | 'students' | 'blogs' | 'opportunities'
  const [currentView, setCurrentView] = useState('home');

  // View navigation handler
  const handleNavigate = (viewId) => {
    setCurrentView(viewId);
    // Smooth scroll to top of content when switching views
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-shell">
      {/* Site Header */}
      <Header />

      {/* Main Navigation Bar */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main Content Area (Conditional Rendering based on currentView state) */}
      <main id="main-content" className="site-main container">
        {currentView === 'home' && (
          <HomeView onNavigate={handleNavigate} />
        )}

        {currentView === 'students' && (
          <StudentsView />
        )}

        {currentView === 'blogs' && (
          <BlogsView />
        )}

        {currentView === 'opportunities' && (
          <OpportunitiesView />
        )}

        {/* Fallback view for unrecognized navigation state */}
        {!['home', 'students', 'blogs', 'opportunities'].includes(currentView) && (
          <div className="view-container fallback-view">
            <h2>View Not Found</h2>
            <p>The requested view does not exist in this single-page application prototype.</p>
            <button 
              type="button" 
              className="btn-hero-primary" 
              onClick={() => handleNavigate('home')}
            >
              Return to Home Dashboard
            </button>
          </div>
        )}
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
