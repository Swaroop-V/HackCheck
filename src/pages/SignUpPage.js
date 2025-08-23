import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal'; 

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const navigate = useNavigate();

  const handleInitiateSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch('/api/signup/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred.');
      }
      setMessage(data.message);
      setStep(2);
    } catch (error) {
      setMessage(error.toString());
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch('/api/signup/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred.');
      }
      
      setShowSuccessModal(true);

    } catch (error) {
      setMessage(error.toString());
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/check');
  };

  return (
    <>
      <Modal 
        show={showSuccessModal}
        title="Account Created!"
        message="Congratulations! Your account has been successfully created."
        buttonText="Continue"
        onClose={handleModalClose}
      />

      <div className="checker">
        <div className="checker-container">
          <div className="checker-card">
            {step === 1 ? (
              <>
                <div className="checker-header">
                  <div className="lock-icon">👤</div>
                  <h1 className="checker-title">Create Your Account</h1>
                  <p className="checker-subtitle">Join HackCheck to start protecting your credentials.</p>
                </div>
                <form onSubmit={handleInitiateSubmit} className="checker-form">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-input" placeholder="Choose a username" required />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="you@example.com" required />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" placeholder="••••••••" required />
                </div>
                <button type="submit" className="btn-primary submit-payment-btn">
                  Create Account
                </button>
              </form>
              </>
            ) : (
              <>
                <div className="checker-header">
                  <div className="lock-icon">📧</div>
                  <h1 className="checker-title">Verify Your Email</h1>
                  <p className="checker-subtitle">Enter the 6-digit code we sent to <strong>{email}</strong>.</p>
                </div>
                <form onSubmit={handleVerifySubmit} className="checker-form">
                  <div className="form-group">
                    <label htmlFor="otp">Verification Code</label>
                    <input id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="form-input" placeholder="123456" maxLength="6" required />
                  </div>
                  <button type="submit" className="btn-primary submit-payment-btn">
                    Verify Account
                  </button>
                </form>
              </>
            )}
            
            {message && <p style={{ color: message.includes('OTP sent') ? 'green' : 'red', textAlign: 'center', marginTop: '1rem' }}>{message}</p>}

            <div className="auth-switch">
              <p>Already have an account? <Link to="/login" className="auth-switch-link">Log In</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;