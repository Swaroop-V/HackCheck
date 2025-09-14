import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="checker">
      <div className="checker-container">
        <div className="checker-card">
          <div className="checker-header">
            <h1 className="checker-title">Forgot Your Password?</h1>
            <p className="checker-subtitle">Enter your email and we'll send you a link to reset it.</p>
          </div>
          <form onSubmit={handleSubmit} className="checker-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required />
            </div>
            <button type="submit" className="btn-primary submit-payment-btn">
              Send Reset Link
            </button>
          </form>
          {message && <p style={{ color: '#4ade80', textAlign: 'center', marginTop: '1rem' }}>{message}</p>}
          <Link to="/login" className="back-btn">← Back to Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;