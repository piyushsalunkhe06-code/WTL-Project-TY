/**
 * Main Application Component & Single Page Routing
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import DashboardPage from './pages/DashboardPage';
import FeedPage from './pages/FeedPage';
import PostDetailPage from './pages/PostDetailPage';
import DirectoryPage from './pages/DirectoryPage';
import ProfilePage from './pages/ProfilePage';
import AchievementsPage from './pages/AchievementsPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardPage 
            setActivePage={setActivePage}
            setSelectedPostId={setSelectedPostId}
            setSelectedStudentId={setSelectedStudentId}
          />
        );

      case 'feed':
        return (
          <FeedPage 
            setActivePage={setActivePage}
            setSelectedPostId={setSelectedPostId}
            setSelectedStudentId={setSelectedStudentId}
          />
        );

      case 'post-detail':
        return (
          <PostDetailPage 
            postId={selectedPostId}
            setActivePage={setActivePage}
            setSelectedStudentId={setSelectedStudentId}
          />
        );

      case 'directory':
        return (
          <DirectoryPage 
            setActivePage={setActivePage}
            setSelectedStudentId={setSelectedStudentId}
          />
        );

      case 'profile':
        return (
          <ProfilePage 
            studentId={selectedStudentId || (user ? user.id : 2)}
            setActivePage={setActivePage}
            setSelectedPostId={setSelectedPostId}
          />
        );

      case 'achievements':
        return (
          <AchievementsPage 
            setActivePage={setActivePage}
            setSelectedStudentId={setSelectedStudentId}
          />
        );

      case 'opportunities':
        return (
          <OpportunitiesPage 
            setActivePage={setActivePage}
          />
        );

      case 'settings':
        return isAuthenticated ? (
          <SettingsPage 
            setActivePage={setActivePage}
            setSelectedStudentId={setSelectedStudentId}
          />
        ) : (
          <LoginPage setActivePage={setActivePage} />
        );

      case 'login':
        return <LoginPage setActivePage={setActivePage} />;

      case 'register':
        return <RegisterPage setActivePage={setActivePage} />;

      default:
        return (
          <DashboardPage 
            setActivePage={setActivePage}
            setSelectedPostId={setSelectedPostId}
            setSelectedStudentId={setSelectedStudentId}
          />
        );
    }
  };

  return (
    <>
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content container">
        {renderCurrentPage()}
      </main>
      <Footer setActivePage={setActivePage} />
    </>
  );
}
