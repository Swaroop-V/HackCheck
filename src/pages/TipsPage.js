import React from 'react';
import { Link } from 'react-router-dom';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { useAuth } from '../context/AuthContext'; 

const TipsPage = () => {
  const [containerRef, containerIsVisible] = useIntersectionObserver({ threshold: 0.1 });
  const { isAuthenticated } = useAuth(); 

  return (
    <div 
      ref={containerRef}
      className={`about-container animate-on-scroll ${containerIsVisible ? 'is-visible' : ''}`}
    >
      <div className="about-header">
        <h1>Password Security Tips</h1>
        <p className="about-subtitle">Simple steps to fortify your digital life.</p>
      </div>
      <div className="about-content">
        <section>
          <h2>1. Create Strong & Complex Passwords</h2>
          <p>
            Avoid common words, phrases, or personal information like birthdays. A strong password should be at least 12 characters long and include a mix of uppercase letters, lowercase letters, numbers, and symbols (e.g., !@#$%^&*).
          </p>
        </section>
        <section>
          <h2>2. Use a Unique Password for Every Service</h2>
          <p>
            This is critical. If you reuse passwords and one website is breached, attackers can use that same password to access your accounts on other sites, like your email or banking. Every important account needs its own unique password.
          </p>
        </section>
        <section>
          <h2>3. Leverage a Password Manager</h2>
          <p>
            Remembering dozens of complex, unique passwords is impossible for humans. A password manager is an application that securely stores all your passwords in an encrypted vault. You only need to remember one master password, and the manager handles the rest.
          </p>
        </section>
        <section>
          <h2>4. Enable Two-Factor Authentication (2FA)</h2>
          <p>
            <strong>Two-Factor Authentication</strong> is one of the most effective security measures you can take. It requires a second piece of information (like a code from your phone) in addition to your password, making it much harder for attackers to gain access even if they steal your password.
          </p>
        </section>
        <section>
          <h2>5. Beware of Phishing Scams</h2>
          <p>
            Be cautious of unsolicited emails or messages asking you to log in or provide personal information. Attackers often create fake login pages that look real to steal your credentials. Always double-check the website address before entering your password.
          </p>
        </section>
        <div className="about-cta">
          <h3>Think one of your passwords might be old?</h3>
          <p>Check it against our database of known breaches and stay one step ahead.</p>
         
          <Link to={isAuthenticated ? "/check" : "/signup"} className="btn-primary btn-large">
            Check a Password Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TipsPage;