import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About LeakGuard</h1>
        <p className="about-subtitle">Your shield in the digital world.</p>
      </div>

      <div className="about-content">
        <section>
          <h2>Our Mission</h2>
          <p>
            In an age where data breaches are becoming alarmingly frequent, our digital identities are constantly at risk. LeakGuard was born from a simple yet powerful mission: to provide everyone with a free, fast, and secure way to check if their credentials have been compromised. We believe that digital security should be accessible to all, not just a privileged few.
          </p>
        </section>

        <section>
          <h2>How We Protect You</h2>
          <p>
            Trust is the cornerstone of our service. When you check a password with LeakGuard, we ensure your privacy is never compromised. We use a sophisticated technique called <strong>k-Anonymity</strong>, which allows us to check your password against a massive database of known breaches without ever seeing, storing, or transmitting your actual password. Your security check is completely anonymous.
          </p>
        </section>

        <section>
          <h2>The Team</h2>
          <p>
            LeakGuard is developed and maintained by a small team of cybersecurity enthusiasts dedicated to making the internet a safer place. We are driven by our passion for technology and a firm belief in the right to privacy.
          </p>
        </section>
        
        <div className="about-cta">
          <h3>Ready to secure your accounts?</h3>
          <p>Check your most-used passwords now and take the first step towards better protection.</p>
          <Link to="/check" className="btn-primary btn-large">
            Check a Password Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;