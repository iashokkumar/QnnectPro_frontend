/**
 * Authentication utility functions for handling JWT tokens
 */

const TOKEN_KEY = 'qnnect_auth_token';
const USER_KEY = 'qnnect_user';

/**
 * Save authentication token to localStorage
 */
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Get authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/**
 * Remove authentication token from localStorage
 */
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Save user data to localStorage
 */
export const setUser = (user: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

/**
 * Get user data from localStorage
 */
export const getUser = (): any | null => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }
  return null;
};

/**
 * Remove user data from localStorage
 */
export const removeUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Check if user has a specific role
 */
export const hasRole = (role: string): boolean => {
  const user = getUser();
  return user?.role === role;
};

/**
 * Logout user by removing auth data
 */
export const logout = (): void => {
  removeAuthToken();
  removeUser();
  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

/**
 * Get authorization header with token
 */
export const getAuthHeader = (): { Authorization: string } | {} => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  setUser,
  getUser,
  removeUser,
  isAuthenticated,
  hasRole,
  logout,
  getAuthHeader,
};
