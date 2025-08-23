import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import CheckerPage from './pages/CheckerPage';
import AboutPage from './pages/AboutPage';
import TipsPage from './pages/TipsPage';
import PricingPage from './pages/PricingPage';
import CheckoutPage from './pages/CheckoutPage'; 
import SupportPage from './pages/SupportPage'; 
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage'; // 1. Import
import ResetPasswordPage from './pages/ResetPasswordPage';   // 2. Import
import ProfilePage from './pages/ProfilePage'; // 1. Import



function App() {
  return (
    <Router>
      <Navbar />

      <div className="app-container">
        <main className="page-content">
          <Routes>
            {/* --- PUBLIC ROUTES --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/tips" element={<TipsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/checkout/:planName" element={<CheckoutPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
           
            {/* --- PROTECTED ROUTES --- */}
            <Route 
              path="/dashboard"
              element={
                <ProtectedRoute> <DashboardPage /> </ProtectedRoute>
              } 
            />
            <Route 
              path="/check"
              element={
                <ProtectedRoute> <CheckerPage /></ProtectedRoute>
              } 
            />
             <Route 
              path="/profile" 
              element={<ProtectedRoute> <ProfilePage /></ProtectedRoute>} 
            />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
