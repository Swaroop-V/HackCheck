import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Using Link for router navigation

function CheckerPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/check-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to check password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checker">
      <div className="checker-container">
        <div className="checker-card">
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
                placeholder="Enter your password"
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
              {/* V V V V V  REPLACE THIS WHOLE DIV V V V V V */}
              <div className="result-content">
                <span className="result-icon">
                  {result.error ? '❌' : result.leaked ? '⚠️' : '✅'}
                </span>
                
                {/* We are adding a class to this span to style it */}
                <span className="result-text">
                  <strong>
                    {result.error ? 'Error: ' + result.error : result.message}
                  </strong>
                </span>
              </div>
              {/* ^ ^ ^ ^ ^  REPLACE THIS WHOLE DIV ^ ^ ^ ^ ^ */}
            </div>
          )}

          {/* This now uses a Link to go back to the homepage route */}
          <Link to="/" className="back-btn">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CheckerPage;