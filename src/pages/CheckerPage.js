import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import useIntersectionObserver from '../hooks/useIntersectionObserver'; 


function CheckerPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [cardRef, cardIsVisible] = useIntersectionObserver({ threshold: 0.1 });


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/check-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        // Handle server-side errors (like 400 or 500)
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'An unknown server error occurred.');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      // This catch block handles network errors (like 'Failed to fetch')
      // AND errors thrown from a bad server response.
      // created both a message and a subMessage for errors.
      setResult({ 
        error: true, 
        message: 'An error occurred while checking.',
        subMessage: 'Please try again later.'
      });
      console.error("Fetch Error:", error); // Log the actual error for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checker">
      <div className="checker-container">
        <div 
          ref={cardRef}
          className={`checker-card animate-on-scroll ${cardIsVisible ? 'is-visible' : ''}`}
        >
          <div className="checker-header">
            <div className="lock-icon">🔒</div>
            <h1 className="checker-title">Password Security Check</h1>
            <p className="checker-subtitle">Check if your password has been compromised</p>
          </div>

          <form onSubmit={handleSubmit} className="checker-form">
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Check your password"
                className="password-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="submit-btn"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <span>🛡️</span>
                  <span>Check Password</span>
                </>
              )}
            </button>
          </form>

          {result && (
            <div className={`result ${result.error ? 'error' : result.leaked ? 'danger' : 'safe'}`}>
              <div className="result-content">
                <span className="result-icon">
                  {result.error ? '❌' : result.leaked ? '⚠️' : '✅'}
                </span>
                <div className="result-text-container">
                  <p className="result-text-main">
                    {result.message}
                  </p>
                  {result.subMessage && (
                    <p className="result-text-sub">
                      {result.subMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <Link to="/" className="back-btn">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CheckerPage;