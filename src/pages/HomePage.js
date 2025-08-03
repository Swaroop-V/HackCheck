import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../Assets/hack-check-circular.png';
import useIntersectionObserver from '../hooks/useIntersectionObserver'; 
import { useAuth } from '../context/AuthContext'; 

const HomePage = () => {
  const [section1Ref, section1IsVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [divider1Ref, divider1IsVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [section2Ref, section2IsVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [divider2Ref, divider2IsVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [section3Ref, section3IsVisible] = useIntersectionObserver({ threshold: 0.1 });
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div className="gradient-bg"></div>
      
      <div className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              HackCheck:<br />
              <span className="hero-subtitle">Protect Your Credentials</span>
            </h1>
            <p className="hero-description">
              HackCheck helps you verify if your passwords have been compromised in data breaches.
            </p>
            <div className="hero-actions">
              <Link to={isAuthenticated ? "/check" : "/signup"} className="btn-primary btn-large">
                Check Now
              </Link>
              <Link to="/about" className="btn-outline btn-large">
                Learn More
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-glow"></div>
            <img 
              src={heroImage}
              alt="Cybersecurity professional"
              className="hero-img"
            />
          </div>
        </div>
      </div>
      
      <section 
        ref={section1Ref}
        className={`content-section animate-on-scroll ${section1IsVisible ? 'is-visible' : ''}`}
      >
        <h2 className="section-title">Why Check Your Password?</h2>
        <p className="section-subtitle">
          In an era of constant data breaches, proactive security is not just an option - it's a necessity.
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
      
      <hr 
        ref={divider1Ref}
        className={`section-divider animate-on-scroll ${divider1IsVisible ? 'is-visible' : ''}`}
      />

      <section 
        ref={section2Ref}
        className={`content-section animate-on-scroll ${section2IsVisible ? 'is-visible' : ''}`}
      >
        <h2 className="section-title">Secure & Anonymous By Design</h2>
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

      <hr 
        ref={divider2Ref}
        className={`section-divider animate-on-scroll ${divider2IsVisible ? 'is-visible' : ''}`}
      />

      <section 
        ref={section3Ref}
        className={`content-section animate-on-scroll ${section3IsVisible ? 'is-visible' : ''}`}
      >
        <h2 className="section-title">Our Commitment to You</h2>
        <p className="section-subtitle">
          This project was built on a foundation of respect for user privacy and digital security for all.
        </p>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3 className="feature-title">Privacy First</h3>
            <p className="feature-description">
              We will never track you, store your passwords, or sell your data. Your security check is anonymous, and that will never change.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3 className="feature-title">Open & Accessible</h3>
            <p className="feature-description">
              Core security tools should be available to everyone. Our password checker will always be free to use for personal security checks.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3 className="feature-title">Empowering Education</h3>
            <p className="feature-description">
              Our goal is not just to check a password, but to be the first step in helping you build stronger, safer online habits.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;