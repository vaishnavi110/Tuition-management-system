import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure global Axios request interceptor to always attach current token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('tuition_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem('tuition_token');
    if (saved) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${saved}`;
    }
    return saved || null;
  });
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

  // Real registration
  const registerUser = async (formData) => {
    setError(null);
    try {
      const res = await axios.post('/api/auth/register', formData);
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem('tuition_token', receivedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
      setToken(receivedToken);
      setUser(receivedUser);
      return receivedUser;
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  // Real login with credentials
  const login = async (emailOrPhone, password) => {
    setError(null);
    try {
      const res = await axios.post('/api/auth/login', { emailOrPhone, password });
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem('tuition_token', receivedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
      setToken(receivedToken);
      setUser(receivedUser);
      return receivedUser;
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed. Please check your credentials.';
      setError(message);
      throw new Error(message);
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    setError(null);
    try {
      const res = await axios.put('/api/auth/profile', profileData);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to update profile.';
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
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      role: user?.role, 
      login, 
      registerUser, 
      updateProfile, 
      quickLogin, 
      logout, 
      loading, 
      error, 
      setError 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
