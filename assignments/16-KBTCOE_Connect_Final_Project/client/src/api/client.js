/**
 * Centralized API Client Service
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

const API_BASE = '/api';

/**
 * Executes an HTTP fetch request with token injection and error normalization.
 */
async function request(endpoint, options = {}) {
  const { method = 'GET', body, token } = options;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  // Inject Bearer token if provided or stored in localStorage
  const activeToken = token || localStorage.getItem('kbtcoe_auth_token');
  if (activeToken) {
    headers['Authorization'] = `Bearer ${activeToken}`;
  }

  const fetchOptions = {
    method,
    headers
  };

  if (body !== undefined) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, fetchOptions);

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = { success: false, message: 'Non-JSON response received from server.' };
  }

  if (!response.ok) {
    const error = new Error(data.message || data.error || `HTTP Error ${response.status}`);
    error.status = response.status;
    error.details = data.details || data.errors;
    throw error;
  }

  return data;
}

export const api = {
  // System Health & Dashboard
  getHealth: () => request('/health'),
  getDashboardStats: () => request('/dashboard/stats'),

  // Authentication
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  register: (userData) => request('/auth/register', { method: 'POST', body: userData }),
  getMe: () => request('/auth/me'),

  // Students & Profiles
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/users${query ? `?${query}` : ''}`);
  },
  getUserById: (id) => request(`/users/${id}`),
  updateProfile: (profileData) => request('/users/profile', { method: 'PUT', body: profileData }),

  // Community Posts
  getPosts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/posts${query ? `?${query}` : ''}`);
  },
  getPostById: (id) => request(`/posts/${id}`),
  createPost: (postData) => request('/posts', { method: 'POST', body: postData }),
  updatePost: (id, postData) => request(`/posts/${id}`, { method: 'PUT', body: postData }),
  deletePost: (id) => request(`/posts/${id}`, { method: 'DELETE' }),

  // Comments
  getComments: (postId) => request(`/posts/${postId}/comments`),
  createComment: (postId, commentData) => request(`/posts/${postId}/comments`, { method: 'POST', body: commentData }),
  deleteComment: (commentId) => request(`/comments/${commentId}`, { method: 'DELETE' }),

  // Likes
  toggleLike: (postId) => request(`/posts/${postId}/like`, { method: 'POST' }),

  // Achievements
  getAchievements: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/achievements${query ? `?${query}` : ''}`);
  },
  getAchievementById: (id) => request(`/achievements/${id}`),
  createAchievement: (data) => request('/achievements', { method: 'POST', body: data }),
  updateAchievement: (id, data) => request(`/achievements/${id}`, { method: 'PUT', body: data }),
  deleteAchievement: (id) => request(`/achievements/${id}`, { method: 'DELETE' }),

  // Opportunities
  getOpportunities: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/opportunities${query ? `?${query}` : ''}`);
  },
  getOpportunityById: (id) => request(`/opportunities/${id}`),
  createOpportunity: (data) => request('/opportunities', { method: 'POST', body: data }),
  updateOpportunity: (id, data) => request(`/opportunities/${id}`, { method: 'PUT', body: data }),
  deleteOpportunity: (id) => request(`/opportunities/${id}`, { method: 'DELETE' })
};
