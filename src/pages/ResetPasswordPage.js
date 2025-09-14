import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal'; 

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const { token } = useParams();
  const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch(`/api/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      alert(data.message);
      navigate('/login');
    } catch (error) {
      setMessage(error.toString());
    }
  };  

  // 4. This function will be called when the modal's button is clicked
  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/login'); 
  };

  return (
    <>
      <Modal 
        show={showSuccessModal}
        title="Password Reset!"
        message="Your password has been successfully updated. You can now log in with your new password."
        buttonText="Go to Log In"
        onClose={handleModalClose}
      />

      <div className="checker">
        <div className="checker-container">
          <div className="checker-card">
            <div className="checker-header">
              <h1 className="checker-title">Reset Your Password</h1>
              <p className="checker-subtitle">Enter your new password below.</p>
            </div>
            <form onSubmit={handleSubmit} className="checker-form">
              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" required />
              </div>
              <button type="submit" className="btn-primary submit-payment-btn">
                Update Password
              </button>
            </form>
            {message && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{message}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;