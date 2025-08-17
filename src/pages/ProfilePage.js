import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useIntersectionObserver from '../hooks/useIntersectionObserver'; // Import the hook

const ProfilePage = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Hook for the animation
  const [containerRef, containerIsVisible] = useIntersectionObserver({ threshold: 0.1 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // THIS IS THE CRITICAL FIX: The URL MUST be relative for the proxy to work.
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important: we need to send the auth cookie
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      setMessage(data.message);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`about-container animate-on-scroll ${containerIsVisible ? 'is-visible' : ''}`}
    >
      <div className="about-header">
        <h1>User Profile</h1>
        <p className="about-subtitle">Manage your account settings.</p>
      </div>

      <div className="about-content">
        <section>
          <h2>Account Information</h2>
          <div className="profile-info">
            <strong>Email:</strong> {user ? user.email : 'Loading...'}
          </div>
        </section>

        <section>
          <h2>Change Password</h2>
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input 
                id="currentPassword" 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-input" 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input 
                id="newPassword" 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input" 
                required 
              />
            </div>
            <button type="submit" className="btn-primary">Update Password</button>
          </form>
          {message && <p style={{ color: '#4ade80', marginTop: '1rem' }}>{message}</p>}
          {error && <p style={{ color: '#f87171', marginTop: '1rem' }}>{error}</p>}
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;