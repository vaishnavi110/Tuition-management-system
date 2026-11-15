import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('tuition_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set default auth header for axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  // Verify and fetch profile on refresh
  const fetchUserProfile = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data.user);
    } catch (err) {
      console.warn('Session expired or invalid, logging out.');
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Real login with credentials
  const login = async (emailOrPhone, password) => {
    setError(null);
    try {
      const res = await axios.post('/api/auth/login', { emailOrPhone, password });
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem('tuition_token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      return receivedUser;
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed. Please check your credentials.';
      setError(message);
      throw new Error(message);
    }
  };

  // 1-Click Fast Login for easy testing
  const quickLogin = async (role) => {
    const creds = {
      ADMIN: { email: 'admin@tuition.com', pass: 'admin123' },
      TEACHER: { email: 'teacher@tuition.com', pass: 'teacher123' },
      STUDENT: { email: 'student@tuition.com', pass: 'student123' },
    };
    const target = creds[role];
    if (target) {
      return await login(target.email, target.pass);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('tuition_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, role: user?.role, login, quickLogin, logout, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
