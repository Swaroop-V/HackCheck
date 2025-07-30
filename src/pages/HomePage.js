import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    // Use a fragment to return multiple top-level elements
    <>
      <div className="gradient-bg"></div>
      
      <div className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              LeakGuard:<br />
              <span className="hero-subtitle">Protect Your Credentials</span>
            </h1>
            <p className="hero-description">
              LeakGuard helps you verify if your passwords have been compromised in data breaches.
            </p>
            <div className="hero-actions">
              <Link to="/check" className="btn-primary btn-large">
                Start Checking
              </Link>
              <Link to="/about" className="btn-outline btn-large">
                Learn More
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-glow"></div>
            <img
              src="https://images.unsplash.com/photo-1719255417989-b6858e87359e?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxoYWNrZXIlMjBjeWJlcnNlY3VyaXR5JTIwZGFyayUyMGNvbXB1dGVyfGVufDB8fHx8MTc1MzY5ODE5MXww&ixlib=rb-4.1.0&fit=fillmax&h=600&w=800"
              alt="Cybersecurity professional"
              className="hero-img"
            />
          </div>
        </div>
      </div>
      
      {/* ======================================================= */}
      {/*   THE FIX: All sections are now inside this new div   */}
      {/* ======================================================= */}
      <div className="page-sections">
        {/* Why LeakGuard? Section */}
        <section className="content-section">
          <h2 className="section-title">Why Check Your Password?</h2>
          {/* ... all the content for this section ... */}
          <p className="section-subtitle">
            In an era of constant data breaches, proactive security is not just an option—it's a necessity.
          </p>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Instant Verification</h3>
              <p className="feature-description">
                Check your password against a database of over 800 million real-world passwords previously exposed in data breaches.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3 className="feature-title">Complete Anonymity</h3>
              <p className="feature-description">
                Your password is never sent to our servers. We use a secure method called k-Anonymity to check for leaks without exposing your data.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3 className="feature-title">Stay Proactive</h3>
              <p className="feature-description">
                Knowing your password is compromised is the first step. It empowers you to update your credentials and prevent account takeovers.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="content-section extra-space-top">
          <h2 className="section-title">Secure & Anonymous By Design</h2>
          {/* ... all the content for this section ... */}
          <p className="section-subtitle">
            We respect your privacy. Here's how we protect your password during the check.
          </p>
          <div className="how-it-works-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">You Enter Your Password</h3>
              <p>Your password stays in your browser. It is never sent to us or any third party.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">We Anonymize It</h3>
              <p>Your browser creates a cryptographic hash (SHA-1) of your password, and sends only the first 5 characters of that hash to the API.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">We Check for a Match</h3>
              <p>The API returns a list of all leaked password hashes that start with those 5 characters. Your browser checks the full hash locally for a match.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;