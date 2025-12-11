import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Authentication API Service
 * Handles login, logout, token refresh, and user management
 */

export const authService = {
  /**
   * Login user and get JWT tokens
   * @param {string} username - Username or email
   * @param {string} password - Password
   * @returns {Promise} - User data with tokens
   */
  login: async (username, password) => {
    console.log('Auth service - attempting login with:', username);
    
    const response = await axios.post(`${API_BASE_URL}/auth/token/`, {
      username,
      password,
    });
    
    console.log('Auth service - login response:', response.status);
    
    const { access, refresh } = response.data;
    
    // Store tokens in localStorage first
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    
    // Fetch user profile with the access token
    const userResponse = await axios.get(`${API_BASE_URL}/auth/user/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    
    const user = userResponse.data;
    
    // Store user in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    
    // Return both tokens and user
    return { access, refresh, user };
  },

  /**
   * Logout user and clear tokens
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  /**
   * Refresh access token using refresh token
   * @returns {Promise} - New access token
   */
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
      refresh: refreshToken,
    });

    const { access } = response.data;
    localStorage.setItem('accessToken', access);
    
    return access;
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} - User object or null
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  /**
   * Get access token
   * @returns {string|null}
   */
  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },
};

export default authService;
