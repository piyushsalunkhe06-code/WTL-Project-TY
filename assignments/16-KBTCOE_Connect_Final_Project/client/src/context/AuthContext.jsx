/**
 * Authentication Context & Provider
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('kbtcoe_auth_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Synchronize authenticated session on initial mount
  useEffect(() => {
    async function verifySession() {
      const storedToken = localStorage.getItem('kbtcoe_auth_token');
      if (!storedToken) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.getMe();
        if (response.success && response.data) {
          setUser(response.data);
          setToken(storedToken);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session verification failed:', err.message);
        logout();
      } finally {
        setIsLoading(false);
      }
    }

    verifySession();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success && res.data) {
      localStorage.setItem('kbtcoe_auth_token', res.data.token);
      localStorage.setItem('kbtcoe_user_data', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    }
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.success && res.data) {
      localStorage.setItem('kbtcoe_auth_token', res.data.token);
      localStorage.setItem('kbtcoe_user_data', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('kbtcoe_auth_token');
    localStorage.removeItem('kbtcoe_user_data');
    setToken(null);
    setUser(null);
  };

  const updateCurrentUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('kbtcoe_user_data', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isAdmin: Boolean(user && user.role === 'admin'),
    isLoading,
    login,
    register,
    logout,
    updateCurrentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
