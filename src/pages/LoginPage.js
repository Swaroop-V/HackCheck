import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed.');
      }
      
      login();
      
      navigate('/check');

    } catch (error) {
      setMessage(error.toString());
    }
  };

  return (
    <div className="checker">
      <div className="checker-container">
        <div className="checker-card">
          <div className="checker-header">
            <div className="lock-icon">🔑</div>
            <h1 className="checker-title">Welcome Back</h1>
            <p className="checker-subtitle">Log in to your HackCheck account.</p>
          </div>

          <form onSubmit={handleSubmit} className="checker-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" placeholder="••••••••" required />
            </div>
            
            <button type="submit" className="btn-primary submit-payment-btn">
              Log In
            </button>
          </form>

          {message && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{message}</p>}

          <div className="auth-switch">
            <p>Don't have an account? <Link to="/signup" className="auth-switch-link">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;