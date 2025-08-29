import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
      const response = await fetch(`${API_URL}/api/user/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If the login fails, throw an error to be caught by the catch block
        throw new Error(data.message || 'Login failed.');
      }
      
      // If the response is OK, i will know the login was successful.
      // updates the context and then navigate.
      login(data.user);
      navigate('/dashboard'); // Navigate to the dashboard on success

    } catch (error) {
      // This block only runs if the fetch fails or if i threw an error above
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

          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <Link to="/forgot-password" className="auth-switch-link" style={{ fontSize: '14px' }}>
              Forgot Password?
            </Link>
          </div>

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