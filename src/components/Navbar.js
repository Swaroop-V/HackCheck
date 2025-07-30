import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="nav">
      <Link to="/" className="nav-brand">
        <span className="shield-icon">🛡️</span>
        <span className="brand-text">LeakGuard</span>
      </Link>
      <div className="nav-links">
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/tips" className="nav-link">Tips</Link>
        {/* These links are restored as requested. They won't go anywhere until you add routes for them. */}
        <Link to="/pricing" className="nav-link">Pricing</Link>
        <Link to="/support" className="nav-link">Support</Link>
      </div>
      <Link to="/check" className="btn-primary">
        Check Now
      </Link>
    </nav>
  );
};

export default Navbar;