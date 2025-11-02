import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Get user level based on karma
 */
const getLevel = (karma) => {
  if (karma < 50) return 'Newbie';
  if (karma < 150) return 'Student';
  if (karma < 300) return 'Tutor';
  if (karma < 500) return 'Expert';
  return 'Master';
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    // Load token from localStorage on initialization
    return localStorage.getItem('authToken') || '';
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user info when token changes
  useEffect(() => {
    if (token) {
      fetchUserInfo();
    } else {
      setUser(null);

    }
  }, [token]);

  // Save token to localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [token]);

  /**
   * Fetch current user information including karma
   */
  const fetchUserInfo = async () => {
    if (!token) return;
    
    try {
      const userData = await userAPI.getCurrentUser(token);
      setUser({
        ...userData,
        level: getLevel(userData.karma || 0)
      });
    } catch (err) {
      console.error('Failed to fetch user info:', err);
      // Don't clear token on error, might be temporary network issue
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authAPI.login(email, password);
      setToken(data.access_token);
      // fetchUserInfo will be called by useEffect
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authAPI.register(name, email, password);
      // Auto-login after registration
      const loginData = await authAPI.login(email, password);
      setToken(loginData.access_token);
      // fetchUserInfo will be called by useEffect
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
  };

  const refreshUser = () => {
    // Expose function to manually refresh user info (e.g., after karma update)
    fetchUserInfo();
  };

  const value = {
    token,
    user,
    login,
    register,
    logout,
    refreshUser,
    loading,
    isAuthenticated: !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

