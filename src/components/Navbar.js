import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Calls the backend endpoint to clear the cookie
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', // Important to send the cookie so it can be cleared
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Regardless of whether the API call succeeds, clears the frontend state
      logout();
      navigate('/');
    }
  };

  return (
    <nav className="nav">
      <Link to="/" className="nav-brand">
        <span className="shield-icon">🛡️</span>
        <span className="brand-text">HackCheck</span>
      </Link>

      <div className="nav-links">
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/tips" className="nav-link">Tips</Link>
        <Link to="/pricing" className="nav-link">Pricing</Link>
        <Link to="/support" className="nav-link">Support</Link>
        
        
        {isAuthenticated && (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
          </>
        )}
      </div>
      
      {isAuthenticated ? (
        <button onClick={handleLogout} className="btn-primary">
          Log Out
        </button>
      ) : (
        <Link to="/signup" className="btn-primary">
          Sign Up
        </Link>
      )}
    </nav>
  );
};

export default Navbar;