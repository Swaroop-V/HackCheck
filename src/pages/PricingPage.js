import React from 'react';
import { Link } from 'react-router-dom';

const PricingPage = () => {
  return (
    // We reuse the 'about-container' class for consistent layout
    <div className="about-container">
      <div className="about-header">
        <h1>Flexible Plans for Everyone</h1>
        <p className="about-subtitle">Choose the plan that's right for you. All plans come with our core security promise.</p>
      </div>

      <div className="pricing-grid">
        {/* Plan 1: Basic */}
        <div className="pricing-card">
          <h3 className="plan-name">Personal</h3>
          <div className="price-amount">
            <span className="dollar">$</span>10<span className="period">/mo</span>
          </div>
          <ul className="feature-list">
            <li>✓ Unlimited Password Checks</li>
            <li>✓ Secure k-Anonymity Method</li>
            <li>✓ Email-based Support</li>
            <li>✓ Single User</li>
          </ul>
          <Link to="/checkout/personal" className="btn-outline">Choose Plan</Link>
        </div>

        {/* Plan 2: Recommended */}
        <div className="pricing-card recommended">
          <div className="popular-badge">Most Popular</div>
          <h3 className="plan-name">Pro</h3>
          <div className="price-amount">
            <span className="dollar">$</span>15<span className="period">/mo</span>
          </div>
          <ul className="feature-list">
            <li>✓ Everything in Personal</li>
            <li>✓ Breach Monitoring for 5 Emails</li>
            <li>✓ Priority Support</li>
            <li>✓ Family Sharing (Up to 5 Users)</li>
          </ul>
          <Link to="/checkout/pro" className="btn-primary">Choose Plan</Link>
        </div>

        {/* Plan 3: Enterprise */}
        <div className="pricing-card">
          <h3 className="plan-name">Enterprise</h3>
          <div className="price-amount">
            <span className="dollar">$</span>20<span className="period">/mo</span>
          </div>
          <ul className="feature-list">
            <li>✓ Everything in Pro</li>
            <li>✓ Full API Access</li>
            <li>✓ Dedicated Account Manager</li>
            <li>✓ Custom Security Reports</li>
          </ul>
          <Link to="/checkout/enterprise" className="btn-outline">Choose Plan</Link>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;