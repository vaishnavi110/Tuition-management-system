import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Home Page */}
          <Route path="/" element={<HomePage />} />
          
          {/* Dedicated Sign In Page */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Public Role-Based Registration Page */}
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Role-Based Dashboard & Profiles */}
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
