import React from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const SupportPage = () => {
  const [containerRef, containerIsVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div 
      ref={containerRef}
      className={`about-container animate-on-scroll ${containerIsVisible ? 'is-visible' : ''}`}
    >
      <div className="about-header">
        <h1>Support Center</h1>
        <p className="about-subtitle">We're here to help. Find answers to your questions below.</p>
      </div>
      <div className="about-content">
        <section>
          <h2>Frequently Asked Questions (FAQ)</h2>
          <div className="faq-item">
            <h3>Is it safe to enter my password on HackCheck?</h3>
            <p><strong>Yes.</strong> Your privacy and security are our top priorities. We use a method called k-Anonymity, which means your full password is never sent to our servers. We only send the first 5 characters of its cryptographic hash, ensuring your password remains completely anonymous to us and everyone else.</p>
          </div>
          <div className="faq-item">
            <h3>What should I do if my password has been leaked?</h3>
            <p>If your password appears in a breach, you should immediately change it on every website where you have used it. We also highly recommend enabling Two-Factor Authentication (2FA) on all your important accounts for an extra layer of security.</p>
          </div>
          <div className="faq-item">
            <h3>Is HackCheck a free service?</h3>
            <p>The password checking feature is completely free and unlimited for everyone. We may offer optional premium features in the future, such as automated breach monitoring for your email addresses, which would be part of our paid plans.</p>
          </div>
        </section>
        <section>
          <h2>Contact Us</h2>
          <p>If your question isn't answered in the FAQ, please feel free to reach out to our support team. We'll do our best to get back to you as soon as possible.</p>
          <p>Email: <a href="mailto:support@hackcheck.com" className="support-email-link">support@hackcheck.com</a></p>
        </section>
      </div>
    </div>
  );
};

export default SupportPage;